/**
 * 接口层公共工具。
 *
 * 分页常量、ids 序列化、CRUD 路径在这里集中维护，避免各 api 文件重复拼接。
 */
import { DEFAULT_PAGE_SIZE, DICT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/constants/api'

export { DEFAULT_PAGE_SIZE, DICT_PAGE_SIZE, MAX_PAGE_SIZE }

/** 数组转逗号分隔字符串（兼容带空格的旧格式） */
export const List2String = (arr) => (Array.isArray(arr) ? arr.join(',') : '')

/** 取出统一响应结构 `{ code, msg, data }` 中的 data，缺失时返回 undefined */
export const unwrapData = (res) => res?.data?.data

/**
 * 把列表响应规范化为 `{ items, counts }`。
 * 兼容三种后端形态：`{items,counts}`、裸数组、以及 data 为空（避免页面解构崩溃）。
 * @param {import('axios').AxiosResponse} res
 */
export const toPageResult = (res) => {
    const data = unwrapData(res)
    if (Array.isArray(data)) return { items: data, counts: data.length }
    return { items: data?.items ?? [], counts: data?.counts ?? 0 }
}

/** 分页参数 */
export const pageParams = (page, pageSize = DEFAULT_PAGE_SIZE) => ({
    page,
    pageSize
})

/** 批量删除参数 */
export const idsParams = (ids) => ({
    ids: List2String(ids)
})

/**
 * 生成某个资源的 CRUD 服务集合
 * @param {import('axios').AxiosInstance} request
 * @param {string} base 资源基础路径，如 '/user'
 * @param {{ findPath?: string, listPath?: string }} [options]
 *   findPath: 详情路径（默认 `${base}/find`）
 *   listPath: 列表路径（默认 `${base}/list`）
 */
export const createCrudServices = (request, base, options = {}) => {
    const listPath = options.listPath || `${base}/list`
    const findPath = options.findPath || `${base}/find`

    return {
        list: (page, pageSize = DEFAULT_PAGE_SIZE) => request.get(listPath, { params: pageParams(page, pageSize) }),
        find: (id) => request.get(`${findPath}/${id}`),
        add: (data) => request.post(`${base}/add`, data),
        update: (data) => request.put(`${base}/update`, data),
        remove: (ids) => request.delete(`${base}/delete`, { params: idsParams(ids) })
    }
}
