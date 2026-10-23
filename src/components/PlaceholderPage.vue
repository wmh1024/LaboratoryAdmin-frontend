<script setup>
/**
 * 通用占位页：用于尚未实现的功能模块（设备、课表、数据留存/展示）。
 * 仅保证页面不再显示裸文本，不提供任何业务逻辑。
 */
defineProps({
    title: {
        type: String,
        default: '功能建设中'
    },
    description: {
        type: String,
        default: '该模块尚未开发完成，敬请期待。'
    }
})
</script>

<template>
    <el-row justify="center" style="margin-top: 15vh">
        <el-col :span="14">
            <el-result icon="info" :sub-title="description" :title="title">
                <template #extra>
                    <el-tag type="info" effect="plain">建设中</el-tag>
                </template>
            </el-result>
        </el-col>
    </el-row>
</template>
