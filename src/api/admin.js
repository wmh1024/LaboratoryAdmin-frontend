import request from '@/utils/request'
import { createCrudServices } from './common'

/* 管理员 Admin */
const admin = createCrudServices(request, '/admin')

export const getAdminListService = (page, pageSize) => admin.list(page, pageSize)
export const getAdminByIdService = (id) => admin.find(id)
export const deleteAdminByIdsService = (ids) => admin.remove(ids)
export const editAdminService = (adminData) => admin.update(adminData)
export const addAdminService = (adminData) => admin.add(adminData)
