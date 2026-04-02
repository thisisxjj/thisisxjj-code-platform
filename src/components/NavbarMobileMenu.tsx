import {
	CurrentLevelIcon,
	LevelProvider,
} from "#/features/profile-level-progress";
import { logoutApi } from "#/lib/api/auth";
import {
	useProfileDetailByProfileIdQueryOptions,
	useXpByProfileIdQueryOptions,
} from "#/lib/queries/useProfileQueryOptions";
import {
	userKeys,
	useUserQueryOptions,
} from "#/lib/queries/useUserQueryOptions";
import type { CurrentUserDTO } from "#/lib/schemas/user.schema";
import { cn } from "#/lib/utils";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { LogOut, Settings, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { ProfileAvatar } from "./ProfileAvatar";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { TextLink } from "./ui/link";
import { Skeleton } from "./ui/skeleton";
import { SmoothHashLink } from "./ui/smooth-hash-link";

export function ButtonSkeleton() {
	return <Skeleton className="h-9 w-36" />;
}

function UserXpLevel() {
	const { data: user } = useSuspenseQuery(useUserQueryOptions());
	return user ? <XpLevel user={user} /> : null;
}

function XpLevel({ user }: { user: CurrentUserDTO }) {
	const { data: xp } = useSuspenseQuery(useXpByProfileIdQueryOptions(user.id));
	return (
		<LevelProvider xp={xp}>
			<CurrentLevelIcon />
		</LevelProvider>
	);
}

function UserDropdownMenu({
	user,
	trigger,
	triggerClassName,
}: {
	user: CurrentUserDTO;
	trigger: ReactNode;
	triggerClassName?: string;
}) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data: profileDetail } = useSuspenseQuery(
		useProfileDetailByProfileIdQueryOptions(user.id),
	);
	const logoutServerFn = useServerFn(logoutApi);
	const { mutate: logout } = useMutation({
		mutationFn: logoutServerFn,
		onSuccess: async () => {
			await router.navigate({
				to: "/auth/login",
				replace: true,
			});
			await queryClient.invalidateQueries({
				queryKey: userKeys.currentUser,
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="lg"
					className={cn(
						"bg-transparent! p-0 hover:opacity-70",
						triggerClassName,
					)}
				>
					{trigger}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" sideOffset={4}>
				<DropdownMenuLabel className="p-0 font-normal">
					<div className="flex flex-col gap-2 px-1 py-1.5 text-left text-sm">
						<div className="flex items-center gap-2">
							<ProfileAvatar
								profileDetails={profileDetail!}
								className="size-8"
							/>
							<div className="flex flex-col text-left">
								<span className="font-medium">{profileDetail?.username}</span>
								<span className="text-muted-foreground text-xs">
									{profileDetail?.email}
								</span>
							</div>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{profileDetail?.username && (
						<DropdownMenuItem asChild>
							<TextLink
								variant="ghost"
								to="/user/$username"
								params={{ username: profileDetail.username }}
							>
								<UserRound className="size-4" />
								Profile
							</TextLink>
						</DropdownMenuItem>
					)}
					<DropdownMenuItem asChild>
						<TextLink variant="ghost" to="/settings/account">
							<Settings className="size-4" />
							Settings
						</TextLink>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant="destructive"
					onClick={() => logout(undefined)}
				>
					<LogOut className="size-4" />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function UserDropdownMenuAvatar({ user }: { user: CurrentUserDTO }) {
	const { data: profileDetails } = useSuspenseQuery(
		useProfileDetailByProfileIdQueryOptions(user.id),
	);
	return <ProfileAvatar profileDetails={profileDetails!} className="size-8" />;
}

function UserAvatar() {
	const { data: user } = useSuspenseQuery(useUserQueryOptions());
	return user ? (
		<UserDropdownMenu
			user={user}
			trigger={<UserDropdownMenuAvatar user={user} />}
		/>
	) : (
		<div className="hidden items-center gap-2 lg:flex">
			<Button asChild variant="ghost" size="lg">
				<TextLink variant="ghost" to="/auth/login">
					Login
				</TextLink>
			</Button>
			<Button asChild size="lg">
				<SmoothHashLink variant="ghost" to="/" hash="pricing">
					Get Started
				</SmoothHashLink>
			</Button>
		</div>
	);
}
export function UserInfoContainer() {
	const { data: user } = useSuspenseQuery(useUserQueryOptions());

	return user ? (
		<div className="flex items-center gap-4">
			<UserXpLevel />
			{/* TODO: 添加用户的订阅信息 */}
			<UserAvatar />
		</div>
	) : (
		<UserAvatar />
	);
}
