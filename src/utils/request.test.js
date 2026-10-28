import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockAdapter } from '@/mock/browser'
import { resetMockDb } from '@/mock/server'
import { useUserStore } from '@/stores'
import router from '@/router'
import request from './request'

describe('request 401 语义', () => {
    beforeEach(() => {
        resetMockDb()
        setActivePinia(createPinia())
        request.defaults.adapter = createMockAdapter()
        vi.spyOn(router, 'push').mockResolvedValue()
    })

    it('Mock 网络层 401 会清理 token 并跳转登录页', async () => {
        const store = useUserStore()
        store.setToken('mock-token-1-0')

        await expect(request.get('/user/list')).rejects.toBeTruthy()

        expect(store.token).toBe('')
        expect(router.push).toHaveBeenCalledWith('/login')
    })

    it('HTTP 200 + 业务码 401 同样清理登录态', async () => {
        const store = useUserStore()
        store.setToken('some-token')
        request.defaults.adapter = async (config) => ({
            data: { code: 401, msg: '登录已过期', data: null },
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            request: {}
        })

        await expect(request.get('/user/list')).rejects.toMatchObject({ code: 401 })

        expect(store.token).toBe('')
        expect(router.push).toHaveBeenCalledWith('/login')
    })
})
