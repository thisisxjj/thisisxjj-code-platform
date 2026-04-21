import { randomUUID } from "node:crypto";
import { escapeText } from "../utils/sql-helpers";

type RoadmapCategory = {
	id: string;
	name: string;
	description?: string;
	courseIds?: string[];
	projectIds?: string[];
	order?: number;
};

type RoadmapProject = {
	id: string;
	name: string;
	description?: string;
	releaseDate?: string;
};

type RoadmapData = {
	roadmapCategories?: RoadmapCategory[];
	projects?: RoadmapProject[];
};

export function generateRoadmapSql(data: RoadmapData): string {
	const categories = Array.isArray(data.roadmapCategories)
		? data.roadmapCategories
		: [];
	const projects = Array.isArray(data.projects) ? data.projects : [];

	console.log(
		`⏳ 开始解析 Roadmap 数据... categories: ${categories.length}, projects: ${projects.length}`,
	);

	let sql = "-- === 插入 Roadmap 业务域数据 ===\n";

	const categoryIdMap = new Map<string, string>();
	const projectIdMap = new Map<string, string>();

	projects.forEach((project, index) => {
		const projectId = randomUUID();
		projectIdMap.set(project.id, projectId);

		sql += `INSERT INTO public.roadmap_projects (id, slug, name, description, release_text, order_index) VALUES (\n`;
		sql += `  '${projectId}',\n`;
		sql += `  ${escapeText(project.id)},\n`;
		sql += `  ${escapeText(project.name)},\n`;
		sql += `  ${escapeText(project.description ?? "")},\n`;
		sql += `  ${escapeText(project.releaseDate ?? "Coming Soon")},\n`;
		sql += `  ${index}\n`;
		sql += `);\n\n`;
	});

	categories.forEach((category, index) => {
		const categoryId = randomUUID();
		categoryIdMap.set(category.id, categoryId);

		sql += `INSERT INTO public.roadmap_categories (id, slug, name, description, order_index) VALUES (\n`;
		sql += `  '${categoryId}',\n`;
		sql += `  ${escapeText(category.id)},\n`;
		sql += `  ${escapeText(category.name)},\n`;
		sql += `  ${escapeText(category.description ?? "")},\n`;
		sql += `  ${(category.order ?? index + 1) - 1}\n`;
		sql += `);\n\n`;

		if (Array.isArray(category.courseIds)) {
			category.courseIds.forEach((courseSlug, courseIndex) => {
				sql += `INSERT INTO public.roadmap_category_courses (roadmap_category_id, course_id, order_index)\n`;
				sql += `SELECT '${categoryId}', c.id, ${courseIndex}\n`;
				sql += `FROM public.courses c\n`;
				sql += `WHERE c.slug = ${escapeText(courseSlug)};\n\n`;
			});
		}
	});

	categories.forEach((category) => {
		if (!Array.isArray(category.projectIds)) {
			return;
		}

		const categoryId = categoryIdMap.get(category.id);
		if (!categoryId) {
			return;
		}

		category.projectIds.forEach((projectSlug, projectIndex) => {
			const projectId = projectIdMap.get(projectSlug);
			if (!projectId) {
				return;
			}

			sql += `INSERT INTO public.roadmap_category_projects (roadmap_category_id, roadmap_project_id, order_index) VALUES (\n`;
			sql += `  '${categoryId}',\n`;
			sql += `  '${projectId}',\n`;
			sql += `  ${projectIndex}\n`;
			sql += `);\n\n`;
		});
	});

	return sql;
}
