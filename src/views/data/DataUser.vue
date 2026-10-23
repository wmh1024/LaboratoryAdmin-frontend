<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import {
  addUserService,
  deleteUserByIdsService,
  editUserService,
  getUserByIdService,
  getUserListService
} from '@/api/data'
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { PAGE_SIZE } from '@/constants/page'

const addDrawer = ref(false)
const editDrawer = ref(false)
const tableData = ref([])
const multipleSelection = ref([])
const formModel = reactive({})
const addFormRef = ref()
const editFormRef = ref()
const positionList = [
  { id: 0, name: '学生' },
  { id: 1, name: '教职工' }
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

// 编辑时密码留空表示不修改，此时无需校验确认密码
const validateEditConfirmPassword = (_rule, value, callback) => {
  if (!formModel.password && !value) return callback()
  return validateConfirmPassword(_rule, value, callback)
}

const rules = {
  username: [{ required: true, message: '请输入学号(工号)', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  positionStatus: [{ required: true, message: '请选择职位', trigger: 'change' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  repassword: [{ validator: validateConfirmPassword, trigger: 'blur' }]
}

const editRules = {
  username: rules.username,
  name: rules.name,
  positionStatus: rules.positionStatus,
  password: [{ min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' }],
  repassword: [{ validator: validateEditConfirmPassword, trigger: 'blur' }]
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val.map((item) => item.id)
}

/** 请求后一页；若当前页已无数据则回退 */
const getUserList = async (page = pageNum.value) => {
  loading.value = true
  try {
    const userResult = await getUserListService(page)
    const { items, counts } = userResult.data.data
    // 删除当前页最后一条后自动回退到上一页
    if (items.length === 0 && page > 1 && counts > 0) {
      loading.value = false
      return getUserList(page - 1)
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

const getUserById = async (id) => {
  const result = await getUserByIdService(id)
  return result.data.data
}

const resetForm = () => {
  Object.keys(formModel).forEach((key) => delete formModel[key])
}

const onAdd = () => {
  resetForm()
  formModel.positionStatus = 0
  addDrawer.value = true
  addFormRef.value?.clearValidate()
}

const onEdit = async (id) => {
  try {
    const user = await getUserById(id)
    resetForm()
    // 密码不回填，留空表示不修改
    Object.assign(formModel, user, { password: '', repassword: '' })
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
    // 用户取消删除
    return
  }
  try {
    await deleteUserByIdsService(ids)
    ElMessage.success('删除成功')
    multipleSelection.value = []
    await getUserList()
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
    // 编辑时密码为空表示不修改
    if (!payload.password) {
      delete payload.password
      delete payload.repassword
    }
    await service(payload)
    ElMessage.success(message)
    drawer.value = false
    await getUserList()
  } catch {
    // 错误提示由请求拦截器统一处理
  } finally {
    submitting.value = false
  }
}

const addUser = () => submit(addFormRef, addUserService, addDrawer, '添加成功')
const editUser = () => submit(editFormRef, editUserService, editDrawer, '修改成功')

const pageChange = async (page) => {
  await getUserList(page)
}

getUserList(pageNum.value)
</script>

<template>
  <div>
    <el-row>
      <h1 style="margin: 5px auto">用户信息管理</h1>
    </el-row>
    <el-row style="margin-bottom: 20px">
      <el-button plain style="margin-left: 20px" type="primary" @click="onAdd"> 用户添加 </el-button>
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
      <el-table-column label="学号(工号)" width="200">
        <template #default="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="150">
        <template #default="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职位" width="150">
        <template #default="scope">
          <span>{{ positionName(scope.row.positionStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专业班级">
        <template #default="scope">
          <span>{{ scope.row.className }}</span>
        </template>
      </el-table-column>
      <el-table-column label="违规次数" width="140">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.violationCount }}</span>
            <el-tag v-if="scope.row.violationStatus === 1" effect="dark" style="margin-left: 15px" type="danger">
              现有违规
            </el-tag>
          </div>
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
        v-if="totalNum > PAGE_SIZE"
        v-model:current-page="pageNum"
        :page-size="PAGE_SIZE"
        :total="totalNum"
        background
        layout="total, prev, pager, next"
        style="margin: 20px auto"
        @current-change="(currentPage) => pageChange(currentPage)"
      />
    </div>
  </div>
  <el-drawer v-model="addDrawer" direction="rtl" size="35%" title="添加用户">
    <el-form ref="addFormRef" :model="formModel" :rules="rules" label-width="100px">
      <el-form-item label="学号(工号)" prop="username">
        <el-input v-model.trim="formModel.username" placeholder="请输入学号(工号)" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model.trim="formModel.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="职位" prop="positionStatus">
        <el-select v-model="formModel.positionStatus" style="width: 100%">
          <el-option v-for="channel in positionList" :key="channel.id" :label="channel.name" :value="channel.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="专业班级" prop="className">
        <el-input v-model.trim="formModel.className" placeholder="请输入专业班级" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formModel.password" placeholder="请输入密码" show-password type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="repassword">
        <el-input v-model="formModel.repassword" placeholder="请再次输入密码" show-password type="password" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="submitting" type="primary" @click="addUser">添加</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  <el-drawer v-model="editDrawer" direction="rtl" size="35%" title="编辑用户">
    <el-form ref="editFormRef" :model="formModel" :rules="editRules" label-width="100px">
      <el-form-item label="学号(工号)" prop="username">
        <el-input v-model.trim="formModel.username" placeholder="请输入学号(工号)" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model.trim="formModel.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="职位" prop="positionStatus">
        <el-select v-model="formModel.positionStatus" style="width: 100%">
          <el-option v-for="channel in positionList" :key="channel.id" :label="channel.name" :value="channel.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="专业班级" prop="className">
        <el-input v-model.trim="formModel.className" placeholder="请输入专业班级" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formModel.password" placeholder="留空表示不修改密码" show-password type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="repassword">
        <el-input v-model="formModel.repassword" placeholder="留空表示不修改密码" show-password type="password" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="submitting" type="primary" @click="editUser">修改</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
