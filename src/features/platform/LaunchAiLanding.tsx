import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { TextLink } from "#/components/ui/link";
import { Skeleton } from "#/components/ui/skeleton";
import { Sparkles } from "lucide-react";
import { Suspense } from "react";
import SocialProof from "./SocialProof";
import { Image } from "@unpic/react";
import VideoSkeleton from "../video-player/VideoSkeleton";
import { VideoPlayer } from "../video-player";

interface LaunchAiProps {
	affiliateId?: string;
	landingPageVariant: string;
}

function HeroSection() {
	return (
		<div className="mx-auto max-w-6xl space-y-6 text-center sm:space-y-8">
			<Badge className="gap-1 self-center lg:gap-2" size="lg" variant="outline">
				<Sparkles className="text-secondary-500 size-3 lg:size-4" />
				The Ultimate React Learning Platform
			</Badge>
			<h1 className="text-3xl font-bold text-balance sm:text-4xl lg:text-6xl">
				<span className="text-gradient">Master React</span>
				{" the way it was meant to be learned"}
			</h1>
			<p className="text-muted-foreground text-base text-balance sm:text-lg lg:text-xl">
				Stop watching endless tutorials. Start building real React applications
				with hands-on practice, expert instruction, and an AI mentor that
				understands exactly what you're learning
			</p>
			<div className="flex flex-col items-center gap-8 pt-4">
				<Button asChild size="xl">
					<TextLink variant="ghost" to="/roadmap">
						Get Started
					</TextLink>
				</Button>
				<Suspense fallback={<Skeleton className="h-4 w-24" />}>
					<SocialProof />
				</Suspense>
			</div>
			<div className="mt-12 space-y-3 sm:space-y-4 lg:mt-24">
				<div className="flex flex-col items-center gap-1">
					<h2 className="text-center text-xl font-semibold lg:text-2xl">
						See how it works
					</h2>
					<p className="text-muted-foreground text-center text-xs text-balance lg:text-sm">
						Watch this quick overview to see what makes Cosden Code different
					</p>
				</div>
				<Image
					className="mx-auto mt-4 mb-8 w-18.75 rotate-70 pl-4 sm:mb-12 sm:w-31.25 sm:pl-8"
					src="/arrow.png"
					width={800}
					height={400}
					alt="arrow"
				/>
				<Suspense fallback={<VideoSkeleton />}>
					<VideoPlayer
						videoId="6d7194f6-2e65-49f8-803c-6c96e38b9792"
						options={{
							rememberPosition: false,
						}}
					/>
				</Suspense>
			</div>
		</div>
	);
}

export default function LaunchAiLanding({
	affiliateId,
	landingPageVariant,
}: LaunchAiProps) {
	return (
		<div className="space-y-16 sm:space-y-24 lg:space-y-36">
			<HeroSection />
		</div>
	);
}
