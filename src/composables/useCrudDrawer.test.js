import { describe, expect, it, vi } from 'vitest'
import { useCrudDrawer } from './useCrudDrawer'

const reply = (record) => ({ data: { code: 200, msg: '操作成功', data: record } })

describe('useCrudDrawer.openEdit', () => {
    it('解包 axios 响应并回填业务字段', async () => {
        const record = { id: 1, username: '20990101', name: '张同学' }
        const drawer = useCrudDrawer({
            services: { find: vi.fn().mockResolvedValue(reply(record)) },
            refresh: vi.fn()
        })

        await drawer.openEdit(record.id)

        expect(drawer.formModel).toMatchObject(record)
        expect(drawer.formModel).not.toHaveProperty('status')
        expect(drawer.editDrawer.value).toBe(true)
    })

    it('先回填记录再应用 editDefaults，密码字段被清空', async () => {
        const record = { id: 2, username: 'demo_admin', name: '演示管理员' }
        const onOpenEdit = vi.fn()
        const drawer = useCrudDrawer({
            services: { find: vi.fn().mockResolvedValue(reply(record)) },
            refresh: vi.fn(),
            editDefaults: () => ({ password: '', repassword: '' }),
            onOpenEdit
        })

        await drawer.openEdit(record.id)

        expect(drawer.formModel).toEqual({ ...record, password: '', repassword: '' })
        expect(onOpenEdit).toHaveBeenCalledWith(record)
    })

    it('详情不存在时不打开抽屉', async () => {
        const drawer = useCrudDrawer({
            services: { find: vi.fn().mockResolvedValue(reply(null)) },
            refresh: vi.fn()
        })

        await drawer.openEdit(999)

        expect(drawer.editDrawer.value).toBe(false)
    })
})
