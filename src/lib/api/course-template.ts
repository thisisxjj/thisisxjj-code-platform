import { createServerSupabase } from "@/lib/supabase/server";
import { logger } from "@/utils/logger.server";
import { createServerFn } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";
import { z } from "zod";
import {
	CourseSummarySchema,
	type CourseSummaryDTO,
	CourseDetailsSchema,
	type CourseDetailsDTO,
} from "../schemas/course.schema";

export const getAllCourseTemplates = createServerFn({
	method: "GET",
}).handler(async (): Promise<CourseSummaryDTO[]> => {
	try {
		const supabase = createServerSupabase();

		const { data, error } = await supabase
			.from("course_summaries")
			.select("*")
			.order("order_index", { ascending: true });

		if (error) {
			logger.error("api course-template getAllCourseTemplates ===> DB Error", {
				error,
			});
			return [];
		}

		return CourseSummarySchema.array().parse(data);
	} catch (err: any) {
		logger.error("api course-template getAllCourseTemplates ===> Exception", {
			err,
		});
		return [];
	}
});

const GetCourseDetailBySlugSchema = z
	.string()
	.regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, {
		message: "Invalid course slug format",
	});

export const getCourseDetailBySlug = createServerFn({ method: "GET" })
	.inputValidator((data: unknown) => GetCourseDetailBySlugSchema.parse(data))
	.handler(async ({ data: slug }): Promise<CourseDetailsDTO | null> => {
		try {
			const supabase = createServerSupabase();

			const { data, error } = await supabase
				.from("course_details")
				.select("*")
				.eq("slug", slug)
				.single();

			if (error || !data) {
				logger.error(
					"api course-template getCourseDetailBySlug ===> DB Error",
					{ error },
				);
				throw notFound();
			}

			return CourseDetailsSchema.parse(data);
		} catch (err: any) {
			logger.error("api course-template getCourseDetailBySlug ===> Exception", {
				err,
			});
			throw notFound();
		}
	});
