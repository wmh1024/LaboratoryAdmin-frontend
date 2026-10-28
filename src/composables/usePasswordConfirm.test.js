import { describe, expect, it, vi } from 'vitest'
import { usePasswordConfirm } from './usePasswordConfirm'

const runValidator = (validator, value) => {
    const callback = vi.fn()
    validator({}, value, callback)
    return callback
}

describe('usePasswordConfirm', () => {
    it('新增时确认密码必填且必须一致', () => {
        const formModel = { password: '123456' }
        const { addConfirmRules } = usePasswordConfirm(formModel)
        const validator = addConfirmRules[0].validator

        expect(runValidator(validator, '').mock.calls[0][0].message).toBe('请再次输入密码')
        expect(runValidator(validator, '654321').mock.calls[0][0].message).toBe('两次输入密码不一致')
        expect(runValidator(validator, '123456').mock.calls[0]).toEqual([])
    })

    it('编辑时密码留空则放行确认密码', () => {
        const formModel = { password: '' }
        const { editConfirmRules } = usePasswordConfirm(formModel)
        const callback = runValidator(editConfirmRules[0].validator, '')
        expect(callback).toHaveBeenCalledWith()
    })

    it('编辑时填写了密码仍要求确认一致', () => {
        const formModel = { password: 'abcdef' }
        const { editConfirmRules } = usePasswordConfirm(formModel)
        const validator = editConfirmRules[0].validator

        expect(runValidator(validator, '').mock.calls[0][0].message).toBe('请再次输入密码')
        expect(runValidator(validator, 'abcdef').mock.calls[0]).toEqual([])
    })

    it('新增密码规则包含必填与最短长度', () => {
        const { addPasswordRules } = usePasswordConfirm({})
        expect(addPasswordRules[0].required).toBe(true)
        expect(addPasswordRules[1]).toMatchObject({ min: 6 })
    })
})
