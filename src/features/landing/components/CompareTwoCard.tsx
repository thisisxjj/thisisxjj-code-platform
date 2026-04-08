import { Card, CardContent } from "#/components/ui/card";
import { Check, X } from "lucide-react";
import React from "react";

export default function CompareTwoCard({
	wrong,
	wrongTitle = "Other courses say",
	right,
	rightTitle = "Cosden Code teaches",
}: {
	wrong: string;
	wrongTitle?: string;
	right?: string;
	rightTitle?: string;
}) {
	return (
		<React.Fragment>
			<Card className="p-0">
				<CardContent className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center sm:gap-4 sm:p-6">
					<div className="bg-destructive/10 flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-12">
						<X className="text-destructive size-5 sm:size-6" />
					</div>
					<div className="space-y-1">
						<p className="text-muted-foreground text-xs font-medium tracking-wider uppercase sm:text-sm">
							{wrongTitle}
						</p>
						<p className="text-sm sm:text-base">"{wrong}"</p>
					</div>
				</CardContent>
			</Card>
			<Card className="p-0">
				<CardContent className="flex flex-col items-center gap-3 p-4 text-center sm:gap-4 sm:p-6">
					<div className="bg-secondary-500/10 flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-12">
						<Check className="text-secondary-500 size-5 sm:size-6" />
					</div>
					<div className="space-y-1">
						<p className="text-secondary-500 text-xs font-medium tracking-wider uppercase sm:text-sm">
							{rightTitle}
						</p>
						<p className="text-sm sm:text-base">"{right}"</p>
					</div>
				</CardContent>
			</Card>
		</React.Fragment>
	);
}
