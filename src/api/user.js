import request from '@/utils/request'

export const userLoginService = (user) => {
    console.log('user', user)
    return request.post('/admin/login', user)
}
