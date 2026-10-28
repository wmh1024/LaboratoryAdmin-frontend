import request from '@/utils/request'
import { createCrudServices } from './common'

/* 用户 User */
const user = createCrudServices(request, '/user')

export const getUserListService = (page, pageSize) => user.list(page, pageSize)
export const getUserByIdService = (id) => user.find(id)
export const deleteUserByIdsService = (ids) => user.remove(ids)
export const editUserService = (userData) => user.update(userData)
export const addUserService = (userData) => user.add(userData)
