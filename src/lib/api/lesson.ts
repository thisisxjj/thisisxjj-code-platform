import { createServerSupabase } from "@/lib/supabase/server";
import { logger } from "@/utils/logger.server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
	LessonSubmissionSchema,
	type LessonSubmissionDTO,
} from "../schemas/lesson.schema";

const GetLessonSubmissionsByLessonIdsSchema = z.array(z.string().uuid());
const FIRST_COURSE_SLUG = "javascript";
const FIRST_LESSON_SLUG = "1-1-what-is-javascript";

export const getLessonSubmissionsByLessonIds = createServerFn({
	method: "GET",
})
	.inputValidator((data: unknown) =>
		GetLessonSubmissionsByLessonIdsSchema.parse(data),
	)
	.handler(async ({ data: lessonIds }): Promise<LessonSubmissionDTO[]> => {
		try {
			if (lessonIds.length === 0) {
				return [];
			}

			const supabase = createServerSupabase();

			const { data, error } = await supabase
				.from("lesson_submissions")
				.select(
					"id, is_ready_for_completion, is_passed, lesson_id, profile_id, created_at, updated_at",
				)
				.in("lesson_id", lessonIds)
				.order("updated_at", { ascending: false });

			if (error) {
				logger.error(
					"api lesson getLessonSubmissionsByLessonIds ===> DB Error",
					{
						error,
						lessonIds,
					},
				);
				return [];
			}

			return LessonSubmissionSchema.array().parse(data);
		} catch (err: unknown) {
			logger.error(
				"api lesson getLessonSubmissionsByLessonIds ===> Exception",
				{
					err,
				},
			);
			return [];
		}
	});

export const completeFirstLessonForDevBootstrap = createServerFn({
	method: "POST",
}).handler(async (): Promise<void> => {
	if (!import.meta.env.DEV) {
		return;
	}

	try {
		const supabase = createServerSupabase();

		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError || !user) {
			logger.warn("dev bootstrap complete lesson skipped: no user session", {
				userError,
			});
			return;
		}

		const { data: course, error: courseError } = await supabase
			.from("courses")
			.select("id")
			.eq("slug", FIRST_COURSE_SLUG)
			.maybeSingle();

		if (courseError || !course) {
			logger.error("dev bootstrap complete lesson failed: course not found", {
				courseError,
				courseSlug: FIRST_COURSE_SLUG,
			});
			return;
		}

		const { data: lesson, error: lessonError } = await supabase
			.from("lessons")
			.select("id")
			.eq("course_id", course.id)
			.eq("slug", FIRST_LESSON_SLUG)
			.maybeSingle();

		if (lessonError || !lesson) {
			logger.error("dev bootstrap complete lesson failed: lesson not found", {
				lessonError,
				courseSlug: FIRST_COURSE_SLUG,
				lessonSlug: FIRST_LESSON_SLUG,
			});
			return;
		}

		const { error: rpcError } = await supabase.rpc("complete_lesson", {
			p_lesson_id: lesson.id,
		});

		if (rpcError) {
			logger.error("dev bootstrap complete lesson RPC failed", {
				rpcError,
				lessonId: lesson.id,
				userId: user.id,
			});
		}
	} catch (err: unknown) {
		logger.error("dev bootstrap complete lesson exception", {
			err,
		});
	}
});
