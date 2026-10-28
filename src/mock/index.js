/**
 * Mock 层唯一门面。
 *
 * 应用代码只允许从 `@/mock` 引入；生产构建时 vite.config.js 会把该精确路径
 * 替换为 `src/__mock_disabled__.js`，因此这里及其依赖不会进入生产产物。
 */
import { DEMO_ACCOUNT } from './account'

export { createMockAdapter } from './browser'

/** 获取演示账号：非 Mock 模式返回 null，页面据此决定是否展示提示 */
export const getDemoAccount = () => (import.meta.env.VITE_USE_MOCK === 'true' ? DEMO_ACCOUNT : null)
