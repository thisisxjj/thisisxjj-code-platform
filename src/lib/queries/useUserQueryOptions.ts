import { queryOptions } from "@tanstack/react-query";
import { getCurrentUser } from "../api/user";

export const userKeys = {
	currentUser: ["current-user"],
};
export function useUserQueryOptions() {
	return queryOptions({
		queryKey: userKeys.currentUser,
		queryFn: () => getCurrentUser(),
	});
}
