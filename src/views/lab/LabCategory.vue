<script setup>

import { Delete, Edit } from '@element-plus/icons-vue'
import {
  addUserService,
  deleteUserByIdsService,
  editUserService,
  getUserByIdService,
  getUserListService
} from '@/api/data'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getLabCategoryByIdService, getLabCategoryListService } from '@/api/lab'

const addDrawer = ref(false)
const editDrawer = ref(false)
const tableData = ref([])
const multipleSelection = ref([])
const formModel = ref({})
const positionList = [{ id: 0, name: "院长管理" }, { id: 1, name: "主任管理" }, { id: 2, name: "教师管理" }]
const loading = ref(false)

const handleSelectionChange = (val) => {
  multipleSelection.value = val.map(item => item.id);
}

const getLabCategoryList = async () => {
  loading.value = true
  const labCategoryResult = await getLabCategoryListService()
  tableData.value = labCategoryResult.data.data.items
  loading.value = false
}

const getLabCategoryById = async (id) => {
  const result = await getLabCategoryByIdService(id)
  return result.data.data
}

const onAdd = () => {
  formModel.value = {}
  addDrawer.value = true
}

const onEdit = async (index) => {
  formModel.value = await getLabCategoryById(index)
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
  await deleteUserByIdsService(ids)
  ElMessage.success('删除成功')
  await getLabCategoryList()
}

const addUser = async () => {
  console.log(formModel.value)
  await addUserService(formModel.value)
  ElMessage.success('添加成功')
  addDrawer.value = false
  await getLabCategoryList()
}

const editUser = async () => {
  await editUserService()
  ElMessage.success('修改成功')
  editDrawer.value = false
  await getLabCategoryList()
}

const pageChange = async (page) => {
  pageNum.value = page
  await getLabCategoryList()
}

getLabCategoryList()

</script>

<template>
  <div>
    <el-row>
      <h1 style="margin: 5px auto;">实验室类别管理</h1>
    </el-row>
    <el-row style="margin-bottom: 20px;">
      <el-button plain style="margin-left: 20px;" type="primary" @click="onAdd">
        类别添加
      </el-button>
      <el-button :disabled="multipleSelection.length === 0" plain
                 style="margin-left: 20px;" type="danger" @click="() => onDelete(multipleSelection)">
        删除选中
      </el-button>

    </el-row>
    <el-table :data="tableData" :row-key="(row) => row.id" border v-loading="loading"
              style="width: 98%; margin:0 auto" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="分类名称" width="">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.category_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类别权限" width="">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ positionList[scope.row.category_status]["name"] }}</span>
<!--            <span>{{ scope.row.category_status }}</span>-->
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
  <el-drawer v-model="addDrawer" direction="rtl" size="35%" title="添加用户">
    <el-form ref="formRef" label-width="100px">
      <el-form-item label="学号(工号)">
        <el-input v-model="formModel.username" placeholder="请输入学号(工号)"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formModel.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="职位">
        <el-select v-model="formModel.status" style="width: 100%;">
          <el-option
              v-for="channel in positionList" :key="channel.id"
              :label="channel.name" :value="channel.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业班级">
        <el-input v-model="formModel.class" placeholder="请输入专业班级"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formModel.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="formModel.repassword" placeholder="请输入确认密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addUser">添加</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  <el-drawer v-model="editDrawer" direction="rtl" size="35%" title="编辑用户">
    <el-form ref="formRef" label-width="100px">
      <el-form-item label="学号(工号)">
        <el-input v-model="formModel.username" placeholder="请输入学号(工号)"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formModel.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="职位">
        <el-select v-model="formModel.position_status" style="width: 100%;">
          <el-option
              v-for="channel in positionList" :key="channel.id"
              :label="channel.name" :value="channel.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业班级">
        <el-input v-model="formModel.class" placeholder="请输入专业班级"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formModel.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="formModel.repassword" placeholder="请输入确认密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editUser">修改</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped>

</style>
