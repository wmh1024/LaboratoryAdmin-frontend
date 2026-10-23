<script setup>
import { useRouter } from 'vue-router'
import sjzc from '@/assets/sjzc.png'

const router = useRouter()

const goBack = () => {
    // 直接访问不存在的地址时无历史记录，回退到首页
    if (window.history.length > 1) {
        router.back()
    } else {
        router.push('/')
    }
}

const goHome = () => {
    router.push('/')
}
</script>

<template>
    <el-result icon="warning" sub-title="您访问的路径有误！" title="404">
        <template #icon>
            <el-image :src="sjzc" class="img" />
        </template>
        <template #extra>
            <el-button type="primary" @click="goHome">返回首页</el-button>
            <el-button @click="goBack">返回上一页</el-button>
        </template>
    </el-result>
</template>

<style scoped>
.img {
    width: 15%;
}
</style>
