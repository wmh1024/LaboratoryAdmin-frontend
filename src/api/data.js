import request from '@/utils/request'
import { List2String } from '@/utils/format'

/* 用户 User */
export const getUserListService = (page) => {
    return request.get(`/user/list?page=${page}&pageSize=10`)
}

export const getUserByIdService = (id) => {
    return request.get(`/user/find/${id}`)
}

export const deleteUserByIdsService = (ids) => {
    return request.delete('/user/delete', {
        params: {
            ids: List2String(ids)
        }
    })
}
export const editUserService = (user) => {
    return request.put('/user/update', user)
}
export const addUserService = (user) => {
    return request.post('/user/add', user)
}

/* 管理员 Admin */
export const getAdminListService = (page) => {
    return request.get(`/admin/list?page=${page}&pageSize=10`)
}

export const getAdminByIdService = (id) => {
    return request.get(`/admin/find/${id}`)
}

export const deleteAdminByIdsService = (ids) => {
    return request.delete('/admin/delete', {
        params: {
            ids: List2String(ids)
        }
    })
}

export const editAdminService = (admin) => {
    return request.put('/user/update', admin)
}
export const addAdminService = (admin) => {
    return request.post('/admin/add', admin)
}

