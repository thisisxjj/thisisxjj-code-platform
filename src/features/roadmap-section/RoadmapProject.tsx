import { Badge } from "#/components/ui/badge";
import { Card, CardContent } from "#/components/ui/card";
import type { RoadmapProjectDTO } from "#/lib/schemas/roadmap.schema";
import { cn } from "#/lib/utils";

export function RoadmapProject({
	project,
	className,
}: {
	project: RoadmapProjectDTO;
	className?: string;
}) {
	return (
		<Card
			className={cn(
				"relative h-full w-full p-0 transition-colors md:w-87.5",
				project.releaseDate && "opacity-70",
				!project.releaseDate && "hover:bg-muted",
				className,
			)}
		>
			{project.releaseDate && (
				<Badge variant="outline" className="absolute top-4 right-4">
					{project.releaseDate}
				</Badge>
			)}
			<CardContent className="flex h-full w-full flex-col gap-1 p-4 font-normal">
				<h3 className="font-semibold">{project.name}</h3>
				<p className="text-muted-foreground text-sm">{project.description}</p>
			</CardContent>
		</Card>
	);
}
