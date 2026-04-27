import {
	createContext,
	use,
	useRef,
	useState,
	type Dispatch,
	type ReactNode,
	type Ref,
	type SetStateAction,
} from "react";

interface LessonContextType {
	lessonChatRef: Ref<null>;
	lessonExplorerRef: Ref<null>;
	lessonCodeEditorRef: Ref<null>;
	optimisticReadyForCompletion: boolean;
	setOptimisticReadyForCompletion: Dispatch<SetStateAction<boolean>>;
}
const LessonContext = createContext<LessonContextType | null>(null);

export function LessonProvider({ children }: { children: ReactNode }) {
	const lessonChatRef = useRef(null);
	const lessonExplorerRef = useRef(null);
	const lessonCodeEditorRef = useRef(null);
	const [optimisticReadyForCompletion, setOptimisticReadyForCompletion] =
		useState(false);

	return (
		<LessonContext
			value={{
				lessonChatRef,
				lessonExplorerRef,
				lessonCodeEditorRef,
				optimisticReadyForCompletion,
				setOptimisticReadyForCompletion,
			}}
		>
			{children}
		</LessonContext>
	);
}

export function useLesson() {
	const lesson = use(LessonContext);
	if (!lesson) {
		throw new Error("useLesson must be used within LessonProvider");
	}
	return lesson;
}
