import { getLevelByTotalXp, getTotalXpByLevel } from "#/utils/level";
import { Swords } from "lucide-react";
import { createContext, use, type ReactNode } from "react";

interface LevelProgressContextValue {
	currentLevel: number;
	xpInCurrentLevel: number;
	xpNeededForNextLevel: number;
	progressPercentage: number;
}

const ProfileLevelProgressContext =
	createContext<LevelProgressContextValue | null>(null);

interface LevelProgressProviderProps {
	xp: number;
	children: ReactNode;
}

function ProfileLevelProgressProvider({
	xp,
	children,
}: LevelProgressProviderProps) {
	const currentLevel = getLevelByTotalXp(xp);
	const minXp = getTotalXpByLevel(currentLevel);
	const maxXp = getTotalXpByLevel(currentLevel + 1);
	const xpInCurrentLevel = xp - minXp;
	const xpNeededForNextLevel = maxXp - minXp;
	const progressPercentage = Math.round(
		(xpInCurrentLevel / xpNeededForNextLevel) * 100,
	);

	const levelValue = {
		currentLevel,
		xpInCurrentLevel,
		xpNeededForNextLevel,
		progressPercentage,
	};
	return (
		<ProfileLevelProgressContext value={levelValue}>
			{children}
		</ProfileLevelProgressContext>
	);
}

export function useLevelProgress() {
	const levelProgress = use(ProfileLevelProgressContext);
	if (!levelProgress)
		throw new Error(
			"useLevelProgress must be used within a LevelProgressProvider",
		);
	return levelProgress;
}

export function LevelProvider({ children, xp }: LevelProgressProviderProps) {
	// k 可能会在这里做一些兜底处理，比如 xp 为空时默认为 0
	const safeXp = xp ?? 0;
	return (
		<ProfileLevelProgressProvider xp={safeXp}>
			{children}
		</ProfileLevelProgressProvider>
	);
}

export function CurrentLevelIcon() {
	const { currentLevel } = useLevelProgress();
	return (
		<div className="flex items-center gap-1">
			<Swords className="text-secondary-500 size-5" />
			<span className="text-sm font-semibold">{currentLevel}</span>
		</div>
	);
}
