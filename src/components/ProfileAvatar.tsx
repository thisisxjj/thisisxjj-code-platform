import type { ProfileDetailDTO } from "#/lib/schemas/profile.schema";
import { cn } from "#/lib/utils";
import { Image } from "@unpic/react";

export function ProfileAvatar({
	profileDetails,
	className,
}: {
	profileDetails: ProfileDetailDTO;
	className?: string;
}) {
	return (
		<Image
			src={profileDetails.avatarUrl ?? "/avatar-placeholder.png"}
			alt={profileDetails.username ?? "Profile avatar"}
			className={cn(
				"aspect-square size-36 w-auto! rounded-full object-cover",
				className,
			)}
			width={500}
			height={500}
		/>
	);
}
