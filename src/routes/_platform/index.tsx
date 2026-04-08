import LaunchAiLanding from "#/features/landing/LaunchAiLanding";
import LaunchReactLanding from "#/features/landing/LaunchReactLanding";
import { LandingPageVariant } from "#/features/landing/type";
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
			{landingPageVariant === LandingPageVariant.LAUNCH_AI_FOCUSED && (
				<LaunchAiLanding
					affiliateId={affiliateId}
					landingPageVariant={landingPageVariant}
				/>
			)}
			{landingPageVariant === LandingPageVariant.LAUNCH_REACT_FOCUSED && (
				<LaunchReactLanding
					affiliateId={affiliateId}
					landingPageVariant={landingPageVariant}
				/>
			)}
		</div>
	);
}

function LoaderComponent() {
	// TODO get landingPageVariant
	return {
		affiliateId: undefined,
		landingPageVariant: LandingPageVariant.LAUNCH_REACT_FOCUSED,
	};
}
