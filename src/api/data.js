import axios from 'axios'
import request from '@/utils/request'
import { List2String } from '@/utils/format'

/* 用户 User */
export const getUserListService = (page) => {
    return request.get(`/user/list?page=${page}&pageSize=10`)
}

export const getUserByIdService = (id) => {
    return axios.get(`/user/find/${id}`)
}

export const deleteUserByIdsService = (ids) => {
    return axios.delete('/user/delete', {
        ids: List2String(ids)
    })
}
export const editUserService = (user) => {
    return axios.put('/user/update', user)
}
export const addUserService = (user) => {
    return axios.post('/user/add', user)
}

/* 管理员 Admin */
export const getAdminListService = (page) => {
    return axios.get(`/admin/list?page=${page}&pageSize=10`)
}

export const getAdminByIdService = (id) => {
    return axios.get(`/admin/find/${id}`)
}

export const deleteAdminByIdsService = (ids) => {
    return axios.delete('/admin/delete', {
        ids: List2String(ids)
    })
}
export const editAdminService = (admin) => {
    return axios.put('/user/update', admin)
}
export const addAdminService = (admin) => {
    return axios.post('/admin/add', admin)
}

