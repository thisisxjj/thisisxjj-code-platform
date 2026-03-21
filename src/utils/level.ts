import { BASE_XP } from "@/lib/constants";

const SCALING_EXPONENT = 1.1;

/**
 * 根据目标等级，计算所需的总经验值
 * @param level 目标等级 (对应原函数的 t)
 * @returns 升到该等级所需的累计总经验值
 */
export function getTotalXpByLevel(level: number): number {
	const progressionSum = (level * (level - 1)) / 2;
	return Math.ceil(BASE_XP * Math.pow(progressionSum, SCALING_EXPONENT));
}

/**
 * 根据当前累计的总经验值，计算出当前的等级
 * @param totalXp 用户的总经验值 (对应原函数的 t)
 * @returns 用户当前达到的等级 (最低为 1 级)
 */
export function getLevelByTotalXp(totalXp: number): number {
	const xpRatio = totalXp / BASE_XP;
	const rootBase = Math.pow(xpRatio, 1 / SCALING_EXPONENT);

	// 利用一元二次方程求根公式反推等级
	const calculatedLevel = Math.floor((1 + Math.sqrt(1 + 8 * rootBase)) / 2);

	return Math.max(1, calculatedLevel);
}
