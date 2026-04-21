import { createServerSupabase } from "@/lib/supabase/server";
import { logger } from "@/utils/logger.server";
import { createServerFn } from "@tanstack/react-start";
import {
	EMPTY_ROADMAP_DATA,
	RoadmapDataSchema,
	type RoadmapDataDTO,
} from "../schemas/roadmap.schema";

export const getRoadmapData = createServerFn({ method: "GET" }).handler(
	async (): Promise<RoadmapDataDTO> => {
		try {
			const supabase = createServerSupabase();

			const { data, error } = await supabase.rpc("get_roadmap_data");

			if (error || !data) {
				logger.error("api roadmap getRoadmapData ===> DB Error", {
					error,
				});
				return EMPTY_ROADMAP_DATA;
			}

			return RoadmapDataSchema.parse(data);
		} catch (err: any) {
			logger.error("api roadmap getRoadmapData ===> Exception", {
				err,
			});
			return EMPTY_ROADMAP_DATA;
		}
	},
);
