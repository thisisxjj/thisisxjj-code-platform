import { z } from "zod";
import type { Database } from "@/types/supabase";
import { ObjectiveSchema } from "./common.schema";

// ============================================================================
// 视图 1: Course Summaries (全量列表查询)
// ============================================================================
export type CourseSummariesRow = {
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

const RawCourseSummariesSchema = z.object({
	id: z.string().uuid(),
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

export const CourseSummarySchema = RawCourseSummariesSchema.transform(
	(row) => ({
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
	}),
);

export type CourseSummaryDTO = z.infer<typeof CourseSummarySchema>;

// ============================================================================
// 视图 2: Course Details (课程大纲)
// ============================================================================
export type LessonOutlineRow = {
	id: string;
	slug: string;
	name: string;
	description: string | null;
	type: Database["public"]["Enums"]["lesson_type"];
	is_free: boolean;
	video_id: string | null;
	order_index: number;
	xp_reward: number;
	objectives: any[];
};

export type ModuleOutlineRow = {
	id: string;
	slug: string;
	name: string;
	description: string | null;
	order_index: number;
	lesson_count: number;
	task_count: number;
	lessons: LessonOutlineRow[];
};

export type CourseDetailsRow = {
	id: string;
	slug: string;
	name: string;
	description: string | null;
	long_description: string | null;
	difficulty: Database["public"]["Enums"]["course_difficulty"];
	duration_in_hours: number;
	status: Database["public"]["Enums"]["course_status"];
	order_index: number;
	thumbnail_url: string | null;
	xp_reward: number;
	review_count: number;
	average_rating: number;
	created_at: string;
	updated_at: string;
	module_count: number;
	lesson_count: number;
	task_count: number;
	modules: ModuleOutlineRow[];
};

const RawLessonOutlineSchema = z.object({
	id: z.string().uuid(),
	slug: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	type: z.enum(["standard", "whiteboard", "video", "quiz"]),
	is_free: z.boolean(),
	video_id: z.string().nullable(),
	order_index: z.number(),
	xp_reward: z.number(),
	// 大纲视图中引入 common.ts 定义的 ObjectiveSchema
	objectives: z.array(ObjectiveSchema).default([]),
}) satisfies z.ZodType<LessonOutlineRow>;

const RawModuleOutlineSchema = z.object({
	id: z.string().uuid(),
	slug: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	order_index: z.number(),
	lesson_count: z.number(),
	task_count: z.number(),
	lessons: z.array(RawLessonOutlineSchema),
}) satisfies z.ZodType<ModuleOutlineRow>;

const RawCourseDetailsSchema = z.object({
	id: z.string().uuid(),
	slug: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	long_description: z.string().nullable(),
	difficulty: z.enum(["beginner", "intermediate", "advanced"]),
	duration_in_hours: z.number(),
	status: z.enum(["draft", "published", "archived"]),
	order_index: z.number(),
	thumbnail_url: z.string().nullable(),
	xp_reward: z.number(),
	review_count: z.number(),
	average_rating: z.number(),
	created_at: z.string(),
	updated_at: z.string(),
	module_count: z.number(),
	lesson_count: z.number(),
	task_count: z.number(),
	modules: z.array(RawModuleOutlineSchema),
}) satisfies z.ZodType<CourseDetailsRow>;

export const CourseDetailsSchema = RawCourseDetailsSchema.transform((row) => ({
	id: row.id,
	slug: row.slug,
	name: row.name,
	description: row.description,
	longDescription: row.long_description,
	difficulty: row.difficulty,
	durationInHours: row.duration_in_hours,
	status: row.status,
	orderIndex: row.order_index,
	thumbnailUrl: row.thumbnail_url,
	xpReward: row.xp_reward,
	reviewCount: row.review_count,
	averageRating: row.average_rating,
	createdAt: row.created_at,
	updatedAt: row.updated_at,
	moduleCount: row.module_count,
	lessonCount: row.lesson_count,
	taskCount: row.task_count,
	modules: row.modules.map((mod) => ({
		id: mod.id,
		slug: mod.slug,
		name: mod.name,
		description: mod.description,
		orderIndex: mod.order_index,
		lessonCount: mod.lesson_count,
		taskCount: mod.task_count,
		lessons: mod.lessons.map((lesson) => ({
			id: lesson.id,
			slug: lesson.slug,
			name: lesson.name,
			description: lesson.description,
			type: lesson.type,
			isFree: lesson.is_free,
			videoId: lesson.video_id,
			orderIndex: lesson.order_index,
			xpReward: lesson.xp_reward,
			objectives: lesson.objectives,
		})),
	})),
}));

export type CourseDetailsDTO = z.infer<typeof CourseDetailsSchema>;
export type ModuleOutlineDTO = CourseDetailsDTO["modules"][number];
export type LessonOutlineDTO = ModuleOutlineDTO["lessons"][number];
