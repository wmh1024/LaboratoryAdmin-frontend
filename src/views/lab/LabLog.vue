<script setup>

import { getLabRecordByIdService, getLabRecordListService } from '@/api/lab/LabLog'
import { ref } from 'vue'


const loading = ref(false)
const tableData = ref([])
const detailsData = ref({})
const pageNum = ref(1)
const detailsDrawer = ref(false)

const getLabCategoryList = async () => {
  loading.value = true
  const req = await getLabRecordListService(pageNum.value)
  tableData.value = req.data.data
  loading.value = false
}

const onDetails = async (id) => {
  const req = await getLabRecordByIdService(id)
  detailsData.value = req.data.data
  detailsDrawer.value = true
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
          <span>{{ scope.row.laboratoryName }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="预约班级" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.className }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="预约用户" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.userName }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="使用时间" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.useTime }}</span>
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
    <el-table-column label="操作" width="130">
      <template #default="scope">
        <!--        <el-button :icon="Edit" circle type="primary" @click="() => onEdit(scope.row.id)"/>-->
        <el-button type="primary" @click="() => onDetails(scope.row.id)">查看详情</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-drawer v-model="detailsDrawer" direction="rtl" size="25%" title="">
    <el-descriptions
        :border="true"
        :column="1"
        title="内容详情"
    >
      <el-descriptions-item label="ID">{{ detailsData.id || "-" }}</el-descriptions-item>
      <el-descriptions-item label="实验室名称">{{ detailsData.laboratoryName || "-" }}</el-descriptions-item>
      <el-descriptions-item label="开始时间">{{ detailsData.startCourseNumber || "-" }}</el-descriptions-item>
      <el-descriptions-item label="结束时间">{{ detailsData.endCourseNumber || "-" }}</el-descriptions-item>
      <el-descriptions-item label="使用时间">{{ detailsData.useTime || "-" }}</el-descriptions-item>
      <el-descriptions-item label="指导教师ID">{{ detailsData.teacherId || "-" }}</el-descriptions-item>
      <el-descriptions-item label="审核院长ID">{{ detailsData.presidentId || "-" }}</el-descriptions-item>
      <el-descriptions-item label="审核主任ID">{{ detailsData.directorId || "-" }}</el-descriptions-item>
      <el-descriptions-item label="用途">{{ detailsData.useTo || "-" }}</el-descriptions-item>
      <el-descriptions-item label="状态">{{ detailsData.status || "-" }}</el-descriptions-item>
      <el-descriptions-item label="指导教师拒绝原因">{{ detailsData.teacherFailReason || "-" }}</el-descriptions-item>
      <el-descriptions-item label="主任拒绝原因">{{ detailsData.directorFailReason || "-" }}</el-descriptions-item>
      <el-descriptions-item label="院长拒绝原因">{{ detailsData.presidentFailReason || "-" }}</el-descriptions-item>
    </el-descriptions>
  </el-drawer>
</template>

<style scoped>
</style>
