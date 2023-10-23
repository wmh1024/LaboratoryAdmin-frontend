<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'

const tableData = [
  {
    name: '软件研究中心2',
    beginTime: '2023.10.23 18:00',
    endTime: '2023.10.23 21:00',
    teacher: '邵高祥',
    admin: '王秋阳',
    use: '学习Python',
    status: 1
  }, {
    name: '软件研究中心1',
    beginTime: '2023.10.23 18:00',
    endTime: '2023.10.23 21:00',
    teacher: '邵高祥',
    admin: '王秋阳',
    use: '学习Java',
    status: 0
  }
]
</script>

<template>
  <el-row>
    <h3 style="margin: 5px auto;">实验室预约记录</h3>
  </el-row>
  <!--  <el-row style="margin-bottom: 20px;">-->
  <!--    <el-button plain style="margin-left: 20px;" type="primary">添加管理员信息</el-button>-->
  <!--    <el-button plain style="margin-left: 20px;" type="danger">删除选中</el-button>-->

  <!--  </el-row>-->
  <el-table :data="tableData" border style="width: 98%; margin:0 auto">
    <el-table-column type="selection" width="55"/>
    <el-table-column label="实验室名称" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.name }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="时间" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.beginTime }} - {{ scope.row.endTime }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="指导老师" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.teacher }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="审核人" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.admin }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="预约用途" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.use }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="预约状态" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-tag
              v-if="scope.row.status === 1"
              effect="dark"
              label='Tag 4'
              type='danger'
          >
            审批未通过
          </el-tag>
          <el-tag
              v-else
              effect="dark"
              label='Tag 2'
              type='success'
          >
            审批通过
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

<style scoped>

</style>
