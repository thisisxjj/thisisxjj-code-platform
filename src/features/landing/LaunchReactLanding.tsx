import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { TextLink } from "#/components/ui/link";
import { Skeleton } from "#/components/ui/skeleton";
import { Image } from "@unpic/react";
import {
	ArrowRight,
	Award,
	Brain,
	CircleQuestionMark,
	Clock,
	CodeXml,
	Lightbulb,
	Sparkles,
	Target,
} from "lucide-react";
import { Suspense } from "react";
import { VideoPlayer, VideoSkeleton } from "../video-player";
import { AdvantageItem } from "./components/AdvantageItem";
import DisadvantageItem from "./components/DisadvantageItem";
import { PricingPlanButton } from "./components/PricingPlanButton";
import SocialProof from "./components/SocialProof";
import TipCard from "./components/TipCard";
import type { LaunchAiProps } from "./type";
import CompareTwoCard from "./components/CompareTwoCard";
import CosdenAsistantDemo from "./components/CosdenAsistantDemo";
import EverythingAllInOneSection from "./components/EverythingAllInOneSection";
import DevelopmentEvaluation from "./components/DevelopmentEvaluation";
import { AvailableCourseList, CourseListSkeleton } from "../roadmap-section";
import { EarnedItemsSection } from "./components/EarnedItemsSection";
import { FragmentLearningCostItem } from "./components/FragmentLearningCostItem";
import CheckedItem from "./components/CheckedItem";
import { FrequentlyQuestionSection } from "./components/FrequentlyQuestionSection";

function HeroSection() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 text-center sm:space-y-8">
			<Badge size="lg" variant="outline" className="gap-1 self-center lg:gap-2">
				<Sparkles className="text-secondary-500 size-3 lg:size-4" />
				The Ultimate React Learning Platform
			</Badge>
			<h1 className="text-3xl font-bold text-balance sm:text-4xl lg:text-6xl">
				The React platform that{" "}
				<span className="text-gradient">grows with you</span>
			</h1>
			<p className="text-muted-foreground text-base text-balance sm:text-lg lg:text-xl">
				From your first component to production-ready applications. A complete,
				continuously evolving learning ecosystem that you'll never outgrow.
			</p>
			<div className="flex flex-col items-center gap-8 pt-4">
				<Button asChild size="xl">
					<TextLink variant="ghost" to="/roadmap">
						Get Started
						<ArrowRight className="size-4" />
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
					alt="Arrow"
				/>
				<Suspense fallback={<VideoSkeleton />}>
					<VideoPlayer
						videoId="72a00f68-4747-4818-9d2b-5457d6622d79"
						options={{ rememberPosition: false }}
					/>
				</Suspense>
			</div>
		</section>
	);
}

function PainPointsSection() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<div className="space-y-2">
				<h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
					Stop buying React courses{" "}
					<span className="text-gradient">you outgrow in 3 months</span>
				</h2>
				<p className="text-muted-foreground text-sm sm:text-base">
					You've been down this road before:
				</p>
			</div>
			<div className="space-y-4">
				<DisadvantageItem
					title="Buy a Udemy course"
					description="It's outdated or incomplete → Buy another one"
				/>
				<DisadvantageItem
					title="Follow YouTube tutorials"
					description="Content is scattered → Still feel lost"
				/>
				<DisadvantageItem
					title="Join a bootcamp"
					description="They rush through React in weeks → You're unprepared"
				/>
				<DisadvantageItem
					title="Try to 'figure it out'"
					description="Waste months piecing together fragments → Give up frustrated"
				/>
			</div>
			<div className="space-y-4">
				<p className="text-muted-foreground text-sm font-semibold sm:text-base">
					The result? You've spent hundreds of dollars and countless hours, but
					you still don't feel confident building React applications.
				</p>
				<p className="text-muted-foreground text-sm font-semibold sm:text-base">
					The problem isn't you. It's that you've been trying to learn React
					from resources that were never designed to take you the full distance.
				</p>
			</div>
		</section>
	);
}

