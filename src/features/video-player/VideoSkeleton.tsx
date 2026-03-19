import { Skeleton } from "#/components/ui/skeleton";

export default function VideoSkeleton() {
	return (
		<div className="overflow-hidden rounded-xl">
			<Skeleton className="aspect-video w-full" />
		</div>
	);
}
