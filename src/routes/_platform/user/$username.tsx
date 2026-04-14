import { ProfileAvatar } from "#/components/ProfileAvatar";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { TextLink } from "#/components/ui/link";
import { Progress } from "#/components/ui/progress";
import { Separator } from "#/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "#/components/ui/tooltip";
import { LessonBadge } from "#/features/lesson-badge";
import {
	CurrentLevel,
	CurrentXpProgress,
	LevelProvider,
	XpNeededLevel,
} from "#/features/profile-level-progress";
import {
	useProfileActivityDataByProfileIdQueryOptions,
	useProfileByProfileIdQueryOptions,
	useProfileByUsernameQueryOptions,
	useProfileCourseProgressByProfileIdQueryOptions,
	useProfileDetailByProfileIdQueryOptions,
	useprofileRecentActivityByProfileIdQueryOptions,
	useProfileStatsByProfileIdQueryOptions,
	useXpByProfileIdQueryOptions,
} from "#/lib/queries/useProfileQueryOptions";
import type {
	ProfileActivityDataDTO,
	ProfileCourseProgressDTO,
	ProfileDetailDTO,
	ProfileDTO,
	ProfileRecentActivityDTO,
	ProfileStatsDTO,
} from "#/lib/schemas/profile.schema";
import { cn } from "#/lib/utils";
import { useAuth } from "#/providers/AuthProvider";
import { sub365Days } from "#/utils/date";
import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { addDays, format, getMonth, isAfter, startOfWeek } from "date-fns";
import { BookOpen, Calendar, Check, List, Target } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/_platform/user/$username")({
	component: RouteComponent,
	pendingComponent: CurrentUserPendingSkeleton,
	loader: async ({ context, params }) => {
		const profileData = await context.queryClient.fetchQuery(
			useProfileByUsernameQueryOptions(params.username),
		);
		if (!profileData) {
			throw notFound();
		}
		const profileId = profileData.id;
		Promise.all([
			context.queryClient.fetchQuery(
				useProfileDetailByProfileIdQueryOptions(profileId),
			),
			context.queryClient.fetchQuery(useXpByProfileIdQueryOptions(profileId)),
			context.queryClient.fetchQuery(
				useProfileStatsByProfileIdQueryOptions(profileId),
			),
			context.queryClient.fetchQuery(
				useProfileActivityDataByProfileIdQueryOptions(profileId),
			),
			context.queryClient.fetchQuery(
				useProfileCourseProgressByProfileIdQueryOptions(profileId),
			),
			context.queryClient.fetchQuery(
				useprofileRecentActivityByProfileIdQueryOptions(profileId),
			),
		]);
		return {
			profileId,
		};
	},
});

