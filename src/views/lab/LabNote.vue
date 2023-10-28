<script setup>

</script>

<template>
  <el-row>
    <h1 style="margin: 5px auto;">实验室注意事项</h1>
  </el-row>
  <el-row style="margin-bottom: 15px;"/>
  <el-row>
    <el-col :offset="1" :span="11">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>实验室注意事项</span>
          </div>
        </template>

      </el-card>
    </el-col>
    <el-col :span="11">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>修改注意事项</span>
            <el-button class="button" type="primary">修改</el-button>
          </div>
        </template>
        <el-form-item>
          <el-input :rows="23" type="textarea"/>
        </el-form-item>
      </el-card>
    </el-col>
  </el-row>


</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
</style>
