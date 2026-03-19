import { type ParsedLocation, useRouterState } from "@tanstack/react-router";
import type * as React from "react";
import { TextLink, type TextLinkProps } from "./link";

/**
 * 封装 TanStack Router 的路由状态，仅订阅 location 的变化以优化性能
 */
export function useLocation<T = ParsedLocation>(options?: {
	select?: (location: ParsedLocation) => T;
}): T {
	return useRouterState({
		select: (state: any) =>
			options?.select ? options.select(state.location) : state.location,
	}) as T;
}
/**
 * 继承 TanStack Router 的 Link 属性以及原生的 a 标签属性
 */
export type SmoothHashLinkProps = TextLinkProps &
	React.AnchorHTMLAttributes<HTMLAnchorElement> & {
		hash: string;
	};

/**
 * 平滑滚动的锚点链接组件
 * 如果点击的 hash 与当前页面的 hash 相同，会拦截路由跳转并使用原生 API 平滑滚动
 */
export function SmoothHashLink({
	hash,
	onClick,
	...props
}: SmoothHashLinkProps) {
	const location = useLocation();

	function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
		// 检查当前 URL 的 hash 是否与点击目标的 hash 完全一致
		if (location.hash === hash) {
			// 阻止 TanStack Router 的瞬间强制刷新/跳转
			event.preventDefault();

			const targetId = hash.replace("#", "");
			const targetElement = document.getElementById(targetId);

			// 如果能在 DOM 中找到该 id，执行原生平滑滚动
			if (targetElement) {
				targetElement.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}
		}

		// 如果父组件传入了其他的 onClick 逻辑，依然正常执行
		if (onClick) {
			onClick(event);
		}
	}

	return <TextLink hash={hash} onClick={handleClick} {...props} />;
}
