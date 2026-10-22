<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  addLabService,
  deleteLabByIdsService,
  editLabService,
  getLabByIdService,
  getLabListService
} from '@/api/lab/LabManage'
import { getLabCategoryListService } from '@/api/lab/labCategory'

const PAGE_SIZE = 10

const addDrawer = ref(false)
const editDrawer = ref(false)
const tableData = ref([])
const multipleSelection = ref([])
const formModel = reactive({})
const addFormRef = ref()
const editFormRef = ref()
const categoryList = ref([])
const pageNum = ref(1)
const totalNum = ref(0)
const loading = ref(false)
const submitting = ref(false)

const rules = {
  laboratoryName: [{ required: true, message: '请输入实验室名称', trigger: 'blur' }],
  laboratoryLocation: [{ required: true, message: '请输入实验室位置', trigger: 'blur' }],
  laboratoryType: [{ required: true, message: '请输入实验室类型', trigger: 'blur' }],
  laboratoryCategory: [{ required: true, message: '请选择实验室分类', trigger: 'change' }]
}

const categoryName = (id) => categoryList.value.find((item) => item.id === id)?.categoryName || '-'

const getLabCategoryList = async () => {
  try {
    const labCategoryResult = await getLabCategoryListService()
    categoryList.value = labCategoryResult.data.data.items
  } catch {
    // 错误提示由请求拦截器统一处理
  }
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val.map((item) => item.id)
}

const getLabList = async (page = pageNum.value) => {
  loading.value = true
  try {
    const labResult = await getLabListService(page)
    const { items, counts } = labResult.data.data
    if (items.length === 0 && page > 1 && counts > 0) {
      loading.value = false
      return getLabList(page - 1)
    }
    tableData.value = items
    totalNum.value = counts
    pageNum.value = page
  } catch {
    // 错误提示由请求拦截器统一处理
  } finally {
    loading.value = false
  }
}

const getLabById = async (id) => {
  const result = await getLabByIdService(id)
  return result.data.data
}

const resetForm = () => {
  Object.keys(formModel).forEach((key) => delete formModel[key])
}

const onAdd = () => {
  resetForm()
  addDrawer.value = true
  addFormRef.value?.clearValidate()
}

const onEdit = async (id) => {
  try {
    const lab = await getLabById(id)
    resetForm()
    Object.assign(formModel, lab)
    editDrawer.value = true
    editFormRef.value?.clearValidate()
  } catch {
    // 错误提示由请求拦截器统一处理
  }
}

const onDelete = async (ids) => {
  try {
    await ElMessageBox.confirm('你确认要删除吗？', '提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })
  } catch {
    return
  }
  try {
    await deleteLabByIdsService(ids)
    ElMessage.success('删除成功')
    multipleSelection.value = []
    await getLabList()
  } catch {
    // 错误提示由请求拦截器统一处理
  }
}

const submit = async (formRef, service, drawer, message) => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    await service({ ...formModel })
    ElMessage.success(message)
    drawer.value = false
    await getLabList()
  } catch {
    // 错误提示由请求拦截器统一处理
  } finally {
    submitting.value = false
  }
}

const addLab = () => submit(addFormRef, addLabService, addDrawer, '添加成功')
const editLab = () => submit(editFormRef, editLabService, editDrawer, '修改成功')

const pageChange = async (page) => {
  await getLabList(page)
}

getLabList(pageNum.value)
getLabCategoryList()
</script>

<template>
  <div>
    <el-row>
      <h1 style="margin: 5px auto">实验室管理</h1>
    </el-row>
    <el-row style="margin-bottom: 20px">
      <el-button plain style="margin-left: 20px" type="primary" @click="onAdd">实验室添加</el-button>
      <el-button
        :disabled="multipleSelection.length === 0"
        plain
        style="margin-left: 20px"
        type="danger"
        @click="() => onDelete(multipleSelection)"
      >
        删除选中
      </el-button>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      :row-key="(row) => row.id"
      border
      style="width: 98%; margin: 0 auto"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
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
          <span>{{ scope.row.laboratoryDirectorId ?? '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人">
        <template #default="scope">
          <span>{{ scope.row.laboratoryHeadId ?? '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用次数" width="100">
        <template #default="scope">
          <span>{{ scope.row.laboratoryCount ?? 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130">
        <template #default="scope">
          <el-button :icon="Edit" circle type="primary" @click="() => onEdit(scope.row.id)" />
          <el-button :icon="Delete" circle type="danger" @click="() => onDelete([scope.row.id])" />
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: center">
      <el-pagination
        :current-page="pageNum"
        :page-size="PAGE_SIZE"
        :total="totalNum"
        background
        hide-on-single-page
        layout="total, prev, pager, next"
        style="margin: 20px auto"
        @current-change="(currentPage) => pageChange(currentPage)"
      />
    </div>
  </div>
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
        <el-input-number v-model="formModel.laboratoryDirectorId" :min="0" placeholder="审核人 ID" />
      </el-form-item>
      <el-form-item label="负责人">
        <el-input-number v-model="formModel.laboratoryHeadId" :min="0" placeholder="负责人 ID" />
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
        <el-input-number v-model="formModel.laboratoryDirectorId" :min="0" placeholder="审核人 ID" />
      </el-form-item>
      <el-form-item label="负责人">
        <el-input-number v-model="formModel.laboratoryHeadId" :min="0" placeholder="负责人 ID" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="submitting" type="primary" @click="editLab">修改</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
