import type {
	CourseSummaryDTO,
	RoadmapCategoryDTO,
	RoadmapProjectDTO,
} from "#/lib/schemas/roadmap.schema";
import { CourseCard } from "../course-card";
import { RoadmapProject } from "./RoadmapProject";

export function RoadmapStep({
	category,
	index,
	courses,
	projects = [],
}: {
	category: RoadmapCategoryDTO;
	index: number;
	courses: CourseSummaryDTO[];
	projects: RoadmapProjectDTO[];
}) {
	const currentCourses = category.courseIds
		.map((courseId) => courses.find((item) => item.id === courseId))
		.filter((courseId) => courseId !== undefined);
	const currentProjects = category.projectIds
		? category.projectIds
				.map((a) => projects?.find((x) => x.id === a))
				.filter((a) => a !== void 0)
		: [];
	return currentCourses.length === 0 && currentProjects.length === 0 ? null : (
		<div className="flex flex-col gap-6 sm:gap-8">
			<div className="flex flex-col items-center gap-2 text-center">
				<div className="bg-primary-500/10 text-primary-300 rounded-full px-3 py-1 text-xs font-semibold tracking-[0.2em] uppercase sm:tracking-[0.3em]">
					{"Step "}
					{index + 1}
				</div>
				<h2 className="text-foreground text-xl font-semibold sm:text-2xl">
					{category.name}
				</h2>
				{category.description && (
					<p className="text-muted-foreground max-w-2xl text-sm text-balance sm:text-base">
						{category.description}
					</p>
				)}
			</div>
			{currentCourses.length > 0 && (
				<div className="flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
					{currentCourses.map((course) => (
						<CourseCard key={course.id} course={course} />
					))}
				</div>
			)}
			{currentProjects.length > 0 && (
				<div className="flex flex-col gap-4">
					<h3 className="text-foreground text-center text-base font-semibold sm:text-lg">
						Projects
					</h3>
					<div className="flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
						{currentProjects.map((project) => (
							<RoadmapProject key={project.id} project={project} />
						))}
					</div>
				</div>
			)}
		</div>
	);
}
