import { z } from "zod";
import type { Database } from "@/types/supabase";

type CourseSummariesRow = {
	id: string;
	slug: string;
	name: string;
	description: string | null;
	difficulty: Database["public"]["Enums"]["course_difficulty"];
	duration_in_hours: number;
	thumbnail_url: string | null;
	status: Database["public"]["Enums"]["course_status"];
	order_index: number;
	review_count: number;
	average_rating: number;
	module_count: number;
	lesson_count: number;
	task_count: number;
};

const RawCourseTemplateSchema = z.object({
	id: z.string(),
	slug: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	difficulty: z.enum(["beginner", "intermediate", "advanced"]),
	duration_in_hours: z.number(),
	thumbnail_url: z.string().nullable(),
	status: z.enum(["draft", "published", "archived"]),
	order_index: z.number(),
	review_count: z.number(),
	average_rating: z.number(),
	module_count: z.number(),
	lesson_count: z.number(),
	task_count: z.number(),
}) satisfies z.ZodType<CourseSummariesRow>;

export const CourseTemplateSchema = RawCourseTemplateSchema.transform((row) => ({
	id: row.id,
	slug: row.slug,
	name: row.name,
	description: row.description,
	difficulty: row.difficulty,
	durationInHours: row.duration_in_hours,
	thumbnailUrl: row.thumbnail_url,
	status: row.status,
	orderIndex: row.order_index,
	reviewCount: row.review_count,
	averageRating: row.average_rating,
	moduleCount: row.module_count,
	lessonCount: row.lesson_count,
	taskCount: row.task_count,
}));

export type CourseTemplateDTO = z.infer<typeof CourseTemplateSchema>;
