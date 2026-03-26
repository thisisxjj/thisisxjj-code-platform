import { cn } from "#/lib/utils";
import { marked } from "marked";
import Prism from "prismjs";
import RemarkGfm from "remark-gfm";
import "prismjs/components/prism-jsx"; // 引入 JSX 支持
import { memo, useId, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";

/**
 * 允许从外部传入的自定义类名配置
 * 用于深度定制 Markdown 内部特定标签的样式
 */
export interface MarkdownClassNames {
	/**
	 * 传递给内联代码块 <code> 的自定义类名
	 */
	code?: string;
	// 如果未来需要拓展，可以在这里继续加，比如：
	// pre?: string;
	// p?: string;
}

/**
 * 完整的 Markdown 渲染器 Props
 */
export interface MarkdownTextProps {
	/**
	 * 原始的 Markdown 字符串
	 */
	children: string | ReactNode;
	/**
	 * 最外层 <article> 容器的类名
	 */
	className?: string;
	/**
	 * 内部特定标签的类名配置
	 */
	classNames?: MarkdownClassNames;
}

/**
 * 自定义代码高亮组件 Props
 */
export interface CodeHighlightProps {
	/**
	 * 需要高亮的代码字符串
	 */
	children: ReactNode;
	/**
	 * 附加的类名（通常来自 remark/rehype 插件解析出的 language-xxx）
	 */
	className?: string;
}

/**
 * 自定义代码块容器 Props
 */
export interface PreBlockProps {
	/**
	 * 内部包含的高亮 <code> 节点等
	 */
	children: ReactNode;
}

/**
 * 记忆化的单一 Markdown 区块 Props
 */
export interface MemoizedMarkdownBlockProps {
	/**
	 * 切分后的单个 Markdown 字符串区块
	 */
	children: string | ReactNode;
	/**
	 * 继承自顶层的自定义类名配置
	 */
	classNames?: MarkdownClassNames;
}

/**
 * 提取 Markdown 顶层块
 * (对应原代码：zp 函数)
 * 将长文本拆分成独立区块，利用 React.memo 实现流式输出时的局部渲染优化
 */
function splitMarkdownIntoBlocks(markdownString: string) {
	if (!markdownString) return [];
	// 只使用 marked 的词法分析功能，不生成 HTML
	return marked.lexer(markdownString).map((token) => token.raw);
}

/**
 * 自定义代码高亮组件
 */
function CodeHighlight({
	children: codeString,
	className,
}: CodeHighlightProps) {
	if (typeof codeString !== "string") return null;

	// 使用 Prism 进行高亮解析（这里默认当作 jsx 处理）
	const highlightedHtml = Prism.highlight(
		codeString,
		Prism.languages.jsx,
		"jsx",
	);

	return (
		<code
			className={cn(
				"text-secondary-foreground rounded-sm bg-neutral-700 p-1 font-normal whitespace-nowrap [&:after]:hidden [&:before]:hidden",
				className,
			)}
			dangerouslySetInnerHTML={{ __html: highlightedHtml }}
		/>
	);
}

/**
 * 自定义代码块容器
 */
function PreBlock({ children }: PreBlockProps) {
	return (
		<pre className="bg-input/50 border-secondary my-4 max-w-full overflow-x-auto rounded-lg border-2 p-4 [&>code]:bg-transparent [&>code]:font-normal [&>code]:whitespace-pre-wrap">
			{children}
		</pre>
	);
}

/**
 * 记忆化的独立 Markdown 区块
 */
const MemoizedMarkdownBlock = memo(
	({ children: markdownContent, classNames }: MemoizedMarkdownBlockProps) => {
		return (
			<ReactMarkdown
				components={{
					code: ({ children }) => (
						<CodeHighlight className={classNames?.code}>
							{children}
						</CodeHighlight>
					),
					pre: ({ children }) => <PreBlock>{children}</PreBlock>,
				}}
				remarkPlugins={[RemarkGfm]}
			>
				{markdownContent as string}
			</ReactMarkdown>
		);
	},
	(prevProps, nextProps) => prevProps.children === nextProps.children,
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export const MarkdownText = memo(
	({ children: rawMarkdown, className, classNames }: MarkdownTextProps) => {
		const id = useId();
		const blocks = splitMarkdownIntoBlocks(rawMarkdown as string);
		return (
			<article
				className={cn(
					"prose dark:prose-invert prose-neutral max-w-none",
					className,
				)}
			>
				{blocks.map((block, index) => (
					<MemoizedMarkdownBlock
						key={`${id}-block_${index}`}
						classNames={classNames}
					>
						{block}
					</MemoizedMarkdownBlock>
				))}
			</article>
		);
	},
);

MarkdownText.displayName = "MarkdownText";
