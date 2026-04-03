import { CircleAlert } from "lucide-react";
import { Button } from "./ui/button";
import { TextLink } from "./ui/link";

export default function NotFound() {
	return (
		<div className="absolute inset-0 flex grow items-center justify-center">
			<div className="flex flex-col items-center justify-center gap-4 px-4 text-center">
				<CircleAlert className="text-muted-foreground size-10" />
				<h1 className="text-2xl font-bold">Not Found</h1>
				<p className="text-muted-foreground">
					The page you are looking for does not exist
				</p>
				<Button variant="outline" asChild>
					<TextLink variant="ghost" to="/">
						Back to home
					</TextLink>
				</Button>
			</div>
		</div>
	);
}
