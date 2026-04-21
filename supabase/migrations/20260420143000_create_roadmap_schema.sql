begin;

create table if not exists public.roadmap_categories (
	id uuid primary key default gen_random_uuid(),
	slug text not null unique check (slug ~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$'),
	name text not null,
	description text not null default '',
	order_index integer not null default 0 check (order_index >= 0),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.roadmap_projects (
	id uuid primary key default gen_random_uuid(),
	slug text not null unique check (slug ~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$'),
	name text not null,
	description text not null default '',
	release_text text not null default 'Coming Soon',
	order_index integer not null default 0 check (order_index >= 0),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.roadmap_category_courses (
	roadmap_category_id uuid not null references public.roadmap_categories(id) on delete cascade,
	course_id uuid not null references public.courses(id) on delete cascade,
	order_index integer not null default 0 check (order_index >= 0),
	created_at timestamptz not null default now(),
	primary key (roadmap_category_id, course_id),
	unique (roadmap_category_id, order_index)
);

create table if not exists public.roadmap_category_projects (
	roadmap_category_id uuid not null references public.roadmap_categories(id) on delete cascade,
	roadmap_project_id uuid not null references public.roadmap_projects(id) on delete cascade,
	order_index integer not null default 0 check (order_index >= 0),
	created_at timestamptz not null default now(),
	primary key (roadmap_category_id, roadmap_project_id),
	unique (roadmap_category_id, order_index)
);

drop trigger if exists on_roadmap_categories_updated on public.roadmap_categories;
create trigger on_roadmap_categories_updated
	before update on public.roadmap_categories
	for each row
	execute function public.handle_updated_at();

drop trigger if exists on_roadmap_projects_updated on public.roadmap_projects;
create trigger on_roadmap_projects_updated
	before update on public.roadmap_projects
	for each row
	execute function public.handle_updated_at();

create index if not exists idx_roadmap_category_courses_course_id
	on public.roadmap_category_courses(course_id);

create index if not exists idx_roadmap_category_projects_project_id
	on public.roadmap_category_projects(roadmap_project_id);

alter table public.roadmap_categories enable row level security;
alter table public.roadmap_projects enable row level security;
alter table public.roadmap_category_courses enable row level security;
alter table public.roadmap_category_projects enable row level security;

drop policy if exists "roadmap_categories_select_all" on public.roadmap_categories;
create policy "roadmap_categories_select_all"
	on public.roadmap_categories
	for select
	using (true);

drop policy if exists "roadmap_projects_select_all" on public.roadmap_projects;
create policy "roadmap_projects_select_all"
	on public.roadmap_projects
	for select
	using (true);

drop policy if exists "roadmap_category_courses_select_all" on public.roadmap_category_courses;
create policy "roadmap_category_courses_select_all"
	on public.roadmap_category_courses
	for select
	using (true);

drop policy if exists "roadmap_category_projects_select_all" on public.roadmap_category_projects;
create policy "roadmap_category_projects_select_all"
	on public.roadmap_category_projects
	for select
	using (true);

grant select on public.roadmap_categories to anon, authenticated;
grant select on public.roadmap_projects to anon, authenticated;
grant select on public.roadmap_category_courses to anon, authenticated;
grant select on public.roadmap_category_projects to anon, authenticated;

drop function if exists public.get_roadmap_data();

create function public.get_roadmap_data()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
	with categories as (
		select
			rc.id,
			rc.slug,
			rc.name,
			rc.description,
			rc.order_index as order_value,
			coalesce(
				(
					select jsonb_agg(c.id order by rcc.order_index)
					from public.roadmap_category_courses rcc
					join public.courses c on c.id = rcc.course_id
					where rcc.roadmap_category_id = rc.id
				),
				'[]'::jsonb
			) as course_ids,
			coalesce(
				(
					select jsonb_agg(rp.id order by rcp.order_index)
					from public.roadmap_category_projects rcp
					join public.roadmap_projects rp on rp.id = rcp.roadmap_project_id
					where rcp.roadmap_category_id = rc.id
				),
				'[]'::jsonb
			) as project_ids
		from public.roadmap_categories rc
	),
	projects as (
		select
			rp.id,
			rp.slug,
			rp.name,
			rp.description,
			rp.release_text,
			rp.order_index
		from public.roadmap_projects rp
	),
	courses as (
		select
			cs.id,
			cs.slug,
			cs.name,
			cs.description,
			cs.difficulty,
			cs.duration_in_hours,
			cs.thumbnail_url,
			cs.status,
			cs.order_index,
			cs.review_count,
			cs.average_rating,
			cs.module_count,
			cs.lesson_count,
			cs.task_count
		from public.course_summaries cs
	)
	select jsonb_build_object(
		'roadmapCategories',
		coalesce(
			(
				select jsonb_agg(
					jsonb_build_object(
						'id', ct.id,
						'slug', ct.slug,
						'name', ct.name,
						'description', ct.description,
						'courseIds', ct.course_ids,
						'projectIds', ct.project_ids,
						'order', ct.order_value
					)
					order by ct.order_value
				)
				from categories ct
			),
			'[]'::jsonb
		),
		'projects',
		coalesce(
			(
				select jsonb_agg(
					jsonb_build_object(
						'id', pt.id,
						'slug', pt.slug,
						'name', pt.name,
						'description', pt.description,
						'releaseDate', pt.release_text,
						'order', pt.order_index
					)
					order by pt.order_index
				)
				from projects pt
			),
			'[]'::jsonb
		),
		'courses',
		coalesce(
			(
				select jsonb_agg(
					jsonb_build_object(
						'id', ct.id,
						'slug', ct.slug,
						'name', ct.name,
						'description', ct.description,
						'difficulty', ct.difficulty,
						'duration_in_hours', ct.duration_in_hours,
						'thumbnail_url', ct.thumbnail_url,
						'status', ct.status,
						'order_index', ct.order_index,
						'review_count', ct.review_count,
						'average_rating', ct.average_rating,
						'module_count', ct.module_count,
						'lesson_count', ct.lesson_count,
						'task_count', ct.task_count
					)
					order by ct.order_index
				)
				from courses ct
			),
			'[]'::jsonb
		)
	);
$$;

grant execute on function public.get_roadmap_data() to anon, authenticated;

commit;
