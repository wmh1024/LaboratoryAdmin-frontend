import axios from 'axios'

export const userLoginService = (user) => {
    console.log('user', user)
    return axios.post('http://127.0.0.1:8081/admin/login', user)
}
