import { Button } from "#/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

export function RoadmapToggle({
	trigger,
	content,
}: {
	trigger: ReactNode;
	content: ReactNode;
}) {
	const [show, setShow] = useState(false);
	return (
		<div className="flex flex-col gap-8">
			<div className="flex justify-center">
				<Button
					size="xl"
					variant="outline"
					onClick={() => setShow(!show)}
					className="gap-2"
				>
					{trigger}
					<ChevronDown
						className={`size-5 transition-transform duration-200 ${show ? "rotate-180" : ""}`}
					/>
				</Button>
			</div>
			{show && <div>{content}</div>}
		</div>
	);
}
