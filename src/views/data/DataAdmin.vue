<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import {
    addAdminService,
    deleteAdminByIdsService,
    editAdminService,
    getAdminByIdService,
    getAdminListService
} from '@/api/data'
import { usePagedList } from '@/composables/usePagedList'
import { useCrudDrawer } from '@/composables/useCrudDrawer'
import { ADMIN_ROLES, roleName } from '@/constants/role'

const { rows, total, page, pageSize, loading, selection, load, refresh, onSelectionChange } =
    usePagedList(getAdminListService)

/* 只提交允许修改的字段，避免把 role/phone 等整包覆盖 */
const EDITABLE_FIELDS = ['id', 'username', 'name', 'status', 'phone']

const transform = (payload) => {
    const data = Object.fromEntries(
        EDITABLE_FIELDS.filter((key) => payload[key] !== undefined).map((key) => [key, payload[key]])
    )
    if (payload.password) data.password = payload.password
    return data
}

const { formModel, addDrawer, editDrawer, submitting, addFormRef, editFormRef, openAdd, openEdit, submit, remove } =
    useCrudDrawer({
        services: {
            add: addAdminService,
            update: editAdminService,
            remove: deleteAdminByIdsService,
            find: getAdminByIdService
        },
        refresh,
        defaults: () => ({ status: 0 }),
        onOpenEdit: (record) => Object.assign(record, { password: '', repassword: '' })
    })

const validateConfirmPassword = (_rule, value, callback) => {
    if (!value) return callback(new Error('请再次输入密码'))
    if (value !== formModel.password) return callback(new Error('两次输入密码不一致'))
    callback()
}

// 编辑时密码留空表示不修改，此时无需校验确认密码
const validateEditConfirmPassword = (_rule, value, callback) => {
    if (!formModel.password && !value) return callback()
    return validateConfirmPassword(_rule, value, callback)
}

const rules = {
    username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    status: [{ required: true, message: '请选择权限', trigger: 'change' }],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' }
    ],
    repassword: [{ validator: validateConfirmPassword, trigger: 'blur' }]
}

const editRules = {
    username: rules.username,
    name: rules.name,
    status: rules.status,
    password: [{ min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' }],
    repassword: [{ validator: validateEditConfirmPassword, trigger: 'blur' }]
}

const addAdmin = () => submit(addFormRef, 'add', { successMessage: '添加成功', drawer: addDrawer, transform })
const editAdmin = () => submit(editFormRef, 'update', { successMessage: '修改成功', drawer: editDrawer, transform })

const onDelete = async (ids) => {
    if (await remove(ids)) selection.value = []
}

load(1)
</script>

<template>
    <CrudTable
        v-model:page="page"
        :loading="loading"
        :page-size="pageSize"
        :rows="rows"
        :total="total"
        title="管理员信息管理"
        @refresh="load"
        @selection-change="onSelectionChange"
    >
        <template #toolbar>
            <el-button plain type="primary" @click="openAdd">管理员添加</el-button>
            <el-button :disabled="selection.length === 0" plain type="danger" @click="onDelete(selection)"
                >删除选中</el-button
            >
        </template>

        <el-table-column label="账号">
            <template #default="scope">
                <span>{{ scope.row.username }}</span>
            </template>
        </el-table-column>
        <el-table-column label="姓名">
            <template #default="scope">
                <span>{{ scope.row.name }}</span>
            </template>
        </el-table-column>
        <el-table-column label="管理权限">
            <template #default="scope">
                <span>{{ roleName(scope.row.status) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
            <template #default="scope">
                <el-button :icon="Edit" circle type="primary" @click="openEdit(scope.row.id)" />
                <el-button :icon="Delete" circle type="danger" @click="onDelete([scope.row.id])" />
            </template>
        </el-table-column>
    </CrudTable>

    <el-drawer v-model="addDrawer" direction="rtl" size="35%" title="添加管理员">
        <el-form ref="addFormRef" :model="formModel" :rules="rules" label-width="100px">
            <el-form-item label="账号" prop="username">
                <el-input v-model.trim="formModel.username" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model.trim="formModel.name" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="权限" prop="status">
                <el-select v-model="formModel.status" style="width: 100%">
                    <el-option v-for="role in ADMIN_ROLES" :key="role.id" :label="role.name" :value="role.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="formModel.password" placeholder="请输入密码" show-password type="password" />
            </el-form-item>
            <el-form-item label="确认密码" prop="repassword">
                <el-input v-model="formModel.repassword" placeholder="请再次输入密码" show-password type="password" />
            </el-form-item>
            <el-form-item>
                <el-button :loading="submitting" type="primary" @click="addAdmin">添加</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>

    <el-drawer v-model="editDrawer" direction="rtl" size="35%" title="编辑管理员">
        <el-form ref="editFormRef" :model="formModel" :rules="editRules" label-width="100px">
            <el-form-item label="账号" prop="username">
                <el-input v-model.trim="formModel.username" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model.trim="formModel.name" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="权限" prop="status">
                <el-select v-model="formModel.status" style="width: 100%">
                    <el-option v-for="role in ADMIN_ROLES" :key="role.id" :label="role.name" :value="role.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="formModel.password" placeholder="留空表示不修改密码" show-password type="password" />
            </el-form-item>
            <el-form-item label="确认密码" prop="repassword">
                <el-input
                    v-model="formModel.repassword"
                    placeholder="留空表示不修改密码"
                    show-password
                    type="password"
                />
            </el-form-item>
            <el-form-item>
                <el-button :loading="submitting" type="primary" @click="editAdmin">修改</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>
