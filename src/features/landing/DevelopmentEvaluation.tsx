import { Card, CardContent } from "#/components/ui/card";
import { Star } from "lucide-react";

type Comment = { name: string; text: string };

const comments: Comment[] = [
	{
		name: "Sebastian",
		text: "My biggest struggle with learning React was understanding and applying certain advanced patterns like higher-order components and render props. These concepts were really hard to grasp on my own. Cosden Code helped me a lot by explaining how and when to use them in a clear, practical way. Thanks to the platform, I was able to apply the render props pattern in one of my projects, and now I finally understand the basics of how these patterns work and why they're useful.",
	},
	{
		name: "Sebastian",
		text: "Before using Cosden Code, I mostly learned React through YouTube videos and self-projects. However, the explanations often weren't deep enough or clear about how to apply certain concepts correctly. What makes Cosden Code different is how interactive and well-structured it is. It not only helped me polish ideas I previously struggled to apply, but the AI assistant also guided me to understand concepts more deeply and see how they fit into real-world projects.",
	},
	{
		name: "Lina",
		text: `I'm studying computer science and I'm learning React on the side. Honestly, most materials out there barely scratch the surface. Every tutorial shows things just working "somehow" especially with props and state updates, but never really explains why. Cosden Code finally slowed things down and explained *why* React behaves the way it does, and the little coding tasks after each lesson helped me actually apply the ideas instead of just memorizing them. The AI mentor was surprisingly helpful too, it pointed out why my components re-rendered when I didn't expect them to, and the explanations tied directly to what I was learning. It's the first time React has actually made sense to me.`,
	},
	{
		name: "Marco",
		text: "I learned React from YouTube but always got confused because people explain too fast and skip many steps. My English is not perfect so sometimes I don't understand everything. On Cosden Code it was much easier for me because the lessons are clear and slow enough, and the examples are simple to follow. When I got stuck on a small mistake, the AI mentor explained it in a really friendly way, not like documentation that is super hard. The exercises after the videos helped me so much, because I could try it myself and get feedback right away. I finally feel like I understand how components talk to each other.",
	},
	{
		name: "Khoyer",
		text: `All I can say is that relating to the courses makes a big difference. Becoming familiar with the topic isn't difficult, but understanding why it matters is often the main challenge for new learners. That's why Cosden Code focuses on project-based learning. But the approach in this platform is beyond that. It's similar to being an intern under a senior: asking questions like 'Why?', 'Why not?', and 'If so, when?'. This forms a very powerful learning model.

Oh and the AI is a gem. I asked without giving context by calling the variable name, and the AI was able to detect the context. So, learner and mentor (!) at the same pace, that's a huge advantage.`,
	},
	{
		name: "James",
		text: "I've been a junior frontend dev for about six months, and honestly I've felt in over my head most days. I could build small features in React, but whenever something involved state management or lifting state up or figuring out what should re-render, I got stuck. Cosden Code has been a life-saver. The depth of each lesson is way beyond anything I've seen on Udemy, and the AI mentor feels like having a patient senior dev sitting next to me. It didn't just fix my mistakes, it explained how the pattern in the lesson applied to my exact code. For the first time I'm not scared to open a real codebase at work.",
	},
	{
		name: "Priya",
		text: "Coming from Angular, React felt chaotic to me. All those hooks, effects firing when I didn't expect, and no clear structure to follow. I kept bouncing between tutorials that all contradicted each other. What helped me on Cosden Code was how everything is organized in a very logical order, and every topic builds on the last one. The videos actually explain the instinct behind React's patterns, not just the syntax. The code editor in the lessons was a huge bonus because I could test my understanding immediately, and whenever I messed up, the AI mentor pointed out exactly why that hook behaved the way it did. It made the transition so much smoother.",
	},
	{
		name: "Dylan",
		text: `I've been using React for about a year but always felt like my code was "fine but not great." I knew there were better ways to structure components, but most tutorials just throw buzzwords at you without showing real use cases. The React Design Patterns course on Cosden Code was exactly what I needed. It broke down things like container/presentational components, composition patterns, and even when to use custom hooks in a way that clicked instantly. The AI feedback during the exercises also helped me spot bad habits in my code. I feel like I finally understand how to write React the right way, not just the "it works so leave it" way.`,
	},
	{
		name: "Vivek",
		text: "My biggest struggle with learning React was understanding how all the pieces fit together  especially state management, props, and how components communicate. It always felt abstract when learning from random tutorials. Cosden Code really changed that by breaking everything down step-by-step with practical examples and AI assistant. I could actually see how concepts worked in real projects, which made React finally click for me. And can ask any questions to the AI assistant related to a particular concept, or can easily get my doubts resolved through it, without waiting for anyone.",
	},
	{
		name: "Vivek",
		text: "Before Cosden Code, I tried learning React through a few Udemy courses and YouTube tutorials. They helped a bit, but I often felt lost because they either moved too fast or skipped important context. Cosden Code felt different, it's structured, easy to follow, and actually explains why things are done a certain way. I didn't just copy code; I finally understood it. And in the end of each lecture solving the problem on our in the code editor present right there, and getting it reviewed instantly with the help of AI is really a cool and unique feature, I highly doubt there would be platforms with such functionalities atm.",
	},
	{
		name: "Vivek",
		text: "The course structure made React concepts much clearer than other resources I've tried. Most tutorials just show what to do, but Cosden Code focused on why explaining the reasoning behind each React pattern and when it should be used. The step-by-step progression, from basic component composition to advanced design patterns, made everything feel connected. I also liked how each section ended with small, practical projects that reinforced what I'd just learned. It helped me actually apply the patterns, not just memorize them.",
	},
	{
		name: "Vladimir",
		text: `Before Cosden Code, I mainly used Udemy courses, YouTube tutorials, and a few custom learning platforms. They were fine for learning the basics, but they all shared the same issue - they were completely static. You just watch a video, try to follow along on your local setup, and when something breaks, you're on your own.

Cosden Code changes that completely. The built-in AI actually reads the lesson and my code, explains why something fails, and suggests a clean fix - instantly. Having the editor, console, and AI mentor all in one place makes learning React far more interactive. Instead of passively watching, I'm actively experimenting, getting feedback, and understanding concepts deeply as I go`,
	},
	{
		name: "Vladimir",
		text: `I got stuck a few times, especially on topics like state management, effects, and understanding when components re-render. Normally, I'd waste time googling or rewatching videos, but here the AI mentor and the course structure made it easy to recover. Each lesson builds up gradually, so you always have just enough context. When I made a mistake, the AI didn't just tell me what was wrong - it explained why, based on the code I'd written and the specific concept from that lesson. It also gave short examples or hints that helped me fix things without feeling spoon-fed.

The combination of structured progression + instant, contextual feedback kept me moving forward instead of getting frustrated or losing focus.`,
	},
	{
		name: "Vladimir",
		text: `The structure and teaching style on Cosden Code make React concepts much clearer than anything I've tried before. What works really well is how each lesson mixes short video explanations, hands-on coding, and instant AI feedback. You're not just watching theory but you immediately apply it, and the AI checks your code in context of that specific topic. That constant "learn–try–get feedback" cycle helps concepts like state, props, and hooks actually stick.`,
	},
	{
		name: "Stefan",
		text: "My biggest problem with learning React was that I didn't have the time to go through all the content from different courses. In addition, many sources were often not very good. With Cosden Code, I immediately had the feeling that the teacher knows what they're talking about and that it's important to them to impart that knowledge. The courses have also broadened my horizons when it comes to React. No other platform has ever covered the subject as deeply, broadly and concisely as Cosden Code",
	},
];

