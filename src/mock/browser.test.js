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
        const noToken = await call({ url: '/user/list' })
        expect(noToken.status).toBe(401)

        const login = await call({ url: '/admin/login', method: 'post', data: { ...DEMO_ACCOUNT } })
        const res = await call({
            url: '/user/list',
            headers: { Authorization: `Bearer ${login.data.data.token}` }
        })
        expect(res.status).toBe(200)
    })

    it('返回体结构与 axios response 兼容', async () => {
        const res = await call({ url: '/lab/category/list', headers: { Authorization: 'Bearer bad' } })
        expect(res).toMatchObject({ status: 401, statusText: 'Error' })
        expect(res).toHaveProperty('data')
        expect(res).toHaveProperty('config')
    })
})
