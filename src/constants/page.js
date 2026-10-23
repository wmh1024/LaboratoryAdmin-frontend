/**
 * 列表页每页条数。
 *
 * 唯一来源是 `src/api/common.js` 的 DEFAULT_PAGE_SIZE，这里仅做语义化重导出，
 * 避免与 Mock / 页面各维护一份导致「展示与实际请求不一致」。
 */
export { DEFAULT_PAGE_SIZE as PAGE_SIZE } from '@/api/common'
