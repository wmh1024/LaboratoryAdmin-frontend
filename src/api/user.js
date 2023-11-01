import axios from 'axios'

export const userLoginService = (user) => {
    console.log('user', user)
    return axios.post('http://192.168.126.131:8081/admin/login', user)
}
