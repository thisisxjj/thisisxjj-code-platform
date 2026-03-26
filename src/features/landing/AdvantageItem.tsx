import { Check } from "lucide-react";

export function AdvantageItem({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="flex items-start gap-3">
			<Check className="mt-0.5 size-5 shrink-0 text-green-500" />
			<p className="text-muted-foreground text-sm sm:text-base">
				<span className="text-primary font-semibold">{title}</span>
				{description && "-"}
				{description}
			</p>
		</div>
	);
}
