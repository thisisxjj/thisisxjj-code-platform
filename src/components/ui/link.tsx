import { Link, type LinkProps } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "#/lib/utils";

const linkVariants = cva("hover:underline underline-offset-2", {
	variants: {
		variant: {
			default: "",
			ghost: "hover:no-underline",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export interface TextLinkProps
	extends Omit<LinkProps, "className">,
		Omit<
			React.AnchorHTMLAttributes<HTMLAnchorElement>,
			keyof LinkProps | "className"
		>,
		VariantProps<typeof linkVariants> {
	className?: string;
	children?: React.ReactNode;
}

export function TextLink({
	className,
	variant,
	children,
	...props
}: TextLinkProps) {
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