function AdvantageSection() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<div className="space-y-2">
				<h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
					What if there was{" "}
					<span className="text-gradient">
						one place for your entire React journey?
					</span>
				</h2>
				<p className="text-muted-foreground text-sm sm:text-base">
					Imagine a platform where:
				</p>
			</div>
			<div className="space-y-4">
				<AdvantageItem
					title="You start as a complete beginner"
					description="and progress all the way to advanced, production-ready skills"
				/>
				<AdvantageItem
					title="Content evolves as React evolves"
					description="so you're never learning outdated patterns or wasting time on deprecated features"
				/>
				<AdvantageItem
					title="Everything lives in one place"
					description="no more jumping between 10 different tabs, courses, and documentation sites"
				/>
				<AdvantageItem
					title="You learn by building, not just watching"
					description="with hands-on practice built into every single lesson"
				/>
				<AdvantageItem
					title="You're never stuck alone"
					description="with instant help available 24/7, plus a community of learners on the same path"
				/>
				<AdvantageItem
					title="You never outgrow it"
					description="from your first useState to building complex applications with advanced state management"
				/>
			</div>
			<p className="text-muted-foreground text-sm font-semibold sm:text-base">
				That's Cosden Code. The living React platform built for the long haul.
			</p>
		</section>
	);
}

function ReactInstructionSection() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<div className="space-y-2">
				<h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
					Hundreds of hours of{" "}
					<span className="text-gradient">expert React instruction</span>
				</h2>
				<p className="text-muted-foreground text-sm sm:text-base">
					This isn't a 40-hour course you finish and forget. This is a
					comprehensive video library that rivals any bootcamp curriculum.
				</p>
			</div>
			<div className="space-y-2">
				<h3 className="text-base font-bold sm:text-lg lg:text-xl">
					The depth you've been craving:
				</h3>
				<p className="text-muted-foreground text-sm sm:text-base">
					You know that feeling when a tutorial breezes over something
					important, leaving you confused?
				</p>
				<p className="text-muted-foreground text-sm sm:text-base">
					That doesn't happen here.
				</p>
				<p className="text-muted-foreground text-sm sm:text-base">
					Every concept is explained thoroughly:
				</p>
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<TipCard
					Icon={CircleQuestionMark}
					title="The 'what'"
					description="What is this feature?"
				/>
				<TipCard
					Icon={Lightbulb}
					title="The 'why'"
					description="Why does React work this way?"
				/>
				<TipCard
					Icon={Clock}
					title="The 'when'"
					description="When should you use this pattern vs. that one?"
				/>
				<TipCard
					Icon={CodeXml}
					title="The 'how'"
					description="How do you implement it correctly?"
				/>
			</div>
			<p className="text-muted-foreground text-sm font-semibold sm:text-base">
				No surface-level syntax memorization. Deep understanding that sticks.
			</p>
		</section>
	);
}

function ThaughtTheWaySection() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<div className="space-y-2">
				<h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
					Taught the way you're{" "}
					<span className="text-gradient">already familiar with</span>
				</h2>
				<p className="text-muted-foreground text-sm sm:text-base">
					The same clear, thorough teaching style from Cosden Solutions, now
					structured into a complete curriculum.
				</p>
				<p className="text-muted-foreground text-sm sm:text-base">
					You already know the instructor can explain complex concepts in ways
					that actually make sense. Now imagine that teaching organized into a
					step-by-step roadmap from beginner to advanced.
				</p>
			</div>
			<p className="text-muted-foreground text-sm font-semibold sm:text-base">
				This is what professional React education looks like:
			</p>
			<div className="space-y-4">
				<AdvantageItem
					title="Clear explanations with real-world context"
					description=""
				/>
				<AdvantageItem
					title="Code examples that actually teach, not just demo"
					description=""
				/>
				<AdvantageItem
					title="Concepts that build on each other logically"
					description=""
				/>
				<AdvantageItem
					title="No gaps, no confusion about what comes next"
					description=""
				/>
			</div>
		</section>
	);
}

function AnythingTryBeforeSection() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<div className="space-y-2">
				<h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
					This isn't like{" "}
					<span className="text-gradient">anything you've tried before</span>
				</h2>
				<p className="text-muted-foreground text-sm sm:text-base">
					Cosden Code is more than just a course. It's a complete learning
					ecosystem that takes you from beginner to advanced.
				</p>
			</div>
			<div className="grid gap-3 sm:gap-4 md:grid-cols-2">
				<CompareTwoCard
					wrongTitle="YouTube tutorials"
					rightTitle="Cosden Code"
					wrong="5-10 minute videos that scratch the surface. You're left wondering 'okay, but how does this fit into a real app?'"
					right="Comprehensive instruction that goes deep. Concepts are explained thoroughly and put in real-world practice with hands-on exercises."
				/>
				<CompareTwoCard
					wrongTitle="Udemy courses"
					wrong="Often 30-40 hours of content, but still incomplete. You finish and realize you don't know state management, routing, or how to structure a real application."
					rightTitle="Cosden Code"
					right="Comprehensive curriculum that covers all the essential concepts of React frontend development. Specific courses on state management, routing, and building real applications."
				/>
				<CompareTwoCard
					wrongTitle="Code Bootcamps"
					wrong="Rushed through in weeks. You're drowning in information with no time to absorb it."
					rightTitle="Cosden Code"
					right="Slower-paced evolving curriculum that allows you to take your time and absorb the concepts at your own pace. Courses and projects are added regularly to give you a clear path to mastery."
				/>
			</div>
		</section>
	);
}

