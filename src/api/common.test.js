import { describe, expect, it } from 'vitest'
import { DICT_PAGE_SIZE, List2String, idsParams, pageParams, toPageResult, unwrapData } from './common'

describe('List2String', () => {
    it('把数组拼成逗号分隔字符串', () => {
        expect(List2String([1, 2, 3])).toBe('1,2,3')
    })

    it('非数组一律返回空串', () => {
        expect(List2String(null)).toBe('')
        expect(List2String(undefined)).toBe('')
        expect(List2String('1,2')).toBe('')
    })
})

describe('pageParams', () => {
    it('默认每页 10 条', () => {
        expect(pageParams(2)).toEqual({ page: 2, pageSize: 10 })
    })

    it('可显式指定每页条数', () => {
        expect(pageParams(1, DICT_PAGE_SIZE)).toEqual({ page: 1, pageSize: 50 })
    })
})

describe('idsParams', () => {
    it('批量删除参数为逗号分隔字符串', () => {
        expect(idsParams([4, 5])).toEqual({ ids: '4,5' })
    })

    it('空选择时传空串', () => {
        expect(idsParams([])).toEqual({ ids: '' })
    })
})

describe('unwrapData', () => {
    it('取出 {code,msg,data} 中的 data', () => {
        expect(unwrapData({ data: { code: 200, data: { id: 1 } } })).toEqual({ id: 1 })
    })
})

describe('toPageResult', () => {
    it('规范化 {items, counts}', () => {
        expect(toPageResult({ data: { data: { items: [1, 2], counts: 9 } } })).toEqual({ items: [1, 2], counts: 9 })
    })

    it('兼容后端直接返回裸数组', () => {
        expect(toPageResult({ data: { data: [1, 2, 3] } })).toEqual({ items: [1, 2, 3], counts: 3 })
    })

    it('data 为 null 时不抛异常', () => {
        expect(toPageResult({ data: { data: null } })).toEqual({ items: [], counts: 0 })
    })

    it('响应缺失时不抛异常', () => {
        expect(toPageResult(undefined)).toEqual({ items: [], counts: 0 })
    })

    it('items 缺失时退化为空数组', () => {
        expect(toPageResult({ data: { data: { counts: 5 } } })).toEqual({ items: [], counts: 5 })
    })
})
