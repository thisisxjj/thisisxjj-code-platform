import { Card, CardContent, CardFooter } from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";

export function CourseCardSkeleton() {
	return (
		<Card className="relative h-100 w-full justify-between md:w-87.5">
			<CardContent className="flex flex-col gap-4 font-normal">
				<Skeleton className="size-24 self-center rounded-lg" />
				<div className="flex flex-col gap-2">
					<Skeleton className="h-7 w-3/4" />
					<Skeleton className="h-5 w-full" />
					<Skeleton className="h-5 w-5/6" />
				</div>
				<div className="flex items-center gap-2 text-sm">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-12" />
				</div>
				<div className="flex flex-row gap-4">
					<Skeleton className="h-5 w-24" />
					<Skeleton className="h-5 w-20" />
				</div>
			</CardContent>
			<CardFooter className="flex justify-end">
				<Skeleton className="h-10 w-full" />
			</CardFooter>
		</Card>
	);
}
