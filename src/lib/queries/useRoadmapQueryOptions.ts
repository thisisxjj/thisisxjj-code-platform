import { queryOptions } from "@tanstack/react-query";
import { getRoadmapData } from "../api/roadmap";

export const roadmapKeys = {
	roadmapData: ["roadmap-data"],
};

export function useRoadmapDataQueryOptions() {
	return queryOptions({
		queryKey: roadmapKeys.roadmapData,
		queryFn: () => getRoadmapData(),
	});
}
