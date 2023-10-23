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
    <el-button plain style="margin-left: 20px;" type="primary">添加学生信息</el-button>
    <el-button plain style="margin-left: 20px;" type="danger">删除选中</el-button>

  </el-row>
  <el-table :data="tableData" border style="width: 98%; margin:0 auto">
    <el-table-column type="selection" width="55"/>
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
              v-if="scope.row.status"
              effect="dark"
              label='Tag 4'
              type='danger'
          >
            有违规
          </el-tag>
          <el-tag
              v-else
              effect="dark"
              label='Tag 2'
              type='success'
          >
            无违规
          </el-tag>
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
</template>


