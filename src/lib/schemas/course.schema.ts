import { z } from "zod";
import type { Database } from "@/types/supabase";

type CourseRow = Database["public"]["Tables"]["courses"]["Row"];

const RawCourseSchema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
	description: z.string().nullable(),
	long_description: z.string().nullable(),
	difficulty: z.enum(["beginner", "intermediate", "advanced"]),
	duration_in_hours: z.number(),
	xp_reward: z.number(),
	thumbnail_url: z.string().nullable(),
	review_count: z.number(),
	average_rating: z.number(),
	status: z.enum(["draft", "published", "archived"]),
	order_index: z.number(),
	created_at: z.string(),
	updated_at: z.string(),
}) satisfies z.ZodType<CourseRow>;

export const CourseSchema = RawCourseSchema.transform((row) => ({
	id: row.id,
	name: row.name,
	slug: row.slug,
	description: row.description,
	longDescription: row.long_description,
	difficulty: row.difficulty,
	durationInHours: row.duration_in_hours,
	xpReward: row.xp_reward,
	thumbnailUrl: row.thumbnail_url,
	reviewCount: row.review_count,
	averageRating: row.average_rating,
	status: row.status,
	orderIndex: row.order_index,
	createdAt: row.created_at,
	updatedAt: row.updated_at,
}));

export type CourseDTO = z.infer<typeof CourseSchema>;
