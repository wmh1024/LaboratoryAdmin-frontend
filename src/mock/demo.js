/**
 * Mock 演示模式的前端入口。
 *
 * 所有「仅演示模式需要」的前端代码（示教账号提示等）都从这里导出，
 * 页面统一从 `@/mock/demo` 引入；生产构建时 vite.config.js 会把 `@/mock`
 * 别名指向空实现，因此本模块及其依赖不会进入生产产物。
 */
export { DEMO_ACCOUNT } from './account.js'
