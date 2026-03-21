import { createFileRoute } from "@tanstack/react-router";
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";
import { Image } from "@unpic/react";
import { Button } from "#/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { oauthLoginServerFn } from "#/lib/api/auth";

export const Route = createFileRoute("/auth/login")({
	component: RouteComponent,
});

function RouteComponent() {
	const searchParams = Route.useSearch();
	return (
		<div className="flex h-screen flex-col items-center justify-center px-4 py-8">
			<LoginCard searchParams={searchParams} />
		</div>
	);
}

function GoogleLogin({ searchParams }: { searchParams: object }) {
	return (
		<Button type="button" variant="outline" size="lg" className="w-full">
			<SiGoogle className="h-5 w-5" />
			Continue with Google
		</Button>
	);
}

function GithubLogin({ searchParams }: { searchParams: object }) {
	const githubLoginServer = useServerFn(oauthLoginServerFn);
	const { mutate, isPending } = useMutation({
		mutationFn: githubLoginServer,
		onError: () => {
			// TODO toast message
			// toast.
		},
	});
	return (
		<Button
			type="button"
			variant="outline"
			size="lg"
			className="w-full"
			isLoading={isPending}
			onClick={() =>
				mutate({
					data: {
						provider: "github",
						...searchParams,
					},
				})
			}
		>
			<SiGithub className="h-5 w-5" />
			Continue with Github
		</Button>
	);
}

function LoginCard({ searchParams }: { searchParams: object }) {
	return (
		<div className="border-border w-full max-w-md space-y-8 rounded-2xl border bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 p-6 shadow-2xl">
			<div className="flex w-full flex-col items-center gap-6">
				<div className="relative">
					<Image
						src="/500w-logo.png"
						alt="Cosden Code Logo"
						width={80}
						height={80}
						className="relative size-20"
					/>
				</div>
				<div className="space-y-2">
					<h1 className="text-center text-3xl font-semibold">
						{"Cosden "}
						<span className="text-gradient">Code</span>
					</h1>
					<p className="text-center text-sm text-neutral-400">
						Sign in to continue your learning journey
					</p>
				</div>
			</div>
			<div className="flex flex-col gap-4">
				<div className="space-y-2">
					<GoogleLogin searchParams={searchParams} />
					<GithubLogin searchParams={searchParams} />
				</div>
			</div>
		</div>
	);
}
