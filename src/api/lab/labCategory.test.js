import { beforeEach, describe, expect, it, vi } from 'vitest'

const { get } = vi.hoisted(() => ({ get: vi.fn() }))

vi.mock('@/utils/request', () => ({ default: { get } }))

const { getLabCategoryDictService, getLabCategoryListService } = await import('./labCategory')

const pageReply = (items, counts) => ({ data: { code: 200, msg: '操作成功', data: { items, counts } } })

describe('labCategory services', () => {
    beforeEach(() => {
        get.mockReset()
    })

    it('列表 service 透传 page/pageSize', async () => {
        get.mockResolvedValue(pageReply([], 0))
        await getLabCategoryListService(2, 10)
        expect(get).toHaveBeenCalledWith('/lab/category/list', { params: { page: 2, pageSize: 10 } })
    })

    it('字典 service 在总数超过单页上限时自动补齐剩余页', async () => {
        get.mockImplementation((_url, { params }) => {
            const { page, pageSize } = params
            const start = (page - 1) * pageSize
            const length = Math.max(Math.min(pageSize, 250 - start), 0)
            const items = Array.from({ length }, (_, index) => ({ id: start + index + 1 }))
            return Promise.resolve(pageReply(items, 250))
        })

        const res = await getLabCategoryDictService()
        const { items, counts } = res.data.data

        expect(get).toHaveBeenCalledTimes(5)
        expect(get).toHaveBeenNthCalledWith(1, '/lab/category/list', { params: { page: 1, pageSize: 50 } })
        expect(get).toHaveBeenNthCalledWith(5, '/lab/category/list', { params: { page: 5, pageSize: 50 } })
        expect(items).toHaveLength(250)
        expect(counts).toBe(250)
    })

    it('字典 service 只有一页时只请求一次', async () => {
        get.mockResolvedValue(pageReply([{ id: 1 }], 1))
        const res = await getLabCategoryDictService()
        expect(get).toHaveBeenCalledTimes(1)
        expect(res.data.data.items).toEqual([{ id: 1 }])
    })
})
