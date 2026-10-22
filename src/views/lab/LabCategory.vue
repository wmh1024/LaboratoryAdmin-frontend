<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  addLabCategoryService,
  deleteLabCategoryByIdsService,
  editLabCategoryService,
  getLabCategoryByIdService,
  getLabCategoryListService
} from '@/api/lab/labCategory'

const addDrawer = ref(false)
const editDrawer = ref(false)
const tableData = ref([])
const multipleSelection = ref([])
const formModel = ref({})
const positionList = [
  { id: 0, name: '院长管理' },
  { id: 1, name: '主任管理' },
  { id: 2, name: '教师管理' }
]
const totalNum = ref(0)
const loading = ref(false)
const handleSelectionChange = (val) => {
  multipleSelection.value = val.map((item) => item.id)
}

const categoryStatusName = (status) => positionList[status]?.name || '未知'

const getLabCategoryList = async () => {
  loading.value = true
  try {
    const labCategoryResult = await getLabCategoryListService()
    tableData.value = labCategoryResult.data.data.items
    totalNum.value = labCategoryResult.data.data.counts
  } catch {
    // 错误提示由请求拦截器统一处理
  } finally {
    loading.value = false
  }
}

const getLabCategoryById = async (id) => {
  const result = await getLabCategoryByIdService(id)
  return result.data.data
}

const onAdd = () => {
  formModel.value = {}
  addDrawer.value = true
}

const onEdit = async (id) => {
  try {
    formModel.value = await getLabCategoryById(id)
    editDrawer.value = true
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
    await deleteLabCategoryByIdsService(ids)
    ElMessage.success('删除成功')
    await getLabCategoryList()
  } catch {
    // 错误提示由请求拦截器统一处理
  }
}

const addLabCategory = async () => {
  if (!formModel.value.categoryName) {
    ElMessage.warning('请输入分类名称')
    return
  }
  try {
    await addLabCategoryService(formModel.value)
    ElMessage.success('添加成功')
    addDrawer.value = false
    await getLabCategoryList()
  } catch {
    // 错误提示由请求拦截器统一处理
  }
}

const editLabCategory = async () => {
  if (!formModel.value.categoryName) {
    ElMessage.warning('请输入分类名称')
    return
  }
  try {
    await editLabCategoryService(formModel.value)
    ElMessage.success('修改成功')
    editDrawer.value = false
    await getLabCategoryList()
  } catch {
    // 错误提示由请求拦截器统一处理
  }
}

getLabCategoryList()
</script>

<template>
  <div>
    <el-row>
      <h1 style="margin: 5px auto">实验室类别</h1>
    </el-row>
    <el-row style="margin-bottom: 20px">
      <el-button plain style="margin-left: 20px" type="primary" @click="onAdd"> 类别添加 </el-button>
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
      <el-table-column label="分类名称">
        <template #default="scope">
          <span>{{ scope.row.categoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类别权限">
        <template #default="scope">
          <span>{{ categoryStatusName(scope.row.categoryStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130">
        <template #default="scope">
          <el-button :icon="Edit" circle type="primary" @click="() => onEdit(scope.row.id)" />
          <el-button :icon="Delete" circle type="danger" @click="() => onDelete([scope.row.id])" />
        </template>
      </el-table-column>
    </el-table>
    <el-row class="toolbar">
      <span class="total">共 {{ totalNum }} 条</span>
    </el-row>
  </div>
  <el-drawer v-model="addDrawer" direction="rtl" size="35%" title="添加分类">
    <el-form label-width="100px">
      <el-form-item label="分类名称">
        <el-input v-model="formModel.categoryName" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="权限">
        <el-select v-model="formModel.categoryStatus" style="width: 100%">
          <el-option v-for="channel in positionList" :key="channel.id" :label="channel.name" :value="channel.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addLabCategory">添加</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  <el-drawer v-model="editDrawer" direction="rtl" size="35%" title="编辑分类">
    <el-form label-width="100px">
      <el-form-item label="分类名称">
        <el-input v-model="formModel.categoryName" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="权限">
        <el-select v-model="formModel.categoryStatus" style="width: 100%">
          <el-option v-for="channel in positionList" :key="channel.id" :label="channel.name" :value="channel.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editLabCategory">修改</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped>
.toolbar {
  width: 98%;
  margin: 8px auto 0;
  justify-content: flex-end;

  .total {
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }
}
</style>
