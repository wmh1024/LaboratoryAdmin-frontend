import axios from 'axios'

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

export const getAdminListService = () => {
    return axios.get('https://mock.apifox.cn/m1/3472636-0-default/data/admin?a=1')
}
