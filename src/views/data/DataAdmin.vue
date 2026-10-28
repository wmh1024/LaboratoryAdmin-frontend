<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import {
    addAdminService,
    deleteAdminByIdsService,
    editAdminService,
    getAdminByIdService,
    getAdminListService
} from '@/api/admin'
import { usePagedList } from '@/composables/usePagedList'
import { useCrudDrawer } from '@/composables/useCrudDrawer'
import { usePasswordConfirm } from '@/composables/usePasswordConfirm'
import { ADMIN_ROLES, roleName } from '@/constants/role'
import { ACTION_COLUMN_WIDTH, DRAWER_SIZE } from '@/constants/ui'

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
        // 密码不回填，留空表示不修改
        editDefaults: () => ({ password: '', repassword: '' })
    })

const { addPasswordRules, addConfirmRules, editPasswordRules, editConfirmRules } = usePasswordConfirm(formModel)

const rules = {
    username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    status: [{ required: true, message: '请选择权限', trigger: 'change' }],
    password: addPasswordRules,
    repassword: addConfirmRules
}

const editRules = {
    username: rules.username,
    name: rules.name,
    status: rules.status,
    password: editPasswordRules,
    repassword: editConfirmRules
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
        <el-table-column label="操作" :width="ACTION_COLUMN_WIDTH">
            <template #default="scope">
                <el-button :icon="Edit" circle type="primary" @click="openEdit(scope.row.id)" />
                <el-button :icon="Delete" circle type="danger" @click="onDelete([scope.row.id])" />
            </template>
        </el-table-column>
    </CrudTable>

    <el-drawer v-model="addDrawer" direction="rtl" :size="DRAWER_SIZE" title="添加管理员">
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
            <PasswordFormItems v-model:password="formModel.password" v-model:repassword="formModel.repassword" />
            <el-form-item>
                <el-button :loading="submitting" type="primary" @click="addAdmin">添加</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>

    <el-drawer v-model="editDrawer" direction="rtl" :size="DRAWER_SIZE" title="编辑管理员">
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
            <PasswordFormItems v-model:password="formModel.password" v-model:repassword="formModel.repassword" edit />
            <el-form-item>
                <el-button :loading="submitting" type="primary" @click="editAdmin">修改</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>
