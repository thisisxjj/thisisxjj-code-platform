import { createServerFn } from "@tanstack/react-start";

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
	async () => {
		// TODO
		return {
			user: {
				name: "thisisxjj",
				email: "333@qq.com",
			},
		};
	},
);
