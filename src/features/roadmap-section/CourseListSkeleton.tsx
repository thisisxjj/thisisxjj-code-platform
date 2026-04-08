import { Skeleton } from "#/components/ui/skeleton";

export function CourseListSkeleton() {
	return (
		<div className="flex flex-col gap-16">
			{Array.from({ length: 2 }).map((_, index) => (
				<div key={index} className="flex flex-col gap-8">
					<div className="flex flex-col items-center gap-2 text-center">
						<Skeleton className="h-6 w-24 rounded-full" />
						<Skeleton className="h-8 w-32 sm:w-48" />
						<Skeleton className="h-4 w-full max-w-xs sm:max-w-md" />
					</div>
					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
						{Array.from({ length: 2 }).map((_, i) => (
							<Skeleton key={i} className="h-100 w-full max-w-87.5" />
						))}
					</div>
				</div>
			))}
		</div>
	);
}
