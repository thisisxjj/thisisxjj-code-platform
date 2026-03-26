import { Button, buttonVariants } from "#/components/ui/button";
import { SmoothHashLink } from "#/components/ui/smooth-hash-link";
import { cn } from "#/lib/utils";
import type { VariantProps } from "class-variance-authority";

interface PricingPlanButtonProps {
	title: string;
	// 从 buttonVariants 中提取 size 的具体字面量类型
	size?: VariantProps<typeof buttonVariants>["size"];
	className?: string;
}

export function PricingPlanButton({
	title,
	size = "xl",
	className,
}: PricingPlanButtonProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 text-center">
			<Button
				asChild
				size={size}
				className={cn("mx-auto self-center", className)}
			>
				<SmoothHashLink variant="ghost" to="/" hash="pricing">
					{title}
				</SmoothHashLink>
			</Button>
		</div>
	);
}
