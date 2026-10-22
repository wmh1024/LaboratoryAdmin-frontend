<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  addAdminService,
  deleteAdminByIdsService,
  editAdminService,
  getAdminByIdService,
  getAdminListService
} from '@/api/data'
import { PAGE_SIZE } from '@/constants/page'

const addDrawer = ref(false)
const editDrawer = ref(false)
const tableData = ref([])
const multipleSelection = ref([])
const formModel = reactive({})
const addFormRef = ref()
const editFormRef = ref()
const positionList = [
  { id: 0, name: '院长' },
  { id: 1, name: '主任' },
  { id: 2, name: '指导老师' },
  { id: 3, name: '负责人' }
]
const pageNum = ref(1)
const totalNum = ref(0)
const loading = ref(false)
const submitting = ref(false)

const positionName = (status) => positionList.find((item) => item.id === status)?.name || '未知'

const validateConfirmPassword = (_rule, value, callback) => {
  if (!value) return callback(new Error('请再次输入密码'))
  if (value !== formModel.password) return callback(new Error('两次输入密码不一致'))
  callback()
}

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  status: [{ required: true, message: '请选择权限', trigger: 'change' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  repassword: [{ validator: validateConfirmPassword, trigger: 'blur' }]
}

const editRules = {
  username: rules.username,
  name: rules.name,
  status: rules.status,
  password: [{ min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' }],
  repassword: [{ validator: validateConfirmPassword, trigger: 'blur' }]
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val.map((item) => item.id)
}

const getAdminList = async (page = pageNum.value) => {
  loading.value = true
  try {
    const adminResult = await getAdminListService(page)
    const { items, counts } = adminResult.data.data
    if (items.length === 0 && page > 1 && counts > 0) {
      loading.value = false
      return getAdminList(page - 1)
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

const getAdminById = async (id) => {
  const result = await getAdminByIdService(id)
  return result.data.data
}

const resetForm = () => {
  Object.keys(formModel).forEach((key) => delete formModel[key])
}

const onAdd = () => {
  resetForm()
  formModel.status = 0
  addDrawer.value = true
  addFormRef.value?.clearValidate()
}

const onEdit = async (id) => {
  try {
    const admin = await getAdminById(id)
    resetForm()
    Object.assign(formModel, admin, { password: '', repassword: '' })
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
    await deleteAdminByIdsService(ids)
    ElMessage.success('删除成功')
    multipleSelection.value = []
    await getAdminList()
  } catch {
    // 错误提示由请求拦截器统一处理
  }
}

const submit = async (formRef, service, drawer, message) => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    const payload = { ...formModel }
    if (!payload.password) {
      delete payload.password
      delete payload.repassword
    }
    await service(payload)
    ElMessage.success(message)
    drawer.value = false
    await getAdminList()
  } catch {
    // 错误提示由请求拦截器统一处理
  } finally {
    submitting.value = false
  }
}

const addAdmin = () => submit(addFormRef, addAdminService, addDrawer, '添加成功')
const editAdmin = () => submit(editFormRef, editAdminService, editDrawer, '修改成功')

const pageChange = async (page) => {
  await getAdminList(page)
}

getAdminList(pageNum.value)
</script>

<template>
  <div>
    <el-row>
      <h1 style="margin: 5px auto">管理员信息管理</h1>
    </el-row>
    <el-row style="margin-bottom: 20px">
      <el-button plain style="margin-left: 20px" type="primary" @click="onAdd">管理员添加</el-button>
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
          <span>{{ positionName(scope.row.status) }}</span>
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
          <el-option v-for="channel in positionList" :key="channel.id" :label="channel.name" :value="channel.id" />
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
          <el-option v-for="channel in positionList" :key="channel.id" :label="channel.name" :value="channel.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formModel.password" placeholder="留空表示不修改密码" show-password type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="repassword">
        <el-input v-model="formModel.repassword" placeholder="留空表示不修改密码" show-password type="password" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="submitting" type="primary" @click="editAdmin">修改</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
