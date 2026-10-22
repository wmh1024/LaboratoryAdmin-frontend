<script setup>
import { getLabRecordByIdService, getLabRecordListService } from '@/api/lab/LabLog'
import { ref } from 'vue'

const PAGE_SIZE = 10

const loading = ref(false)
const tableData = ref([])
const detailsData = ref({})
const pageNum = ref(1)
const totalNum = ref(0)
const detailsDrawer = ref(false)

// 预约状态：0 审批通过，1 指导教师拒绝，2 主任拒绝，3 院长拒绝
const statusMap = {
  0: { text: '审批通过', type: 'success' },
  1: { text: '指导教师未通过', type: 'danger' },
  2: { text: '主任未通过', type: 'danger' },
  3: { text: '院长未通过', type: 'danger' }
}

const statusInfo = (status) => statusMap[status] || { text: '未知', type: 'info' }

const getLabRecordList = async (page = pageNum.value) => {
  loading.value = true
  try {
    const req = await getLabRecordListService(page)
    const data = req.data.data
    // 兼容后端返回分页对象或裸数组两种形式
    if (Array.isArray(data)) {
      tableData.value = data
      totalNum.value = data.length
    } else {
      tableData.value = data.items || []
      totalNum.value = data.counts ?? 0
    }
    pageNum.value = page
  } catch {
    // 错误提示由请求拦截器统一处理
  } finally {
    loading.value = false
  }
}

const onDetails = async (id) => {
  try {
    const req = await getLabRecordByIdService(id)
    detailsData.value = req.data.data || {}
    detailsDrawer.value = true
  } catch {
    // 错误提示由请求拦截器统一处理
  }
}

const pageChange = async (page) => {
  await getLabRecordList(page)
}

getLabRecordList(pageNum.value)
</script>

<template>
  <div>
    <el-row>
      <h1 style="margin: 5px auto">实验室预约记录</h1>
    </el-row>
    <el-table v-loading="loading" :data="tableData" border style="width: 98%; margin: 0 auto">
      <el-table-column label="实验室名称">
        <template #default="scope">
          <span>{{ scope.row.laboratoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约班级">
        <template #default="scope">
          <span>{{ scope.row.className }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约用户">
        <template #default="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用时间">
        <template #default="scope">
          <span>{{ scope.row.useTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约状态">
        <template #default="scope">
          <el-tag :type="statusInfo(scope.row.status).type" effect="dark">
            {{ statusInfo(scope.row.status).text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130">
        <template #default="scope">
          <el-button type="primary" @click="() => onDetails(scope.row.id)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: center">
      <el-pagination
        :current-page="pageNum"
        :page-size="PAGE_SIZE"
        :total="totalNum"
        background
        hide-on-single-page
        layout="total, prev, pager, next"
        style="margin: 20px auto"
        @current-change="(currentPage) => pageChange(currentPage)"
      />
    </div>
  </div>
  <el-drawer v-model="detailsDrawer" direction="rtl" size="25%" title="">
    <el-descriptions :border="true" :column="1" title="内容详情">
      <el-descriptions-item label="ID">{{ detailsData.id ?? '-' }}</el-descriptions-item>
      <el-descriptions-item label="实验室名称">{{ detailsData.laboratoryName || '-' }}</el-descriptions-item>
      <el-descriptions-item label="开始节次">{{ detailsData.startCourseNumber ?? '-' }}</el-descriptions-item>
      <el-descriptions-item label="结束节次">{{ detailsData.endCourseNumber ?? '-' }}</el-descriptions-item>
      <el-descriptions-item label="使用时间">{{ detailsData.useTime || '-' }}</el-descriptions-item>
      <el-descriptions-item label="指导教师ID">{{ detailsData.teacherId ?? '-' }}</el-descriptions-item>
      <el-descriptions-item label="审核院长ID">{{ detailsData.presidentId ?? '-' }}</el-descriptions-item>
      <el-descriptions-item label="审核主任ID">{{ detailsData.directorId ?? '-' }}</el-descriptions-item>
      <el-descriptions-item label="用途">{{ detailsData.useTo || '-' }}</el-descriptions-item>
      <el-descriptions-item label="状态">{{ statusInfo(detailsData.status).text }}</el-descriptions-item>
      <el-descriptions-item label="指导教师拒绝原因">{{ detailsData.teacherFailReason || '-' }}</el-descriptions-item>
      <el-descriptions-item label="主任拒绝原因">{{ detailsData.directorFailReason || '-' }}</el-descriptions-item>
      <el-descriptions-item label="院长拒绝原因">{{ detailsData.presidentFailReason || '-' }}</el-descriptions-item>
    </el-descriptions>
  </el-drawer>
</template>
