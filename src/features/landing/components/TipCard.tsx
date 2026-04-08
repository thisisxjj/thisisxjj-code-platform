import { Card, CardContent } from "#/components/ui/card";
import type { ComponentType } from "react";

export default function TipCard({
	Icon,
	title,
	description,
}: {
	Icon: ComponentType<{ className?: string }>;
	title: string;
	description: string;
}) {
	return (
		<Card>
			<CardContent className="flex flex-col items-center gap-2 p-4 text-center sm:gap-3 sm:p-6">
				<div className="bg-secondary-500/10 flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-12">
					<Icon className="text-secondary-500 size-5 sm:size-6" />
				</div>
				<div className="space-y-1">
					<h3 className="text-base font-semibold lg:text-lg">{title}</h3>
					<p className="text-muted-foreground text-sm text-balance lg:text-base">
						{description}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
