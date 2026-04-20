begin;

drop view if exists public.profile_course_progress_view;

create view public.profile_course_progress_view with (security_invoker = false) as
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
  c.slug as course_template_slug,
  c.id as course_template_id,
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

grant select on public.profile_course_progress_view to anon, authenticated;

commit;
