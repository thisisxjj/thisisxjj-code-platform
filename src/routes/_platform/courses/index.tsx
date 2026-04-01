import { Input } from "#/components/ui/input";
import { Skeleton } from "#/components/ui/skeleton";
import { CourseCard, CourseCardSkeleton } from "#/features/course-card";
import { useAllCourseTemplatesQueryOptions } from "#/lib/queries/useCourseQueryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Search } from "lucide-react";
import { Suspense, useMemo, useState } from "react";

export const Route = createFileRoute("/_platform/courses/")({
	component: RouteComponent,
	loader: ({ context }) => {
		context.queryClient.fetchQuery(useAllCourseTemplatesQueryOptions());
	},
	head: () => ({
		meta: [
			{
				title: "Courses | Cosden Code",
			},
			{
				name: "description",
				content:
					"Browse all available courses and start your learning journey to become a full-stack React developer",
			},
		],
	}),
});

function CoursesSkeleton() {
	return (
		<div className="space-y-6 sm:space-y-8">
			<div className="mx-auto max-w-md">
				<Skeleton className="h-10 w-full" />
			</div>
			<div className="flex flex-wrap justify-center gap-4">
				{Array.from({ length: 6 }).map((item, index) => (
					<CourseCardSkeleton key={index} />
				))}
			</div>
		</div>
	);
}

function CoursesList() {
	const { data } = useSuspenseQuery(useAllCourseTemplatesQueryOptions());

	const [searchKey, setSearchKey] = useState("");
	const filteredCourses = useMemo(() => {
		if (!searchKey.trim()) return data;
		const lowerSearchKey = searchKey.toLowerCase();
		return data.filter((course) =>
			course.name.toLowerCase().includes(lowerSearchKey),
		);
	}, [data, searchKey]);

	return (
		<div className="space-y-6 sm:space-y-8">
			<div className="mx-auto max-w-md">
				<div className="relative">
					<Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
					<Input
						type="text"
						placeholder="Search courses..."
						value={searchKey}
						onChange={(e) => setSearchKey(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>
			{filteredCourses?.length === 0 ? (
				<div className="text-muted-foreground flex flex-col items-center gap-3 py-12 text-center">
					<BookOpen className="size-12" />
					<p className="text-sm sm:text-base">
						No courses found matching "{searchKey}"
					</p>
				</div>
			) : (
				<div className="flex flex-wrap justify-center gap-4">
					{filteredCourses?.map((course) => (
						<CourseCard key={course.id} course={course} />
					))}
				</div>
			)}
		</div>
	);
}

function RouteComponent() {
	return (
		<div className="mx-auto max-w-6xl space-y-8 sm:space-y-12">
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-center text-xl font-bold sm:text-2xl lg:text-4xl">
					All Courses
				</h1>
				<p className="text-muted-foreground px-4 text-sm text-balance sm:px-8 sm:text-base lg:text-lgtext-muted-foreground lg:text-lg">
					Explore our comprehensive collection of courses designed to take you
					from beginner to expert full-stack React developer
				</p>
			</div>
			<Suspense fallback={<CoursesSkeleton />}>
				<CoursesList />
			</Suspense>
		</div>
	);
}
