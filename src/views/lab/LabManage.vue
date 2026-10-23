<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { addLabService, deleteLabByIdsService, editLabService, getLabByIdService, getLabListService } from '@/api/lab/LabManage'
import { getLabCategoryListService } from '@/api/lab/labCategory'
import { getAdminListService } from '@/api/data'
import { toPageResult } from '@/api/common'
import { usePagedList } from '@/composables/usePagedList'
import { useCrudDrawer } from '@/composables/useCrudDrawer'

const { rows, total, page, pageSize, loading, selection, load, refresh, onSelectionChange } = usePagedList(getLabListService)

const categoryList = ref([])
const adminList = ref([])

const categoryName = (id) => categoryList.value.find((item) => item.id === id)?.categoryName || '-'
const adminName = (id) => adminList.value.find((item) => item.id === id)?.name || '-'

const loadDictionaries = async () => {
    try {
        // 并行拉取两个字典，任一失败不影响列表展示
        const [categoryRes, adminRes] = await Promise.allSettled([getLabCategoryListService(), getAdminListService(1)])
        if (categoryRes.status === 'fulfilled') categoryList.value = toPageResult(categoryRes.value).items
        if (adminRes.status === 'fulfilled') adminList.value = toPageResult(adminRes.value).items
    } catch {
        // 错误提示由请求拦截器统一处理
    }
}

/* 使用次数等统计数据不由客户端提交 */
const EDITABLE_FIELDS = ['id', 'laboratoryName', 'laboratoryLocation', 'laboratoryType', 'laboratoryCategory', 'laboratoryDirectorId', 'laboratoryHeadId']

const transform = (payload) =>
    Object.fromEntries(EDITABLE_FIELDS.filter((key) => payload[key] !== undefined).map((key) => [key, payload[key]]))

const { formModel, addDrawer, editDrawer, submitting, addFormRef, editFormRef, openAdd, openEdit, submit, remove } =
    useCrudDrawer({
        services: { add: addLabService, update: editLabService, remove: deleteLabByIdsService, find: getLabByIdService },
        refresh
    })

const rules = {
    laboratoryName: [{ required: true, message: '请输入实验室名称', trigger: 'blur' }],
    laboratoryLocation: [{ required: true, message: '请输入实验室位置', trigger: 'blur' }],
    laboratoryType: [{ required: true, message: '请输入实验室类型', trigger: 'blur' }],
    laboratoryCategory: [{ required: true, message: '请选择实验室分类', trigger: 'change' }]
}

const addLab = () => submit(addFormRef, 'add', { successMessage: '添加成功', drawer: addDrawer, transform })
const editLab = () => submit(editFormRef, 'update', { successMessage: '修改成功', drawer: editDrawer, transform })

const onDelete = async (ids) => {
    if (await remove(ids)) selection.value = []
}

load(1)
loadDictionaries()
</script>

<template>
    <CrudTable
        v-model:page="page"
        :loading="loading"
        :page-size="pageSize"
        :rows="rows"
        :total="total"
        title="实验室管理"
        @refresh="load"
        @selection-change="onSelectionChange"
    >
        <template #toolbar>
            <el-button plain type="primary" @click="openAdd">实验室添加</el-button>
            <el-button :disabled="selection.length === 0" plain type="danger" @click="onDelete(selection)">删除选中</el-button>
        </template>

        <el-table-column label="实验室名称">
            <template #default="scope">
                <span>{{ scope.row.laboratoryName }}</span>
            </template>
        </el-table-column>
        <el-table-column label="实验室地点">
            <template #default="scope">
                <span>{{ scope.row.laboratoryLocation }}</span>
            </template>
        </el-table-column>
        <el-table-column label="实验室类型">
            <template #default="scope">
                <span>{{ scope.row.laboratoryType }}</span>
            </template>
        </el-table-column>
        <el-table-column label="实验室分类">
            <template #default="scope">
                <span>{{ categoryName(scope.row.laboratoryCategory) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="审核人">
            <template #default="scope">
                <span>{{ adminName(scope.row.laboratoryDirectorId) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="负责人">
            <template #default="scope">
                <span>{{ adminName(scope.row.laboratoryHeadId) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="使用次数" width="100">
            <template #default="scope">
                <span>{{ scope.row.laboratoryCount ?? 0 }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
            <template #default="scope">
                <el-button :icon="Edit" circle type="primary" @click="openEdit(scope.row.id)" />
                <el-button :icon="Delete" circle type="danger" @click="onDelete([scope.row.id])" />
            </template>
        </el-table-column>
    </CrudTable>

    <el-drawer v-model="addDrawer" direction="rtl" size="35%" title="添加实验室">
        <el-form ref="addFormRef" :model="formModel" :rules="rules" label-width="100px">
            <el-form-item label="名称" prop="laboratoryName">
                <el-input v-model.trim="formModel.laboratoryName" placeholder="请输入实验室名称" />
            </el-form-item>
            <el-form-item label="位置" prop="laboratoryLocation">
                <el-input v-model.trim="formModel.laboratoryLocation" placeholder="请输入实验室位置" />
            </el-form-item>
            <el-form-item label="类型" prop="laboratoryType">
                <el-input v-model.trim="formModel.laboratoryType" placeholder="请输入实验室类型" />
            </el-form-item>
            <el-form-item label="分类" prop="laboratoryCategory">
                <el-select v-model="formModel.laboratoryCategory" placeholder="请选择实验室分类" style="width: 100%">
                    <el-option v-for="item in categoryList" :key="item.id" :label="item.categoryName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="审核人">
                <el-select v-model="formModel.laboratoryDirectorId" clearable placeholder="请选择审核人" style="width: 100%">
                    <el-option v-for="item in adminList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="负责人">
                <el-select v-model="formModel.laboratoryHeadId" clearable placeholder="请选择负责人" style="width: 100%">
                    <el-option v-for="item in adminList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button :loading="submitting" type="primary" @click="addLab">添加</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>

    <el-drawer v-model="editDrawer" direction="rtl" size="35%" title="编辑实验室">
        <el-form ref="editFormRef" :model="formModel" :rules="rules" label-width="100px">
            <el-form-item label="名称" prop="laboratoryName">
                <el-input v-model.trim="formModel.laboratoryName" placeholder="请输入实验室名称" />
            </el-form-item>
            <el-form-item label="位置" prop="laboratoryLocation">
                <el-input v-model.trim="formModel.laboratoryLocation" placeholder="请输入实验室位置" />
            </el-form-item>
            <el-form-item label="类型" prop="laboratoryType">
                <el-input v-model.trim="formModel.laboratoryType" placeholder="请输入实验室类型" />
            </el-form-item>
            <el-form-item label="分类" prop="laboratoryCategory">
                <el-select v-model="formModel.laboratoryCategory" placeholder="请选择实验室分类" style="width: 100%">
                    <el-option v-for="item in categoryList" :key="item.id" :label="item.categoryName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="审核人">
                <el-select v-model="formModel.laboratoryDirectorId" clearable placeholder="请选择审核人" style="width: 100%">
                    <el-option v-for="item in adminList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="负责人">
                <el-select v-model="formModel.laboratoryHeadId" clearable placeholder="请选择负责人" style="width: 100%">
                    <el-option v-for="item in adminList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button :loading="submitting" type="primary" @click="editLab">修改</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>
