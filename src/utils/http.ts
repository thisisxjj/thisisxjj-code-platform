/**
 * 带有 Cookie 注入能力的重定向
 * 用于替代原生的 Response.redirect，防止 TypeError: immutable
 */
export function redirectWithCookies(url: string) {
	return new Response(null, {
		status: 302,
		headers: { Location: url },
	});
}
