import type {
	CourseDetailsDTO,
	LessonOutlineDTO,
} from "#/lib/schemas/course.schema";
import type { LessonSubmissionDTO } from "#/lib/schemas/lesson.schema";

export function getAllLessonIdsByCourse(course: CourseDetailsDTO) {
	return course.modules.flatMap((module) =>
		module.lessons.map((lesson) => lesson.id),
	);
}

export function hasPassedLesson(
	lesson: LessonOutlineDTO,
	lessonSubmissions: LessonSubmissionDTO[],
) {
	return !!lessonSubmissions
		.filter(
			(lessonSubmission) => lessonSubmission.lessonTemplateId === lesson.id,
		)
		.some((lessonSubmission) => lessonSubmission.isPassed);
}

export function getCourseEntryState(
	course: CourseDetailsDTO,
	lessonSubmissions: LessonSubmissionDTO[],
): {
	lesson: LessonOutlineDTO;
	status: "review" | "contiune" | "start";
} {
	const lessons = course.modules.flatMap((module) => module.lessons);
	const firstLesson = lessons[0];

	if (lessons.every((lesson) => hasPassedLesson(lesson, lessonSubmissions))) {
		return {
			lesson: firstLesson,
			status: "review",
		};
	} else if (lessonSubmissions.length > 0) {
		return {
			lesson: lessons.find(
				(lesson) => !hasPassedLesson(lesson, lessonSubmissions),
			),
			status: "contiune",
		};
	} else {
		return {
			lesson: firstLesson,
			status: "start",
		};
	}
}
