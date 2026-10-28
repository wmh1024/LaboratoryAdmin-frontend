<script setup>
/**
 * 密码 / 确认密码表单项（新增与编辑共用）。
 *
 * 通过 `edit` 切换占位提示；校验规则由 usePasswordConfirm 提供。
 */
defineProps({
    edit: { type: Boolean, default: false }
})

const password = defineModel('password', { type: String, default: '' })
const repassword = defineModel('repassword', { type: String, default: '' })
</script>

<template>
    <el-form-item label="密码" prop="password">
        <el-input
            v-model="password"
            :placeholder="edit ? '留空表示不修改密码' : '请输入密码'"
            show-password
            type="password"
        />
    </el-form-item>
    <el-form-item label="确认密码" prop="repassword">
        <el-input
            v-model="repassword"
            :placeholder="edit ? '留空表示不修改密码' : '请再次输入密码'"
            show-password
            type="password"
        />
    </el-form-item>
</template>
