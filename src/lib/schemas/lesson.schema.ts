import { z } from "zod";
import type { Database } from "@/types/supabase";
import {
	ObjectiveSchema,
	TaskSchema,
	CodeEditorSchema,
	WhiteboardSchema,
	ResourceSchema,
	type ObjectiveRow,
	type TaskRow,
	type CodeEditorRow,
	type WhiteboardRow,
	type ResourceRow,
} from "./common.schema";

// ============================================================================
// 单课详情 (带 context, whiteboard, code_editor, tasks 等全量重型负载)
// ============================================================================
export type LessonDetailRow = {
	id: string;
	slug: string;
	module_id: string;
	course_id: string;
	name: string;
	description: string | null;
	type: Database["public"]["Enums"]["lesson_type"];
	context: string | null;
	video_id: string | null;
	is_free: boolean;
	order_index: number;
	xp_reward: number;
	objectives: ObjectiveRow[];
	tasks: TaskRow[];
	code_editor: CodeEditorRow;
	resources: ResourceRow[];
	whiteboard: WhiteboardRow;
	created_at: string;
	updated_at: string;
};

const RawLessonDetailSchema = z.object({
	id: z.string().uuid(),
	slug: z.string(),
	module_id: z.string().uuid(),
	course_id: z.string().uuid(),
	name: z.string(),
	description: z.string().nullable(),
	type: z.enum(["standard", "whiteboard", "video", "quiz"]),
	context: z.string().nullable(),
	video_id: z.string().nullable(),
	is_free: z.boolean(),
	order_index: z.number(),
	xp_reward: z.number(),

	// 核心：全面集成 common.ts 中的强校验 JSONB Schema
	objectives: z.array(ObjectiveSchema).default([]),
	tasks: z.array(TaskSchema).default([]),
	code_editor: CodeEditorSchema,
	resources: z.array(ResourceSchema).default([]),
	whiteboard: WhiteboardSchema,

	created_at: z.string(),
	updated_at: z.string(),
}) satisfies z.ZodType<LessonDetailRow>;

export const LessonDetailSchema = RawLessonDetailSchema.transform((row) => ({
	id: row.id,
	slug: row.slug,
	moduleId: row.module_id,
	courseId: row.course_id,
	name: row.name,
	description: row.description,
	type: row.type,
	context: row.context,
	videoId: row.video_id,
	isFree: row.is_free,
	orderIndex: row.order_index,
	// xpReward: row.xp_reward,

	// JSONB 字段完美映射并自带 TypeScript 提示
	objectives: row.objectives,
	tasks: row.tasks,
	codeEditor: row.code_editor,
	resources: row.resources,
	whiteboard: row.whiteboard,

	createdAt: row.created_at,
	updatedAt: row.updated_at,
}));

export type LessonDetailDTO = z.infer<typeof LessonDetailSchema>;
