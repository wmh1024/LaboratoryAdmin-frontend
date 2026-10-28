<script setup>
import { ref } from 'vue'
import { getLabRecordByIdService, getLabRecordListService } from '@/api/lab/labLog'
import { usePagedList } from '@/composables/usePagedList'
import { recordStatus } from '@/constants/role'
import { unwrapData } from '@/api/common'
import { ACTION_COLUMN_WIDTH, DETAIL_DRAWER_SIZE } from '@/constants/ui'

const { rows, total, page, pageSize, loading, load } = usePagedList(getLabRecordListService)

const detailsData = ref({})
const detailsDrawer = ref(false)

const onDetails = async (id) => {
    try {
        const req = await getLabRecordByIdService(id)
        detailsData.value = unwrapData(req) || {}
        detailsDrawer.value = true
    } catch {
        // 错误提示由请求拦截器统一处理
    }
}

load(1)
</script>

<template>
    <CrudTable
        v-model:page="page"
        :loading="loading"
        :page-size="pageSize"
        :rows="rows"
        :selectable="false"
        :total="total"
        title="实验室预约记录"
        @refresh="load"
    >
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
                <el-tag :type="recordStatus(scope.row.status).type" effect="dark">
                    {{ recordStatus(scope.row.status).text }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" :width="ACTION_COLUMN_WIDTH">
            <template #default="scope">
                <el-button type="primary" @click="onDetails(scope.row.id)">查看详情</el-button>
            </template>
        </el-table-column>
    </CrudTable>

    <el-drawer v-model="detailsDrawer" direction="rtl" :size="DETAIL_DRAWER_SIZE" title="">
        <el-descriptions border :column="1" title="内容详情">
            <el-descriptions-item label="ID">{{ detailsData.id ?? '-' }}</el-descriptions-item>
            <el-descriptions-item label="实验室名称">{{ detailsData.laboratoryName || '-' }}</el-descriptions-item>
            <el-descriptions-item label="开始节次">{{ detailsData.startCourseNumber ?? '-' }}</el-descriptions-item>
            <el-descriptions-item label="结束节次">{{ detailsData.endCourseNumber ?? '-' }}</el-descriptions-item>
            <el-descriptions-item label="使用时间">{{ detailsData.useTime || '-' }}</el-descriptions-item>
            <el-descriptions-item label="指导教师ID">{{ detailsData.teacherId ?? '-' }}</el-descriptions-item>
            <el-descriptions-item label="审核院长ID">{{ detailsData.presidentId ?? '-' }}</el-descriptions-item>
            <el-descriptions-item label="审核主任ID">{{ detailsData.directorId ?? '-' }}</el-descriptions-item>
            <el-descriptions-item label="用途">{{ detailsData.useTo || '-' }}</el-descriptions-item>
            <el-descriptions-item label="状态">{{ recordStatus(detailsData.status).text }}</el-descriptions-item>
            <el-descriptions-item label="指导教师拒绝原因">{{
                detailsData.teacherFailReason || '-'
            }}</el-descriptions-item>
            <el-descriptions-item label="主任拒绝原因">{{
                detailsData.directorFailReason || '-'
            }}</el-descriptions-item>
            <el-descriptions-item label="院长拒绝原因">{{
                detailsData.presidentFailReason || '-'
            }}</el-descriptions-item>
        </el-descriptions>
    </el-drawer>
</template>
