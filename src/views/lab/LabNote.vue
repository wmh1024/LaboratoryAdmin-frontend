<script setup>
// 该页面对应的后端接口尚未提供，暂只做只读提示，不提供无后端的“修改”入口
</script>

<template>
  <el-row>
    <h1 style="margin: 5px auto">实验室注意事项</h1>
  </el-row>
  <el-row justify="center">
    <el-col :span="20">
      <el-alert
        :closable="false"
        description="后端暂未提供注意事项相关接口，该页面暂不支持编辑。"
        show-icon
        title="功能建设中"
        type="info"
      />
    </el-col>
  </el-row>
</template>
