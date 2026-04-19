import { ERROR_MESSAGE } from "#/lib/constants";
import { completeFirstLessonForDevBootstrap } from "#/lib/api/lesson";
import { useUserQueryOptions } from "#/lib/queries/useUserQueryOptions";
import type { CurrentUserDTO } from "#/lib/schemas/user.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createContext, use, useEffect, type ReactNode } from "react";

const DEV_BOOTSTRAP_COMPLETE_KEY_PREFIX = "dev:auto-complete:first-lesson";

const AuthContext = createContext<{
	user: CurrentUserDTO | null | undefined;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const { data, error } = useQuery(useUserQueryOptions());
	const completeFirstLessonServerFn = useServerFn(
		completeFirstLessonForDevBootstrap,
	);
	const { mutate: runDevBootstrapComplete } = useMutation({
		mutationFn: completeFirstLessonServerFn,
	});

	useEffect(() => {
		if (!import.meta.env.DEV || !data?.id) {
			return;
		}

		const bootstrapKey = `${DEV_BOOTSTRAP_COMPLETE_KEY_PREFIX}:${data.id}`;
		if (globalThis.localStorage.getItem(bootstrapKey)) {
			return;
		}

		runDevBootstrapComplete(undefined, {
			onSuccess: () => {
				globalThis.localStorage.setItem(bootstrapKey, "1");
			},
			onError: (bootstrapError) => {
				console.error("dev bootstrap complete lesson failed", bootstrapError);
			},
		});
	}, [data?.id, runDevBootstrapComplete]);

	if (error) {
		// TODO: 上报sentry
		throw new Error(ERROR_MESSAGE);
	}

	return (
		<AuthContext
			value={{
				user: data,
			}}
		>
			{children}
		</AuthContext>
	);
}

export function useAuth() {
	const data = use(AuthContext);
	if (!data) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return data;
}
