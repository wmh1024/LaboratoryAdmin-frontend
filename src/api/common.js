/**
 * 接口层公共常量与工具。
 *
 * 分页参数、ids 序列化、CRUD 路径在这里集中维护，避免各 api 文件重复拼接。
 */

/** 列表默认分页大小，与后端约定的 pageSize 保持一致 */
export const DEFAULT_PAGE_SIZE = 10

/** 不分页的小型字典列表（如实验室分类）使用较大的 pageSize */
export const DICT_PAGE_SIZE = 50

/** 数组转逗号分隔字符串（兼容带空格的旧格式） */
export const List2String = (arr) => (Array.isArray(arr) ? arr.join(',') : '')

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
