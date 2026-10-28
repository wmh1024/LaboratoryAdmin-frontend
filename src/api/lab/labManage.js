/* 实验室管理 */
import request from '@/utils/request'
import { createCrudServices } from '@/api/common'

const lab = createCrudServices(request, '/laboratory')

export const getLabListService = (page, pageSize) => lab.list(page, pageSize)
export const getLabByIdService = (id) => lab.find(id)
export const deleteLabByIdsService = (ids) => lab.remove(ids)
export const editLabService = (data) => lab.update(data)
export const addLabService = (data) => lab.add(data)
