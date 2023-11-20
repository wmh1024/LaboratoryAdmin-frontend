<script setup>

import { getLabRecordListService } from '@/api/lab/LabLog'
import { ref } from 'vue'
import { getLabCategoryListService } from '@/api/lab/labCategory'

// const tableData = [
//   {
//     id: 1,
//     laboratory_id: 1,
//     laboratory_name: '软二实训室',
//     start_time: '2023.10.23 18:00',
//     end_time: '2023.10.23 21:00',
//     teacher_id: 1,
//     teacher: '邵高祥',
//     admin_id: 2,
//     admin: '王秋阳',
//     use: '学习Python',
//     status: 1,
//     user_id: 1,
//     user: '包俊辉',
//     teacher_fail_reason: 'xxx',
//     admin_fail_reason: 'xxxx'
//   }
// ]

const loading = ref(false)
const tableData = ref([])
const pageNum = ref(1)
const totalNum = ref(0)

const getLabCategoryList = async () => {
  loading.value = true
  const req = await getLabRecordListService(pageNum.value)
  tableData.value = req.data.data.items
  totalNum.value = pageNum.data.data.counts
  loading.value = false
}


getLabCategoryList()
</script>

<template>
  <el-row>
    <h1 style="margin: 5px auto;">实验室预约记录</h1>
  </el-row>
  <el-table :data="tableData" border style="width: 98%; margin:0 auto">
    <el-table-column label="实验室名称" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.laboratory_name }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="预约用户" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.user }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="开始时间" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.start_time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="结束时间" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.end_time }}</span>
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
    <el-table-column label="指导老师不通过原因" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.teacher_fail_reason }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="审批人不通过原因" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.admin_fail_reason }}</span>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>

</style>
