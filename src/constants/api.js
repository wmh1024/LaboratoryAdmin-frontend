/**
 * API / Mock 共享常量（唯一来源）。
 *
 * 分页上限、字典页大小、请求超时与 Mock 延迟都从这里引用，
 * 避免 Mock、文档与页面各写一份导致契约漂移。
 */

/** 列表默认分页大小 */
export const DEFAULT_PAGE_SIZE = 10

/** 小型字典列表（如实验室分类）的单次拉取上限 */
export const DICT_PAGE_SIZE = 50

/** 后端允许的最大分页大小，同时也是字典自动翻页的步长 */
export const MAX_PAGE_SIZE = 100

/** 请求超时（毫秒） */
export const REQUEST_TIMEOUT_MS = 10000

/** Mock 模拟网络延迟（毫秒） */
export const MOCK_DELAY_MS = 120
