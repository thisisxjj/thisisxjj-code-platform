import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardFooter } from "#/components/ui/card";
import { TextLink } from "#/components/ui/link";
import type { CourseTemplateDTO } from "#/lib/schemas/course-template.schema";
import { cn } from "#/lib/utils";
import { ArrowRight, Layers, SquareCheckBig, Video } from "lucide-react";
import {
	CourseReviewStar,
	CourseThumbnail,
} from "../course-review-star-rating";

export function CourseCard({
	course,
	className,
}: {
	course: CourseTemplateDTO;
	className?: string;
}) {
	return (
		<Card
			className={cn(
				"relative w-full justify-between transition-colors md:w-[350px]",
				course.status !== "published" && "opacity-70",
				className,
			)}
		>
			<CardContent className="flex flex-col gap-4 font-normal">
				<CourseThumbnail course={course} className="self-center" />
				<div className="flex flex-col gap-2">
					<h3 className="text-xl font-semibold">{course.name}</h3>
					<p className="text-muted-foreground line-clamp-3 text-base">
						{course.description}
					</p>
				</div>
				<div className="flex items-center gap-2 text-sm">
					<CourseReviewStar
						starClassName="size-4"
						rating={
							course.status === "published"
								? Math.round(course.averageRating)
								: 0
						}
					/>
					<span className="text-muted-foreground">
						{course.status === "published" ? `(${course.reviewCount})` : "(0)"}
					</span>
				</div>
				<div className="flex flex-row gap-4">
					<div className="text-muted-foreground flex items-center gap-1 text-sm">
						<Layers
							className={cn(
								"text-secondary-500 size-4",
								course.status !== "published" && "text-muted-foreground",
							)}
						/>
						{course.status === "published" ? course.moduleCount : "0"}
						{" modules"}
					</div>
					<div className="text-muted-foreground flex items-center gap-1 text-sm">
						<Video
							className={cn(
								"text-secondary-500 size-4",
								course.status !== "published" && "text-muted-foreground",
							)}
						/>
						{course.status === "published" ? course.lessonCount : "0"}
						{" lessons"}
					</div>
					<div className="text-muted-foreground flex items-center gap-1 text-sm">
						<SquareCheckBig
							className={cn(
								"text-secondary-500 size-4",
								course.status !== "published" && "text-muted-foreground",
							)}
						/>
						{course.status === "published" ? course.taskCount : "0"}
						{" tasks"}
					</div>
				</div>
				{course.status !== "published" && (
					<Badge variant={"outline"} className="absolute top-4 right-4">
						{course.releaseDate || "Coming Soon"}
					</Badge>
				)}
			</CardContent>
			<CardFooter className="flex justify-end">
				<Button
					variant="outline"
					asChild
					disabled={course.status !== "published"}
					className="w-full"
				>
					<TextLink
						to="/courses/$courseTemplateId"
						variant="ghost"
						params={{ courseTemplateId: course.slug }}
					>
						View Course
						<ArrowRight className="size-4" />
					</TextLink>
				</Button>
			</CardFooter>
		</Card>
	);
}
