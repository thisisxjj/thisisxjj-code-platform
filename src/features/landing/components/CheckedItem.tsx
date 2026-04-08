import { Check } from "lucide-react";

export default function CheckedItem({ text }: { text: string }) {
	return (
		<div className="flex items-start gap-3">
			<Check className="text-secondary-500 mt-0.5 size-5 shrink-0" />
			<span className="text-sm sm:text-base">{text}</span>
		</div>
	);
}
