import { Card, CardContent } from "#/components/ui/card";
import { X } from "lucide-react";

export function FragmentLearningCostItem({
	title,
	description,
	cost,
}: {
	title: string;
	description: string;
	cost: string;
}) {
	return (
		<Card className="p-0">
			<CardContent className="flex h-full flex-col items-center gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-6">
				<div className="bg-destructive/10 flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-12">
					<X className="text-destructive size-5 sm:size-6" />
				</div>
				<div className="flex h-full w-full flex-col items-center gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
					<div className="min-w-0">
						<h3 className="text-center text-sm font-bold sm:text-left sm:text-base">
							{title}
						</h3>
						<p className="text-muted-foreground text-center text-sm leading-relaxed sm:text-left sm:text-base">
							{description}
						</p>
					</div>
					<span className="text-muted-foreground text-sm font-semibold whitespace-nowrap sm:text-base">
						{cost}
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
