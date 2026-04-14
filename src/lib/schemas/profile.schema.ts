import { z } from "zod";
import type { Database } from "@/types/supabase"; // Supabase 自动生成的类型

type ProfileBaseRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profile_details"]["Row"];
type ProfileStatsRow = Database["public"]["Tables"]["profile_stats"]["Row"];
type ProfileActivityDataRow =
	Database["public"]["Views"]["profile_activity_data_view"]["Row"];
type ProfileCourseProgressRow =
	Database["public"]["Views"]["profile_course_progress_view"]["Row"];
type ProfileRecentActivityRow =
	Database["public"]["Views"]["profile_recent_activity_view"]["Row"];

const RawProfileBaseSchema = z.object({
	id: z.string().uuid(),
	created_at: z.string(),
	updated_at: z.string(),
	is_anonymous: z.boolean(),
	is_beta_user: z.boolean(),
}) satisfies z.ZodType<ProfileBaseRow>;

export const ProfileSchema = RawProfileBaseSchema.transform((row) => ({
	id: row.id,
	isAnonymous: row.is_anonymous,
	isBetaUser: row.is_beta_user,
	createdAt: row.created_at,
	updatedAt: row.updated_at,
}));

export type ProfileDTO = z.infer<typeof ProfileSchema>;

const RawProfileStatsSchema = z.object({
	profile_id: z.string().uuid(),
	total_xp: z.number(),
	lessons_completed: z.number(),
	updated_at: z.string(),
}) satisfies z.ZodType<ProfileStatsRow>;

export const ProfileStatsSchema = RawProfileStatsSchema.transform((row) => ({
	profileId: row.profile_id,
	totalXp: row.total_xp,
	lessonsCompleted: row.lessons_completed,
	updatedAt: row.updated_at,
}));

export type ProfileStatsDTO = z.infer<typeof ProfileStatsSchema>;

const RawProfileActivityDataSchema = z.object({
	profile_id: z.string().uuid().nullable(),
	date: z.string().nullable(),
	count: z.number().nullable(),
}) satisfies z.ZodType<ProfileActivityDataRow>;

export const ProfileActivityDataSchema = RawProfileActivityDataSchema.transform(
	(row) => ({
		profileId: row.profile_id,
		date: row.date,
		count: row.count,
	}),
);

export type ProfileActivityDataDTO = z.infer<typeof ProfileActivityDataSchema>;

const RawProfileCourseProgressSchema = z.object({
	profile_id: z.string().uuid().nullable(),
	course_template_id: z.string().uuid().nullable(),
	course_template_name: z.string().nullable(),
	completed_lessons: z.number().nullable(),
	total_lessons: z.number().nullable(),
	progress_percentage: z.number().nullable(),
}) satisfies z.ZodType<ProfileCourseProgressRow>;

export const ProfileCourseProgressSchema = RawProfileCourseProgressSchema.transform(
	(row) => ({
		profileId: row.profile_id,
		courseTemplateId: row.course_template_id,
		courseTemplateName: row.course_template_name,
		completedLessons: row.completed_lessons,
		totalLessons: row.total_lessons,
		progressPercentage: row.progress_percentage,
	}),
);

export type ProfileCourseProgressDTO = z.infer<
	typeof ProfileCourseProgressSchema
>;

const RawLessonTemplateSchema = z.object({
	id: z.string().uuid(),
	slug: z.string(),
	name: z.string(),
	description: z.string().nullable(),
});

const RawCourseTemplateSchema = z.object({
	id: z.string().uuid(),
	slug: z.string(),
	name: z.string(),
	status: z.enum(["draft", "published", "archived"]),
});

const RawProfileRecentActivitySchema = z.object({
	id: z.string().uuid().nullable(),
	profile_id: z.string().uuid().nullable(),
	completed_at: z.string().nullable(),
	lesson_template: RawLessonTemplateSchema.nullable(),
	course_template: RawCourseTemplateSchema.nullable(),
}) satisfies z.ZodType<ProfileRecentActivityRow>;

export const ProfileRecentActivitySchema = RawProfileRecentActivitySchema.transform(
	(row) => ({
		id: row.id,
		profileId: row.profile_id,
		completedAt: row.completed_at,
		lessonTemplate: row.lesson_template,
		courseTemplate: row.course_template,
	}),
);

export type ProfileRecentActivityDTO = z.infer<typeof ProfileRecentActivitySchema>;

const RawProfileSchema = z.object({
	id: z.string(),
	profile_id: z.string(),
	avatar_url: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	bio: z.string().nullable(),
	username: z.string(),
	email: z.email(),
	name: z.string().nullable(),
	occupation: z.string().nullable(),
	additional_info: z.json().nullable(),
}) satisfies z.ZodType<ProfileRow>;

export const ProfileDetailSchema = RawProfileSchema.transform((row) => ({
	id: row.id,
	profileId: row.profile_id,
	username: row.username,
	email: row.email,
	name: row.name,
	avatarUrl: row.avatar_url,
	bio: row.bio,
	occupation: row.occupation,
	additionalInfo: row.additional_info,
	createdAt: row.created_at,
	updateAt: row.updated_at,
}));

// 完美的前端驼峰类型
export type ProfileDetailDTO = z.infer<typeof ProfileDetailSchema>;
