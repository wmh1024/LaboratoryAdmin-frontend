<script setup>
</script>

<template>
  <el-row class="tac">
    <el-col :span="4">
      <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          router
          unique-opened
          @close="handleClose"
          @open="handleOpen"
      >
        <div class="mb-2" style="text-align: center; line-height: 45px;">
          实验室预约系统
        </div>
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <User/>
            </el-icon>
            <span>信息管理</span>
          </template>
          <el-menu-item index="/data/user">用户信息</el-menu-item>
          <el-menu-item index="/data/admin">管理员信息</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <School/>
            </el-icon>
            <span>实验室数据</span>
          </template>
          <el-menu-item index="/lab/manage">实验室管理</el-menu-item>
          <el-menu-item index="/lab/category">实验室类别</el-menu-item>
          <el-menu-item index="/lab/log">实验室预约记录</el-menu-item>
          <el-menu-item index="/lab/note">注意事项</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon>
              <Box/>
            </el-icon>
            <span>设备数据</span>
          </template>
          <el-menu-item index="/dev/log">设备预约记录</el-menu-item>
          <el-menu-item index="/dev/head">负责人数据</el-menu-item>
          <el-menu-item index="/dev/category">设备类别</el-menu-item>
          <el-menu-item index="/dev/note">注意事项</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/timetable">
          <el-icon>
            <Calendar/>
          </el-icon>
          <span>课表数据</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="20">
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
</style>
