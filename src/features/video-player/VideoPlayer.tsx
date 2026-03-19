import { useVideoSecureTokenQuery } from "#/lib/queries/useVideoSecureTokenQuery";
import { useSuspenseQuery } from "@tanstack/react-query";
import * as React from "react";

export interface VideoPlayerProps {
	videoId: string;
	options?: Record<string, string | boolean | number>;
}

export const VideoPlayer = React.memo(
	function ({ videoId, options = {} }: VideoPlayerProps) {
		const {
			data: { token, expiresAt },
		} = useSuspenseQuery(useVideoSecureTokenQuery(videoId));
		const libraryId = import.meta.env.VITE_BUNNY_LIBRARY_ID;
		const videoUrl = new URL(
			`https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`,
		);
		videoUrl.searchParams.set("autoplay", "false");
		videoUrl.searchParams.set("loop", "false");
		videoUrl.searchParams.set("muted", "false");
		videoUrl.searchParams.set("preload", "true");
		videoUrl.searchParams.set("responsive", "true");
		videoUrl.searchParams.set("token", token!);
		videoUrl.searchParams.set("expires", expiresAt!.toString());

		Object.entries(options).forEach(([key, value]) => {
			videoUrl.searchParams.set(key, value.toString());
		});

		return (
			<div
				className="overflow-hidden rounded-xl"
				style={{ position: "relative", paddingTop: "56.25%" }}
			>
				<iframe
					src={videoUrl.toString()}
					loading="lazy"
					className="absolute top-0 h-full w-full border-0"
					allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
					allowFullScreen
				></iframe>
			</div>
		);
	},
	(prevProps, nextProps) =>
		prevProps.videoId === nextProps.videoId &&
		prevProps.options?.rememberPosition === nextProps.options?.rememberPosition,
);
