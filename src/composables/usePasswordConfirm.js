/**
 * 密码 + 确认密码的表单校验规则。
 *
 * 新增时密码必填；编辑时留空表示不修改，此时也放行确认密码。
 * 两个管理页共用同一套规则，避免密码策略改一处漏一处。
 *
 * @param {Record<string, any>} formModel 包含 password 的响应式表单对象
 * @param {{ minLength?: number, passwordLabel?: string }} [options]
 */
export const usePasswordConfirm = (formModel, { minLength = 6, passwordLabel = '密码' } = {}) => {
    const validateConfirmPassword = (_rule, value, callback) => {
        if (!value) return callback(new Error('请再次输入密码'))
        if (value !== formModel.password) return callback(new Error('两次输入密码不一致'))
        callback()
    }

    const validateEditConfirmPassword = (_rule, value, callback) => {
        if (!formModel.password && !value) return callback()
        return validateConfirmPassword(_rule, value, callback)
    }

    const lengthRule = {
        min: minLength,
        message: `${passwordLabel}长度不能少于 ${minLength} 位`,
        trigger: 'blur'
    }

    return {
        addPasswordRules: [{ required: true, message: `请输入${passwordLabel}`, trigger: 'blur' }, lengthRule],
        addConfirmRules: [{ validator: validateConfirmPassword, trigger: 'blur' }],
        editPasswordRules: [lengthRule],
        editConfirmRules: [{ validator: validateEditConfirmPassword, trigger: 'blur' }]
    }
}