function AiMentorSection() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<div className="space-y-2">
				<h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
					{"Instant help "}
					<span className="text-gradient">available 24/7</span>
				</h2>
				<p className="text-muted-foreground text-sm sm:text-base">
					Each lesson has its own specialized AI mentor, Cosden Assistant,
					available 24/7 to help you when you're stuck.
				</p>
			</div>
			<div className="space-y-2">
				<h3 className="text-base font-bold sm:text-lg lg:text-xl">
					Your personal AI mentor (not just ChatGPT)
				</h3>
				<p className="text-muted-foreground text-sm sm:text-base">
					Unlike generic AI chatbots, Cosden Assistant is custom-built for every
					single lesson.
				</p>
				<p className="text-muted-foreground text-sm font-semibold sm:text-base">
					Here's what makes it revolutionary:
				</p>
				<p className="text-muted-foreground text-sm sm:text-base">
					Each lesson has its own specialized AI mentor trained on:
				</p>
			</div>
			<div className="space-y-4">
				<AdvantageItem
					title="The exact concepts you're learning right now"
					description="not generic React knowledge"
				/>
				<AdvantageItem
					title="The specific task you're working on"
					description="it knows what you're trying to build"
				/>
				<AdvantageItem
					title="Your actual code"
					description="it sees exactly what you wrote and can pinpoint where your logic went wrong"
				/>
				<AdvantageItem
					title="Common mistakes at this exact step"
					description="and how to guide you through them without giving away the answer"
				/>
			</div>
			<p className="text-muted-foreground text-sm font-semibold sm:text-base">
				This means:
			</p>
			<div className="space-y-4">
				<AdvantageItem
					title="Context-aware help"
					description="It knows you're on 'Lesson 12: Managing Complex State,' not just 'a React lesson somewhere'"
				/>
				<AdvantageItem
					title="Socratic teaching method"
					description="It asks questions that guide you to the 'aha!' moment instead of just giving you the answer"
				/>
				<AdvantageItem
					title="Available 24/7"
					description="Stuck at 2 AM? Your mentor never sleeps, never judges, never gets impatient"
				/>
				<AdvantageItem
					title="Tailored to your knowledge level"
					description="It won't reference concepts you haven't learned yet"
				/>
			</div>
			<div className="space-y-4">
				<p className="text-muted-foreground text-sm font-semibold sm:text-base">
					Between the AI mentor and the active community, you'll never be truly
					stuck again.
				</p>
				<p className="text-muted-foreground text-sm sm:text-base">
					Here's some examples of how Cosden Assistant can help you:
				</p>
			</div>
			<CosdenAsistantDemo />
		</section>
	);
}

function InteractiveCodingEnvSection() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<div className="space-y-2">
				<h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
					Built-in{" "}
					<span className="text-gradient">interactive coding environment</span>
				</h2>
				<p className="text-muted-foreground text-sm sm:text-base">
					No more pausing videos to switch to VS Code. No more "wait, how do I
					set this up?"
				</p>
			</div>
			<div className="space-y-4">
				<p className="text-muted-foreground text-sm font-semibold sm:text-base">
					Code directly in the browser while you learn:
				</p>
				<AdvantageItem title="Watch a concept explained" description="" />
				<AdvantageItem
					title="Immediately practice it in the built-in IDE"
					description=""
				/>
				<AdvantageItem
					title="Get instant feedback on your code"
					description=""
				/>
				<AdvantageItem
					title="Build muscle memory by actually typing, not just copying"
					description=""
				/>
			</div>
		</section>
	);
}

