import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { Toaster } from "#/components/ui/sonner";
import { Providers } from "#/providers";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "color-scheme",
				content: "dark",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title:
					"Cosden Code: Your Career in Full-Stack React Development Starts Here",
			},
			{
				description:
					"The complete beginner-to-advanced roadmap to becoming a full-stack React developer",
			},
			{
				property: "og:title",
				content:
					"Cosden Code: Your Career in Full-Stack React Development Starts Here",
			},
			{
				property: "og:description",
				content:
					"The complete beginner-to-advanced roadmap to becoming a full-stack React developer",
			},
			{
				property: "og:image",
				content: "/opengraph-image.jpg",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/icon.png",
				sizes: "32x32",
			},
		],
	}),
	component: RootDocument,
});

function RootDocument() {
	return (
		<html lang="en" className="dark" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				<Toaster
					theme="dark"
					toastOptions={{
						unstyled: true,
						classNames: {
							toast:
								"bg-background text-foreground text-sm border border-border shadow-lg rounded-lg p-4 flex flex-row gap-2 items-center",
							success: "[&_svg]:text-green-600",
							error: "[&_svg]:text-destructive",
							info: "[&_svg]:text-blue-600",
							warning: "[&_svg]:text-yellow-600",
						},
					}}
				/>
				<Providers>
					<Outlet />
				</Providers>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						{
							name: "Tanstack Query",
							render: <ReactQueryDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
