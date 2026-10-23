import { describe, expect, it, vi } from 'vitest'
import { usePagedList } from './usePagedList'

const reply = (items, counts) => ({ data: { code: 200, data: { items, counts } } })

describe('usePagedList', () => {
    it('加载第一页并规范化 total', async () => {
        const fetcher = vi.fn().mockResolvedValue(reply([{ id: 1 }], 1))
        const list = usePagedList(fetcher)
        await list.load(1)
        expect(list.rows.value).toEqual([{ id: 1 }])
        expect(list.total.value).toBe(1)
        expect(list.page.value).toBe(1)
        expect(list.loading.value).toBe(false)
        expect(fetcher).toHaveBeenCalledWith(1, 10)
    })

    it('删除后当前页为空时自动回退上一页', async () => {
        const fetcher = vi
            .fn()
            .mockResolvedValueOnce(reply([], 1)) // 第 2 页已空
            .mockResolvedValueOnce(reply([{ id: 2 }], 1)) // 回退到第 1 页
        const list = usePagedList(fetcher)
        await list.load(2)
        expect(fetcher).toHaveBeenNthCalledWith(1, 2, 10)
        expect(fetcher).toHaveBeenNthCalledWith(2, 1, 10)
        expect(list.page.value).toBe(1)
        expect(list.rows.value).toEqual([{ id: 2 }])
        expect(list.loading.value).toBe(false)
    })

    it('并发请求只采用最后一次的结果', async () => {
        let resolveSlow
        const slow = new Promise((resolve) => {
            resolveSlow = resolve
        })
        const fetcher = vi
            .fn()
            .mockReturnValueOnce(slow)
            .mockResolvedValueOnce(reply([{ id: 'new' }], 5))
        const list = usePagedList(fetcher)
        const slowPromise = list.load(1)
        await list.load(2)
        resolveSlow(reply([{ id: 'old' }], 5))
        await slowPromise
        expect(list.rows.value).toEqual([{ id: 'new' }])
        expect(list.page.value).toBe(2)
    })

    it('请求失败时复位 loading 且不抛异常', async () => {
        const fetcher = vi.fn().mockRejectedValue(new Error('boom'))
        const onError = vi.fn()
        const list = usePagedList(fetcher, { onError })
        await expect(list.load(1)).resolves.toBeUndefined()
        expect(onError).toHaveBeenCalled()
        expect(list.loading.value).toBe(false)
        expect(list.rows.value).toEqual([])
    })

    it('选择变化时只保留 id', async () => {
        const list = usePagedList(vi.fn().mockResolvedValue(reply([], 0)))
        list.onSelectionChange([{ id: 3 }, { id: 7 }])
        expect(list.selection.value).toEqual([3, 7])
    })
})
