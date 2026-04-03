import { SiX, SiYoutube } from "@icons-pack/react-simple-icons";
import { format } from "date-fns";
import { TextLink } from "./ui/link";

export default function Footer() {
	return (
		<footer className="bg-card flex h-[var(--footer-height)] items-center justify-center border-t">
			<div className="container mx-auto px-4">
				<div className="mb-8 flex flex-wrap justify-center gap-8">
					<TextLink
						variant="ghost"
						className="text-muted-foreground"
						to="/roadmap"
					>
						Roadmap
					</TextLink>
					<TextLink
						variant="ghost"
						className="text-muted-foreground"
						to="/"
						hash="pricing"
					>
						Pricing
					</TextLink>
					<TextLink
						variant="ghost"
						className="text-muted-foreground"
						to="/leaderboards"
					>
						Leaderboards
					</TextLink>
				</div>
				<div className="mb-8 flex justify-center gap-6">
					<TextLink
						variant="ghost"
						className="text-muted-foreground"
						target="_blank"
					>
						<SiYoutube className="size-5" />
					</TextLink>
					<TextLink
						variant="ghost"
						className="text-muted-foreground"
						target="_blank"
					>
						<SiX className="size-5" />
					</TextLink>
				</div>
				<div className="text-center">
					<p className="text-muted-foreground text-sm">
						{"© Cosden Code "}
						{format(new Date(), "yyyy")}
					</p>
				</div>
			</div>
		</footer>
	);
}
