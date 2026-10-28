/**
 * Vitest 全局测试环境准备。
 *
 * jsdom 不实现浏览器布局相关 API，Element Plus 的部分组件在挂载时会访问它们，
 * 这里提供最小可用的空实现，避免组件测试因环境差异失败。
 */

if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
}

if (!globalThis.IntersectionObserver) {
    globalThis.IntersectionObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
            return []
        }
    }
}

if (!window.matchMedia) {
    window.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener() {},
        removeListener() {},
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent() {
            return false
        }
    })
}
