import { getCurrentUser } from "../api/user";

export const userKeys = {
	currentUser: ["current-user"],
};
export function useUserQueryOptions() {
	return {
		queryKey: userKeys.currentUser,
		queryFn: getCurrentUser,
	};
}
