import { Image } from "@unpic/react";
import { LucideBookOpen, LucideHammer, LucideMap } from "lucide-react";
import { Suspense } from "react";
import { ButtonSkeleton, UserInfoContainer } from "./NavbarMobileMenu";
import { Badge } from "./ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { TextLink } from "./ui/link";
import { PathLink } from "./ui/path-link";
import { SmoothHashLink } from "./ui/smooth-hash-link";

export default function Header() {
	return (
		<div className="mx-auto grid h-full max-w-7xl grid-cols-2 items-center px-4 py-2 lg:grid-cols-3">
			<TextLink variant="ghost" to="/" className="flex items-center gap-3">
				<Image
					src="/500w-logo.png"
					alt="Cosden Code Logo"
					width={100}
					height={100}
					className="size-6"
				/>
				<h2 className="font-semibold">
					Cosden{" "}
					<span className="from-primary-500 to-secondary-500 bg-linear-to-r bg-clip-text text-transparent">
						Code
					</span>
				</h2>
			</TextLink>
			<div className="col-span-1 hidden items-center justify-center gap-6 lg:flex">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<span className="flex items-center gap-1 hover:cursor-pointer hover:opacity-70">
							Learn
						</span>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						<DropdownMenuItem asChild>
							<TextLink to="/roadmap" variant="ghost" className="w-full">
								<LucideMap className="size-4" />
								Roadmap
								<Badge variant="outline" size="sm">
									Start Here
								</Badge>
							</TextLink>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<TextLink to="/courses" variant="ghost" className="w-full">
								<LucideBookOpen className="size-4" />
								Courses
							</TextLink>
						</DropdownMenuItem>
						<DropdownMenuItem asChild disabled>
							<TextLink className="w-full" variant="ghost" to="/" disabled>
								<LucideHammer className="size-4" />
								Projects
								<Badge variant="outline" size="sm">
									Early 2026
								</Badge>
							</TextLink>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<SmoothHashLink
					to="/"
					hash="pricing"
					variant="ghost"
					className="hover:opacity-70"
				>
					Pricing
				</SmoothHashLink>
				<PathLink to="/leaderboards">Leaderboards</PathLink>
			</div>
			<div className="col-span-1 flex items-center justify-end gap-2 md:gap-4">
				<div className="hidden items-center gap-2 lg:flex">
					<Suspense fallback={<ButtonSkeleton />}>
						<UserInfoContainer />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
