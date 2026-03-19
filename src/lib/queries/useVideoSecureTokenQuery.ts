import { generateVideoToken } from "../api/videoToken";

export const secureTokenKeys = {
	secureToken: (videoId: string) => ["secure-token", videoId],
};

export function useVideoSecureTokenQuery(videoId: string) {
	return {
		queryKey: secureTokenKeys.secureToken(videoId),
		queryFn: () => generateVideoToken({ data: { videoId } }),
	};
}
