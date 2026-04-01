import { queryOptions } from "@tanstack/react-query";
import { getAllCourseTemplates, getCourseDetailBySlug } from "../api/course-template";

export const courseKeys = {
	courseTemplates: {
		all: ["course-templates"],
		byId: (id: string) => ["course-templates", id],
		byLessonTemplateId: (id: string) => ["course-templates", id],
	},
};

export function useAllCourseTemplatesQueryOptions() {
	return queryOptions({
		queryKey: courseKeys.courseTemplates.all,
		queryFn: () => getAllCourseTemplates(),
	});
}

export function useCourseDetailQueryOptions(slug: string) {
	return queryOptions({
		queryKey: courseKeys.courseTemplates.byLessonTemplateId(slug),
		queryFn: () => getCourseDetailBySlug({ data: slug }),
	});
}
