<script setup>
import { Box, Calendar, DataLine, Files, Picture, School, User } from '@element-plus/icons-vue'
</script>

<template>
  <el-row>
    <div style="width: 100%; margin-bottom: 20px; text-align: center;font-size: 20px;margin-top: 10px;">
      <strong>
        实验室预约系统 后台管理
      </strong>
    </div>
  </el-row>
  <el-row class="tac">
    <el-col :span="4">
      <!--      <h5 class="mb-2">Default colors</h5>-->
      <el-menu
          default-active="/data/student"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          unique-opened
          router
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <User/>
            </el-icon>
            <span>信息录入</span>
          </template>
          <el-menu-item index="/data/student">学生信息录入</el-menu-item>
          <el-menu-item index="/data/teacher">教师信息录入</el-menu-item>
          <el-menu-item index="/data/admin">管理员信息录入</el-menu-item>
          <el-menu-item index="/data/director">主任信息录入</el-menu-item>
          <el-menu-item index="/data/president">院长信息录入</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <School/>
            </el-icon>
            <span>实验室数据</span>
          </template>
          <el-menu-item index="/lab/category">实验室类别</el-menu-item>
          <el-menu-item index="/lab/log">实验室预约记录</el-menu-item>
          <el-menu-item index="/lab/head">负责人数据</el-menu-item>
          <el-menu-item index="/lab/note">注意事项</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon>
              <Box/>
            </el-icon>
            <span>设备数据</span>
          </template>
          <el-menu-item index="/dev/category">设备类别</el-menu-item>
          <el-menu-item index="/dev/log">设备预约记录</el-menu-item>
          <el-menu-item index="/dev/head">负责人数据</el-menu-item>
          <el-menu-item index="/dev/note">注意事项</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/timetable">
          <el-icon>
            <Calendar/>
          </el-icon>
          <span>课表数据</span>
        </el-menu-item>
        <el-menu-item index="/datashow">
          <el-icon>
            <DataLine/>
          </el-icon>
          <span>数据展示</span>
        </el-menu-item>
        <el-menu-item index="/datalog">
          <el-icon>
            <Files/>
          </el-icon>
          <span>数据留存</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <el-icon>
            <Picture/>
          </el-icon>
          <span>首页轮播图</span>
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
