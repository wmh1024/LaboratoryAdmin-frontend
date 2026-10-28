/* 实验室类别 */
import request from '@/utils/request'
import { createCrudServices, toPageResult, DICT_PAGE_SIZE } from '@/api/common'

const labCategory = createCrudServices(request, '/lab/category')

/** 列表页：按传入分页参数请求 */
export const getLabCategoryListService = (page, pageSize) => labCategory.list(page, pageSize)

/**
 * 下拉字典：拉取全量分类。
 * 先取最大页，若总数超过一页则并行补齐剩余页，避免分类超过 50/100 条时静默截断。
 */
export const getLabCategoryDictService = async () => {
    const first = await labCategory.list(1, DICT_PAGE_SIZE)
    const { items, counts } = toPageResult(first)
    const pageCount = Math.ceil(counts / DICT_PAGE_SIZE)
    if (pageCount <= 1 || items.length === 0) return first

    const rest = await Promise.all(
        Array.from({ length: pageCount - 1 }, (_, index) => labCategory.list(index + 2, DICT_PAGE_SIZE))
    )
    const allItems = rest.reduce((acc, res) => acc.concat(toPageResult(res).items), items)
    return { data: { code: 200, msg: '操作成功', data: { items: allItems, counts } } }
}

export const getLabCategoryByIdService = (id) => labCategory.find(id)
export const deleteLabCategoryByIdsService = (ids) => labCategory.remove(ids)
export const editLabCategoryService = (data) => labCategory.update(data)
export const addLabCategoryService = (data) => labCategory.add(data)
