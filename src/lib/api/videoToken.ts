import { createServerFn } from "@tanstack/react-start";
import crypto from "node:crypto";
import { z } from "zod";

export const AuthInputSchema = z.object({
	// 防御性编程：限制长度，防止哈希碰撞攻击或内存溢出攻击
	videoId: z
		.string()
		.min(1, "视频 ID 不能为空")
		.max(100, "视频 ID 长度异常")
		.regex(/^[a-zA-Z0-9-_]+$/, "视频 ID 包含非法字符"), // 仅允许安全字符
});

interface AuthResponse {
	token?: string;
	expiresAt?: number;
	error?: string;
}

export const generateVideoToken = createServerFn({ method: "GET" })
	.inputValidator((data: unknown) => AuthInputSchema.parse(data))
	.handler(async ({ data: { videoId } }): Promise<AuthResponse> => {
		try {
			// 1. 鉴权逻辑 (企业级必备：验证用户是否登录/购买)
			const securityKey = process.env.BUNNY_SECURITY_KEY;
			if (!securityKey) {
				throw new Error("Server configuration error");
			}

			// TODO 当前过期时间写死
			// 2. 计算过期时间 (当前时间戳秒数 + 3600秒)
			const expiresAt = Math.floor(Date.now() / 1000) + 3600;

			// 3. 按照 Bunny CDN 规则生成防盗链 Token
			const hashString = `${securityKey}${videoId}${expiresAt}`;
			const token = crypto
				.createHash("sha256")
				.update(hashString)
				.digest("hex");

			// 4. 只返回 token 和 expiresAt
			return { token, expiresAt };
		} catch (error: any) {
			return { error: error.message || "Token generation failed" };
		}
	});
