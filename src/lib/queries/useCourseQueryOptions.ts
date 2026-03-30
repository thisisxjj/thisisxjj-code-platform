import { queryOptions } from "@tanstack/react-query";
import { getAllCourseTemplates } from "../api/course-template";

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
