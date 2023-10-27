import axios from 'axios'

/* 用户 User */
export const getUserListService = (page) => {
    console.log(page)
    return axios.get(`https://mock.apifox.cn/m1/3472636-0-default/data/user?page=${page}`)
}

export const getUserByIdService = (id) => {
    return axios.get('https://mock.apifox.cn/m1/3472636-0-default/data/user/1?test=1')
}

export const deleteUserByIdsService = (ids) => {
    return axios.delete('https://mock.apifox.cn/m1/3472636-0-default/data/user', ids)
}
export const editUserService = (user) => {
    console.log('user', user)
    return axios.put('https://mock.apifox.cn/m1/3472636-0-default/data/user?q=1', user)
}
export const addUserService = (user) => {
    console.log('user', user)
    return axios.post('https://mock.apifox.cn/m1/3472636-0-default/data/user?q=1', user)
}

/* 管理员 Admin */
export const getAdminListService = (page) => {
    return axios.get(`https://mock.apifox.cn/m1/3472636-0-default/data/admin?page=${page}`)
}

export const getAdminByIdService = (id) => {
    return axios.get('https://mock.apifox.cn/m1/3472636-0-default/data/admin1?test=1')
}

export const deleteAdminByIdsService = (ids) => {
    return axios.delete('https://mock.apifox.cn/m1/3472636-0-default/data/admin', ids)
}
export const editAdminService = (admin) => {
    return axios.put('https://mock.apifox.cn/m1/3472636-0-default/data/admin?q=1', admin)
}
export const addAdminService = (admin) => {
    return axios.post('https://mock.apifox.cn/m1/3472636-0-default/data/admin?q=1', admin)
}
