import { z } from "zod";
import type { User } from "@supabase/supabase-js";

const RawUserSchema = z.object({
	id: z.string().uuid(),
	email: z.string().optional(), // 邮箱可能是可选的（比如手机号注册）
	created_at: z.string(),
	// 记录第三方登录信息、角色等
	app_metadata: z.record(z.string(), z.any()),
	// 记录用户头像、昵称等自定义信息
	user_metadata: z.record(z.string(), z.any()),
}) satisfies z.ZodType<
	Pick<User, "id" | "email" | "created_at" | "app_metadata" | "user_metadata">
>;

export const CurrentUserSchema = RawUserSchema.transform((user) => ({
	id: user.id,
	email: user.email,
	createdAt: user.created_at,
	appMetadata: user.app_metadata,
	userMetadata: user.user_metadata,
}));

// 🌟 3. 导出完美的前端 DTO (记得在业务里用 type 导入避免报错哦！)
export type CurrentUserDTO = z.infer<typeof CurrentUserSchema>;
