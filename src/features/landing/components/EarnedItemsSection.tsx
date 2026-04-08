import { Card, CardContent } from "#/components/ui/card";
import type { ReactNode } from "react";

function EarnedItem({ title, salary }: { title: string; salary: string }) {
	return (
		<Card>
			<CardContent className="space-y-2 py-4 text-center sm:py-6">
				<h3 className="text-base font-semibold sm:text-lg">{title}</h3>
				<p className="text-secondary-500 text-xl font-bold sm:text-2xl">
					{salary}
				</p>
			</CardContent>
		</Card>
	);
}

export function EarnedItemsSection({ title }: { title: string | ReactNode }) {
	return (
		<section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
			<div className="space-y-2">
				<h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">{title}</h2>
				<p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
					According to the 2025 Stack Overflow Developer Survey:
				</p>
			</div>
			<div className="grid gap-4 sm:gap-6 md:grid-cols-2">
				<EarnedItem title="Frontend Developer (React)" salary="$135,000/year" />
				<EarnedItem title="Full-Stack Developer" salary="$150,000/year" />
				<EarnedItem title="Senior React Developer" salary="$160,000+/year" />
				<EarnedItem title="Freelance React developers" salary="$75-150/hour" />
			</div>
		</section>
	);
}
