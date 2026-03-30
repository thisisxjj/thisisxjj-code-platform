-- ============================================================
-- 1. 创建通用函数与自定义枚举类型
-- ============================================================

-- 自动更新 updated_at 的触发器函数
create or replace function public.handle_updated_at()
returns trigger
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 课程难度枚举
create type public.course_difficulty as enum ('beginner', 'intermediate', 'advanced');

-- 课程状态枚举 (替代布尔值，为后续扩展打底)
create type public.course_status as enum ('draft', 'published', 'archived');

-- ============================================================
-- 2. courses 表 (课程主表)
-- ============================================================
create table public.courses (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null,       -- 前端路由标识，如 "javascript"
  name               text not null,              -- UI 展示名称，如 "JavaScript 核心课程"
  description        text,
  long_description   text,
  difficulty         public.course_difficulty not null default 'beginner',
  duration_in_hours  integer not null default 0,
  status             public.course_status not null default 'draft',
  order_index        integer not null default 0,
  thumbnail_url      text,

  -- 预留字段：为 Phase 2 经验值系统和评价系统做好准备
  xp_reward          integer not null default 100,
  review_count       integer not null default 0,

  -- 明确为 1-5 星评分制 (如 4.85)
  average_rating     numeric(3,2) not null default 0.00 check (average_rating >= 0.00 and average_rating <= 5.00),

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ============================================================
-- 3. modules 表 (课程模块表)
-- ============================================================
create table public.modules (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null,              -- 前端路由标识，如 "1-getting-started"
  course_id          uuid not null references public.courses(id) on delete cascade,
  name               text not null,              -- UI 展示名称，如 "Getting Started"
  description        text,
  order_index        integer not null default 0,

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  -- 约束 1：同一个课程下的 module slug 不能重复
  unique(course_id, slug),

  -- 约束 2：复合唯一约束。这是为了让 lessons 表的复合外键能够引用，确保数据一致性
  unique(id, course_id)
);

-- ============================================================
-- 4. lessons 表 (课时表)
-- ============================================================
create table public.lessons (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null,              -- 前端路由标识，如 "1-1-what-is-javascript"
  module_id          uuid not null,
  course_id          uuid not null,              -- 冗余设计：用于 RLS 高效查询

  name               text not null,              -- UI 展示名称，如 "What is JavaScript?"
  description        text,
  context            text,                       -- Markdown 正文
  video_id           text,
  is_free            boolean not null default false,
  order_index        integer not null default 0,

  -- 预留字段：为 Phase 2 单课经验值奖励做准备
  xp_reward          integer not null default 10,

  -- 核心 JSONB 数据结构
  objectives         jsonb not null default '[]'::jsonb,
  tasks              jsonb not null default '[]'::jsonb,
  code_editor        jsonb not null default '{}'::jsonb,
  resources          jsonb not null default '[]'::jsonb,

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  -- 约束 1：复合外键。强制要求 lessons 的 (module_id, course_id) 必须和 modules 表里的一模一样，彻底杜绝数据撕裂！
  foreign key (module_id, course_id) references public.modules(id, course_id) on delete cascade,

  -- 约束 2：同一个模块下的 lesson slug 不能重复
  unique(module_id, slug)
);

-- ============================================================
-- 5. 触发器 (Triggers)
-- ============================================================
create trigger on_courses_updated
  before update on public.courses
  for each row execute procedure public.handle_updated_at();

create trigger on_modules_updated
  before update on public.modules
  for each row execute procedure public.handle_updated_at();

create trigger on_lessons_updated
  before update on public.lessons
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- 6. 索引优化 (Indexes)
-- ============================================================
-- Slug 检索优化
create index idx_courses_slug on public.courses(slug);

-- 外键检索优化
create index idx_modules_course_id on public.modules(course_id);
create index idx_lessons_module_id on public.lessons(module_id);
create index idx_lessons_course_id on public.lessons(course_id);

-- 列表排序优化
create index idx_modules_order on public.modules(course_id, order_index);
create index idx_lessons_order on public.lessons(module_id, order_index);

-- ============================================================
-- 7. 行级安全策略 (Row Level Security - RLS)
-- ============================================================
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;

-- Courses: 允许所有人查询所有状态的课程 (包含 draft 用于界面展示)。
create policy "courses_select_all"
  on public.courses for select
  using (true);

-- Modules: 严格限制。所有人均可查询，但前提是所属课程的状态必须为 'published'。
create policy "modules_select_published"
  on public.modules for select
  using (exists (
    select 1 from public.courses c
    where c.id = modules.course_id and c.status = 'published'
  ));

-- Lessons: 严格限制。所有人均可查询，但前提是所属课程的状态必须为 'published'。
create policy "lessons_select_published"
  on public.lessons for select
  using (exists (
    select 1 from public.courses c
    where c.id = lessons.course_id and c.status = 'published'
  ));

-- 确保如果存在旧视图，先将其删除（因为我们要修改返回的列结构）
drop view if exists public.course_summaries;

-- 创建带有 security_invoker 的视图，强制继承 RLS 策略！
create view public.course_summaries with (security_invoker = on) as

-- 1. CTE: 预先聚合模块数量
with module_counts as (
  select
    course_id,
    count(id) as module_count
  from public.modules
  group by course_id
),

-- 2. CTE: 预先聚合课时数量与 JSONB 的 tasks 长度
lesson_stats as (
  select
    course_id,
    count(id) as lesson_count,
    -- 聚合 task 数量，处理空值
    coalesce(sum(jsonb_array_length(tasks)), 0) as task_count
  from public.lessons
  group by course_id
)

-- 3. 主查询: 使用 LEFT JOIN 将聚合结果无缝拼接到课程主表
select
  c.id,
  c.slug,
  c.name,
  c.description,
  c.difficulty,
  c.duration_in_hours,
  c.thumbnail_url,
  c.status,
  c.order_index,

  -- 补全的 UI 展示字段
  c.review_count,
  c.average_rating,

  -- 组装聚合数据，如果查不到则兜底为 0
  coalesce(mc.module_count, 0) as module_count,
  coalesce(ls.lesson_count, 0) as lesson_count,
  coalesce(ls.task_count, 0) as task_count

from
  public.courses c
left join
  module_counts mc on c.id = mc.course_id
left join
  lesson_stats ls on c.id = ls.course_id;
