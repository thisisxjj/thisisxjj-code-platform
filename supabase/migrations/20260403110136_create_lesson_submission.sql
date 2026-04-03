begin;

-- ============================================================
-- 1. 自定义枚举类型 (Types)
-- ============================================================
do $$ begin
  create type public.xp_source_type as enum ('lesson', 'course');
exception when duplicate_object then null; end $$;


-- ============================================================
-- 2. 核心数据表设计 (Tables)
-- ============================================================

create table if not exists public.lesson_submissions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  is_passed boolean not null default false,
  is_ready_for_completion boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lesson_submissions_profile_lesson_key unique(profile_id, lesson_id)
);

create table if not exists public.xp_records (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  source_type public.xp_source_type not null,

  lesson_id uuid references public.lessons(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,

  xp_rewarded integer not null check (xp_rewarded >= 0),
  created_at timestamptz not null default now(),

  constraint xp_records_exclusive_arc check (
    (source_type = 'lesson' and lesson_id is not null and course_id is null) or
    (source_type = 'course' and lesson_id is null and course_id is not null)
  )
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint activity_logs_profile_lesson_key unique(profile_id, lesson_id)
);

create table if not exists public.user_code_editors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  template text not null default 'vanilla',
  files jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_code_editors_profile_lesson_key unique(profile_id, lesson_id)
);


-- ============================================================
-- 3. 触发器与高效索引 (Triggers & Indexes)
-- ============================================================

drop trigger if exists on_lesson_submissions_updated on public.lesson_submissions;
create trigger on_lesson_submissions_updated before update on public.lesson_submissions for each row execute function public.handle_updated_at();

drop trigger if exists on_user_code_editors_updated on public.user_code_editors;
create trigger on_user_code_editors_updated before update on public.user_code_editors for each row execute function public.handle_updated_at();

create index if not exists idx_activity_logs_profile_created_at on public.activity_logs(profile_id, created_at desc);

create unique index if not exists idx_xp_records_profile_lesson on public.xp_records(profile_id, lesson_id) where lesson_id is not null;
create unique index if not exists idx_xp_records_profile_course on public.xp_records(profile_id, course_id) where course_id is not null;


-- ============================================================
-- 4. 行级安全策略 (Row Level Security) 及底层授权
-- ============================================================

alter table public.lesson_submissions enable row level security;
alter table public.xp_records enable row level security;
alter table public.activity_logs enable row level security;
alter table public.user_code_editors enable row level security;

revoke all on public.user_code_editors from anon, public;

grant select on public.lesson_submissions to anon, authenticated;
grant select on public.xp_records to anon, authenticated;
grant select on public.activity_logs to anon, authenticated;
grant select, insert, update, delete on public.user_code_editors to authenticated;

drop policy if exists "lesson_submissions viewable by everyone" on public.lesson_submissions;
drop policy if exists "xp_records viewable by everyone" on public.xp_records;
drop policy if exists "activity_logs viewable by everyone" on public.activity_logs;
drop policy if exists "user_code_editors viewable by owner" on public.user_code_editors;
drop policy if exists "user_code_editors insertable by owner" on public.user_code_editors;
drop policy if exists "user_code_editors updatable by owner" on public.user_code_editors;
drop policy if exists "user_code_editors deletable by owner" on public.user_code_editors;

create policy "lesson_submissions viewable by everyone" on public.lesson_submissions for select using (true);
create policy "xp_records viewable by everyone" on public.xp_records for select using (true);
create policy "activity_logs viewable by everyone" on public.activity_logs for select using (true);

create policy "user_code_editors viewable by owner" on public.user_code_editors
  for select using (profile_id = (select auth.uid()));
create policy "user_code_editors insertable by owner" on public.user_code_editors
  for insert with check (profile_id = (select auth.uid()));
create policy "user_code_editors updatable by owner" on public.user_code_editors
  for update using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));
create policy "user_code_editors deletable by owner" on public.user_code_editors
  for delete using (profile_id = (select auth.uid()));


-- ============================================================
-- 5. 支撑前端 API 的视图 (Views) 与业务规约
-- ============================================================

create or replace view public.profile_activity_data_view with (security_invoker = true) as
select
  profile_id,
  to_char(created_at, 'YYYY-MM-DD') as date,
  count(*) as count
from public.activity_logs
group by profile_id, to_char(created_at, 'YYYY-MM-DD');

