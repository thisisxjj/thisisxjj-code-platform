import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "#/lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
	"inline-flex text-primary items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:cursor-pointer font-semibold relative",
	{
		variants: {
			variant: {
				default:
					"bg-gradient-to-r from-primary-500 to-secondary-500 text-primary dark:text-primary-foreground shadow-xs hover:from-primary-500/70 hover:to-secondary-500/70",
				destructive:
					"bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
				outline:
					"bg-background shadow-xs shadow-[inset_0_0_0_1px_theme(colors.border)] hover:bg-accent dark:bg-input/30 dark:shadow-[inset_0_0_0_1px_theme(colors.border)] dark:hover:bg-input/50",
				"outline-active":
					"bg-background shadow-xs shadow-[inset_0_0_0_1px_theme(colors.border)] hover:bg-accent dark:bg-primary/30 dark:shadow-[inset_0_0_0_1px_theme(colors.border)] dark:hover:bg-primary/20",
				secondary:
					"bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/70",
				"secondary-active":
					"bg-secondary text-secondary-500 shadow-xs hover:bg-secondary/70",
				ghost:
					"hover:bg-accent hover:text-accent-foreground dark:hover:bg-input/50",
				ghostActive: "bg-input/50 hover:bg-input/70",
				link: "underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 rounded-md gap-1.5 px-3 text-sm has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				xl: "h-12 rounded-md px-8 has-[>svg]:px-6 text-lg",
				xs: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
				icon: "size-9",
				iconSm: "size-8 has-[>svg]:px-2.5",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

const spinnerVariant = cva("size-4", {
	variants: {
		variant: {
			default: "text-primary dark:text-primary-foreground",
			destructive: "text-white",
			outline: "text-foreground",
			"outline-active": "text-foreground",
			secondary: "text-secondary-foreground",
			"secondary-active": "text-secondary-500",
			ghost: "text-foreground",
			ghostActive: "text-foreground",
			link: "text-primary",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

function Button({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	disabled = false,
	isLoading = false,
	children,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		isLoading?: boolean;
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot.Root : "button";

	return (
		<Comp
			data-slot="button"
			disabled={disabled || isLoading}
			className={cn(
				buttonVariants({ variant, size, className }),
				disabled && "pointer-events-none opacity-50",
				isLoading && "text-transparent",
			)}
			{...props}
		>
			{isLoading && (
				<div className="absolute top-1/2 left-1/2 flex aspect-square h-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
					<Spinner
						className={spinnerVariant({
							variant,
						})}
					/>
				</div>
			)}
			<Slot.Slottable>{children}</Slot.Slottable>
		</Comp>
	);
}

export { Button, buttonVariants };
