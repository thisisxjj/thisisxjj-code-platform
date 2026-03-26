import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "#/components/ui/card";
import { ClientOnly } from "@tanstack/react-router";
import { CodeXml, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { MarkdownText } from "../video-player";

function CosdenAsistantExampleCard({
	exampleNumber,
	children,
}: {
	exampleNumber: number;
	children: ReactNode;
}) {
	return (
		<Card>
			<CardHeader>
				<CardDescription className="text-center text-sm">
					Example #{exampleNumber}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4 p-4 sm:space-y-8 sm:p-6">
				{children}
			</CardContent>
		</Card>
	);
}
function MessageItem({
	role,
	message,
}: {
	role: "user" | "assistant";
	message: string;
}) {
	return role === "user" ? (
		<div className="flex w-full justify-end">
			<div className="max-w-[85%] sm:max-w-[80%]">
				<div className="bg-accent text-secondary-foreground rounded-lg px-3 py-2 text-sm sm:px-4 sm:py-3 sm:text-base">
					{message}
				</div>
			</div>
		</div>
	) : (
		<div className="flex w-full gap-2 sm:gap-3">
			<div className="bg-input/50 flex size-8 shrink-0 items-center justify-center rounded-full sm:size-10">
				<Sparkles className="text-secondary-500 size-4 sm:size-6" />
			</div>
			<div className="min-w-0 flex-1">
				<ClientOnly
					fallback={
						<div className="text-foreground text-sm sm:text-base">
							{message}
						</div>
					}
				>
					<MarkdownText>{message}</MarkdownText>
				</ClientOnly>
			</div>
		</div>
	);
}

function SnapshotButton() {
	return (
		<div className="flex w-full justify-end">
			<div className="border-muted bg-card text-card-foreground flex max-w-full items-center gap-1.5 rounded-md border px-2 py-1.5 shadow-sm sm:gap-2 sm:px-3 sm:py-2">
				<CodeXml className="text-muted-foreground size-3 sm:size-4" />
				<div className="text-muted-foreground truncate text-xs font-semibold sm:text-sm">
					Code snapshot
				</div>
			</div>
		</div>
	);
}

export default function CosdenAsistantDemo() {
	return (
		<div className="mx-auto grid max-w-6xl gap-3 sm:gap-4 lg:grid-cols-2">
			<CosdenAsistantExampleCard exampleNumber={1}>
				<MessageItem
					role="assistant"
					message="Hi! I'm **Cosden Assistant**, your personal React mentor for this lesson. How can I help?"
				/>
				<div className="space-y-2">
					<MessageItem
						role="user"
						message="I don't understand why my useEffect keeps running every time"
					/>
					<SnapshotButton />
				</div>
				<MessageItem
					role="assistant"
					message={`No problem, let's take a look at your code! Looking at your dependency array, I can see you're passing a function there. That's what's causing it to run over and over again. \n\n Do you remember what happens when React compares functions between renders?`}
				/>
				<MessageItem
					role="user"
					message="Oh... they're never equal because they're different references?"
				/>
				<MessageItem
					role="assistant"
					message={`Exactly! In React, functions get recreated on every render, even if they are the same function. This means that \`useEffect\` will see something new and run again. Now, what could you do to fix this? Think back to what we learned earlier in the lesson. \n\n_Hint: does the function need to be created outside of the \`useEffect\`?_`}
				/>
			</CosdenAsistantExampleCard>
			<CosdenAsistantExampleCard exampleNumber={2}>
				<MessageItem
					role="assistant"
					message="Hi! I'm **Cosden Assistant**, your AI mentor for this lesson. How can I help?"
				/>
				<div className="space-y-2">
					<MessageItem
						role="user"
						message="Can you review my code? I'm not sure if I'm handling the state updates correctly"
					/>
					<SnapshotButton />
				</div>
				<MessageItem
					role="assistant"
					message={`Of course! What's happening is that you're calling \`setCount\` twice with \`count + 1\`. When you do that, both calls acltually use the same \`count\` value because they're part of the same render.\n\nInstead, what other form of state update could you use to fix this?`}
				/>
				<MessageItem
					role="user"
					message="Passing a function instead of a value would fix this, right?"
				/>
				<MessageItem
					role="assistant"
					message={`Yes exactly! The function form of \`setCount\` is a common pattern in React when you need to update state based on the previous value. It ensures you always use the most up-to-date value, even if other state updates are happening at the same time. \n\nTry it out and let me know if you need any help!`}
				/>
			</CosdenAsistantExampleCard>
		</div>
	);
}
