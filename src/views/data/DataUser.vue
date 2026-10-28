<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import {
    addUserService,
    deleteUserByIdsService,
    editUserService,
    getUserByIdService,
    getUserListService
} from '@/api/user'
import { usePagedList } from '@/composables/usePagedList'
import { useCrudDrawer } from '@/composables/useCrudDrawer'
import { usePasswordConfirm } from '@/composables/usePasswordConfirm'
import { POSITIONS, positionName } from '@/constants/role'
import {
    ACTION_COLUMN_WIDTH,
    COUNT_COLUMN_WIDTH,
    DRAWER_SIZE,
    NAME_COLUMN_WIDTH,
    USERNAME_COLUMN_WIDTH
} from '@/constants/ui'

const { rows, total, page, pageSize, loading, selection, load, refresh, onSelectionChange } =
    usePagedList(getUserListService)

/* 密码字段只在新增/修改密码时提交，避免整包回填 */
const EDITABLE_FIELDS = ['id', 'username', 'name', 'positionStatus', 'className']

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
            add: addUserService,
            update: editUserService,
            remove: deleteUserByIdsService,
            find: getUserByIdService
        },
        refresh,
        defaults: () => ({ positionStatus: 0 }),
        // 密码不回填，留空表示不修改
        editDefaults: () => ({ password: '', repassword: '' })
    })

const { addPasswordRules, addConfirmRules, editPasswordRules, editConfirmRules } = usePasswordConfirm(formModel)

const rules = {
    username: [{ required: true, message: '请输入学号(工号)', trigger: 'blur' }],
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    positionStatus: [{ required: true, message: '请选择职位', trigger: 'change' }],
    password: addPasswordRules,
    repassword: addConfirmRules
}

const editRules = {
    username: rules.username,
    name: rules.name,
    positionStatus: rules.positionStatus,
    password: editPasswordRules,
    repassword: editConfirmRules
}

const addUser = () => submit(addFormRef, 'add', { successMessage: '添加成功', drawer: addDrawer, transform })
const editUser = () => submit(editFormRef, 'update', { successMessage: '修改成功', drawer: editDrawer, transform })

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
        title="用户信息管理"
        @refresh="load"
        @selection-change="onSelectionChange"
    >
        <template #toolbar>
            <el-button plain type="primary" @click="openAdd">用户添加</el-button>
            <el-button :disabled="selection.length === 0" plain type="danger" @click="onDelete(selection)"
                >删除选中</el-button
            >
        </template>

        <el-table-column label="学号(工号)" :width="USERNAME_COLUMN_WIDTH">
            <template #default="scope">
                <span>{{ scope.row.username }}</span>
            </template>
        </el-table-column>
        <el-table-column label="姓名" :width="NAME_COLUMN_WIDTH">
            <template #default="scope">
                <span>{{ scope.row.name }}</span>
            </template>
        </el-table-column>
        <el-table-column label="职位" :width="NAME_COLUMN_WIDTH">
            <template #default="scope">
                <span>{{ positionName(scope.row.positionStatus) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="专业班级">
            <template #default="scope">
                <span>{{ scope.row.className }}</span>
            </template>
        </el-table-column>
        <el-table-column label="违规次数" :width="COUNT_COLUMN_WIDTH">
            <template #default="scope">
                <div class="violation">
                    <span>{{ scope.row.violationCount ?? 0 }}</span>
                    <el-tag v-if="scope.row.violationStatus === 1" effect="dark" type="danger">现有违规</el-tag>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="操作" :width="ACTION_COLUMN_WIDTH">
            <template #default="scope">
                <el-button :icon="Edit" circle type="primary" @click="openEdit(scope.row.id)" />
                <el-button :icon="Delete" circle type="danger" @click="onDelete([scope.row.id])" />
            </template>
        </el-table-column>
    </CrudTable>

    <el-drawer v-model="addDrawer" direction="rtl" :size="DRAWER_SIZE" title="添加用户">
        <el-form ref="addFormRef" :model="formModel" :rules="rules" label-width="100px">
            <el-form-item label="学号(工号)" prop="username">
                <el-input v-model.trim="formModel.username" placeholder="请输入学号(工号)" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model.trim="formModel.name" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="职位" prop="positionStatus">
                <el-select v-model="formModel.positionStatus" style="width: 100%">
                    <el-option v-for="item in POSITIONS" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="专业班级" prop="className">
                <el-input v-model.trim="formModel.className" placeholder="请输入专业班级" />
            </el-form-item>
            <PasswordFormItems v-model:password="formModel.password" v-model:repassword="formModel.repassword" />
            <el-form-item>
                <el-button :loading="submitting" type="primary" @click="addUser">添加</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>

    <el-drawer v-model="editDrawer" direction="rtl" :size="DRAWER_SIZE" title="编辑用户">
        <el-form ref="editFormRef" :model="formModel" :rules="editRules" label-width="100px">
            <el-form-item label="学号(工号)" prop="username">
                <el-input v-model.trim="formModel.username" placeholder="请输入学号(工号)" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model.trim="formModel.name" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="职位" prop="positionStatus">
                <el-select v-model="formModel.positionStatus" style="width: 100%">
                    <el-option v-for="item in POSITIONS" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="专业班级" prop="className">
                <el-input v-model.trim="formModel.className" placeholder="请输入专业班级" />
            </el-form-item>
            <PasswordFormItems v-model:password="formModel.password" v-model:repassword="formModel.repassword" edit />
            <el-form-item>
                <el-button :loading="submitting" type="primary" @click="editUser">修改</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<style scoped>
.violation {
    display: flex;
    align-items: center;
    gap: 15px;
}
</style>
