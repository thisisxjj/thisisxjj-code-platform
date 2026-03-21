import { createServerFn } from "@tanstack/react-start";
import { createServerSupabase } from "@/lib/supabase/server";
import { logger } from "@/utils/logger.server";
import type { CurrentUserDTO } from "../schemas/user.schema";

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
	async (): Promise<CurrentUserDTO | null> => {
		try {
			const supabase = createServerSupabase();

			// 获取当前真实会话中的用户
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();

			// 如果未登录或 Token 失效，直接返回 null
			if (error || !user) {
				return null;
			}

			// 返回干净的 DTO 对象，没有任何多余的包装！
			return {
				id: user.id,
				email: user.email,
				userMetadata: user.user_metadata,
				appMetadata: user.app_metadata,
				createdAt: user.created_at,
			};
		} catch (err: any) {
			logger.error("api auth ===> Get current user failed", { err });
			// 发生异常也直接返回 null，优雅降级
			return null;
		}
	},
);
