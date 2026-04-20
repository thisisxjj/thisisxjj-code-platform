import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { TextLink } from "#/components/ui/link";
import { Separator } from "#/components/ui/separator";
import { Skeleton } from "#/components/ui/skeleton";
import { CourseThumbnail } from "#/features/course-review-star-rating";
import { LessonBadge } from "#/features/lesson-badge";
import {
	MarkdownText,
	VideoPlayer,
	VideoSkeleton,
} from "#/features/video-player";
import { useCourseDetailQueryOptions } from "#/lib/queries/useCourseQueryOptions";
import { useLessonSubmissionsByLessonIds } from "#/lib/queries/useLessonQueryOptions";
import type {
	CourseDetailsDTO,
	LessonOutlineDTO,
} from "#/lib/schemas/course.schema";
import { getAllLessonIdsByCourse, getCourseEntryState } from "#/utils/course";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { ArrowRight, CircleCheckBig, Layers, Video } from "lucide-react";
import { Fragment, Suspense } from "react";

export const Route = createFileRoute("/_platform/courses/$courseTemplateId")({
	loader: async ({ context, params }) => {
		const { courseTemplateId } = params;
		const courseTemplate = await context.queryClient.ensureQueryData(
			useCourseDetailQueryOptions(courseTemplateId),
		);
		if (courseTemplate?.status === "draft") {
			throw redirect({
				to: "/roadmap",
			});
		}

		return {
			courseTemplate,
		};
	},
	component: RouteComponent,
});

