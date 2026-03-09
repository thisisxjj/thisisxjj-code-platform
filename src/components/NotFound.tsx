import {} from "react";

export default function NotFound() {
	return (
		<div className="absolute inset-0 flex flex-grow items-center justify-center">
			<div className="flex flex-col items-center justify-center gap-4 px-4 text-center">
				<h1 className="text-2xl font-bold">Not Found</h1>
				<p>The page you are looking for does not exist</p>
			</div>
		</div>
	);
}
