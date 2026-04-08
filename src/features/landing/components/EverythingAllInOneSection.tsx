import { Card, CardContent } from "#/components/ui/card";
import { BookOpen, Laptop, Map, RefreshCw, Sparkles } from "lucide-react";
import type React from "react";

function MasterReactNeedItem({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<Card>
			<CardContent className="flex items-center gap-3 p-4 sm:gap-4 sm:p-6">
				<div className="bg-secondary-500/10 flex size-10 shrink-0 items-center justify-center rounded-lg sm:size-12">
					{icon}
				</div>
				<div className="min-w-0 space-y-1">
					<h3 className="text-lg font-semibold sm:text-xl">{title}</h3>
					<p className="text-muted-foreground text-sm sm:text-base">
						{description}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
export default function EverythingAllInOneSection() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<div className="space-y-2">
				<h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
					<span className="text-gradient">
						Everything you need to master React.
					</span>{" "}
					All in one place
				</h2>
				<p className="text-muted-foreground text-sm sm:text-base">
					No more juggling between YouTube, Udemy, Stack Overflow, and the React
					docs
				</p>
			</div>
			<div className="space-y-4">
				<MasterReactNeedItem
					icon={<BookOpen className="text-secondary-500 size-6" />}
					title="Massive video library"
					description="High-quality, in-depth lessons that actually explain the 'why', not just the 'what'. The same teaching style you love from Cosden Solutions, now structured into a complete learning system from beginner to advanced"
				/>
				<MasterReactNeedItem
					icon={<Laptop className="text-secondary-500 size-6" />}
					title="Interactive coding environment"
					description="You're not just watching. You're building inside a real IDE, right in your browser. Every concept comes with hands-on exercises. You learn by doing, not by memorizing"
				/>
				<MasterReactNeedItem
					icon={<Sparkles className="text-secondary-500 size-6" />}
					title="AI mentor built into every lesson"
					description="Instant help when you're stuck. No waiting for forum replies. No fear of asking 'stupid questions'. Cosden Assistant has full context of the exact lesson you're on"
				/>
				<MasterReactNeedItem
					icon={<Map className="text-secondary-500 size-6" />}
					title="Clear, structured roadmap"
					description="No more wondering 'what should I learn next?' or 'am I missing something important?' We've mapped out the complete path from React beginner to advanced developer"
				/>
				<MasterReactNeedItem
					icon={<RefreshCw className="text-secondary-500 size-6" />}
					title="Always up-to-date"
					description="React evolves. So does Cosden Code. New modules, libraries, and best practices are continuously added. You'll never waste time learning outdated patterns"
				/>
			</div>
		</section>
	);
}
