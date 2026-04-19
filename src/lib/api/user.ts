import { createServerSupabase } from "@/lib/supabase/server";
import { logger } from "@/utils/logger.server";
import { createServerFn } from "@tanstack/react-start";
import { CurrentUserSchema, type CurrentUserDTO } from "../schemas/user.schema";

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
	async (): Promise<CurrentUserDTO | null> => {
		try {
			const supabase = createServerSupabase();

			// 获取当前真实会话中的用户
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();

			// 抛出错误,由外层捕获
			if (error?.name === "AuthSessionMissingError") {
				return null;
			}

			if (error) {
				throw error;
			}

			if (!user) {
				return null;
			}

			// 返回干净的 DTO 对象，没有任何多余的包装！
			return CurrentUserSchema.parse(user);
		} catch (err: any) {
			logger.error("api auth ===> Get current user failed", { err });
			throw err;
		}
	},
);
