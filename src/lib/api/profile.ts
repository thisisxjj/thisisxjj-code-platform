import { createServerSupabase } from "@/lib/supabase/server";
import { logger } from "@/utils/logger.server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
	ProfileDetailSchema,
	type ProfileDetailDTO,
} from "../schemas/profile.schema";

export const ProfileIdSchema = z.string().uuid();

export const getDetailByProfileId = createServerFn({ method: "GET" })
	.inputValidator((data: unknown) => ProfileIdSchema.parse(data))
	.handler(async ({ data: profileId }): Promise<ProfileDetailDTO | null> => {
		try {
			const supabase = createServerSupabase();

			const { data, error } = await supabase
				.from("profile_details")
				.select("*")
				.eq("profile_id", profileId)
				.single();

			if (error) {
				logger.error("api profile ===> DB Error", { error, profileId });
				// 显式返回 null，完美契合接口签名
				return null;
			}

			// 此时，Supabase 推导出的 data 类型完美等同于 ProfileDTO，类型严丝合缝！
			return ProfileDetailSchema.parse(data);
		} catch (err: any) {
			logger.error("api profile ===> Exception", { err });
			return null;
		}
	});

// 1. 定义校验 Schema
export const XpInputSchema = z.string().uuid("非法的用户 ID 格式");

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
				throw new Error("未能获取到用户经验数据");
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
