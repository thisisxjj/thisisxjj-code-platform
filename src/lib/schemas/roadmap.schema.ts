import { z } from "zod";
import { CourseSummarySchema, type CourseSummaryDTO } from "./course.schema";

export const RoadmapCategorySchema = z.object({
	id: z.string().uuid(),
	slug: z.string(),
	name: z.string(),
	description: z.string(),
	courseIds: z.array(z.string()),
	projectIds: z.array(z.string()),
	order: z.number().int().nonnegative(),
});

export const RoadmapProjectSchema = z.object({
	id: z.string().uuid(),
	slug: z.string(),
	name: z.string(),
	description: z.string(),
	releaseDate: z.string(),
	order: z.number().int().nonnegative(),
});

export const RoadmapDataSchema = z.object({
	roadmapCategories: z.array(RoadmapCategorySchema),
	projects: z.array(RoadmapProjectSchema),
	courses: z.array(CourseSummarySchema),
});

export type RoadmapCategoryDTO = z.infer<typeof RoadmapCategorySchema>;
export type RoadmapProjectDTO = z.infer<typeof RoadmapProjectSchema>;
export type { CourseSummaryDTO };
export type RoadmapDataDTO = z.infer<typeof RoadmapDataSchema>;

export const EMPTY_ROADMAP_DATA: RoadmapDataDTO = {
	roadmapCategories: [],
	projects: [],
	courses: [],
};
