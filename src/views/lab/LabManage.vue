<script setup>

import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { addAdminService, deleteAdminByIdsService, editAdminService, getAdminByIdService } from '@/api/data'
import { getLabListService } from '@/api/lab/labCategory'

const addDrawer = ref(false)
const editDrawer = ref(false)
const tableData = ref([])
const multipleSelection = ref([])
const formModel = ref({})
const positionList = [
  { id: 0, name: "院长" }, { id: 1, name: "主任" },
  { id: 2, name: "指导老师" }, { id: 3, name: "负责人" }
]
const pageNum = ref(1)
const totalNum = ref(0)
const loading = ref(false)

const handleSelectionChange = (val) => {
  multipleSelection.value = val.map(item => item.id);
}

const getLabList = async () => {
  loading.value = true
  const labResult = await getLabListService(pageNum.value)
  tableData.value = labResult.data.data.items
  totalNum.value = labResult.data.data.counts
  loading.value = false
}

const getAdminById = async (id) => {
  const result = await getAdminByIdService(id)
  return result.data.data
}

const onAdd = () => {
  formModel.value = {}
  addDrawer.value = true
}

const onEdit = async (index) => {
  formModel.value = await getAdminById(index)
  editDrawer.value = true
}

const onDelete = async (ids) => {
  await ElMessageBox.confirm('你确认要删除吗？', '提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  // todo Mock测试数据
  console.log('old-ids', ids)
  ids = [1, 2, 3]

  await deleteAdminByIdsService(ids)
  ElMessage.success('删除成功')
  await getAdminList(pageNum.value)
}

const addAdmin = async () => {
  console.log(formModel.value)
  await addAdminService(formModel.value)
  ElMessage.success('添加成功')
  addDrawer.value = false
  await getAdminList(pageNum.value)
}

const editAdmin = async () => {
  await editAdminService(formModel.value)
  ElMessage.success('修改成功')
  editDrawer.value = false
  await getAdminList(pageNum.value)
}

const pageChange = async (page) => {
  pageNum.value = page
  await getAdminList(pageNum.value)
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
      <el-form-item label="账号">
        <el-input v-model="formModel.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formModel.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-select v-model="formModel.status" style="width: 100%;">
          <el-option
              v-for="channel in positionList" :key="channel.id"
              :label="channel.name" :value="channel.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formModel.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="formModel.repassword" placeholder="请输入确认密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addAdmin">添加</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  <el-drawer v-model="editDrawer" direction="rtl" size="35%" title="编辑实验室">
    <el-form ref="formRef" label-width="100px">
      <el-form-item label="账号">
        <el-input v-model="formModel.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formModel.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-select v-model="formModel.position_status" style="width: 100%;">
          <el-option
              v-for="channel in positionList" :key="channel.id"
              :label="channel.name" :value="channel.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formModel.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="formModel.repassword" placeholder="请输入确认密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editAdmin">修改</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped>

</style>
