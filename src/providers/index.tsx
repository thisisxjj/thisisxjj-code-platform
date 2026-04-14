import type { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/react";
import { WindowSizeProvider } from "./WindowSizeProvider";
import { AuthProvider } from "./AuthProvider";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<WindowSizeProvider>
			<NuqsAdapter>
				<AuthProvider>{children}</AuthProvider>
			</NuqsAdapter>
		</WindowSizeProvider>
	);
}
