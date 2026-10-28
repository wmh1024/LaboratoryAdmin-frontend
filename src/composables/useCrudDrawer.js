import { nextTick, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { unwrapData } from '@/api/common'

/**
 * 抽屉式增改表单的通用逻辑（配合 CrudTable 使用）。
 *
 * 统一处理：新增/编辑的打开与回填、提交中状态、删除确认、成功后刷新列表。
 * 错误提示统一交给 request.js 的响应拦截器，这里只负责状态复位。
 *
 * @param {{
 *   services: { add: Function, update: Function, remove: Function, find?: Function },
 *   refresh: () => Promise<unknown>,
 *   defaults?: () => Record<string, any>,
 *   editDefaults?: (record: any) => Record<string, any>,
 *   onOpenEdit?: (record: any) => void
 * }} options
 */
export const useCrudDrawer = ({ services, refresh, defaults = () => ({}), editDefaults = () => ({}), onOpenEdit }) => {
    const formModel = reactive({})
    const addDrawer = ref(false)
    const editDrawer = ref(false)
    const submitting = ref(false)
    const addFormRef = ref()
    const editFormRef = ref()

    /** 清空表单并回填默认值（整体替换字段，避免残留脏数据） */
    const resetForm = (initial = {}) => {
        Object.keys(formModel).forEach((key) => delete formModel[key])
        Object.assign(formModel, initial)
    }

    const openAdd = async () => {
        resetForm(defaults())
        addDrawer.value = true
        // 抽屉内容在下一帧才挂载，此时才能拿到 el-form 实例
        await nextTick()
        addFormRef.value?.clearValidate()
    }

    const openEdit = async (id) => {
        try {
            // services.find 走 axios，返回的是响应壳；这里统一解包成业务记录
            const record = services.find ? unwrapData(await services.find(id)) : null
            if (!record) return
            // 先回填记录，再叠加编辑态默认值（例如清空只写的密码字段）
            resetForm({ ...record, ...editDefaults(record) })
            onOpenEdit?.(record)
            editDrawer.value = true
            await nextTick()
            editFormRef.value?.clearValidate()
        } catch {
            // 错误提示由请求拦截器统一处理
        }
    }

    /**
     * 提交表单
     * @param {import('vue').Ref} formRef 当前抽屉的表单实例
     * @param {'add'|'update'} action
     * @param {{ successMessage: string, drawer: import('vue').Ref<boolean>, transform?: (payload: any) => any }} options
     */
    const submit = async (formRef, action, { successMessage, drawer, transform }) => {
        if (submitting.value) return
        const valid = await formRef.value?.validate().catch(() => false)
        if (!valid) return
        submitting.value = true
        try {
            const payload = transform ? transform({ ...formModel }) : { ...formModel }
            await services[action](payload)
            ElMessage.success(successMessage)
            drawer.value = false
            await refresh()
        } catch {
            // 错误提示由请求拦截器统一处理
        } finally {
            submitting.value = false
        }
    }

    /** 删除：confirm 取消不抛异常，成功后才刷新 */
    const remove = async (ids) => {
        try {
            await ElMessageBox.confirm('你确认要删除吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            })
        } catch {
            return false
        }
        try {
            await services.remove(ids)
            ElMessage.success('删除成功')
            await refresh()
            return true
        } catch {
            return false
        }
    }

    return {
        formModel,
        addDrawer,
        editDrawer,
        submitting,
        addFormRef,
        editFormRef,
        resetForm,
        openAdd,
        openEdit,
        submit,
        remove
    }
}
