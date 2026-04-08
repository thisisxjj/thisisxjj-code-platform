import { Avatar, AvatarImage } from "#/components/ui/avatar";

export default function SocialProof() {
	// TODO: 获取真实总人数以及图像
	// const [{ data: s }, { data: t }] = X({
	// queries: [xe(), ue()],
	// });

	const totalUserCount = 1237;

	const userAvatars = [
		"https://lh3.googleusercontent.com/a/ACg8ocLPrvrnQN0t1NFUVHUI5ITYbMg4gLaz-5KYCBBDFA3mOhSKRec=s96-c",
		"https://lh3.googleusercontent.com/a/ACg8ocJ5IP447IN1kpysQLLATyxPqbiTbhRfZHS9QqX0ZLgRB2s0FyRU=s96-c",
		"https://lh3.googleusercontent.com/a/ACg8ocIeD1ZXTZzbXIgt0zyhh8tQuqiaElftJeFKJrbi9Si_K2Gfd7l5YA=s96-c",
		"https://lh3.googleusercontent.com/a/ACg8ocIrsZPTn4av_VAgj6a-sErRxNcbbjgleWCci4oGEc2P3rTulQ=s96-c",
		"https://lh3.googleusercontent.com/a/ACg8ocLRbW_hPzzIkmGPKHPkqdoXMgO-ZIXdZRgJFlSlo6p1SENFXxw=s96-c",
	];
	return (
		<div className="flex flex-row items-center justify-center gap-2">
			<div className="flex -space-x-2">
				{userAvatars.map((avatar, index) => (
					<Avatar
						key={avatar}
						className="border-background size-6 border-2 ring-2 ring-neutral-800"
					>
						<AvatarImage src={avatar} alt={`User ${index + 1}`} />
					</Avatar>
				))}
			</div>
			<p className="text-muted-foreground text-sm sm:text-base">
				Join{" "}
				<span className="text-primary font-semibold">
					{totalUserCount.toLocaleString()}+
				</span>{" "}
				developers learning React
			</p>
		</div>
	);
}
