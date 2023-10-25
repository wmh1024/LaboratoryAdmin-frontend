import axios from 'axios'

export const userLoginService = (user) => {
    return axios.get('https://mock.apifox.cn/m1/3472636-0-default/admin/login', user)
}
