import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";
import { LoaderCircle } from "lucide-react";

const spinnerWrapperVariants = cva("flex-col items-center justify-center", {
	variants: {
		show: {
			true: "flex",
			false: "hidden",
		},
	},
	defaultVariants: {
		show: true,
	},
});

const spinnerIconVariants = cva("animate-spin text-primary-500", {
	variants: {
		size: {
			small: "size-6",
			medium: "size-8",
			large: "size-12",
		},
	},
	defaultVariants: {
		size: "medium",
	},
});

export interface SpinnerProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof spinnerWrapperVariants>,
		VariantProps<typeof spinnerIconVariants> {
	// className 会从 HTMLAttributes 中继承，不需要重复声明
	// children 会从 HTMLAttributes 中继承，不需要重复声明
}

function Spinner({ size, show, children, className }: SpinnerProps) {
	return (
		<span className={spinnerWrapperVariants({ show })}>
			<LoaderCircle className={cn(spinnerIconVariants({ size }), className)} />
			{children}
		</span>
	);
}

export { Spinner };
