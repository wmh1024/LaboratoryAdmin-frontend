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

    it('缺少必填字段时返回 400', () => {
        const token = freshToken()
        const res = handleMockRequest({
            method: 'POST',
            url: '/api/laboratory/add',
            headers: authed(token),
            body: { laboratoryName: '只有名称' }
        })
        expect(res.status).toBe(400)
        expect(res.payload.msg).toContain('缺少必填字段')
    })

    it('批量删除缺少 ids 时返回 400', () => {
        const token = freshToken()
        const res = handleMockRequest({ method: 'DELETE', url: '/api/user/delete', headers: authed(token) })
        expect(res.status).toBe(400)
        expect(res.payload.msg).toContain('请选择要删除的数据')
    })

    it('未知接口返回 404 且提示路径', () => {
        const token = freshToken()
        const res = handleMockRequest({ method: 'GET', url: '/api/nope', headers: authed(token) })
        expect(res.status).toBe(404)
        expect(res.payload.msg).toContain('/nope')
    })
})

describe('handleMockRequest 契约一致性', () => {
    beforeEach(() => resetMockDb())

    it('实验室详情统一使用 /laboratory/find/{id}，旧拼写不再兼容', () => {
        const token = freshToken()
        const found = handleMockRequest({ method: 'GET', url: '/api/laboratory/find/1', headers: authed(token) })
        expect(found.status).toBe(200)
        expect(found.payload.data.laboratoryName).toBe('电子电路实验室')

        const legacy = handleMockRequest({ method: 'GET', url: '/api/laboratory/findl/1', headers: authed(token) })
        expect(legacy.status).toBe(404)
    })

    it('用户列表、详情与新增响应都不包含密码', () => {
        const token = freshToken()
        const added = handleMockRequest({
            method: 'POST',
            url: '/api/user/add',
            headers: authed(token),
            body: {
                username: '20999999',
                name: '测试用户',
                positionStatus: 0,
                className: '测试班级',
                password: '123456',
                violationCount: 99,
                violationStatus: 1
            }
        })
        expect(added.status).toBe(200)
        expect(added.payload.data).not.toHaveProperty('password')
        expect(added.payload.data.violationCount).toBe(0)
        expect(added.payload.data.violationStatus).toBe(0)

        const list = handleMockRequest({ method: 'GET', url: '/api/user/list', headers: authed(token) })
        expect(list.payload.data.items.every((item) => !('password' in item))).toBe(true)

        const detail = handleMockRequest({
            method: 'GET',
            url: `/api/user/find/${added.payload.data.id}`,
            headers: authed(token)
        })
        expect(detail.payload.data).not.toHaveProperty('password')
    })

    it('管理员响应不包含密码', () => {
        const token = freshToken()
        const added = handleMockRequest({
            method: 'POST',
            url: '/api/admin/add',
            headers: authed(token),
            body: { username: 'demo_new', name: '新管理员', status: 1, password: '123456' }
        })
        expect(added.status).toBe(200)
        expect(added.payload.data).not.toHaveProperty('password')

        const list = handleMockRequest({ method: 'GET', url: '/api/admin/list', headers: authed(token) })
        expect(list.payload.data.items.every((item) => !('password' in item))).toBe(true)
    })

    it('账号重复或密码过短时返回 400', () => {
        const token = freshToken()
        const duplicate = handleMockRequest({
            method: 'POST',
            url: '/api/admin/add',
            headers: authed(token),
            body: { username: 'demo_admin', name: '重复账号', status: 1, password: '123456' }
        })
        expect(duplicate.status).toBe(400)

        const shortPassword = handleMockRequest({
            method: 'POST',
            url: '/api/admin/add',
            headers: authed(token),
            body: { username: 'demo_short', name: '短密码', status: 1, password: '123' }
        })
        expect(shortPassword.status).toBe(400)
        expect(shortPassword.payload.msg).toContain('密码长度')
    })
})
