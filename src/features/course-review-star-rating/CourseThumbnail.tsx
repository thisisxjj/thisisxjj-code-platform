import type { CourseTemplateDTO } from "#/lib/schemas/course-template.schema";
import { cn } from "#/lib/utils";
import { Image } from "@unpic/react";

export function CourseThumbnail({
	course,
	className,
}: {
	course: CourseTemplateDTO;
	className: string;
}) {
	function getImagePath(courseId: string) {
		switch (courseId) {
			case "javascript":
				return "/courses/javascript.png";
			case "typescript":
				return "/courses/typescript.png";
			case "react-fundamentals":
			case "design-patterns-in-react":
			case "react-with-typescript":
				return "/courses/react.png";
			case "react-query":
				return "/courses/react-query.png";
			case "redux":
				return "/courses/redux.png";
			case "zustand":
				return "/courses/zustand.png";
			case "react-router":
			case "react-router-framework-mode":
				return "/courses/react-router.png";
			case "tanstack-router":
			case "tanstack-form":
			case "tanstack-start":
				return "/courses/tanstack-router.png";
			case "react-hook-form":
				return "/courses/react-hook-form.png";
			case "tailwind":
				return "/courses/tailwind.png";
			case "nextjs":
				return "/courses/next-js.png";
			default:
				return null;
		}
	}
	const imagePath = getImagePath(course.slug);

	return (
		<div
			className={cn("size-24 shrink-0 overflow-hidden rounded-lg", className)}
		>
			{imagePath && (
				<Image
					src={imagePath}
					alt={course.name}
					width={100}
					height={100}
					className={cn(
						"h-full w-full object-cover",
						course.status !== "published" && "opacity-50 grayscale",
						course.slug === "redux" && "opacity-80",
					)}
				/>
			)}
		</div>
	);
}