function StructuredExercisesSection() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<div className="space-y-2">
				<h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
					<span className="text-gradient">Structured exercises</span>
					{" for every concept"}
				</h2>
				<p className="text-muted-foreground text-sm sm:text-base">
					After each lesson, you'll complete targeted exercises that reinforce
					what you just learned:
				</p>
			</div>
			<div className="space-y-4">
				<p className="text-muted-foreground text-sm font-semibold sm:text-base">
					Each exercise is designed to:
				</p>
				<div className="grid gap-4 md:grid-cols-3">
					<TipCard
						title="Memory"
						description="Cement the concept in your memory"
						Icon={Brain}
					/>
					<TipCard
						title="Application"
						description="Show you how it applies to real scenarios"
						Icon={Target}
					/>
					<TipCard
						title="Confidence"
						description="Build your confidence before moving forward"
						Icon={Award}
					/>
				</div>
			</div>
			<p className="text-muted-foreground text-sm font-semibold sm:text-base">
				You're not just collecting knowledge. You're building skills.
			</p>
		</section>
	);
}

function SpecialCosdenCodeSection() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<div className="space-y-2">
				<h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
					React changes.{" "}
					<span className="text-gradient">Your education shouldn't stop</span>
				</h2>
				<p className="text-muted-foreground text-sm sm:text-base">
					This is the most important difference between Cosden Code and every
					other React course you've considered.
				</p>
			</div>
			<div className="space-y-6 sm:space-y-8">
				<div className="space-y-2">
					<h3 className="text-lg font-bold sm:text-xl lg:text-2xl">
						The problem with traditional courses:
					</h3>
					<p className="text-muted-foreground text-sm sm:text-base">
						You buy a Udemy course. It's great... for 6 months.
					</p>
					<p className="text-muted-foreground text-sm sm:text-base">
						Then React releases a major update:
					</p>
				</div>
				<div className="space-y-4">
					<AdvantageItem title="New hooks are introduced" description="" />
					<AdvantageItem title="Best practices change" description="" />
					<AdvantageItem title="Old patterns are deprecated" description="" />
				</div>
				<div className="space-y-4">
					<p className="text-muted-foreground text-sm font-semibold sm:text-base">
						Your course is now teaching you outdated information.
					</p>
					<p className="text-muted-foreground text-sm font-semibold sm:text-base">
						You realize you need to buy another course. And another. And
						another.
					</p>
					<p className="text-muted-foreground text-sm font-semibold sm:text-base">
						You're not building skills. You're chasing updates.
					</p>
				</div>
			</div>
			<div className="space-y-6 sm:space-y-8">
				<div className="space-y-2">
					<h3 className="text-lg font-bold sm:text-xl lg:text-2xl">
						How Cosden Code is different:
					</h3>
					<p className="text-muted-foreground text-sm font-semibold sm:text-base">
						Cosden Code isn't a static course. It's a living platform.
					</p>
					<p className="text-muted-foreground text-sm sm:text-base">
						When React evolves, your education evolves with it:
					</p>
				</div>
				<div className="space-y-4">
					<AdvantageItem
						title="React 19 drops?"
						description="New modules added within weeks"
					/>
					<AdvantageItem
						title="Server Components become standard?"
						description="Comprehensive lessons created"
					/>
					<AdvantageItem
						title="New state management library emerges?"
						description="We evaluate it, then teach it"
					/>
					<AdvantageItem
						title="Best practices change?"
						description="Existing content is updated or expanded"
					/>
				</div>
				<p className="text-muted-foreground text-sm font-semibold sm:text-base">
					You're not buying a course. You're investing in ongoing React
					education.
				</p>
			</div>
		</section>
	);
}

function ReactRoadmapSection() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<div className="space-y-2">
				<h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
					Your complete path{" "}
					<span className="text-gradient">
						from beginner to confident React developer
					</span>
				</h2>
				<p className="text-muted-foreground text-sm sm:text-base">
					A structured curriculum designed to take you the full distance — not
					just to "hello world," but to building production-ready applications.
				</p>
			</div>
			<div className="space-y-4">
				<p className="text-muted-foreground text-sm font-semibold sm:text-base">
					What you can expect:
				</p>
				<AdvantageItem
					title="Start at your level"
					description="Complete beginner or have some JS knowledge? We meet you where you are"
				/>
				<AdvantageItem
					title="Progress logically"
					description="Each concept builds on the last, no confusing jumps"
				/>
				<AdvantageItem
					title="Go deep"
					description="Not just syntax, but understanding the principles and patterns"
				/>
				<AdvantageItem
					title="Build constantly"
					description="Hands-on practice with every single concept"
				/>
				<AdvantageItem
					title="Reach mastery"
					description="From first component to advanced architecture"
				/>
			</div>
			<p className="text-muted-foreground text-sm sm:text-base">
				Timeline: Most students reach job-ready proficiency in 6-8 months
				studying part-time. But take as long as you need — the platform isn't
				going anywhere, and it's only getting better.
			</p>
			<Suspense fallback={<CourseListSkeleton />}>
				<AvailableCourseList showHeader={false} />
			</Suspense>
			{/* TODO: 添加Roadmap */}
		</section>
	);
}

