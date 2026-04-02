import { z } from "zod";
import type { Database } from "@/types/supabase"; // Supabase 自动生成的类型

type ProfileRow = Database["public"]["Tables"]["profile_details"]["Row"];

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
