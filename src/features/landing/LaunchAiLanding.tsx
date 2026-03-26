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
import { AdvantageItem } from "./AdvantageItem";
import { PricingPlanButton } from "./PricingPlanButton";
import CosdenAsistantDemo from "./CosdenAsistantDemo";
import EverythingAllInOneSection from "./EverythingAllInOneSection";
import CompareTwoCard from "./CompareTwoCard";
import CheckedItem from "./CheckedItem";
import DevelopmentEvaluation from "./DevelopmentEvaluation";

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

function AdvantageSection() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<div className="space-y-1">
				<h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
					Tutorial hell{" "}
					<span className="text-gradient">doesn't cut it anymore</span>
				</h2>
				<p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
					The only way to become a confident React developer is to write a ton
					of code
				</p>
			</div>
			<div className="space-y-4">
				<AdvantageItem
					title="Escape Tutorial Hell"
					description="by coding inside a real IDE, not just watching videos"
				/>
				<AdvantageItem
					title="Get unstuck instantly"
					description="with an AI mentor that reads YOUR code and guides YOUR thinking"
				/>
				<AdvantageItem
					title="Build real projects"
					description="to prove your skills and fill your portfolio"
				/>
				<AdvantageItem
					title="Understand React deeply"
					description="master the 'why' behind every concept, not just memorize syntax"
				/>
				<AdvantageItem
					title="Learn at your own pace"
					description="without interrupting your job or family life"
				/>
				<AdvantageItem
					title="Stay always up-to-date"
					description="with ever-evolving content that grows as React grows"
				/>
				<AdvantageItem
					title="For a fraction of what bootcamps charge"
					description="to minimize your financial risk"
				/>
			</div>
		</section>
	);
}

function ReactMentorSection() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<div className="space-y-2">
				<h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
					Meet your
					<span className="text-gradient">personal React mentor</span>
				</h2>
				<p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
					<span className="font-semibold">Cosden Assistant</span>
					{
						" is the most advanced AI learning system built specifically for React education. See for yourself:"
					}
				</p>
			</div>
			<CosdenAsistantDemo />
			<div className="space-y-1">
				<h2 className="text-lg font-bold sm:text-xl lg:text-2xl">
					{"How does "}
					<span className="text-gradient">Cosden Assistant</span>
					{" work?"}
				</h2>
				<p className="text-muted-foreground text-sm sm:text-base">
					Unlike generic AI chatbots,{" "}
					<span className="font-semibold">Cosden Assistant</span>
					{" has lesson-specific instructions on what and how to teach"}
				</p>
			</div>
			<div className="space-y-4">
				<AdvantageItem
					title="Curriculum-based"
					description="It follows a strict curriculum written by human experts for each lesson"
				/>
				<AdvantageItem
					title="Context-aware help"
					description="It knows you're on 'Lesson 12: Managing Complex State' - not just 'a React lesson somewhere'"
				/>
				<AdvantageItem
					title="Reads YOUR actual code"
					description="It sees exactly what you wrote and can pinpoint where your logic went wrong"
				/>
				<AdvantageItem
					title="Tailored to your current knowledge level"
					description="It won't reference concepts you haven't learned yet or assume you know things you don't"
				/>
				<AdvantageItem
					title="Socratic teaching method"
					description="It asks questions that guide you to the 'aha!' moment instead of robbing you of the learning experience"
				/>
				<AdvantageItem
					title="Available 24/7"
					description="Stuck at 2 AM? Your mentor never sleeps, never judges, never gets impatient"
				/>
				<AdvantageItem
					title="Engineered for learning"
					description="This isn't ChatGPT with React docs copy-pasted in. This is an AI mentor engineered lesson-by-lesson"
				/>
			</div>
		</section>
	);
}

function FinallyUnderstandReact() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<div className="space-y-2">
				<h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
					<span className="text-gradient">Finally understand React</span>
					{" at a level most courses never reach"}
				</h2>
				<p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
					Most courses teach you syntax. Cosden Code teaches you to think
				</p>
			</div>
			<div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
				<CompareTwoCard
					wrong="Use useState like this"
					right="Here's why React needs state, how it triggers re-renders, and when you should (and shouldn't) reach for useState vs useReducer"
				/>
				<CompareTwoCard
					wrong="Here's how to fetch data"
					right="Here's the problem with fetching in useEffect, how React 18's Suspense changes the game, and how to handle loading/error states like a pro"
				/>
				<CompareTwoCard
					wrong="Copy this code for your project"
					right="Build it yourself, experiment with different approaches, and understand the tradeoffs of each solution"
				/>
			</div>
			<div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
				<p className="text-lg font-semibold sm:text-xl">
					When you finish Cosden Code,{" "}
					<span className="text-gradient">
						you won't need another React course. Ever.
					</span>
				</p>
				<div className="space-y-3">
					<CheckedItem text="Build production-ready applications from scratch" />
					<CheckedItem text="Debug complex issues without panicking" />
					<CheckedItem text="Make architecture decisions with confidence" />
					<CheckedItem text="Learn new React libraries on your own" />
					<CheckedItem text="Explain concepts clearly in job interviews" />
				</div>
				<p className="text-muted-foreground text-sm font-semibold sm:text-base">
					This isn't just another course. It's the complete React education
					you've been searching for.
				</p>
			</div>
		</section>
	);
}
export default function LaunchAiLanding({
	affiliateId,
	landingPageVariant,
}: LaunchAiProps) {
	return (
		<div className="space-y-16 sm:space-y-24 lg:space-y-36">
			<HeroSection />
			<AdvantageSection />
			<PricingPlanButton title="Start Learning React Today" />
			<ReactMentorSection />
			<PricingPlanButton title="Try Cosden Assistant" />
			<EverythingAllInOneSection />
			<PricingPlanButton title="Get Complete Access" />
			<FinallyUnderstandReact />
			<PricingPlanButton title="Master React the Right Way" />
			<DevelopmentEvaluation
				title={
					<>
						Join a community of developers{" "}
						<span className="text-gradient">escaping tutorial hell</span>
					</>
				}
			/>
			<PricingPlanButton title="Join The Community" />
		</div>
	);
}
