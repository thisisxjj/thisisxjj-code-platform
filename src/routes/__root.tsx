import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import Footer from "../components/Footer";
import Header from "../components/Header";

import appCss from "../styles.css?url";
import { Providers } from "#/providers";

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
