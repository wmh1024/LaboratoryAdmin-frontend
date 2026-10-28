/**
 * Mock 演示账号。
 *
 * 仅供「离线演示模式」使用：登录页据此提示，Mock 服务据此校验。
 * 应用代码只能通过 `src/mock/index.js` 门面读取；生产构建时 vite.config.js
 * 会把精确路径 `@/mock` 指向空实现，本文件不会被打进产物。
 */
export const DEMO_ACCOUNT = { username: 'demo_admin', password: 'demo1234' }
