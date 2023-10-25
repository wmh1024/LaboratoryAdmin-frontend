import axios from 'axios'

export const userLoginService = (username, password) => {
    return axios.post('https://mock.apifox.cn/m2/3472636-0-default/119384422', { username, password })
}
