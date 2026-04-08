import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion";

function QuestionItem({
	question,
	answer,
}: {
	question: string;
	answer: string;
}) {
	const q = question.toLowerCase().replace(/[^a-z0-9]+/g, "-");
	return (
		<AccordionItem value={q}>
			<AccordionTrigger className="text-left text-base font-semibold sm:text-lg lg:text-xl">
				{question}
			</AccordionTrigger>
			<AccordionContent>
				<p className="text-muted-foreground text-sm sm:text-base">{answer}</p>
			</AccordionContent>
		</AccordionItem>
	);
}

export function FrequentlyQuestionSection() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
				<div className="space-y-2 px-4 text-center">
					<h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
						Frequently asked questions
					</h2>
					<p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
						Got questions? We've got answers
					</p>
				</div>
				<Accordion type="single" collapsible className="w-full">
					<QuestionItem
						question="How is this different from YouTube tutorials or Udemy courses?"
						answer="Cosden Code offers a complete structured roadmap, hands-on coding in every lesson, lesson-specific AI mentor for instant feedback, always up-to-date content, and one cohesive platform. Unlike scattered YouTube videos or passive Udemy courses, you'll always know what's next and get personalized help when stuck."
					/>
					<QuestionItem
						question="Is the AI mentor just ChatGPT?"
						answer="No. While Cosden Assistant does use existing AI models, each lesson has its own human-written context including the exact concepts being taught, what is important to understand, the tasks you're working on, common mistakes students make, and general advice and best practices to mention. Generic ChatGPT doesn't know what lesson you're on or what you've already learned."
					/>
					<QuestionItem
						question="What if I'm a complete beginner? Will this be too advanced?"
						answer={`Nope! Cosden Code starts from the fundamentals and takes you from "I've barely coded before" to "I can build production-ready React apps". You just need a computer, internet connection, a few hours per week, and willingness to practice.`}
					/>
					<QuestionItem
						question="How long will it take me to become job-ready?"
						answer="It depends on your starting point and time commitment. Realistic timelines: 3-4 months (part-time) for core React proficiency, 6-8 months (part-time) to be job-ready with solid portfolio projects, 12+ months (part-time) for advanced mastery. Quality over speed - we'd rather you deeply understand React than rush through."
					/>
					<QuestionItem
						question="How often will new content be added?"
						answer="New courses and projects will be added every month. This cadence will give you enough time to complete the existing content and not feel overwhelmed, while enabling us to keep delivering high-quality content on a regular basis."
					/>
					<QuestionItem
						question="What if React changes? Will the content become outdated?"
						answer="Cosden Code is an ever-evolving platform. When React releases new features, we add new modules and update existing ones. You're not buying a static course that's obsolete in 6 months - you're joining a living platform that grows with the React ecosystem."
					/>
					<QuestionItem
						question="Can I really cancel anytime?"
						answer="Yes. No contracts, no obligations. If Cosden Code isn't working for you, cancel your subscription anytime. We don't want unhappy students - we want developers who love learning and see real progress."
					/>
					<QuestionItem
						question="Do you offer purchase power parity (PPP)?"
						answer="Unfortunately not. We wish we could, but our AI costs are the same for everyone regardless of where you're from. If that changes in the future, we'll let you know."
					/>
				</Accordion>
			</div>
		</section>
	);
}
