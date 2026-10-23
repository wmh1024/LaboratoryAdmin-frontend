<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {
    Box,
    Calendar,
    DataAnalysis,
    Document,
    Expand,
    Fold,
    School,
    SwitchButton,
    User
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/modules/user'
import { userLogoutService } from '@/api/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 窄屏默认折叠侧边栏，打开后自动收起（避免遮挡内容）
const collapsed = ref(false)

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
    try {
        // 通知服务端作废当前令牌；失败也必须继续本地登出
        await userLogoutService()
    } catch {
        // 忽略：登出不应因接口异常而中断
    }
    userStore.removeToken()
    await router.push('/login')
}
</script>

<template>
    <el-row class="layout">
        <el-col :xs="collapsed ? 0 : 24" :md="collapsed ? 1 : 4" class="aside">
            <el-menu :default-active="route.path" class="menu" router unique-opened :collapse="collapsed">
                <div class="brand">{{ collapsed ? '实验室' : '实验室预约系统' }}</div>
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon><User /></el-icon>
                        <span>信息管理</span>
                    </template>
                    <el-menu-item index="/data/user">用户信息</el-menu-item>
                    <el-menu-item index="/data/admin">管理员信息</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="2">
                    <template #title>
                        <el-icon><School /></el-icon>
                        <span>实验室数据</span>
                    </template>
                    <el-menu-item index="/lab/manage">实验室管理</el-menu-item>
                    <el-menu-item index="/lab/category">实验室类别</el-menu-item>
                    <el-menu-item index="/lab/log">实验室预约记录</el-menu-item>
                    <el-menu-item index="/lab/note">注意事项</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="3">
                    <template #title>
                        <el-icon><Box /></el-icon>
                        <span>设备数据</span>
                    </template>
                    <el-menu-item index="/dev/log">设备预约记录</el-menu-item>
                    <el-menu-item index="/dev/head">负责人数据</el-menu-item>
                    <el-menu-item index="/dev/category">设备类别</el-menu-item>
                    <el-menu-item index="/dev/note">注意事项</el-menu-item>
                </el-sub-menu>
                <el-menu-item index="/timetable">
                    <el-icon><Calendar /></el-icon>
                    <span>课表数据</span>
                </el-menu-item>
                <el-menu-item index="/datalog">
                    <el-icon><Document /></el-icon>
                    <span>数据留存</span>
                </el-menu-item>
                <el-menu-item index="/datashow">
                    <el-icon><DataAnalysis /></el-icon>
                    <span>数据展示</span>
                </el-menu-item>
            </el-menu>
        </el-col>
        <el-col :xs="24" :md="collapsed ? 23 : 20" class="main">
            <div class="topbar">
                <el-button :icon="collapsed ? Expand : Fold" link type="primary" @click="collapsed = !collapsed">
                    {{ collapsed ? '展开菜单' : '收起菜单' }}
                </el-button>
                <el-button :icon="SwitchButton" link type="primary" @click="handleLogout">退出登录</el-button>
            </div>
            <router-view />
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

            &:not(.el-menu--collapse) {
                width: 100%;
            }
        }

        .brand {
            text-align: center;
            line-height: 45px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
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
        gap: 8px;
        height: 48px;
    }
}
</style>
