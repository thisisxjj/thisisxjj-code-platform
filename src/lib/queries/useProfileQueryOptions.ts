import { queryOptions } from "@tanstack/react-query";
import {
	getDetailByProfileId,
	getProfileActivityDataByProfileId,
	getProfileByProfileId,
	getProfileByUsername,
	getProfileCourseProgressByProfileId,
	getProfileRecentActivityByProfileId,
	getProfileStatsByProfileId,
	getXpByProfileId,
} from "../api/profile";

export const profileKeys = {
	profileDetails: {
		all: ["profile-details"],
		byProfileId: (profileId: string) => ["profile-details", profileId],
	},
	profileXp: {
		all: ["profile-xp"],
		byProfileId: (profileId: string) => ["profile-xp", profileId],
	},
	profiles: {
		all: ["profiles"],
		byId: (profileId: string) => ["profiles", profileId],
		byUsername: (username: string) => ["profiles", username],
	},
	profileStats: {
		all: ["profile-stats"],
		byProfileId: (profileId: string) => ["profile-stats", profileId],
	},
	profileActivityData: {
		all: ["profile-activity-data"],
		byProfileId: (profileId: string) => ["profile-activity-data", profileId],
	},
	profileCourseProgress: {
		all: ["profile-course-progress"],
		byProfileId: (profileId: string) => ["profile-course-progress", profileId],
	},
	profileRecentActivity: {
		all: ["profile-recent-activity"],
		byProfileId: (profileId: string) => ["profile-recent-activity", profileId],
	},
};

export function useProfileStatsByProfileIdQueryOptions(profileId: string) {
	return queryOptions({
		queryKey: profileKeys.profileStats.byProfileId(profileId),
		queryFn: () =>
			getProfileStatsByProfileId({
				data: profileId,
			}),
	});
}

export function useXpByProfileIdQueryOptions(profileId: string) {
	return queryOptions({
		queryKey: profileKeys.profileXp.byProfileId(profileId),
		queryFn: () => getXpByProfileId({ data: profileId }),
	});
}

export function useProfileDetailByProfileIdQueryOptions(profileId: string) {
	return queryOptions({
		queryKey: profileKeys.profileDetails.byProfileId(profileId),
		queryFn: () => getDetailByProfileId({ data: profileId }),
	});
}

export function useProfileByProfileIdQueryOptions(profileId: string) {
	return queryOptions({
		queryKey: profileKeys.profiles.byId(profileId),
		queryFn: () =>
			getProfileByProfileId({
				data: profileId,
			}),
	});
}
export function useProfileByUsernameQueryOptions(username: string) {
	return queryOptions({
		queryKey: profileKeys.profiles.byUsername(username),
		queryFn: () =>
			getProfileByUsername({
				data: username,
			}),
	});
}

export function useProfileActivityDataByProfileIdQueryOptions(
	profileId: string,
) {
	return queryOptions({
		queryKey: profileKeys.profileActivityData.byProfileId(profileId),
		queryFn: () =>
			getProfileActivityDataByProfileId({
				data: profileId,
			}),
	});
}

export function useProfileCourseProgressByProfileIdQueryOptions(
	profileId: string,
) {
	return queryOptions({
		queryKey: profileKeys.profileCourseProgress.byProfileId(profileId),
		queryFn: () =>
			getProfileCourseProgressByProfileId({
				data: profileId,
			}),
	});
}

export function useprofileRecentActivityByProfileIdQueryOptions(
	profileId: string,
) {
	return queryOptions({
		queryKey: profileKeys.profileRecentActivity.byProfileId(profileId),
		queryFn: () =>
			getProfileRecentActivityByProfileId({
				data: profileId,
			}),
	});
}
