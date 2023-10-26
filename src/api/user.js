import axios from 'axios'

export const userLoginService = (user) => {
    user = [1, 2, 3]
    return axios.get('https://mock.apifox.cn/m2/3472636-0-default/119384422', user)
}
