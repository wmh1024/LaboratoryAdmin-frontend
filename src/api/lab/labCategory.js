/* 实验室类别 */
import request from '@/utils/request'
import { createCrudServices, DICT_PAGE_SIZE } from '@/api/common'

const labCategory = createCrudServices(request, '/lab/category')

export const getLabCategoryListService = () => labCategory.list(1, DICT_PAGE_SIZE)
export const getLabCategoryByIdService = (id) => labCategory.find(id)
export const deleteLabCategoryByIdsService = (ids) => labCategory.remove(ids)
export const editLabCategoryService = (data) => labCategory.update(data)
export const addLabCategoryService = (data) => labCategory.add(data)
