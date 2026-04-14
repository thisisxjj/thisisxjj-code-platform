import { Badge } from "#/components/ui/badge";
import type { LessonOutlineDTO } from "#/lib/schemas/course.schema";
import { Lock } from "lucide-react";

export function LessonBadge({
	lesson,
	hasActiveSubscription,
}: {
	lesson: Pick<LessonOutlineDTO, "id" | "slug" | "name" | "description">;
	hasActiveSubscription?: boolean;
}) {
	return hasActiveSubscription ? null : lesson.isFree ? (
		<Badge variant="outline" size="sm" className="text-green-500">
			Free
		</Badge>
	) : (
		<Badge
			variant="outline"
			size="sm"
			className="text-muted-foreground flex items-center gap-1"
		>
			<Lock className="size-3" />
			Premium
		</Badge>
	);
}
