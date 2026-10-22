<script setup>
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      type: 'warning',
      confirmButtonText: '退出',
      cancelButtonText: '取消'
    })
  } catch {
    return
  }
  userStore.removeToken()
  await router.push('/login')
}
</script>

<template>
  <el-row class="layout">
    <el-col :span="4" class="aside">
      <el-menu
          :default-active="$route.path"
          class="menu"
          router
          unique-opened
      >
        <div class="brand">
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
        <el-menu-item index="/datalog">
          <el-icon>
            <Document/>
          </el-icon>
          <span>数据留存</span>
        </el-menu-item>
        <el-menu-item index="/datashow">
          <el-icon>
            <DataAnalysis/>
          </el-icon>
          <span>数据展示</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="20" class="main">
      <div class="topbar">
        <el-button :icon="SwitchButton" link type="primary" @click="handleLogout">
          退出登录
        </el-button>
      </div>
      <router-view/>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
  background-color: #f5f7fa;

  .aside {
    height: 100vh;
    position: sticky;
    top: 0;
    overflow-y: auto;
    background-color: #fff;
    border-right: 1px solid var(--el-border-color-light);

    .menu {
      border-right: none;
    }

    .brand {
      text-align: center;
      line-height: 45px;
      font-weight: 600;
      user-select: none;
    }
  }

  .main {
    padding: 0 16px 24px;
  }

  .topbar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 48px;
  }
}
</style>
