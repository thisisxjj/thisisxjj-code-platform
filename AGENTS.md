# thisisxjj-code-platform 的 Agent 操作指南

本文档为在此代码库中运行的 AI 编程 Agent 提供必要的上下文、命令和约定。Agent 必须严格遵守这些指南，以确保代码的一致性和正确性。

## 1. 项目概述与技术栈

这是一个现代化的 Web 应用程序，基于以下技术栈构建：
- **框架:** React 19 配合 TanStack Start (SSR/全栈能力) & TanStack Router
- **构建工具:** 结合 Nitro 的 Vite
- **样式:** Tailwind CSS (v4)
- **语言:** TypeScript (严格模式)
- **工具链:** Biome (用于代码检查和格式化), Vitest (用于测试)
- **包管理器:** `pnpm`

## 2. 核心命令

所有依赖管理和脚本执行必须使用 `pnpm`。

### 构建与开发
- **安装依赖:** `pnpm install`
- **启动开发服务器:** `pnpm dev` (运行在 3000 端口)
- **构建生产版本:** `pnpm build`
- **预览生产构建:** `pnpm preview`

### 代码检查与格式化 (Biome)
本项目使用 Biome 替代 ESLint/Prettier。
- **格式化代码:** `pnpm format` (或运行 `pnpm biome format --write .`)
- **代码规范检查:** `pnpm lint` (或运行 `pnpm biome lint .`)
- **运行所有检查:** `pnpm check` (执行 Biome check)

### 测试 (Vitest)
- **运行所有测试:** `pnpm test` (执行 `vitest run`)
- **在监听模式下运行测试:** `pnpm vitest`
- **运行单个测试文件:** `pnpm vitest run path/to/file.test.ts`
- **按名称运行特定测试:** `pnpm vitest run -t "测试的名称"`

## 3. 代码风格与格式化约定

本项目通过 `biome.json` 强制执行特定的格式化规则：
- **缩进:** 使用制表符 Tab (禁止使用空格)。
- **引号:** JavaScript/TypeScript 中的字符串强制使用双引号 (`"`)。
- **导入:** 导入语句应当自动组织排序。
- **分号:** 遵循 Biome 推荐的默认设置（通常包含分号）。

### 路径别名
内部导入必须始终使用路径别名，以避免陷入相对路径地狱 (`../../../`)：
- `#/*` 映射到 `./src/*`
- `@/*` 映射到 `./src/*`

**示例:**
正确: `import { Button } from "@/components/ui/Button"`
错误: `import { Button } from "../../components/ui/Button"`

## 4. 架构与编码模式

### React & TanStack
- 本项目利用 **TanStack Start** (提供 SSR 和全栈能力) 以及 **TanStack Router** 进行路由管理。Agent 必须理解 TanStack Router 基于文件的路由约定及其特有的 Loader 数据加载机制。
- 优先使用带有 Hooks 的函数式组件。
- 由于使用的是 React 19，请在合适的场景下利用新的 Hooks 和特性，但必须确保与 TanStack 的数据获取和状态管理范式相兼容。

### TypeScript 与类型
- **严格模式:** TypeScript 配置为严格模式 (`"strict": true`)。除非绝对必要且附有明确注释，否则禁止使用 `any` 类型。
- 必须为组件的 Props、API 响应和状态定义恰当的接口(Interfaces)或类型(Types)。
- **扩展名:** 虽然 TypeScript 配置允许导入带有 TS 扩展名的文件，但在 Vite/Nitro 打包器规则明确要求时，请勿省略文件扩展名。

### 样式
- 必须使用 **Tailwind CSS v4**。
- 严禁使用内联样式 (Inline styles)。
- 创建 UI 组件时，保持结构整洁有序，合理组织 Tailwind 类名。

### 错误处理
- 异步操作必须使用 `try/catch` 块。
- 确保优雅地处理面向用户的错误（例如，通过 Toast 通知或 Error Boundaries 错误边界处理）。

## 5. 文件操作与 Agent 工作流

- **不要臆造库:** 在导入任何第三方库之前，必须始终检查 `package.json`，确认该库是否已安装。
- **不要修改生成的文件:** 例如，`routeTree.gen.ts` 是自动生成的，绝对不要手动去编辑它。
- **完成任务前的验证:** 在最终交付任何任务之前，**必须**运行 `pnpm format` 和 `pnpm lint`。如果修改的代码存在对应的测试用例，还必须运行 `pnpm test`。
- **如果不确定，请先询问:** 当面对需求不明确的情况时，不要擅自做主，应该向用户提问以明确需求。

## 6. 安全与密钥
- 绝对禁止提交硬编码的密钥、API 凭证或敏感的环境变量。
- 对于所有的配置项，请使用环境变量（Vite/客户端侧使用 `import.meta.env`，或者使用服务端等效的读取方式）。

---
*指南结束。在对代码库进行任何修改前，请仔细阅读以上内容。*