create or replace view public.profile_course_progress_view with (security_invoker = true) as
with course_lesson_counts as (
  select c.id as course_id, count(l.id) as total_lessons
  from public.courses c
  join public.lessons l on c.id = l.course_id
  where c.status = 'published'
  group by c.id
),
user_completed_counts as (
  select
    ls.profile_id,
    l.course_id,
    count(ls.id) as completed_lessons
  from public.lesson_submissions ls
  join public.lessons l on ls.lesson_id = l.id
  join public.courses c on l.course_id = c.id
  where ls.is_passed = true
    and c.status = 'published'
  group by ls.profile_id, l.course_id
)
select
  ucc.profile_id,
  c.slug as course_template_id,
  c.name as course_template_name,
  ucc.completed_lessons,
  clc.total_lessons,
  case
    when clc.total_lessons = 0 then 0
    else least(100, round((ucc.completed_lessons::numeric / clc.total_lessons::numeric) * 100))::integer
  end as progress_percentage
from user_completed_counts ucc
join public.courses c on ucc.course_id = c.id
join course_lesson_counts clc on c.id = clc.course_id;

create or replace view public.profile_recent_activity_view with (security_invoker = true) as
select
  al.id,
  al.profile_id,
  al.created_at as completed_at,
  jsonb_build_object('id', l.id, 'slug', l.slug, 'name', l.name, 'description', l.description) as lesson_template,
  jsonb_build_object('id', c.id, 'slug', c.slug, 'name', c.name, 'status', c.status) as course_template
from public.activity_logs al
join public.lessons l on al.lesson_id = l.id
join public.courses c on l.course_id = c.id;

comment on view public.profile_recent_activity_view is '⚠️ 警告: 该视图为全量数据关联（无内建 LIMIT），查询时务必在前端 API 调用层附加 profile_id=eq.{id} 过滤。';

grant select on public.profile_activity_data_view to anon, authenticated;
grant select on public.profile_course_progress_view to anon, authenticated;
grant select on public.profile_recent_activity_view to anon, authenticated;


-- ============================================================
-- 6. 核心业务逻辑实现 (RPC Functions)
-- ============================================================

drop function if exists public.complete_lesson(uuid, uuid);
drop function if exists public.reset_lesson(uuid, uuid);
drop function if exists public.sync_profile_stats(uuid);

