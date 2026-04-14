import { ERROR_MESSAGE } from "#/lib/constants";
import { useUserQueryOptions } from "#/lib/queries/useUserQueryOptions";
import type { CurrentUserDTO } from "#/lib/schemas/user.schema";
import { useQuery } from "@tanstack/react-query";
import { createContext, use, type ReactNode } from "react";

const AuthContext = createContext<{
	user: CurrentUserDTO | null | undefined;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const { data, error } = useQuery(useUserQueryOptions());
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
