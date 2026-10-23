/**
 * Mock 目录的空实现占位。
 *
 * 生产构建时 vite.config.js 会把 `@/mock` 别名指向本文件，
 * 防止动态 import 仍把 mock 种子数据与 token 逻辑带进产物。
 */
export const createMockAdapter = () => {
    throw new Error('Mock 服务未启用：请通过 VITE_USE_MOCK=true 启动开发服务器')
}

export const handleMockRequest = () => null
