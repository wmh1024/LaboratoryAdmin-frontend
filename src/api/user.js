import request from '@/utils/request'

export const userLoginService = (user) => {
    return request.post('/admin/login', user)
}

export const userLogoutService = () => {
    return request.post('/admin/logout')
}
