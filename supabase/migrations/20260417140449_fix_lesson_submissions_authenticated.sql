begin;

-- tighten table-level select grants to authenticated only
revoke select on public.lesson_submissions from anon;
revoke select on public.xp_records from anon;
revoke select on public.activity_logs from anon;

grant select on public.lesson_submissions to authenticated;
grant select on public.xp_records to authenticated;
grant select on public.activity_logs to authenticated;

-- lesson_submissions: owner-only read
drop policy if exists "lesson_submissions viewable by everyone" on public.lesson_submissions;
drop policy if exists "lesson_submissions viewable by owner" on public.lesson_submissions;

create policy "lesson_submissions viewable by owner"
on public.lesson_submissions
for select
to authenticated
using (profile_id = (select auth.uid()));

-- xp_records: owner-only read
drop policy if exists "xp_records viewable by everyone" on public.xp_records;
drop policy if exists "xp_records viewable by owner" on public.xp_records;

create policy "xp_records viewable by owner"
on public.xp_records
for select
to authenticated
using (profile_id = (select auth.uid()));

-- activity_logs: owner-only read
drop policy if exists "activity_logs viewable by everyone" on public.activity_logs;
drop policy if exists "activity_logs viewable by owner" on public.activity_logs;

create policy "activity_logs viewable by owner"
on public.activity_logs
for select
to authenticated
using (profile_id = (select auth.uid()));

-- keep public course progress view available to anon/authenticated
alter view public.profile_course_progress_view set (security_invoker = false);
grant select on public.profile_course_progress_view to anon, authenticated;

-- activity-based views should follow caller RLS and be authenticated-only
alter view public.profile_activity_data_view set (security_invoker = true);
alter view public.profile_recent_activity_view set (security_invoker = true);

revoke select on public.profile_activity_data_view from anon;
revoke select on public.profile_recent_activity_view from anon;

grant select on public.profile_activity_data_view to authenticated;
grant select on public.profile_recent_activity_view to authenticated;

commit;
