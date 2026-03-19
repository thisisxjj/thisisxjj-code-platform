import Header from "#/components/Header";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_platform")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<div className="bg-background/50 fixed top-0 right-0 left-0 z-50 h-(--header-height) backdrop-blur-md">
				<Header />
			</div>
			<main className="relative container mx-auto mt-(--header-height) min-h-[calc(100svh-var(--header-height)-var(--footer-height))] px-4 py-8">
				<Outlet />
			</main>
			Footer
		</div>
	);
}
