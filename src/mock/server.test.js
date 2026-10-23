import { beforeEach, describe, expect, it } from 'vitest'
import { DEMO_ACCOUNT, handleMockRequest, resetMockDb } from './server'

const authed = (token) => ({ authorization: `Bearer ${token}` })

/** 每次都重新登录，避免用例之间共享令牌/账号状态 */
const freshToken = () => {
    const res = handleMockRequest({ method: 'POST', url: '/api/admin/login', body: { ...DEMO_ACCOUNT } })
    return res.payload.data.token
}

describe('handleMockRequest 鉴权', () => {
    beforeEach(() => resetMockDb())

    it('使用固定演示账号登录成功', () => {
        const res = handleMockRequest({ method: 'POST', url: '/api/admin/login', body: { ...DEMO_ACCOUNT } })
        expect(res.status).toBe(200)
        expect(res.payload.data.token).toMatch(/^mock-token-\d+-\d+$/)
    })

    it('错误密码返回 401', () => {
        const res = handleMockRequest({
            method: 'POST',
            url: '/api/admin/login',
            body: { username: DEMO_ACCOUNT.username, password: 'wrong' }
        })
        expect(res.status).toBe(401)
    })

    it('未携带令牌访问业务接口返回 401', () => {
        const res = handleMockRequest({ method: 'GET', url: '/api/user/list' })
        expect(res.status).toBe(401)
        expect(res.payload.msg).toContain('登录')
    })

    it('伪造令牌返回 401', () => {
        const res = handleMockRequest({ method: 'GET', url: '/api/user/list', headers: authed('mock-token-1-0') })
        expect(res.status).toBe(401)
    })

    it('登出后令牌立即失效', () => {
        const token = freshToken()
        handleMockRequest({ method: 'POST', url: '/api/admin/logout', headers: authed(token) })
        const res = handleMockRequest({ method: 'GET', url: '/api/user/list', headers: authed(token) })
        expect(res.status).toBe(401)
    })

    it('有效令牌可读列表', () => {
        const token = freshToken()
        const res = handleMockRequest({
            method: 'GET',
            url: '/api/user/list?page=1&pageSize=10',
            headers: authed(token)
        })
        expect(res.status).toBe(200)
        expect(res.payload.data.items).toHaveLength(5)
    })
})

describe('handleMockRequest 写权限与字段白名单', () => {
    beforeEach(() => resetMockDb())

    it('非院长角色写入被拒绝 403', () => {
        const token = freshToken()
        // 先把当前登录院长（id=1）降级为主任
        handleMockRequest({
            method: 'PUT',
            url: '/api/admin/update',
            headers: authed(token),
            body: { id: 1, status: 1 }
        })
        const res = handleMockRequest({
            method: 'POST',
            url: '/api/user/add',
            headers: authed(token),
            body: { username: '20999999', name: 'x' }
        })
        expect(res.status).toBe(403)
    })

    it('管理员更新只接受白名单字段，id 不可被改写', () => {
        const token = freshToken()
        const res = handleMockRequest({
            method: 'PUT',
            url: '/api/admin/update',
            headers: authed(token),
            body: { id: 2, name: '新名字', username: 'demo_director', status: 1, injected: 'x', className: 'y' }
        })
        expect(res.status).toBe(200)
        expect(res.payload.data.id).toBe(2)
        expect(res.payload.data.name).toBe('新名字')
        expect(res.payload.data).not.toHaveProperty('injected')
        expect(res.payload.data).not.toHaveProperty('className')
    })

    it('/admin/update 不会误改到用户表', () => {
        const token = freshToken()
        handleMockRequest({
            method: 'PUT',
            url: '/api/admin/update',
            headers: authed(token),
            body: { id: 1, name: '管理员一' }
        })
        const users = handleMockRequest({ method: 'GET', url: '/api/user/find/1', headers: authed(token) })
        expect(users.payload.data.name).toBe('张同学')
    })

    it('新增实验室时使用次数由服务端置 0', () => {
        const token = freshToken()
        const res = handleMockRequest({
            method: 'POST',
            url: '/api/laboratory/add',
            headers: authed(token),
            body: {
                laboratoryName: '新实验室',
                laboratoryLocation: 'A-1',
                laboratoryType: '教学',
                laboratoryCategory: 1,
                laboratoryCount: 9999
            }
        })
        expect(res.status).toBe(200)
        expect(res.payload.data.laboratoryCount).toBe(0)
    })

    it('未知接口返回 404 且提示路径', () => {
        const token = freshToken()
        const res = handleMockRequest({ method: 'GET', url: '/api/nope', headers: authed(token) })
        expect(res.status).toBe(404)
        expect(res.payload.msg).toContain('/nope')
    })
})
