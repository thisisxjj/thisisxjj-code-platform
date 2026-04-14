import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_platform/user")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="mx-auto max-w-6xl">
			<Outlet />
		</div>
	);
}
