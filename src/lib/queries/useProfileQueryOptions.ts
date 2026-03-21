import { queryOptions } from "@tanstack/react-query";
import { getDetailByProfileId, getXpByProfileId } from "../api/profile";

export const profileKeys = {
	profileDetails: {
		all: ["profile-details"],
		byProfileId: (profileId: string) => ["profile-details", profileId],
	},
	profileXp: {
		all: ["profile-xp"],
		byProfileId: (profileId: string) => ["profile-xp", profileId],
	},
};

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