function GetFromCosdenCodeSection() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<div className="space-y-1">
				<h2 className=" text-xl font-bold sm:text-2xl lg:text-3xl">
					The real cost of{" "}
					<span className="text-gradient">fragmented learning</span>
				</h2>
				<p className="text-muted-foreground text-sm sm:text-base">
					Let's be honest about what trying to "piece it together" actually
					costs:
				</p>
			</div>
			<div className="grid gap-4 sm:gap-6 md:grid-cols-2">
				<FragmentLearningCostItem
					title="Multiple Udemy courses"
					cost="$200-500"
					description="Plus the time wasted figuring out which ones are worth it, which are outdated, and what order to take them in"
				/>
				<FragmentLearningCostItem
					title="Coding Bootcamp"
					cost="$15,000-20,000"
					description="For a rushed 12-week program that covers React in 2-3 weeks, leaving you underprepared"
				/>
				<FragmentLearningCostItem
					title="Computer Science Degree"
					cost="$40,000-200,000"
					description="Four years, often with outdated curriculum, and most of it isn't even about React"
				/>
				<FragmentLearningCostItem
					title="YouTube University"
					cost="'Free'"
					description="But the cost in wasted time, confusion, and outdated information? Massive. Plus no structure, no feedback, no accountability"
				/>
			</div>
			<div className="space-y-2">
				<p className="text-primary text-sm font-semibold sm:text-base">
					The biggest cost: Time
				</p>
				<p className="text-muted-foreground text-sm sm:text-base">
					How many more months will you spend searching for the "right" resource
					instead of just learning?
				</p>
			</div>
			<div className="space-y-6 sm:space-y-8">
				<h3 className="text-xl font-bold sm:text-2xl">
					{"What you get with "}
					<span className="text-gradient">Cosden Code</span>
				</h3>
				<div className="grid gap-4 md:grid-cols-2">
					<CheckedItem text="Complete curriculum from beginner to advanced" />
					<CheckedItem text="Lifetime access to all current and future content" />
					<CheckedItem text="All new modules as they're created (React 19, new libraries, emerging patterns)" />
					<CheckedItem text="Interactive coding platform built right in" />
					<CheckedItem text="AI mentor trained on each lesson" />
					<CheckedItem text="Active community of learners and developers" />
					<CheckedItem text="Regular updates so content never becomes outdated" />
					<CheckedItem text="One platform for your entire React journey" />
				</div>
			</div>
			<p className="text-muted-foreground text-sm font-semibold sm:text-base">
				Stop buying courses you'll outgrow. Make one investment that grows with
				you.
			</p>
		</section>
	);
}

export default function LaunchReactLanding({
	affiliateId,
	landingPageVariant,
}: LaunchAiProps) {
	return (
		<div className="space-y-16 sm:space-y-24 lg:space-y-36">
			<HeroSection />
			<PainPointsSection />
			<AdvantageSection />
			<PricingPlanButton title="Start Your React Journey" />
			<ReactInstructionSection />
			<ThaughtTheWaySection />
			<AnythingTryBeforeSection />
			<PricingPlanButton title="See How It Works" />
			<AiMentorSection />
			<PricingPlanButton title="Try Cosden Assistant" />
			<InteractiveCodingEnvSection />
			<StructuredExercisesSection />
			<PricingPlanButton title="Start Coding in Your Browser" />
			<SpecialCosdenCodeSection />
			<PricingPlanButton title="Get Always-Updated Access" />
			<EverythingAllInOneSection />
			<DevelopmentEvaluation
				title={
					<>
						Join a community of developers{" "}
						<span className="text-gradient">who found their React home</span>
					</>
				}
			/>
			<PricingPlanButton title="Join A Community of Learners" />
			<ReactRoadmapSection />
			<EarnedItemsSection
				title={
					<>
						React skills open doors to{" "}
						<span className="text-gradient">serious opportunities</span>
					</>
				}
			/>
			<GetFromCosdenCodeSection />
			<FrequentlyQuestionSection />
		</div>
	);
}
