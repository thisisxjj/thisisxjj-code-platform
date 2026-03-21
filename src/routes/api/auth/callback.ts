import { createServerSupabase } from "@/lib/supabase/server";
import { redirectWithCookies } from "@/utils/http";
import { logger } from "@/utils/logger.server";
import { createFileRoute } from "@tanstack/react-router";
import crypto from "node:crypto";

export const Route = createFileRoute("/api/auth/callback")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const reqId = crypto.randomUUID();
				const requestUrl = new URL(request.url);

				const code = requestUrl.searchParams.get("code");
				const next = requestUrl.searchParams.get("next");
				const providerError = requestUrl.searchParams.get("error");

				const clientIp =
					request.headers.get("x-forwarded-for") ||
					request.headers.get("remote-addr") ||
					"unknown";

				if (providerError) {
					logger.warn("api auth callback ===> OAuth Provider Error", {
						error: providerError,
						description: requestUrl.searchParams.get("error_description"),
						ip: clientIp,
						reqId,
					});
					return redirectWithCookies(
						`${requestUrl.origin}/login?error=access_denied`,
					);
				}

				let redirectPath = "/";
				if (next && next.startsWith("/") && !next.match(/^\/[\/\\]/)) {
					redirectPath = next;
				}

				if (code) {
					const supabase = createServerSupabase();

					try {
						const { error } = await supabase.auth.exchangeCodeForSession(code);

						if (error) {
							logger.error(
								"api auth callback ===> Supabase Session Exchange Failed",
								{
									supabaseError: error.message,
									reqId,
								},
							);
							return redirectWithCookies(
								`${requestUrl.origin}/login?error=session_exchange_failed`,
							);
						}

						logger.info(
							"api auth callback ===> User successfully logged in via OAuth",
							{
								reqId,
								ip: clientIp,
								redirectPath,
							},
						);
						return redirectWithCookies(`${requestUrl.origin}${redirectPath}`);
					} catch (err) {
						logger.error(
							"api auth callback ===> System Exception during Auth Callback",
							{
								exception: err instanceof Error ? err.stack : err,
								reqId,
							},
						);
						return redirectWithCookies(
							`${requestUrl.origin}/login?error=internal_server_error`,
						);
					}
				}

				return redirectWithCookies(
					`${requestUrl.origin}/login?error=invalid_request`,
				);
			},
		},
	},
});
