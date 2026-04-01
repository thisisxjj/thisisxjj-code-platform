import { cn } from "#/lib/utils";
import { Star } from "lucide-react";

export function CourseReviewStar({
	rating,
	starClassName,
}: {
	rating: number;
	starClassName?: string;
}) {
	return (
		<div className="flex items-center gap-1">
			{[1, 2, 3, 4, 5].map((item) => (
				<Star
					key={item}
					className={cn(
						"size-5",
						item <= rating
							? "fill-secondary-500 text-secondary-500"
							: "text-muted-foreground",
						starClassName,
					)}
				/>
			))}
		</div>
	);
}