function CourseDetailSkeleton() {
	return (
		<div className="mx-auto flex max-w-6xl flex-col gap-12 pt-8 sm:gap-16 sm:pt-12">
			<section className="flex flex-col items-center gap-6 text-center sm:gap-8">
				<Skeleton className="size-16 rounded-lg sm:size-24" />
				<div className="flex w-full max-w-4xl flex-col gap-3 sm:gap-4">
					<Skeleton className="mx-auto h-9 w-3/4 sm:h-10 md:h-12 lg:h-14" />
					<Skeleton className="mx-auto h-6 w-full max-w-2xl sm:h-7 lg:h-8" />
				</div>
				<div className="flex flex-col items-center gap-4 sm:gap-6">
					<div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
						{Array.from({
							length: 3,
						}).map((_, index) => (
							<Skeleton key={index} className="h-10 w-32 rounded-lg sm:h-11" />
						))}
					</div>
				</div>
				<div className="flex w-full max-w-md flex-col justify-center gap-3 sm:flex-row">
					<Skeleton className="h-12 w-full sm:h-14 sm:w-48" />
				</div>
			</section>
			<section className="space-y-3 sm:space-y-4">
				<div className="flex flex-col items-center gap-2">
					<Skeleton className="h-7 w-48 sm:h-8" />
					<Skeleton className="h-4 w-64 sm:h-5" />
				</div>
				<Skeleton className="mx-auto mt-4 mb-8 h-20 w-20 sm:mb-12 sm:h-32 sm:w-32" />
				<Skeleton className="mx-auto h-75 w-full rounded-lg sm:h-100 md:h-125" />
			</section>
			<Separator />
			<div className="flex flex-col gap-6 sm:gap-8">
				<div className="space-y-3">
					{Array.from({ length: 5 }).map((_, index) => (
						<Skeleton key={index} className="h-5 w-full" />
					))}
				</div>
			</div>
			<Separator />
			<div className="flex flex-col gap-6 py-0 sm:gap-8">
				<div className="flex flex-col items-center gap-2">
					<Skeleton className="h-7 w-48 sm:h-8" />
					<Skeleton className="h-5 w-64 sm:h-6" />
				</div>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{Array.from({ length: 4 }).map((_, index) => (
						<Card key={index}>
							<CardContent className="flex flex-col gap-3 sm:gap-4">
								<div className="flex flex-col gap-2">
									<Skeleton className="h-6 w-3/4 sm:h-7" />
									<Skeleton className="h-5 w-full sm:h-6" />
								</div>
								<div className="flex items-center gap-3 sm:gap-4">
									<Skeleton className="h-5 w-24" />
									<Skeleton className="h-5 w-24" />
								</div>
								<Separator />
								<div className="flex flex-col gap-2">
									{Array.from({ length: 3 }).map((_, i) => (
										<Skeleton key={i} className="h-9 w-full" />
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
			<Separator />
			<div className="px-0">
				<div className="flex flex-col gap-4 sm:gap-6">
					<div className="flex flex-col items-center gap-2 text-center">
						<Skeleton className="h-6 w-48 sm:h-7" />
						<div className="flex items-center gap-3">
							<Skeleton className="h-5 w-24" />
							<Skeleton className="h-5 w-12 sm:h-6" />
							<Skeleton className="h-5 w-24 sm:h-6" />
						</div>
					</div>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{Array.from({ length: 4 }).map((_, index) => (
							<Skeleton key={index} className="h-32 w-full" />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function CourseStats({ courseTemplate }: { courseTemplate: CourseDetailsDTO }) {
	const items = [
		{
			icon: <Layers className="text-secondary-500 size-4" />,
			label: "Modules",
			value: courseTemplate.moduleCount,
		},
		{
			icon: <Video className="text-secondary-500 size-4" />,
			label: "Lessons",
			value: courseTemplate.lessonCount,
		},
		{
			icon: <CircleCheckBig className="text-secondary-500 size-4" />,
			label: "Lessons",
			value: courseTemplate.taskCount,
		},
	];

	return (
		<div className="flex flex-col items-center gap-4 sm:gap-6">
			<div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
				{items.map((item) => (
					<div
						key={item.label}
						className="bg-muted/30 border-muted flex items-center gap-2 rounded-lg border px-3 py-2 sm:px-2 sm:py-1"
					>
						{item.icon}
						<div className="flex items-baseline gap-1.5">
							<span className="text-sm font-semibold sm:text-base">
								{item.value}
							</span>
							<span className="text-muted-foreground text-xs">
								{item.label}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
function CourseDetailHeaderSection({
	courseTemplate,
}: {
	courseTemplate: CourseDetailsDTO;
}) {
	const { data: lessonSubmissions } = useSuspenseQuery(
		useLessonSubmissionsByLessonIds(getAllLessonIdsByCourse(courseTemplate)),
	);
	const { lesson, status } = getCourseEntryState(
		courseTemplate,
		lessonSubmissions,
	);

	return (
		<section className="flex flex-col items-center gap-6 text-center sm:gap-8">
			<CourseThumbnail course={courseTemplate} className="size-16 sm:size-24" />
			<div className="flex max-w-4xl flex-col gap-3 sm:gap-4">
				<h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
					{courseTemplate.name}
				</h1>
				<p className="text-muted-foreground text-base sm:text-lg lg:text-xl">
					{courseTemplate.description}
				</p>
			</div>
			<CourseStats courseTemplate={courseTemplate} />
			<div className="flex w-full max-w-md flex-col justify-center gap-3 sm:flex-row">
				<Button asChild size="xl">
					<TextLink
						to="/courses/$courseTemplateId/lessons/$lessonTemplateId"
						params={{
							courseTemplateId: courseTemplate.slug,
							lessonTemplateId: lesson.slug,
						}}
						variant="ghost"
					>
						{status === "start"
							? "Start course"
							: status === "contiune"
								? "Continue course"
								: "Review course"}
						<ArrowRight className="size-5" />
					</TextLink>
				</Button>
			</div>
		</section>
	);
}

function CourseIntroVideoSection({
	courseTemplate,
}: {
	courseTemplate: CourseDetailsDTO;
}) {
	const firstLessonVideoId = courseTemplate.modules[0]?.lessons[0]?.videoId;
	return firstLessonVideoId ? (
		<section className="space-y-3 sm:space-y-4">
			<div className="flex flex-col items-center gap-2">
				<h1 className="text-center text-xl font-semibold sm:text-2xl">
					Course Introduction
				</h1>
				<p className="text-muted-foreground text-center text-xs sm:text-sm">
					Watch the first lesson of the course to get started
				</p>
			</div>
			<Image
				className="mx-auto mt-4 mb-8 w-18.75 rotate-70 pl-4 sm:mb-12 sm:w-31.25 sm:pl-8"
				src="/arrow.png"
				width={800}
				height={400}
				alt="Arrow"
			/>
			<Suspense fallback={<VideoSkeleton />}>
				<VideoPlayer
					videoId={firstLessonVideoId}
					options={{ rememberPosition: false }}
				/>
			</Suspense>
		</section>
	) : null;
}

function CourseOverviewSection({
	courseTemplate,
}: {
	courseTemplate: CourseDetailsDTO;
}) {
	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			<MarkdownText className="text-muted-foreground [&_li::marker]:text-secondary-500 [&_li]:ml-4 [&_li::marker]:text-2xl">
				{courseTemplate.longDescription}
			</MarkdownText>
		</div>
	);
}

function CourseLessonItem({
	courseTemplate,
	lesson,
	index,
}: {
	courseTemplate: CourseDetailsDTO;
	lesson: LessonOutlineDTO;
	index: number;
}) {
	// TODO: 添加真是的plan状态
	return (
		<TextLink
			to="/courses/$courseTemplateId/lessons/$lessonTemplateId"
			variant="ghost"
			className="hover:opacity-70"
		>
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<Video className="text-secondary-500 size-4 shrink-0" />
					<span className="text-sm font-medium sm:text-base">
						{lesson.name}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<LessonBadge lesson={lesson} hasActiveSubscription={false} />
				</div>
			</div>
		</TextLink>
	);
}

function CourseLessonList({
	courseTemplate,
	lessons,
}: {
	courseTemplate: CourseDetailsDTO;
	lessons: LessonOutlineDTO[];
}) {
	return (
		<div className="flex flex-col gap-2">
			{lessons.map((lesson, index) => (
				<CourseLessonItem
					key={lesson.id}
					courseTemplate={courseTemplate}
					lesson={lesson}
					index={index}
				/>
			))}
		</div>
	);
}

function CourseModulesSection({
	courseTemplate,
}: {
	courseTemplate: CourseDetailsDTO;
}) {
	return (
		<div className="flex flex-col gap-6 py-0 sm:gap-8">
			<div className="flex flex-col items-center gap-2">
				<h2 className="w-fit text-center text-xl font-semibold sm:text-2xl">
					Course Modules
				</h2>
				<p className="text-muted-foreground text-center text-sm sm:text-base">
					The perfect curriculum for your learning experience
				</p>
			</div>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{courseTemplate.modules.map((module, index) => {
					const lessonCount = module.lessonCount;
					const taskCount = module.taskCount;
					return (
						<Card>
							<CardContent className="flex flex-col gap-3 sm:gap-4">
								<div className="flex flex-col gap-2">
									<h3 className="text-lg font-semibold sm:text-xl">
										{index + 1}
										{". "}
										{module.name}
									</h3>
									<p className="text-muted-foreground text-sm sm:text-base">
										{module.description}
									</p>
								</div>
								<div className="flex items-center gap-3 text-sm sm:gap-4 sm:text-base">
									<div className="flex items-center gap-1.5">
										<Video className="text-secondary-500 size-4" />
										<span className="text-muted-foreground">
											{lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
										</span>
									</div>
									<div className="flex items-center gap-1.5">
										<CircleCheckBig className="text-secondary-500 size-4" />
										<span className="text-muted-foreground">
											{taskCount} {taskCount === 1 ? "Task" : "Tasks"}
										</span>
									</div>
								</div>
								<Separator />
								<CourseLessonList
									courseTemplate={courseTemplate}
									lessons={module.lessons}
								/>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
function CourseDetailContent({
	courseTemplateId,
}: {
	courseTemplateId: string;
}) {
	const { data: courseTemplate } = useSuspenseQuery(
		useCourseDetailQueryOptions(courseTemplateId),
	);
	return (
		<Fragment>
			<CourseDetailHeaderSection courseTemplate={courseTemplate!} />
			<CourseIntroVideoSection courseTemplate={courseTemplate!} />
			<Separator />
			<CourseOverviewSection courseTemplate={courseTemplate!} />
			<Separator />
			<CourseModulesSection courseTemplate={courseTemplate!} />
			{/* TODO: 添加评论section */}
		</Fragment>
	);
}

function RouteComponent() {
	const { courseTemplateId } = Route.useParams();
	return (
		<Suspense fallback={<CourseDetailSkeleton />}>
			<div className="mx-auto flex max-w-6xl flex-col gap-12 pt-8 sm:gap-16 sm:pt-12">
				<CourseDetailContent courseTemplateId={courseTemplateId} />
			</div>
		</Suspense>
	);
}
