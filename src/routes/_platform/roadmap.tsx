import { Skeleton } from "#/components/ui/skeleton";
import {
	AvailableCourseList,
	RoadmapSection,
} from "#/features/roadmap-section";
import { useAvailableCoursesQueryOptions } from "#/lib/queries/useCourseQueryOptions";
import { useRoadmapDataQueryOptions } from "#/lib/queries/useRoadmapQueryOptions";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/_platform/roadmap")({
	component: RouteComponent,
	loader: ({ context }) => {
		context.queryClient.fetchQuery(useAvailableCoursesQueryOptions());
		context.queryClient.fetchQuery(useRoadmapDataQueryOptions());
	},
	head: () => ({
		meta: [
			{
				title: "Roadmap | Cosden Code",
			},
			{
				name: "description",
				content:
					"Follow this structured path from beginner to advanced. Each step builds on the previous one, ensuring you master React and modern web development systematically",
			},
		],
	}),
});

function RouteComponent() {
	return (
		<div className="mx-auto max-w-6xl space-y-12 sm:space-y-16 lg:pt-12">
			<div className="flex flex-col items-center gap-4 text-center sm:gap-8">
				<h1 className="text-3xl font-bold text-balance sm:text-4xl lg:text-6xl">
					<span className="from-primary-500 to-secondary-500 bg-linear-to-r bg-clip-text text-transparent">
						The Complete Roadmap{" "}
					</span>
					For React Development
				</h1>
				<p className="text-muted-foreground px-4 text-sm text-balance sm:px-8 sm:text-base lg:text-lg">
					Follow this structured path from beginner to advanced. Each step
					builds on the previous one, ensuring you master React and modern web
					development systematically
				</p>
			</div>
			<Suspense fallback={<RoadmapSkeleton />}>
				<AvailableCourseList />
				<RoadmapSection />
			</Suspense>
		</div>
	);
}

function RoadmapSkeleton() {
	return (
		<div className="flex flex-col gap-16 sm:gap-24">
			<div className="flex flex-col items-center gap-2">
				<Skeleton className="h-9 w-64" />
				<Skeleton className="h-5 w-full max-w-md sm:max-w-2xl" />
			</div>
			<div className="flex flex-col gap-16 sm:gap-24">
				{Array.from({ length: 5 }).map((_, index) => (
					<div key={index} className="flex flex-col gap-6 sm:gap-8">
						<div className="flex flex-col items-center gap-2 text-center">
							<Skeleton className="h-6 w-24 rounded-full" />
							<Skeleton className="h-7 w-48" />
							<Skeleton className="h-4 w-full max-w-md sm:max-w-2xl" />
						</div>
						<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
							{Array.from({ length: 2 }).map((__, i) => (
								<Skeleton
									key={i}
									className="h-87.5 w-full max-w-87.5 sm:h-100"
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
