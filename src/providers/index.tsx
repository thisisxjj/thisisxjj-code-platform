import type { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/react";
import { WindowSizeProvider } from "./WindowSizeProvider";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<WindowSizeProvider>
			<NuqsAdapter>{children}</NuqsAdapter>
		</WindowSizeProvider>
	);
}
