import { useDebounce } from "#/utils/useDebounce";
import { createContext, useContextSelector } from "use-context-selector";
import { useLayoutEffect, useState } from "react";

// 2. 使用 use-context-selector 创建 Context
type WindowSizeState = { width: number; height: number; isMobile: boolean };

const WindowSizeContext = createContext<WindowSizeState | null>(null);
// 3. Provider 组件
export function WindowSizeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
	useLayoutEffect(() => {
		const handleResize = () => {
			setWindowSize({ width: window.innerWidth, height: window.innerHeight });
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	const debouncedSize = useDebounce(windowSize, 150);
	const isMobile = windowSize.width > 0 && windowSize.width < 1024;
	const value = {
		width: debouncedSize.width,
		height: debouncedSize.height,
		isMobile,
	};
	// 注意：由于使用了 use-context-selector，这里需要保留 .Provider
	return (
		<WindowSizeContext.Provider value={value}>
			{children}
		</WindowSizeContext.Provider>
	);
}
// 4. 改造供外部使用的 Hook
export function useWindowSize<T>(selector: (state: WindowSizeState) => T) {
	// 使用 useContextSelector 替代原有的 R7，实现精准的按需重渲染
	const selectedValue = useContextSelector(WindowSizeContext, (state) => {
		if (!state) {
			throw new Error("useWindowSize must be used within a WindowSizeProvider");
		}
		return selector(state);
	});

	return selectedValue;
}
