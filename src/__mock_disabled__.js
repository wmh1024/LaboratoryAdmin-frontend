/**
 * Mock 门面的空实现占位。
 *
 * 生产构建时 vite.config.js 会把精确路径 `@/mock` 指向本文件，
 * 保证 Mock 适配器、演示账号与种子数据都不会进入生产产物。
 */
export const createMockAdapter = () => {
    throw new Error('Mock 服务未启用：请通过 VITE_USE_MOCK=true 启动开发服务器')
}

export const getDemoAccount = () => null
