begin;

-- ============================================================
-- 1. 创建通用函数与自定义枚举类型
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin create type public.course_difficulty as enum ('beginner', 'intermediate', 'advanced'); exception when duplicate_object then null; end $$;
do $$ begin create type public.course_status as enum ('draft', 'published', 'archived'); exception when duplicate_object then null; end $$;
do $$ begin create type public.lesson_type as enum ('standard', 'whiteboard', 'video', 'quiz'); exception when duplicate_object then null; end $$;

-- 封装 task_count 计算逻辑为纯函数 (Immutable)，并设置 search_path 防御
create or replace function public.calc_task_count(l_type public.lesson_type, l_tasks jsonb)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case
    when l_type = 'whiteboard' then 0
    when jsonb_typeof(l_tasks) = 'array' then jsonb_array_length(l_tasks)
    else 0
  end;
$$;

-- ============================================================
-- 2. courses 表 (课程主表)
-- ============================================================
create table if not exists public.courses (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null check (slug ~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$'),
  name               text not null,
  description        text,
  long_description   text,
  difficulty         public.course_difficulty not null default 'beginner',
  duration_in_hours  integer not null default 0 check (duration_in_hours >= 0),
  status             public.course_status not null default 'draft',
  order_index        integer not null default 0 check (order_index >= 0),
  thumbnail_url      text,
  xp_reward          integer not null default 100 check (xp_reward >= 0),
  review_count       integer not null default 0 check (review_count >= 0),
  average_rating     numeric(3,2) not null default 0.00 check (average_rating >= 0.00 and average_rating <= 5.00),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ============================================================
-- 3. modules 表 (课程模块表)
-- ============================================================
create table if not exists public.modules (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null check (slug ~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$'),
  course_id          uuid not null references public.courses(id) on delete cascade,
  name               text not null,
  description        text,
  order_index        integer not null default 0 check (order_index >= 0),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique(course_id, slug),
  unique(id, course_id)
);

-- ============================================================
-- 4. lessons 表 (课时表)
-- ============================================================
create table if not exists public.lessons (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null check (slug ~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$'),
  module_id          uuid not null,
  course_id          uuid not null,
  name               text not null,
  description        text,
  type               public.lesson_type not null default 'standard',
  context            text,
  video_id           text,
  is_free            boolean not null default false,
  order_index        integer not null default 0 check (order_index >= 0),
  xp_reward          integer not null default 10 check (xp_reward >= 0),

  -- 核心资产字段
  objectives         jsonb not null default '[]'::jsonb,
  tasks              jsonb not null default '[]'::jsonb,
  code_editor        jsonb not null default '{}'::jsonb,
  resources          jsonb not null default '[]'::jsonb,

  -- 新增：画板专属字段
  whiteboard         jsonb not null default '{"elements": []}'::jsonb,

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  foreign key (module_id, course_id) references public.modules(id, course_id) on delete cascade,
  unique(module_id, slug),

  -- 新增：数据一致性约束。杜绝非 whiteboard 类型的课时混入庞大的画板脏数据。
  constraint check_whiteboard_data check (
    (type = 'whiteboard') or
    (type != 'whiteboard' and whiteboard = '{"elements": []}'::jsonb)
  )
);

-- ============================================================
-- 5. 触发器 (Triggers)
-- ============================================================
drop trigger if exists on_courses_updated on public.courses;
create trigger on_courses_updated before update on public.courses for each row execute function public.handle_updated_at();

drop trigger if exists on_modules_updated on public.modules;
create trigger on_modules_updated before update on public.modules for each row execute function public.handle_updated_at();

drop trigger if exists on_lessons_updated on public.lessons;
create trigger on_lessons_updated before update on public.lessons for each row execute function public.handle_updated_at();

-- ============================================================
-- 6. 索引优化 (Indexes)
-- ============================================================
create index if not exists idx_modules_course_id on public.modules(course_id);
create index if not exists idx_lessons_module_id on public.lessons(module_id);
create index if not exists idx_lessons_course_id on public.lessons(course_id);
create index if not exists idx_modules_order on public.modules(course_id, order_index);
create index if not exists idx_lessons_order on public.lessons(module_id, order_index);
-- 偏函数覆盖索引 (Partial Covering Index)
create index if not exists idx_courses_published on public.courses(id) where status = 'published';

-- ============================================================
-- 7. 行级安全策略 (RLS - 纯读策略)
-- ============================================================
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;

-- 架构说明: 后端通过 service_role 写入（BYPASSRLS），无需额外写入策略。
drop policy if exists "courses_select_all" on public.courses;
create policy "courses_select_all" on public.courses for select using (true);

drop policy if exists "modules_select_published" on public.modules;
create policy "modules_select_published" on public.modules for select
  using (exists (select 1 from public.courses c where c.id = modules.course_id and c.status = 'published'));

drop policy if exists "lessons_select_published" on public.lessons;
create policy "lessons_select_published" on public.lessons for select
  using (exists (select 1 from public.courses c where c.id = lessons.course_id and c.status = 'published'));

-- ============================================================
-- 8. 视图 1: course_summaries (全量列表查询)
-- ============================================================
-- 采用 security_invoker，确保视图执行时使用调用者的权限而非视图创建者权限。
-- ============================================================
drop view if exists public.course_summaries;
create view public.course_summaries with (security_invoker = on) as
with module_counts as (
  select course_id, count(*) as module_count from public.modules group by course_id
),
lesson_stats as (
  select course_id, count(*) as lesson_count, coalesce(sum(public.calc_task_count(type, tasks)), 0) as task_count
  from public.lessons group by course_id
)
select
  c.id, c.slug, c.name, c.description, c.difficulty, c.duration_in_hours,
  c.thumbnail_url, c.status, c.order_index, c.review_count, c.average_rating,
  coalesce(mc.module_count, 0) as module_count, coalesce(ls.lesson_count, 0) as lesson_count, coalesce(ls.task_count, 0) as task_count
from public.courses c
left join module_counts mc on c.id = mc.course_id
left join lesson_stats ls on c.id = ls.course_id;

-- ============================================================
-- 9. 视图 2: course_details (课程大纲 - 附加各层级聚合统计)
-- ============================================================
-- ⚠️ WARNING:
-- 此视图内部执行了高度嵌套的相关子查询 (3N+3 结构)。
-- 严禁无条件全局扫描 (SELECT *)，仅限前端通过 slug 或 id 精准查询单条数据。
-- ============================================================
drop view if exists public.course_details;
create view public.course_details with (security_invoker = on) as
select
  c.id, c.slug, c.name, c.description, c.long_description, c.difficulty,
  c.duration_in_hours, c.status, c.order_index, c.thumbnail_url,
  c.xp_reward, c.review_count, c.average_rating, c.created_at, c.updated_at,

  -- 课程级统计 (Course Level Aggregates)
  (select count(*) from public.modules m where m.course_id = c.id) as module_count,
  (select count(*) from public.lessons l where l.course_id = c.id) as lesson_count,
  (select coalesce(sum(public.calc_task_count(l.type, l.tasks)), 0) from public.lessons l where l.course_id = c.id) as task_count,

  (
    select coalesce(jsonb_agg(to_jsonb(m_tree) order by m_tree.order_index), '[]'::jsonb)
    from (
      select m.id, m.slug, m.name, m.description, m.order_index,

        -- 模块级统计 (Module Level Aggregates)
        (select count(*) from public.lessons l where l.module_id = m.id and l.course_id = c.id) as lesson_count,
        (select coalesce(sum(public.calc_task_count(l.type, l.tasks)), 0) from public.lessons l where l.module_id = m.id and l.course_id = c.id) as task_count,

        (
          select coalesce(jsonb_agg(to_jsonb(l_tree) order by l_tree.order_index), '[]'::jsonb)
          from (
            -- 纯净大纲：只保留渲染列表所需的轻量字段，刻意排除了 context/tasks/code_editor/whiteboard
            select l.id, l.slug, l.name, l.description, l.type, l.is_free, l.video_id, l.order_index, l.xp_reward, l.objectives
            from public.lessons l where l.module_id = m.id and l.course_id = c.id
          ) l_tree
        ) as lessons
      from public.modules m where m.course_id = c.id
    ) m_tree
  ) as modules
from public.courses c;
-- 采用方案 B：无 c.status 过滤条件。草稿课程正常返回主表信息，modules/lessons 依靠底层 RLS 返回空。

-- ============================================================
-- 10. 权限下放 (Grants)
-- ============================================================
grant select on public.course_summaries to anon, authenticated;
grant select on public.course_details to anon, authenticated;

commit
