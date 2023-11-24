<script setup>

import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import {
  addLabService,
  deleteLabByIdsService,
  editLabService,
  getLabByIdService,
  getLabListService
} from '@/api/lab/LabManage'
import { getLabCategoryListService } from '@/api/lab/labCategory'

const addDrawer = ref(false)
const editDrawer = ref(false)
const tableData = ref([])
const multipleSelection = ref([])
const formModel = ref({})
const categoryList = ref([])
const pageNum = ref(1)
const totalNum = ref(0)
const loading = ref(false)

const getLabCategoryList = async () => {
  const labCategoryResult = await getLabCategoryListService()
  categoryList.value = labCategoryResult.data.data.items
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val.map(item => item.id);
}

const getLabList = async () => {
  loading.value = true
  const labResult = await getLabListService(pageNum.value)
  tableData.value = labResult.data.data.items
  totalNum.value = labResult.data.data.counts
  loading.value = false
  getLabCategoryList()
}

const getLabById = async (id) => {
  const result = await getLabByIdService(id)
  return result.data.data
}

const onAdd = () => {
  formModel.value = {}
  addDrawer.value = true
}

const onEdit = async (index) => {
  formModel.value = await getLabById(index)
  editDrawer.value = true
}

const onDelete = async (ids) => {
  await ElMessageBox.confirm('你确认要删除吗？', '提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await deleteLabByIdsService(ids)
  ElMessage.success('删除成功')
  await getLabList(pageNum.value)
}

const addLab = async () => {
  console.log(formModel.value)
  await addLabService(formModel.value)
  ElMessage.success('添加成功')
  addDrawer.value = false
  await getLabList(pageNum.value)
}

const editAdmin = async () => {
  await editLabService(formModel.value)
  ElMessage.success('修改成功')
  editDrawer.value = false
  await getLabList(pageNum.value)
}

const pageChange = async (page) => {
  pageNum.value = page
  await getLabList(pageNum.value)
}

getLabList(pageNum.value)

</script>

<template>
  <div>
    <el-row>
      <h1 style="margin: 5px auto;">实验室管理</h1>
    </el-row>
    <el-row style="margin-bottom: 20px;">
      <el-button plain style="margin-left: 20px;" type="primary" @click="onAdd">实验室添加</el-button>
      <el-button :disabled="multipleSelection.length === 0" plain
                 style="margin-left: 20px;"
                 type="danger" @click="() => onDelete(multipleSelection)">删除选中
      </el-button>

    </el-row>
    <el-table v-loading="loading" :data="tableData"
              :row-key="(row) => row.id" border style="width: 98%; margin:0 auto"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="实验室名称" width="">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.laboratoryName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="实验室地点" width="">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.laboratoryLocation }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="实验室类型" width="">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.laboratoryType }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="实验室分类" width="">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.laboratoryCategory }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审批人" width="">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.laboratoryDirectorId }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.laboratoryHeadId }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="使用次数" width="100">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.laboratoryCount }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130">
        <template #default="scope">
          <el-button :icon="Edit" circle type="primary" @click="() => onEdit(scope.row.id)"/>
          <el-button :icon="Delete" circle type="danger" @click="() => onDelete([scope.row.id])"/>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: center">
      <ElPagination :default-page-size="10" :total="totalNum" background hide-on-single-page
                    layout="total, prev, pager, next"
                    style="margin: 20px auto" @current-change="(currentPage) => pageChange(currentPage)"/>
    </div>
  </div>
  <el-drawer v-model="addDrawer" direction="rtl" size="35%" title="添加实验室">
    <el-form ref="formRef" label-width="100px">
      <el-form-item label="名称">
        <el-input v-model="formModel.laboratoryName" placeholder="请输入实验室名称"></el-input>
      </el-form-item>
      <el-form-item label="位置">
        <el-input v-model="formModel.laboratoryLocation" placeholder="请输入实验室位置"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-input v-model="formModel.laboratoryType" placeholder="请输入实验室类型"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="formModel.laboratoryCategory" style="width: 100%;">
          <el-option
              v-for="channel in categoryList" :key="channel.id"
              :label="channel.name" :value="channel.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核人">
        <el-input v-model="formModel.laboratoryAdminId" placeholder="请输入审核人id"></el-input>
      </el-form-item>
      <el-form-item label="负责人">
        <el-input v-model="formModel.laboratoryHeadId" placeholder="请输入负责人id"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addLab">添加</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  <el-drawer v-model="editDrawer" direction="rtl" size="35%" title="编辑实验室">
    <el-form ref="formRef" label-width="100px">
      <el-form-item label="名称">
        <el-input v-model="formModel.laboratoryName" placeholder="请输入实验室名称"></el-input>
      </el-form-item>
      <el-form-item label="位置">
        <el-input v-model="formModel.laboratoryLocation" placeholder="请输入实验室位置"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-input v-model="formModel.laboratoryType" placeholder="请输入实验室类型"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="formModel.laboratoryCategory" style="width: 100%;">
          <el-option
              v-for="channel in categoryList" :key="channel.id"
              :label="channel.name" :value="channel.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核人">
        <el-input v-model="formModel.laboratoryAdminId" placeholder="请输入审核人id"></el-input>
      </el-form-item>
      <el-form-item label="负责人">
        <el-input v-model="formModel.laboratoryHeadId" placeholder="请输入负责人id"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editAdmin">修改</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped>

</style>
