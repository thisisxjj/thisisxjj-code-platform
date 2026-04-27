import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import { parseAsBoolean, useQueryState } from "nuqs";

interface LessonGridToggleContextType {
	showCode: boolean;
	setShowCode: Dispatch<SetStateAction<boolean>>;
}

const LessonGridToggleContext =
	createContext<LessonGridToggleContextType | null>(null);

export function LessonGridToggleProvider({
	children,
	initialShowCode,
}: {
	initialShowCode: boolean;
	children: ReactNode;
}) {
	const [showCode, setShowCode] = useQueryState(
		"showCode",
		parseAsBoolean.withDefault(initialShowCode).withOptions({
			clearOnDefault: false,
		}),
	);

	return (
		<LessonGridToggleContext.Provider value={{ showCode, setShowCode }}>
			{children}
		</LessonGridToggleContext.Provider>
	);
}

export function useLessonGridToggle<T>(
	selector: (state: LessonGridToggleContextType) => T,
) {
	return useContextSelector(LessonGridToggleContext, (value) => {
		if (!value) {
			throw new Error(
				"useLessonGridToggle must be used within a LessonGridToggleProvider",
			);
		}
		return selector(value);
	});
}
