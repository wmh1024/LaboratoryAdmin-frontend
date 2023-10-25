<script setup>
import router from '@/router'
import sjzc from '@/assets/sjzc.png'

const goBack = () => {
  router.back()
}
</script>

<template>
  <el-result sub-title="您访问的路径有误！" title="404">
    <template #icon>
      <el-image :src="sjzc"
                class="img"
      />
    </template>
    <template #extra>
      <el-button type="primary" @click="goBack">返回</el-button>
    </template>
  </el-result>
</template>

<style scoped>
.img {
  width: 15%;
}
</style>
