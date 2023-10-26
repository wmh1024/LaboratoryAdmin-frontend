import axios from 'axios'

export const getUserListService = () => {
    return axios.get('https://mock.apifox.cn/m1/3472636-0-default/data/user?test=1')
}

export const getUserByIdService = (id) => {
    return axios.get('https://mock.apifox.cn/m1/3472636-0-default/data/user/1?test=1')
}
export const getAdminListService = () => {
    return axios.get('https://mock.apifox.cn/m1/3472636-0-default/data/admin?a=1')
}
