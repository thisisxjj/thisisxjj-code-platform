import { createServerSupabase } from "@/lib/supabase/server";
import { logger } from "@/utils/logger.server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
	ProfileActivityDataSchema,
	ProfileCourseProgressSchema,
	ProfileDetailSchema,
	ProfileRecentActivitySchema,
	ProfileSchema,
	type ProfileActivityDataDTO,
	type ProfileCourseProgressDTO,
	type ProfileDetailDTO,
	type ProfileRecentActivityDTO,
	type ProfileDTO,
	ProfileStatsSchema,
	type ProfileStatsDTO,
} from "../schemas/profile.schema";
import { notFound } from "@tanstack/react-router";

export const ProfileIdSchema = z.string().uuid();

export const getDetailByProfileId = createServerFn({ method: "GET" })
	.inputValidator((data: unknown) => ProfileIdSchema.parse(data))
	.handler(async ({ data: profileId }): Promise<ProfileDetailDTO> => {
		try {
			const supabase = createServerSupabase();

			const { data, error } = await supabase
				.from("profile_details")
				.select("*")
				.eq("profile_id", profileId)
				.single();

			if (error) {
				logger.error("api profile ===> DB Error", { error, profileId });
				throw notFound();
			}

			// 此时，Supabase 推导出的 data 类型完美等同于 ProfileDTO，类型严丝合缝！
			return ProfileDetailSchema.parse(data);
		} catch (err: any) {
			logger.error("api profile ===> Exception", { err });
			throw notFound();
		}
	});

// 1. 定义校验 Schema
export const XpInputSchema = z.string().uuid("非法的用户 ID 格式");
export const UsernameInputSchema = z
	.string()
	.regex(/^[a-z0-9]{3,30}$/, "用户名格式不合法");

// 2. 创建 Server Function
export const getXpByProfileId = createServerFn({ method: "GET" })
	.inputValidator((data: unknown) => XpInputSchema.parse(data))
	.handler(async ({ data: profileId }): Promise<number> => {
		try {
			const supabase = createServerSupabase();

			// 3. 执行数据库查询 (假设你的表名是 profiles，字段是 experience)
			const { data: profile, error } = await supabase
				.from("profile_stats")
				.select("total_xp")
				.eq("profile_id", profileId)
				.single();

			if (error) {
				logger.error("profile getXpByProfileId api ===> Database query error", {
					error,
					profileId,
				});
				return 0;
			}

			// 4. 返回标准格式
			return profile?.total_xp ?? 0;
		} catch (error: any) {
			logger.error("profile getXpByProfileId api ===> System Exception", {
				exception: error,
			});
			return 0;
		}
	});

export const getProfileStatsByProfileId = createServerFn({ method: "GET" })
	.inputValidator((data: unknown) => ProfileIdSchema.parse(data))
	.handler(async ({ data: profileId }): Promise<ProfileStatsDTO> => {
		try {
			const supabase = createServerSupabase();

			const { data, error } = await supabase
				.from("profile_stats")
				.select("*")
				.eq("profile_id", profileId)
				.single();

			if (error || !data) {
				logger.error("api profile getProfileStatsByProfileId ===> DB Error", {
					error,
					profileId,
				});
				throw notFound();
			}

			return ProfileStatsSchema.parse(data);
		} catch (err: any) {
			logger.error("api profile getProfileStatsByProfileId ===> Exception", {
				err,
				profileId,
			});
			throw notFound();
		}
	});

export const getProfileActivityDataByProfileId = createServerFn({
	method: "GET",
})
	.inputValidator((data: unknown) => ProfileIdSchema.parse(data))
	.handler(async ({ data: profileId }): Promise<ProfileActivityDataDTO[]> => {
		try {
			const supabase = createServerSupabase();

			const { data, error } = await supabase
				.from("profile_activity_data_view")
				.select("*")
				.eq("profile_id", profileId)
				.order("date", { ascending: true });

			if (error) {
				logger.error(
					"api profile getProfileActivityDataByProfileId ===> DB Error",
					{
						error,
						profileId,
					},
				);
				return [];
			}

			return ProfileActivityDataSchema.array().parse(data);
		} catch (err: any) {
			logger.error(
				"api profile getProfileActivityDataByProfileId ===> Exception",
				{
					err,
					profileId,
				},
			);
			return [];
		}
	});

export const getProfileCourseProgressByProfileId = createServerFn({
	method: "GET",
})
	.inputValidator((data: unknown) => ProfileIdSchema.parse(data))
	.handler(async ({ data: profileId }): Promise<ProfileCourseProgressDTO[]> => {
		try {
			const supabase = createServerSupabase();

			const { data, error } = await supabase
				.from("profile_course_progress_view")
				.select("*")
				.eq("profile_id", profileId)
				.order("progress_percentage", { ascending: false });

			if (error) {
				logger.error(
					"api profile getProfileCourseProgressByProfileId ===> DB Error",
					{
						error,
						profileId,
					},
				);
				return [];
			}

			return ProfileCourseProgressSchema.array().parse(data);
		} catch (err: any) {
			logger.error(
				"api profile getProfileCourseProgressByProfileId ===> Exception",
				{
					err,
					profileId,
				},
			);
			return [];
		}
	});

export const getProfileRecentActivityByProfileId = createServerFn({
	method: "GET",
})
	.inputValidator((data: unknown) => ProfileIdSchema.parse(data))
	.handler(async ({ data: profileId }): Promise<ProfileRecentActivityDTO[]> => {
		try {
			const supabase = createServerSupabase();

			const { data, error } = await supabase
				.from("profile_recent_activity_view")
				.select("*")
				.eq("profile_id", profileId)
				.order("completed_at", { ascending: false });

			if (error) {
				logger.error(
					"api profile getProfileRecentActivityByProfileId ===> DB Error",
					{
						error,
						profileId,
					},
				);
				return [];
			}

			return ProfileRecentActivitySchema.array().parse(data);
		} catch (err: any) {
			logger.error(
				"api profile getProfileRecentActivityByProfileId ===> Exception",
				{
					err,
					profileId,
				},
			);
			return [];
		}
	});

export const getProfileByUsername = createServerFn({ method: "GET" })
	.inputValidator((data: unknown) => UsernameInputSchema.parse(data))
	.handler(async ({ data: username }): Promise<ProfileDTO | null> => {
		try {
			const supabase = createServerSupabase();

			const { data, error } = await supabase
				.from("profiles")
				.select("*, profile_details!inner(username)")
				.eq("profile_details.username", username)
				.single();

			if (error || !data) {
				logger.error("api profile getProfileByUsername ===> DB Error", {
					error,
					username,
				});
				return null;
			}

			return ProfileSchema.parse(data);
		} catch (err: any) {
			logger.error("api profile getProfileByUsername ===> Exception", {
				err,
			});
			return null;
		}
	});

export const getProfileByProfileId = createServerFn({ method: "GET" })
	.inputValidator((data: unknown) => ProfileIdSchema.parse(data))
	.handler(async ({ data: profileId }): Promise<ProfileDTO> => {
		try {
			const supabase = createServerSupabase();

			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", profileId)
				.single();

			if (error || !data) {
				logger.error("api profile getProfileByProfileId ===> DB Error", {
					error,
					profileId,
				});
				throw notFound();
			}

			return ProfileSchema.parse(data);
		} catch (err: any) {
			logger.error("api profile getProfileByProfileId ===> Exception", {
				err,
				profileId,
			});
			throw notFound();
		}
	});
