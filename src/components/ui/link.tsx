import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Link, type LinkProps } from "@tanstack/react-router";

import { cn } from "#/lib/utils";

const linkVariants = cva(
	"group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default: "",
				ghost: "hover:no-underline",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface CustomLinkProps
	extends Omit<LinkProps, "className">,
		VariantProps<typeof linkVariants> {
	className?: string;
	children?: React.ReactNode;
}

export function TextLink({
	className,
	variant,
	children,
	...props
}: CustomLinkProps) {
	return (
		<Link
			// w_ 对应 TanStackLink
			className={cn(linkVariants({ variant }), className)}
			{...props}
		>
			{children}
		</Link>
	);
}

export { linkVariants };