-- ------------------------------------------------------------
-- 6.1 提交完成课程
-- ------------------------------------------------------------
create or replace function public.complete_lesson(p_lesson_id uuid, p_profile_id uuid default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile_id uuid;
  v_submission_id uuid;
  v_course_id uuid;
  v_total_lessons integer;
  v_completed_lessons integer;
  v_accumulated_xp integer := 0;
  v_lesson_xp integer := 0;
  v_course_xp_reward integer := 0;
  v_inserted_lesson_xp integer;
  v_inserted_course_xp integer;
begin
  if auth.role() = 'authenticated' then
    v_profile_id := auth.uid();
  elsif auth.role() = 'service_role' then
    v_profile_id := coalesce(p_profile_id, auth.uid());
    if v_profile_id is null then raise exception 'p_profile_id is required for service_role'; end if;
  else
    raise exception 'Access Denied: Unauthorized role "%"', auth.role();
  end if;

  -- Fast Fail: 合并校验发布状态并一次性获取必要的计算上下文
  select l.course_id, coalesce(l.xp_reward, 0), coalesce(c.xp_reward, 0)
  into v_course_id, v_lesson_xp, v_course_xp_reward
  from public.lessons l
  join public.courses c on l.course_id = c.id
  where l.id = p_lesson_id and c.status = 'published';

  if not found then
    raise exception 'Access Denied: Lesson does not exist or does not belong to a published course.';
  end if;

  insert into public.profile_stats (profile_id, total_xp, lessons_completed)
  values (v_profile_id, 0, 0) on conflict (profile_id) do nothing;
  perform 1 from public.profile_stats where profile_id = v_profile_id for update;

  insert into public.lesson_submissions (profile_id, lesson_id, is_passed, is_ready_for_completion, completed_at)
  values (v_profile_id, p_lesson_id, true, true, now())
  on conflict (profile_id, lesson_id)
  do update set is_passed = true, is_ready_for_completion = true, completed_at = now()
  where public.lesson_submissions.is_passed = false
  returning id into v_submission_id;

  if v_submission_id is null then return; end if;

  insert into public.activity_logs (profile_id, lesson_id)
  values (v_profile_id, p_lesson_id)
  on conflict (profile_id, lesson_id) do nothing;

  insert into public.xp_records (profile_id, source_type, lesson_id, xp_rewarded)
  values (v_profile_id, 'lesson', p_lesson_id, v_lesson_xp)
  on conflict (profile_id, lesson_id) where lesson_id is not null do nothing
  returning xp_rewarded into v_inserted_lesson_xp;

  if v_inserted_lesson_xp is not null then v_accumulated_xp := v_accumulated_xp + v_inserted_lesson_xp; end if;

  select count(*) into v_total_lessons
  from public.lessons
  where course_id = v_course_id;

  select count(ls.id) into v_completed_lessons
  from public.lesson_submissions ls
  join public.lessons l on ls.lesson_id = l.id
  where ls.profile_id = v_profile_id
    and l.course_id = v_course_id
    and ls.is_passed = true;

  if v_total_lessons > 0 and v_completed_lessons = v_total_lessons then
    insert into public.xp_records (profile_id, source_type, course_id, xp_rewarded)
    values (v_profile_id, 'course', v_course_id, v_course_xp_reward)
    on conflict (profile_id, course_id) where course_id is not null do nothing
    returning xp_rewarded into v_inserted_course_xp;

    if v_inserted_course_xp is not null then v_accumulated_xp := v_accumulated_xp + v_inserted_course_xp; end if;
  end if;

  update public.profile_stats
  set lessons_completed = lessons_completed + 1, total_xp = total_xp + v_accumulated_xp
  where profile_id = v_profile_id;
end;
$$;

-- ------------------------------------------------------------
-- 6.2 重置课程
-- ------------------------------------------------------------
create or replace function public.reset_lesson(p_lesson_id uuid, p_profile_id uuid default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile_id uuid;
  v_was_passed boolean;
begin
  if auth.role() = 'authenticated' then
    v_profile_id := auth.uid();
  elsif auth.role() = 'service_role' then
    v_profile_id := coalesce(p_profile_id, auth.uid());
    if v_profile_id is null then raise exception 'p_profile_id is required for service_role'; end if;
  else
    raise exception 'Access Denied: Unauthorized role "%"', auth.role();
  end if;

  insert into public.profile_stats (profile_id, total_xp, lessons_completed)
  values (v_profile_id, 0, 0) on conflict (profile_id) do nothing;
  perform 1 from public.profile_stats where profile_id = v_profile_id for update;

  select is_passed into v_was_passed
  from public.lesson_submissions
  where profile_id = v_profile_id and lesson_id = p_lesson_id;

  if coalesce(v_was_passed, false) = true then
    update public.profile_stats set lessons_completed = greatest(lessons_completed - 1, 0)
    where profile_id = v_profile_id;
  end if;

  delete from public.lesson_submissions where profile_id = v_profile_id and lesson_id = p_lesson_id;
  delete from public.activity_logs where profile_id = v_profile_id and lesson_id = p_lesson_id;
end;
$$;

-- ------------------------------------------------------------
-- 6.3 状态对账/校准函数
-- ------------------------------------------------------------
create or replace function public.sync_profile_stats(p_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile_id uuid;
begin
  if auth.role() = 'service_role' then
    v_profile_id := p_profile_id;
    if v_profile_id is null then raise exception 'p_profile_id cannot be null'; end if;
  else
    raise exception 'Access Denied: Only service_role can trigger sync operations.';
  end if;

  insert into public.profile_stats (profile_id, total_xp, lessons_completed)
  values (v_profile_id, 0, 0) on conflict (profile_id) do nothing;
  perform 1 from public.profile_stats where profile_id = v_profile_id for update;

  update public.profile_stats
  set
    lessons_completed = (
      select count(*) from public.lesson_submissions
      where profile_id = v_profile_id and is_passed = true
    ),
    total_xp = coalesce((
      select sum(xp_rewarded) from public.xp_records
      where profile_id = v_profile_id
    ), 0)
  where profile_id = v_profile_id;
end;
$$;


-- ============================================================
-- 7. RPC 函数执行权限管控
-- ============================================================

revoke execute on function public.complete_lesson(uuid, uuid) from public;
revoke execute on function public.reset_lesson(uuid, uuid) from public;
revoke execute on function public.sync_profile_stats(uuid) from public;

grant execute on function public.complete_lesson(uuid, uuid) to authenticated, service_role;
grant execute on function public.reset_lesson(uuid, uuid) to authenticated, service_role;
grant execute on function public.sync_profile_stats(uuid) to service_role;

commit
