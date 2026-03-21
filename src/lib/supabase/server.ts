import { createServerClient } from "@supabase/ssr";
import { getCookies, setCookie } from "@tanstack/react-start/server";
import type { Database } from "../../types/supabase";

export function createServerSupabase() {
	return createServerClient<Database>(
		import.meta.env.VITE_SUPABASE_URL,
		import.meta.env.VITE_SUPABASE_ANON_KEY,
		{
			cookies: {
				// 1. 获取所有的 Cookie
				getAll() {
					const cookies = getCookies();

					// 兼容处理：防范底层 API 返回值类型的差异
					if (Array.isArray(cookies)) {
						return cookies;
					}
					// 如果返回的是 Record<string, string> 对象，则转换为 Supabase 需要的数组格式
					return Object.entries(cookies || {}).map(([name, value]) => ({
						name,
						value: value as string,
					}));
				},

				// 2. 批量设置 Cookie (登出时的清除操作 Supabase 也会走这里)
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => {
						setCookie(name, value, options);
					});
				},
			},
		},
	);
}
