import request from '@/utils/request'
import { createCrudServices, DICT_PAGE_SIZE } from './common'

/* 用户 User */
const user = createCrudServices(request, '/user')

export const getUserListService = (page) => user.list(page)
export const getUserByIdService = (id) => user.find(id)
export const deleteUserByIdsService = (ids) => user.remove(ids)
export const editUserService = (userData) => user.update(userData)
export const addUserService = (userData) => user.add(userData)

/* 管理员 Admin */
const admin = createCrudServices(request, '/admin')

export const getAdminListService = (page) => admin.list(page)
export const getAdminByIdService = (id) => admin.find(id)
export const deleteAdminByIdsService = (ids) => admin.remove(ids)
export const editAdminService = (adminData) => admin.update(adminData)
export const addAdminService = (adminData) => admin.add(adminData)

/* 实验室类别（字典数据，一次取较大页） */
const labCategory = createCrudServices(request, '/lab/category')

export const getLabCategoryListService = () => labCategory.list(1, DICT_PAGE_SIZE)
export const getLabCategoryByIdService = (id) => labCategory.find(id)
export const deleteLabCategoryByIdsService = (ids) => labCategory.remove(ids)
export const editLabCategoryService = (labCategoryData) => labCategory.update(labCategoryData)
export const addLabCategoryService = (labCategoryData) => labCategory.add(labCategoryData)
