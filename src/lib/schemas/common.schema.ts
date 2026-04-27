import { z } from "zod";

// ============================================================================
// 1. Objectives (课程目标)
// ============================================================================
// 数据示例: [{ "name": "Learn the origins of React..." }]
export const ObjectiveSchema = z.object({
	name: z.string(),
});
export type ObjectiveRow = z.infer<typeof ObjectiveSchema>;

// ============================================================================
// 2. Tasks (任务列表)
// ============================================================================
// 数据示例: [{ "id": "1-1-what-is-react-task-1", "name": "Submit the code editor..." }]
export const TaskSchema = z.object({
	id: z.string(),
	name: z.string(),
});
export type TaskRow = z.infer<typeof TaskSchema>;

// ============================================================================
// 3. Code Editor (代码编辑器初始状态)
// ============================================================================
// 数据示例: { "template": "react", "files": { "App.jsx": { "code": "...", "hidden": false, ... } } }
export const CodeEditorFileSchema = z.object({
	code: z.string(),
	hidden: z.boolean().default(false),
	active: z.boolean().default(false),
	readOnly: z.boolean().default(false),
	asset: z.boolean().default(false),
});

export const CodeEditorSchema = z
	.object({
		template: z.string().default("vanilla"),
		files: z.record(z.string(), CodeEditorFileSchema).default({}),
	})
	.catch({ template: "vanilla", files: {} }); // 防御性容错，损坏时降级为安全对象
export type CodeEditorRow = z.infer<typeof CodeEditorSchema>;

// ============================================================================
// 4. Whiteboard (画板数据)
// ============================================================================
export const WhiteboardSchema = z
	.object({
		elements: z.array(z.record(z.string(), z.any())).default([]),
		appState: z.record(z.string(), z.any()).optional(),
	})
	.catch({ elements: [] });
export type WhiteboardRow = z.infer<typeof WhiteboardSchema>;

// ============================================================================
// 5. Resources (拓展资源)
// ============================================================================
export const ResourceSchema = z.object({
	title: z.string().optional(),
	url: z.string().url().optional(),
	type: z.string().optional(),
});
export type ResourceRow = z.infer<typeof ResourceSchema>;
