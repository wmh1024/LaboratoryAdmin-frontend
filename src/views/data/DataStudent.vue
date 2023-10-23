<script setup>

const handleEdit = (index) => {
  console.log(index)
}
const handleDelete = (index, row) => {
  console.log(index, row)
}

const tableData = [
  {
    date: '20211308076',
    name: '王铭颢',
    class: '计科三班',
    phone: '13223169904',
    status: true
  }, {
    date: '20211308097',
    name: '伊煊',
    class: '软工二班',
    phone: '13020830696',
    status: false
  }
]
import { Delete, Edit } from '@element-plus/icons-vue'
</script>


<template>
  <el-row>
    <h3 style="margin: 5px auto;">学生信息管理</h3>
  </el-row>
  <el-row style="margin-bottom: 20px;">
    <el-button type="primary" plain style="margin-left: 20px;">添加学生信息</el-button>
    <el-button type="danger" style="margin-left: 20px;" plain>删除选中</el-button>

  </el-row>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="学号" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.date }}</span>
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
    <el-table-column label="专业班级" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.class }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="手机号" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.phone }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="学生违规状态" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-tag
              effect="dark"
              type='danger'
              label='Tag 4'
              v-if="scope.row.status"
          >
            有违规
          </el-tag>
          <el-tag
              effect="dark"
              type='success'
              label='Tag 2'
              v-else
          >
            无违规
          </el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" :icon="Edit" circle/>
        <el-button type="danger" :icon="Delete" circle/>
      </template>
    </el-table-column>
  </el-table>
</template>


