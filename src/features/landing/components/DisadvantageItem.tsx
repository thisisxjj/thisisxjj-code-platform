import { X } from "lucide-react";

export default function DisadvantageItem({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="flex items-start gap-3">
			<X className="text-destructive mt-0.5 size-5 shrink-0" />
			<p className="text-muted-foreground text-sm sm:text-base">
				<span className="text-primary font-semibold">{title}</span>
				{description && " - "}
				{description}
			</p>
		</div>
	);
}
