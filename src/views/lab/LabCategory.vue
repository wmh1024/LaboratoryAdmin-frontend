<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import {
    addLabCategoryService,
    deleteLabCategoryByIdsService,
    editLabCategoryService,
    getLabCategoryByIdService,
    getLabCategoryListService
} from '@/api/lab/labCategory'
import { usePagedList } from '@/composables/usePagedList'
import { useCrudDrawer } from '@/composables/useCrudDrawer'
import { ACTION_COLUMN_WIDTH, DRAWER_SIZE } from '@/constants/ui'
import { ADMIN_ROLES, roleName } from '@/constants/role'

const { rows, total, page, pageSize, loading, selection, load, refresh, onSelectionChange } =
    usePagedList(getLabCategoryListService)

const EDITABLE_FIELDS = ['id', 'categoryName', 'categoryStatus']
const transform = (payload) =>
    Object.fromEntries(EDITABLE_FIELDS.filter((key) => payload[key] !== undefined).map((key) => [key, payload[key]]))

const { formModel, addDrawer, editDrawer, submitting, addFormRef, editFormRef, openAdd, openEdit, submit, remove } =
    useCrudDrawer({
        services: {
            add: addLabCategoryService,
            update: editLabCategoryService,
            remove: deleteLabCategoryByIdsService,
            find: getLabCategoryByIdService
        },
        refresh
    })

const rules = {
    categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
    categoryStatus: [{ required: true, message: '请选择类别权限', trigger: 'change' }]
}

const addLabCategory = () => submit(addFormRef, 'add', { successMessage: '添加成功', drawer: addDrawer, transform })
const editLabCategory = () =>
    submit(editFormRef, 'update', { successMessage: '修改成功', drawer: editDrawer, transform })

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
        title="实验室类别"
        @refresh="load"
        @selection-change="onSelectionChange"
    >
        <template #toolbar>
            <el-button plain type="primary" @click="openAdd">类别添加</el-button>
            <el-button :disabled="selection.length === 0" plain type="danger" @click="onDelete(selection)"
                >删除选中</el-button
            >
        </template>

        <el-table-column label="分类名称">
            <template #default="scope">
                <span>{{ scope.row.categoryName }}</span>
            </template>
        </el-table-column>
        <el-table-column label="类别权限">
            <template #default="scope">
                <span>{{ roleName(scope.row.categoryStatus) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" :width="ACTION_COLUMN_WIDTH">
            <template #default="scope">
                <el-button :icon="Edit" circle type="primary" @click="openEdit(scope.row.id)" />
                <el-button :icon="Delete" circle type="danger" @click="onDelete([scope.row.id])" />
            </template>
        </el-table-column>
    </CrudTable>

    <el-drawer v-model="addDrawer" direction="rtl" :size="DRAWER_SIZE" title="添加分类">
        <el-form ref="addFormRef" :model="formModel" :rules="rules" label-width="100px">
            <el-form-item label="分类名称" prop="categoryName">
                <el-input v-model.trim="formModel.categoryName" placeholder="请输入分类名称" />
            </el-form-item>
            <el-form-item label="权限" prop="categoryStatus">
                <el-select v-model="formModel.categoryStatus" style="width: 100%">
                    <el-option v-for="role in ADMIN_ROLES" :key="role.id" :label="role.name" :value="role.id" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button :loading="submitting" type="primary" @click="addLabCategory">添加</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>

    <el-drawer v-model="editDrawer" direction="rtl" :size="DRAWER_SIZE" title="编辑分类">
        <el-form ref="editFormRef" :model="formModel" :rules="rules" label-width="100px">
            <el-form-item label="分类名称" prop="categoryName">
                <el-input v-model.trim="formModel.categoryName" placeholder="请输入分类名称" />
            </el-form-item>
            <el-form-item label="权限" prop="categoryStatus">
                <el-select v-model="formModel.categoryStatus" style="width: 100%">
                    <el-option v-for="role in ADMIN_ROLES" :key="role.id" :label="role.name" :value="role.id" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button :loading="submitting" type="primary" @click="editLabCategory">修改</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>
