import LaunchAiLanding from "#/features/platform/LaunchAiLanding";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_platform/")({
	component: RouteComponent,
	loader: LoaderComponent,
});

function RouteComponent() {
	const { affiliateId, landingPageVariant } = Route.useLoaderData();
	// TODO sentry upload

	return (
		<div className="lg:pt-12">
			{landingPageVariant === "launch-ai-focused" && (
				<LaunchAiLanding
					affiliateId={affiliateId}
					landingPageVariant={landingPageVariant}
				/>
			)}
		</div>
	);
}

function LoaderComponent() {
	return {
		affiliateId: undefined,
		landingPageVariant: "launch-ai-focused",
	};
}
