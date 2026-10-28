import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CrudTable from './CrudTable.vue'

const mountTable = (props) =>
    mount(CrudTable, {
        props: { title: '测试列表', rows: [{ id: 1 }], ...props }
    })

describe('CrudTable.vue', () => {
    it('总数超过一页时渲染分页器', () => {
        const wrapper = mountTable({ total: 25, pageSize: 10 })
        expect(wrapper.find('.el-pagination').exists()).toBe(true)
        wrapper.unmount()
    })

    it('总数不超过一页时不渲染分页器', () => {
        const wrapper = mountTable({ total: 3, pageSize: 10 })
        expect(wrapper.find('.el-pagination').exists()).toBe(false)
        wrapper.unmount()
    })

    it('点击下一页时向上抛出 refresh', async () => {
        const wrapper = mountTable({ total: 25, pageSize: 10, page: 1 })
        const next = wrapper.find('.btn-next')
        expect(next.exists()).toBe(true)
        await next.trigger('click')
        expect(wrapper.emitted('refresh')?.[0]).toEqual([2])
        wrapper.unmount()
    })
})
