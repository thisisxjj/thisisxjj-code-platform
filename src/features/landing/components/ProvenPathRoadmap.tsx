import { Suspense } from "react";
import { CourseListSkeleton } from "#/features/roadmap-section";

export default function ProvenPathRoadmap() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<div className="space-y-2 px-4 text-center">
				<h2 className="text-center text-xl font-bold text-balance sm:text-2xl lg:text-4xl">
					A proven path{" "}
					<span className="text-gradient">
						from complete beginner to confident React developer
					</span>
				</h2>
				<p className="text-muted-foreground text-sm text-balance sm:text-base lg:text-lg">
					Follow this structured path from beginner to advanced. Each step
					builds on the previous one, ensuring you master React and modern web
					development systematically
				</p>
			</div>
			<Suspense fallback={<CourseListSkeleton />}>
				{/* TODO: 添加course list */}
				fff
			</Suspense>
		</section>
	);
}
