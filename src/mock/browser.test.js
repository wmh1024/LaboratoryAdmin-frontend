import { beforeEach, describe, expect, it } from 'vitest'
import { createMockAdapter } from './browser'
import { DEMO_ACCOUNT, resetMockDb } from './server'

const adapter = createMockAdapter()

/** 模拟 axios 传入的 config */
const call = (config) => adapter({ baseURL: '/api', method: 'get', headers: {}, ...config })

describe('createMockAdapter', () => {
    beforeEach(() => resetMockDb())

    it('把 axios params 拼进 query（分页参数不丢失）', async () => {
        const login = await call({ url: '/admin/login', method: 'post', data: { ...DEMO_ACCOUNT } })
        const token = login.data.data.token
        const res = await call({
            url: '/user/list',
            headers: { Authorization: `Bearer ${token}` },
            params: { page: 2, pageSize: 2 }
        })
        expect(res.status).toBe(200)
        expect(res.data.data.items).toHaveLength(2)
        expect(res.data.data.counts).toBe(5)
    })

    it('把 Authorization 头透传给 Mock 鉴权', async () => {
        await expect(call({ url: '/user/list' })).rejects.toMatchObject({ response: { status: 401 } })

        const login = await call({ url: '/admin/login', method: 'post', data: { ...DEMO_ACCOUNT } })
        const res = await call({
            url: '/user/list',
            headers: { Authorization: `Bearer ${login.data.data.token}` }
        })
        expect(res.status).toBe(200)
    })

    it('HTTP >= 400 时按 axios 语义 reject，并保留 response.status', async () => {
        await expect(
            call({ url: '/lab/category/list', headers: { Authorization: 'Bearer bad' } })
        ).rejects.toMatchObject({
            response: {
                status: 401,
                statusText: 'Error',
                data: { code: 401 }
            }
        })
    })

    it('成功响应仍返回与 axios response 兼容的结构', async () => {
        const res = await call({ url: '/admin/login', method: 'post', data: { ...DEMO_ACCOUNT } })
        expect(res).toMatchObject({ status: 200, statusText: 'OK' })
        expect(res).toHaveProperty('data')
        expect(res).toHaveProperty('config')
    })
})
