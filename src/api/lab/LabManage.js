/* 实验室管理 */
import request from '@/utils/request'
import { createCrudServices } from '@/api/common'

// 详情路径按后端现有实现保留 findl 拼写
const lab = createCrudServices(request, '/laboratory', { findPath: '/laboratory/findl' })

export const getLabListService = (page, pageSize) => lab.list(page, pageSize)
export const getLabByIdService = (id) => lab.find(id)
export const deleteLabByIdsService = (ids) => lab.remove(ids)
export const editLabService = (data) => lab.update(data)
export const addLabService = (data) => lab.add(data)