function CurrentUserPendingSkeleton() {
	return (
		<div className="flex flex-col gap-4 lg:flex-row">
			<div className="w-full shrink-0 lg:w-75">
				<div className="space-y-6">
					<div className="bg-card rounded-lg border">
						<div className="flex flex-col items-center gap-6 p-6 text-center">
							<div className="bg-muted size-24 rounded-full" />
							<div className="w-full space-y-4">
								<div className="flex flex-col gap-2">
									<div className="bg-muted mx-auto h-8 w-48 rounded" />
									<div className="bg-muted mx-auto h-4 w-full rounded" />
								</div>
							</div>
							<div className="bg-border h-px w-full" />
							<div className="flex w-full flex-col gap-3">
								<div className="flex items-center justify-between">
									<div className="bg-muted h-5 w-16 rounded" />
									<div className="bg-muted h-5 w-20 rounded" />
								</div>
								<div className="bg-muted h-2 w-full rounded-full" />
							</div>
							<div className="flex w-full flex-col items-start gap-2">
								{Array.from({ length: 2 }).map((_, index) => (
									<div key={index} className="flex items-center gap-3">
										<div className="bg-muted size-5 rounded" />
										<div className="bg-muted h-5 w-32 rounded" />
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex-1 space-y-4">
				<div className="bg-card rounded-lg border">
					<div className="border-b p-6">
						<div className="flex items-center gap-2">
							<div className="bg-muted size-5 rounded" />
							<div className="bg-muted h-6 w-24 rounded" />
						</div>
					</div>
					<div className="p-6">
						<div className="bg-muted h-32 w-full rounded" />
					</div>
				</div>
				<div className="flex flex-col gap-4 lg:flex-row">
					<div className="bg-card w-full rounded-lg border">
						<div className="border-b p-6">
							<div className="flex items-center gap-2">
								<div className="bg-muted size-5 rounded" />
								<div className="bg-muted h-6 w-32 rounded" />
							</div>
						</div>
						<div className="space-y-4 p-6">
							{Array.from({ length: 2 }).map((_, index) => (
								<div key={index} className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="space-y-1">
											<div className="bg-muted h-5 w-32 rounded" />
											<div className="bg-muted h-4 w-24 rounded" />
										</div>
										<div className="bg-muted h-6 w-12 rounded" />
									</div>
									<div className="bg-muted h-2 w-full rounded-full" />
								</div>
							))}
						</div>
					</div>
					<div className="bg-card w-full rounded-lg border">
						<div className="border-b p-6">
							<div className="flex items-center gap-2">
								<div className="bg-muted size-5 rounded" />
								<div className="bg-muted h-6 w-32 rounded" />
							</div>
						</div>
						<div className="space-y-4 p-6">
							{Array.from({ length: 3 }).map((_, i) => (
								<div
									key={i}
									className="flex items-center justify-between gap-2"
								>
									<div className="flex items-center gap-2">
										<div className="bg-muted size-5 rounded" />
										<div className="bg-muted h-5 w-40 rounded" />
									</div>
									<div className="bg-muted h-4 w-16 rounded" />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

type ProfileDetailInfo = ProfileDTO & { profileDetails: ProfileDetailDTO } & {
	xp: number;
};

function ProfileCard({
	profile,
	stats,
	isOwnProfile,
}: {
	profile: ProfileDetailInfo;
	stats: ProfileStatsDTO;
	isOwnProfile: boolean;
}) {
	const profileItems = [
		{
			icon: Target,
			label: "XP",
			value: stats.totalXp.toLocaleString(),
		},
		{
			icon: BookOpen,
			label: "lessons completed",
			value: stats.lessonsCompleted,
		},
	];

	return (
		<div className="space-y-6">
			<Card>
				<CardContent className="flex flex-col items-center gap-6 text-center">
					<ProfileAvatar profileDetails={profile.profileDetails} />
					<div className="w-full space-y-4">
						<div className="flex flex-col gap-2">
							<h1 className="overflow-hidden text-2xl font-bold text-ellipsis">
								{profile.profileDetails.username}
							</h1>
							{profile.profileDetails.bio && (
								<p className="text-muted-foreground">
									{profile.profileDetails.bio}
								</p>
							)}
						</div>
						{isOwnProfile && (
							<div className="w-full">
								{/* TODO:添加edit profile 弹窗 */}
								<div>Edit Profile</div>
							</div>
						)}
					</div>
					<Separator />
					<LevelProvider xp={profile.xp}>
						<div className="flex w-full flex-col gap-3">
							<div className="flex items-center justify-between">
								<CurrentLevel className="text-sm font-medium" />
								<XpNeededLevel className="text-muted-foreground text-sm font-semibold" />
							</div>
							<CurrentXpProgress className="h-2" />
						</div>
					</LevelProvider>
					<div className="flex w-full flex-col items-start gap-2">
						{profileItems.map((item) => (
							<div className="flex items-center gap-3" key={item.label}>
								<item.icon className="text-secondary-500 h-5 w-5" />
								<div>
									<span className="font-semibold">{item.value}</span>
									<span className="text-muted-foreground ml-1 text-sm">
										{item.label}
									</span>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function DayLabelsColumn({
	dayLabels,
	dayIndices,
}: {
	dayIndices: number[];
	dayLabels: string[];
}) {
	return (
		<div className="flex w-8 flex-col gap-1">
			<div className="h-4.5"></div>
			{[0, 1, 2, 3, 4, 5, 6].map((item) => (
				<div className="flex h-2.5 items-center">
					{dayIndices.includes(item) && (
						<span className="text-muted-foreground text-xs">
							{dayLabels[dayIndices.indexOf(item)]}
						</span>
					)}
				</div>
			))}
		</div>
	);
}

type HeatmapCell = {
	date: string;
	count: number;
	dateObj: Date;
} | null;

type MonthLabel = {
	weekIndex: number;
	month: string;
};

function MonthHeader({
	weeks,
	monthLabels,
}: {
	weeks: HeatmapCell[][];
	monthLabels: MonthLabel[];
}) {
	return (
		<div className="mb-1 flex h-2.5 gap-1">
			{weeks.map((_, index) => {
				if (index === weeks.length - 1) {
					return null;
				}
				const monthLabel = monthLabels.find(
					(monthLabel) => monthLabel.weekIndex === index,
				);
				return (
					<div key={index} className="flex w-2.5 shrink-0 items-center">
						{monthLabel && (
							<span className="text-muted-foreground text-xs whitespace-nowrap">
								{monthLabel.month}
							</span>
						)}
					</div>
				);
			})}
		</div>
	);
}

function HeadGridItem({ day }: { day: HeatmapCell }) {
	function getCellColor(count: number) {
		return count === 0
			? "bg-muted"
			: count <= 2
				? "bg-secondary-500/30"
				: count <= 4
					? "bg-secondary-500/60"
					: "bg-secondary-500";
	}

	return (
		<div
			className={cn(
				"size-full rounded-sm",
				day ? `${getCellColor(day.count)} cursor-pointer` : "bg-transparent",
			)}
			title={
				day ? `${format(day.dateObj, "MMM d, yyyy")}: ${day.count} lessons` : ""
			}
		></div>
	);
}

function HeatmapGrid({ weeks }: { weeks: HeatmapCell[][] }) {
	return (
		<div className="flex gap-1">
			{weeks.map((week, index) => (
				<div className="flex shrink-0 flex-col gap-1">
					{week.map((day, i) => (
						<Tooltip key={`${index}-${i}`}>
							<TooltipTrigger className="size-2.5">
								<HeadGridItem key={`${index}-${i}`} day={day} />
							</TooltipTrigger>
							{day && (
								<TooltipContent>
									{day.count > 0
										? `${day.count} lessons on ${format(day.dateObj, "MMMM d")}`
										: `No activity on ${format(day.dateObj, "MMMM d")}`}
								</TooltipContent>
							)}
						</Tooltip>
					))}
				</div>
			))}
		</div>
	);
}

function HeatmapLegend() {
	return (
		<div className="text-muted-foreground flex items-center justify-end gap-4 text-sm">
			<span>Less</span>
			<div className="flex items-center gap-1">
				<div className="bg-muted size-2.5 rounded-sm" />
				<div className="bg-secondary-500/30 size-2.5 rounded-sm" />
				<div className="bg-secondary-500/60 size-2.5 rounded-sm" />
				<div className="bg-secondary-500 size-2.5 rounded-sm" />
			</div>
			<span>More</span>
		</div>
	);
}

function ActivityHeatmap({
	activityData,
}: {
	activityData: ProfileActivityDataDTO[];
}) {
	const today = new Date();
	const startDate365DaysAgo = sub365Days(today);
	const startWeekDate = startOfWeek(startDate365DaysAgo, { weekStartsOn: 0 });
	const dateCountMap = new Map(
		activityData.map((item) => [item.date, item.count]),
	);
	const weeks: HeatmapCell[][] = [];
	const monthLabels: MonthLabel[] = [];
	let currentWeekStart = startWeekDate;
	let lastLabeledMonth = -1;

	while (currentWeekStart <= today) {
		const weekCells = [];
		let hasAnyPastOrTodayCell = false;
		for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
			const dateObj = addDays(currentWeekStart, dayOffset);
			if (isAfter(dateObj, today)) {
				weekCells.push(null);
				continue;
			}
			const date = format(dateObj, "yyyy-MM-dd");
			const count = dateCountMap.get(date) || 0;
			weekCells.push({
				date,
				count,
				dateObj,
			});
			hasAnyPastOrTodayCell = true;

			if (dayOffset === 0) {
				const monthIndex = getMonth(dateObj);
				if (monthIndex !== lastLabeledMonth) {
					const previousLabel = monthLabels[monthLabels.length - 1];
					if (previousLabel && weeks.length - previousLabel.weekIndex < 2) {
						monthLabels.pop();
					}

					monthLabels.push({
						weekIndex: weeks.length,
						month: format(dateObj, "MMM"),
					});
					lastLabeledMonth = monthIndex;
				}
			}
		}

		if (hasAnyPastOrTodayCell) {
			weeks.push(weekCells);
		}
		currentWeekStart = addDays(currentWeekStart, 7);
	}
	const dayLabels = ["Mon", "Wed", "Fri"];
	const dayIndices = [1, 3, 5];
	return (
		<div className="space-y-2">
			<div className="flex items-start gap-1">
				<DayLabelsColumn dayLabels={dayLabels} dayIndices={dayIndices} />
				<div className="flex min-w-0 flex-1 flex-col gap-2">
					<div className="overflow-x-auto">
						<MonthHeader weeks={weeks} monthLabels={monthLabels} />
						<HeatmapGrid weeks={weeks} />
					</div>
					<HeatmapLegend />
				</div>
			</div>
		</div>
	);
}

function ActivityDataCard({
	activityData,
}: {
	activityData: ProfileActivityDataDTO[];
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Calendar className="text-secondary-500 h-5 w-5" />
					{" Activity"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ActivityHeatmap activityData={activityData} />
			</CardContent>
		</Card>
	);
}

function CourseProgressItem({ course }: { course: ProfileCourseProgressDTO }) {
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<div>
					<TextLink
						to="/courses/$courseTemplateId"
						params={{ courseTemplateId: course.courseTemplateId! }}
						className="font-semibold"
					>
						{course.courseTemplateName}
					</TextLink>
					<p className="text-muted-foreground text-sm">
						{course.completedLessons}
						{" of "}
						{course.totalLessons}
						{" lessons"}
					</p>
				</div>
				<Badge variant="outline">{course.progressPercentage}%</Badge>
			</div>
			<Progress value={course.progressPercentage} className="h-2" />
		</div>
	);
}

function CourseProgressCard({
	courseProgress,
}: {
	courseProgress: ProfileCourseProgressDTO[];
}) {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<BookOpen className="text-secondary-500 h-5 w-5" />
					Course Progress
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{courseProgress.length === 0 ? (
						<p className="text-muted-foreground text-sm">
							No courses started yet
						</p>
					) : (
						courseProgress.map((item) => (
							<CourseProgressItem key={item.courseTemplateId} course={item} />
						))
					)}
				</div>
			</CardContent>
		</Card>
	);
}

function RecentActivityItem({
	activity,
}: {
	activity: ProfileRecentActivityDTO;
}) {
	// const { user } = useAuth();
	// TODO: 添加用户订阅相关请求
	// const { data } = useQuery(useProfileSubscriptionsByProfileIdQueryOptions())

	return (
		<div className="flex items-center justify-between gap-2">
			<div className="flex flex-1 items-center gap-2">
				<Check className="text-secondary-500 h-5 w-5 shrink-0" />
				<TextLink
					className="font-semibold"
					to="/courses/$courseTemplateId/lessons/$lessonTemplateId"
					params={{
						courseTemplateId: activity.courseTemplate?.id,
						lessonTemplateId: activity.lessonTemplate?.id,
					}}
				>
					{activity.lessonTemplate?.name}
				</TextLink>
			</div>
			<div className="flex items-center gap-2">
				<LessonBadge lesson={activity.lessonTemplate!} />
				<p className="text-muted-foreground shrink-0 text-sm">
					{format(new Date(activity.completedAt!), "MMM, d")}
				</p>
			</div>
		</div>
	);
}

function RecentActivityCard({
	recentActivity,
}: {
	recentActivity: ProfileRecentActivityDTO[];
}) {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<List className="text-secondary-500 h-5 w-5" />
					{" Recent Activity"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{recentActivity.length === 0 ? (
						<p className="text-muted-foreground text-sm">No recent activity</p>
					) : (
						recentActivity.map((item) => (
							<RecentActivityItem key={item.id} activity={item} />
						))
					)}
				</div>
			</CardContent>
		</Card>
	);
}

function UserInfo({
	profile,
	stats,
	activityData,
	courseProgress,
	recentActivity,
	isOwnProfile,
}: {
	profile: ProfileDetailInfo;
	stats: ProfileStatsDTO;
	activityData: ProfileActivityDataDTO[];
	courseProgress: ProfileCourseProgressDTO[];
	recentActivity: ProfileRecentActivityDTO[];
	isOwnProfile: boolean;
}) {
	return (
		<div className="flex flex-col gap-4 lg:flex-row">
			<div className="w-full shrink-0 lg:w-75">
				<ProfileCard
					profile={profile}
					stats={stats}
					isOwnProfile={isOwnProfile}
				/>
			</div>
			<div className="flex-1 space-y-4">
				<ActivityDataCard activityData={activityData} />
				<div className="flex flex-col gap-4 lg:flex-row">
					<CourseProgressCard courseProgress={courseProgress} />
					<RecentActivityCard recentActivity={recentActivity} />
				</div>
			</div>
		</div>
	);
}

function UserInfoMainContent() {
	const { user } = useAuth();
	const { profileId } = Route.useLoaderData();
	const [
		{ data: profile },
		{ data: profileDetails },
		{ data: xp },
		{ data: stats },
		{ data: activityData },
		{ data: courseProgress },
		{ data: recentActivity },
	] = useSuspenseQueries({
		queries: [
			useProfileByProfileIdQueryOptions(profileId),
			useProfileDetailByProfileIdQueryOptions(profileId),
			useXpByProfileIdQueryOptions(profileId),
			useProfileStatsByProfileIdQueryOptions(profileId),
			useProfileActivityDataByProfileIdQueryOptions(profileId),
			useProfileCourseProgressByProfileIdQueryOptions(profileId),
			useprofileRecentActivityByProfileIdQueryOptions(profileId),
		],
	});
	const isOwnProfile = user?.id === profileId;

	return (
		<UserInfo
			profile={{
				...profile,
				profileDetails,
				xp,
			}}
			stats={stats}
			activityData={activityData}
			courseProgress={courseProgress}
			recentActivity={recentActivity}
			isOwnProfile={isOwnProfile}
		/>
	);
}

function RouteComponent() {
	return (
		<Suspense fallback={<CurrentUserPendingSkeleton />}>
			<UserInfoMainContent />
		</Suspense>
	);
}
