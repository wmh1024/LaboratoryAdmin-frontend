import request from '@/utils/request'

export const userLoginService = (user) => {
    return request.post('/admin/login', user)
}
