<script setup>
/**
 * 列表页通用表格壳：负责工具栏、表格外框、空数据与分页器。
 *
 * 列定义通过默认插槽传入（el-table-column），操作列同理。
 */
defineProps({
    title: { type: String, required: true },
    rows: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    total: { type: Number, default: 0 },
    pageSize: { type: Number, default: 10 },
    selectable: { type: Boolean, default: true }
})

const page = defineModel('page', { type: Number, default: 1 })
const emit = defineEmits(['selection-change', 'refresh'])

const onSelectionChange = (val) => emit('selection-change', val)
const onPageChange = (current) => emit('refresh', current)
</script>

<template>
    <div>
        <el-row class="page-header">
            <h1>{{ title }}</h1>
        </el-row>
        <div class="page-toolbar">
            <slot name="toolbar" />
        </div>
        <el-table
            v-loading="loading"
            :data="rows"
            :row-key="(row) => row.id"
            border
            class="page-table"
            @selection-change="onSelectionChange"
        >
            <el-table-column v-if="selectable" type="selection" width="55" />
            <slot />
        </el-table>
        <div class="page-pager">
            <el-pagination
                v-if="total > pageSize"
                v-model:current-page="page"
                :page-size="pageSize"
                :total="total"
                background
                layout="total, prev, pager, next"
                @current-change="onPageChange"
            />
        </div>
    </div>
</template>

<style scoped>
.page-header {
    justify-content: center;
    margin: 5px 0;
}

.page-header h1 {
    margin: 5px auto;
}

.page-toolbar {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    padding-left: 20px;
}

.page-table {
    width: 98%;
    margin: 0 auto;
}

.page-pager {
    display: flex;
    justify-content: center;
    margin: 20px auto;
}
</style>
