import { queryOptions } from "@tanstack/react-query";
import {
	getLessonDetailByLessonSlug,
	getLessonSubmissionsByLessonIds,
} from "../api/lesson";

export const lessonKeys = {
	lessonTemplate: {
		all: ["lesson-templates"],
		byId: (lessonId: string) => ["lesson-templates", lessonId],
		module: (moduleId: string) => ["lesson-template-module", moduleId],
	},
	lessonSubmissions: {
		all: ["lesson-submissions"],
		byLessonId: (lessonId: string) => ["lesson-submissions", lessonId],
		byLessonIds: (lessonIds: string[]) => ["lesson-submissions", lessonIds],
	},
};
export function useLessonSubmissionsByLessonIds(lessonIds: string[]) {
	return queryOptions({
		queryKey: lessonKeys.lessonSubmissions.byLessonIds(lessonIds),
		queryFn: () =>
			getLessonSubmissionsByLessonIds({
				data: lessonIds,
			}),
	});
}

export function useLessonDetailByLessonSlugQueryOptions(lessonSlug: string) {
	return queryOptions({
		queryKey: lessonKeys.lessonTemplate.byId(lessonSlug),
		queryFn: () =>
			getLessonDetailByLessonSlug({
				data: lessonSlug,
			}),
	});
}
