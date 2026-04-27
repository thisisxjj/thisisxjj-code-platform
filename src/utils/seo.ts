export function buildHeadMeta(title?: string, desc?: string | null) {
	return {
		meta: [
			{
				title: title ? `${title} | Cosden Code` : "Cosden Code",
				description: desc ?? "The ultimate AI-powered React learning platform",
			},
		],
	};
}
