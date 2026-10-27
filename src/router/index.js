import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('@/views/Layout.vue'),
            redirect: '/data/user',
            children: [
                {
                    path: '/data/user',
                    component: () => import('@/views/data/DataUser.vue'),
                    meta: {
                        title: '用户信息管理'
                    }
                },
                {
                    path: '/data/admin',
                    component: () => import('@/views/data/DataAdmin.vue'),
                    meta: {
                        title: '管理员信息管理'
                    }
                },
                {
                    path: '/lab/category',
                    component: () => import('@/views/lab/LabCategory.vue'),
                    meta: {
                        title: '实验室类别'
                    }
                },
                {
                    path: '/lab/log',
                    component: () => import('@/views/lab/LabLog.vue'),
                    meta: {
                        title: '实验室预约记录'
                    }
                },
                {
                    path: '/lab/manage',
                    component: () => import('@/views/lab/LabManage.vue'),
                    meta: {
                        title: '实验室管理'
                    }
                }
            ]
        },
        {
            path: '/login',
            component: () => import('@/views/Login.vue'),
            meta: {
                title: '用户登录'
            }
        },
        {
            path: '/:catchAll(.*)',
            component: () => import('@/views/NotFind.vue'),
            meta: {
                title: '页面未找到'
            }
        }
    ]
})

router.beforeEach((to) => {
    const useStore = useUserStore()
    // 已登录时访问登录页，直接回到首页
    if (useStore.token && to.path === '/login') return '/'
    // 如果没有token, 且访问的是非登录页，拦截到登录
    if (!useStore.token && to.path !== '/login') return '/login'
})

// afterEach 保证所有路由（含无 meta.title 的子路由）都能正确设置标题，
// 避免标题残留上一个页面
router.afterEach((to) => {
    document.title = `${to.meta.title || '管理端'} | 实验室预约系统`
})

export default router