function CommentItem({ testimonial }: { testimonial: Comment }) {
	return (
		<Card>
			<CardContent className="space-y-4 px-4 py-6 sm:px-6 sm:py-8">
				<p className="text-muted-foreground text-sm italic sm:text-base">
					"{testimonial.text}"
				</p>
				<div className="flex flex-col gap-2">
					<p className="text-sm font-semibold sm:text-base">
						{"- "}
						{testimonial.name}
					</p>
					<div className="flex items-center gap-1">
						{[1, 2, 3, 4, 5].map((item) => (
							<Star
								key={item}
								className="fill-secondary-500 text-secondary-500 size-4"
							/>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default function DevelopmentEvaluation({
	title,
}: {
	title: string | React.ReactNode;
}) {
	const commentsMap: Record<string, Comment[]> = {};
	for (const comment of comments) {
		if (!(comment.name in commentsMap)) {
			commentsMap[comment.name] = [];
		}
		commentsMap[comment.name].push(comment);
	}
	const firstComments = Object.values(commentsMap).map((i) => i[0] as Comment);
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<h2 className="px-4 text-center text-xl font-bold sm:text-2xl lg:text-3xl">
				{title}
			</h2>
			<div className="grid gap-4 sm:gap-6 md:grid-cols-2">
				{Object.values(firstComments).map((item) => (
					<CommentItem testimonial={item} />
				))}
			</div>
		</section>
	);
}
