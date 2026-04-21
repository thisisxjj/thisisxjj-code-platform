import { useRoadmapDataQueryOptions } from "#/lib/queries/useRoadmapQueryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import { RoadmapStep } from "./RoadmapStep";

export function RoadmapSection({ maxOrder }: { maxOrder?: number }) {
	const {
		data: { roadmapCategories, projects, courses },
	} = useSuspenseQuery(useRoadmapDataQueryOptions());
	const filterRoadmapCategories = maxOrder
		? roadmapCategories.filter((category) => category.order <= maxOrder)
		: roadmapCategories;

	return (
		<div className="flex flex-col gap-16 sm:gap-24">
			<div className="flex flex-col items-center gap-6 text-center sm:gap-8">
				<div className="flex flex-col items-center gap-2">
					<h2 className="text-foreground text-2xl font-semibold sm:text-3xl">
						The Complete Roadmap
					</h2>
					<p className="text-muted-foreground max-w-2xl text-sm text-balance sm:text-base">
						Cosden Code grows with you. New courses and projects will be added
						regularly as you progress
					</p>
				</div>
				<Image
					className="mx-auto w-15 rotate-70 sm:w-20 lg:w-25"
					src="/arrow.png"
					width={800}
					height={400}
					alt="Arrow"
				/>
			</div>
			<div className="flex flex-col gap-16 sm:gap-24">
				{filterRoadmapCategories.map((category, index) => (
					<RoadmapStep
						key={category.id}
						category={category}
						index={index}
						courses={courses}
						projects={projects}
					/>
				))}
			</div>
		</div>
	);
}
