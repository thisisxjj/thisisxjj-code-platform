import { cn } from "#/lib/utils";
import { TextLink, type TextLinkProps } from "./link";
import { useLocation } from "./smooth-hash-link";

export function PathLink({ to, children, ...props }: TextLinkProps) {
	const path = useLocation<string>({
		select: (location) => location.pathname,
	});

	const isCurrent = to === "/" ? false : path.includes(to as string);

	return (
		<TextLink
			className={cn("hover:opacity-70", isCurrent && "text-secondary-500")}
			variant="ghost"
			to={to}
			{...props}
		>
			{children}
		</TextLink>
	);
}
