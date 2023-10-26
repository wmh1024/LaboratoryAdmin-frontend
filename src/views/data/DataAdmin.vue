<script setup>

import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { getAdminListService } from '@/api/data'

let tableData = ref([])

const getAdminList = async () => {
  const adminResult = await getAdminListService()
  tableData.value = adminResult.data.data.items
}

getAdminList()


</script>

<template>
  <el-row>
    <h3 style="margin: 5px auto;">管理员信息管理</h3>
  </el-row>
  <el-row style="margin-bottom: 20px;">
    <el-button plain style="margin-left: 20px;" type="primary">管理员添加</el-button>
    <el-button plain style="margin-left: 20px;" type="danger">删除选中</el-button>

  </el-row>
  <el-table :data="tableData" border style="width: 98%; margin:0 auto">
    <el-table-column type="selection" width="55"/>
    <el-table-column label="账号" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.username }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="姓名" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.name }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="权限" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <div v-if="scope.row.status === 0">
            <span>院长</span>
          </div>
          <div v-else-if="scope.row.status === 1">
            <span>主任</span>
          </div>
          <div v-else-if="scope.row.status === 2">
            <span>指导老师</span>
          </div>
          <div v-else-if="scope.row.status === 3">
            <span>负责人</span>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button :icon="Edit" circle type="primary"/>
        <el-button :icon="Delete" circle type="danger"/>
      </template>
    </el-table-column>
  </el-table>
  <div style="display: flex; justify-content: center">
    <ElPagination
        style="margin: 20px auto"
        background
        hide-on-single-page
        :default-page-size="5"
        layout="total, prev, pager, next" :total="20"/>
  </div>
</template>

<style scoped>

</style>
