import { createServerSupabase } from "@/lib/supabase/server";
import { logger } from "@/utils/logger.server";
import { createServerFn } from "@tanstack/react-start";
import {
	CourseTemplateSchema,
	type CourseTemplateDTO,
} from "../schemas/course-template.schema";

export const getAllCourseTemplates = createServerFn({
	method: "GET",
}).handler(async (): Promise<CourseTemplateDTO[]> => {
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

		return CourseTemplateSchema.array().parse(data);
	} catch (err: any) {
		logger.error("api course-template getAllCourseTemplates ===> Exception", {
			err,
		});
		return [];
	}
});
