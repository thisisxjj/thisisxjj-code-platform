import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import { createServerSupabase } from "@/lib/supabase/server";
import { logger } from "@/utils/logger.server";
import crypto from "node:crypto";

// 1. 定义前端传过来的参数类型 (对应你源码里的 s)
interface OAuthLoginParams {
	provider: "github" | "google";
	next?: string; // 登录成功后想跳回哪个页面
	[key: string]: any; // 兼容其他 searchParams
}

// 2. 这就是你源码中被混淆的 lG 和 CF
export const oauthLoginServerFn = createServerFn({ method: "POST" })
	.inputValidator((data: OAuthLoginParams) => data) // 验证入参
	.handler(async ({ data }) => {
		const request = getRequest();
		const reqId = crypto.randomUUID();
		const clientIp =
			request.headers.get("x-forwarded-for") ||
			request.headers.get("remote-addr") ||
			"unknown";

		logger.info(`Initiating ${data.provider} OAuth login`, { reqId, clientIp });

		const supabase = createServerSupabase();

		// 3. 动态构建安全的回调地址 (防范硬编码 localhost 导致上云后报错)
		const requestUrl = new URL(request.url);
		const callbackBase = `${requestUrl.origin}/api/auth/callback`;

		// 把 next 参数透传给 callback 路由
		const nextPath = data.next || "/";
		const redirectTo = `${callbackBase}?next=${encodeURIComponent(nextPath)}`;

		// 4. 向 Supabase 发起 OAuth URL 签发请求
		const { data: authData, error } = await supabase.auth.signInWithOAuth({
			provider: data.provider,
			options: {
				redirectTo,
				// 如果你需要拿用户的 github 邮箱或额外信息，可以在这里加 scopes
				// scopes: 'repo read:org',
			},
		});

		// 5. 异常处理：打日志并跳回登录页显示错误
		if (error) {
			logger.error(`Supabase ${data.provider} OAuth Initiation Failed`, {
				reqId,
				error: error.message,
			});
			// 抛出内部路由重定向，带上错误码
			throw redirect({
				to: "/auth/login",
				search: { error: "oauth_initiation_failed" },
			});
		}

		if (!authData?.url) {
			logger.error("No OAuth URL returned from Supabase", { reqId });
			throw redirect({
				to: "/auth/login",
				search: { error: "internal_server_error" },
			});
		}

		logger.info(
			`Successfully generated ${data.provider} OAuth URL, redirecting user`,
			{ reqId },
		);

		// 🚀 6. 核心精髓：抛出外部 URL 重定向
		// 注意：因为 GitHub/Google 授权页是外部域名，所以必须用 `href` 而不是 `to`。
		// 这个 throw 会被你发现的那个 M 函数 (useServerFn wrapper) 完美接住，并让浏览器无刷新跳转！
		throw redirect({
			href: authData.url,
		});
	});

export const logoutApi = createServerFn({ method: "POST" })
	// 没有任何乱七八糟的 Promise 返回类型包装，成功就是 void
	.handler(async () => {
		const supabase = createServerSupabase();
		const { error } = await supabase.auth.signOut();

		if (error) {
			throw new Error(error.message || "登出失败");
		}
	});
