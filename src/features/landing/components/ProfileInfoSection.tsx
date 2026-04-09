import { TextLink } from "#/components/ui/link";
import { Image } from "@unpic/react";
import CheckedItem from "./CheckedItem";

export function ProfileInfoSection() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<Image
				className="mx-auto w-37.5 rounded-full sm:w-50 md:w-75"
				src="/profile-photo.jpg"
				width={300}
				height={300}
				alt="Darius"
			/>
			<h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
				{"Hey, I'm "}
				<span className="text-gradient">Darius</span>! 🤙
			</h2>
			<p className="text-base sm:text-lg">
				You might know me from my YouTube channel,{" "}
				<TextLink
					className="text-secondary-500 font-semibold hover:underline"
					href="/"
					target="_blank"
				>
					Cosden Solutions
				</TextLink>
				.
			</p>
			<p className="text-sm sm:text-base">
				I've been working with React for over 10 years, building complex
				projects as both a team member within startups and corporations, as well
				as on my own as a freelancer. I've also dedicated long after-work hours
				to passion projects. I've learned a lot about React along the way, how
				it truly works under-the-hood, how to effectively use it, and how to
				build really big and complex applications with it.
			</p>
			<p className="text-sm sm:text-base">
				In early 2023, I decided to start teaching React to others. I created a
				YouTube channel which has now grown to millions of views and hundreds of
				thousands of subscribers. As much of a success as the YouTube channel
				has become, I felt like I could do more. I wanted to the ultimate
				learning platform that would help people learn React in a way that I
				wish I had learned it.
			</p>
			<p className="text-base sm:text-lg">I remember what it's like to:</p>
			<div className="space-y-3">
				<CheckedItem text="Feel overwhelmed by React's ecosystem" />
				<CheckedItem text="Waste months on tutorials that don't stick" />
				<CheckedItem text="Struggle alone at midnight with a bug" />
				<CheckedItem text="Wonder if you're 'cut out for this'" />
			</div>
			<p className="text-base font-semibold sm:text-lg">
				That's why I built Cosden Code differently.
			</p>
			<p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
				Not just theory from ivory towers. Real-world React from someone who
				codes every day. I wanted to create a platform that would help people
				learn React in a way that I wish I had learned it.
			</p>
		</section>
	);
}
