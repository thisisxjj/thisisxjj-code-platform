import { Spinner } from "#/components/ui/spinner";
import { useCourseDetailQueryOptions } from "#/lib/queries/useCourseQueryOptions";
import { useLessonDetailByLessonSlugQueryOptions } from "#/lib/queries/useLessonQueryOptions";
import { useUserQueryOptions } from "#/lib/queries/useUserQueryOptions";
import { LessonGridToggleProvider } from "#/providers/LessonGridToggleProvider";
import { LessonProvider } from "#/providers/LessonProvider";
import { buildHeadMeta } from "#/utils/seo";
import {
	createFileRoute,
	createRootRouteWithContext,
	redirect,
} from "@tanstack/react-router";
import {
	createContext,
	use,
	useRef,
	useState,
	type Dispatch,
	type ReactNode,
	type Ref,
	type SetStateAction,
} from "react";
import z from "zod";

export const Route = createFileRoute(
	"/_playground/courses/$courseTemplateId/lessons/$lessonTemplateId",
)({
	component: RouteComponent,
	pendingComponent: RoutePendingComponent,
	validateSearch: z.object({
		panel: z.enum(["chat", "overview"]).optional(),
		showCode: z.boolean().optional(),
	}),
	beforeLoad: async ({ context, params }) => {
		const user = await context.queryClient.fetchQuery(useUserQueryOptions());
		if (!user) {
			throw redirect({
				to: "/auth/login",
				search: {
					next: `/courses/${params.courseTemplateId}/lessons/${params.lessonTemplateId}`,
				},
			});
		}

		const [lessonTemplate, courseTemplate] = await Promise.all([
			context.queryClient.ensureQueryData(
				useLessonDetailByLessonSlugQueryOptions(params.lessonTemplateId),
			),
			context.queryClient.ensureQueryData(
				useCourseDetailQueryOptions(params.courseTemplateId),
			),
		]);

		// TODO:添加订阅相关配置
		if (!lessonTemplate.isFree) {
			throw redirect({
				to: "/",
				hash: "pricing",
			});
		}

		return {
			user,
			lessonTemplate,
			courseTemplate,
		};
	},
	loader: ({ context }) => {
		return {
			lessonTemplate: context.lessonTemplate,
			courseTemplate: context.courseTemplate,
		};
	},
	head: ({ loaderData }) => {
		const { lessonTemplate, courseTemplate } = loaderData ?? {};
		return buildHeadMeta(lessonTemplate?.name, courseTemplate?.description);
	},
});

function RoutePendingComponent() {
	return (
		<div className="flex h-screen items-center justify-center">
			<Spinner />
		</div>
	);
}

function RouteComponent() {
	const { panel, showCode } = Route.useSearch();
	const { lessonTemplate, courseTemplate } = Route.useRouteContext();

	return (
		<LessonProvider>
			<LessonGridToggleProvider initialShowCode={showCode ?? false}>
				<div className="bg-background/50 fixed top-0 right-0 left-0 z-50 h-(--header-height) backdrop-blur-md"></div>
				<main className="absolute inset-0 mt-(--header-height)"></main>
			</LessonGridToggleProvider>
		</LessonProvider>
	);
}
