import { useAvailableCoursesQueryOptions } from "#/lib/queries/useCourseQueryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CourseCard } from "../course-card";

export function AvailableCourseList({ showHeader = true }) {
	const { data: courseList } = useSuspenseQuery(
		useAvailableCoursesQueryOptions(),
	);
	return courseList.length === 0 ? null : (
		<div className="flex scroll-mt-24 flex-col gap-8" id="available-courses">
			{showHeader && (
				<div className="flex flex-col items-center gap-2 text-center">
					<h2 className="text-foreground text-xl font-semibold sm:text-2xl">
						Available Now
					</h2>
					<p className="text-muted-foreground max-w-2xl text-sm text-balance sm:text-base">
						Start learning with these courses that are ready right now
					</p>
				</div>
			)}
			<div className="flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
				{courseList.map((course) => (
					<CourseCard key={course.id} course={course} />
				))}
			</div>
		</div>
	);
}
