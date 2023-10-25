import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('@/views/Layout.vue'),
            redirect: '/data/student',
            children: [
                {
                    path: '/data/student',
                    component: () => import('@/views/data/DataStudent.vue')
                }, {
                    path: '/data/teacher',
                    component: () => import('@/views/data/DataTeacher.vue')
                }, {
                    path: '/data/admin',
                    component: () => import('@/views/data/DataAdmin.vue')
                }, {
                    path: '/data/director',
                    component: () => import('@/views/data/DataDirector.vue')
                }, {
                    path: '/data/president',
                    component: () => import('@/views/data/DataPresident.vue')
                }, {
                    path: '/lab/category',
                    component: () => import('@/views/lab/LabCategory.vue')
                }, {
                    path: '/lab/log',
                    component: () => import('@/views/lab/LabLog.vue')
                }, {
                    path: '/lab/head',
                    component: () => import('@/views/lab/LabHead.vue')
                }, {
                    path: '/lab/note',
                    component: () => import('@/views/lab/LabNote.vue')
                }, {
                    path: '/dev/category',
                    component: () => import('@/views/dev/DevCategory.vue')
                }, {
                    path: '/dev/log',
                    component: () => import('@/views/dev/DevLog.vue')
                }, {
                    path: '/dev/head',
                    component: () => import('@/views/dev/DevHead.vue')
                }, {
                    path: '/dev/note',
                    component: () => import('@/views/dev/DevNote.vue')
                },{
                    path: '/timetable',
                    component: () => import('@/views/TimeTable.vue')
                },{
                    path: '/datalog',
                    component: () => import('@/views/DataLog.vue')
                },{
                    path: '/image',
                    component: () => import('@/views/Image.vue')
                },{
                    path: '/datashow',
                    component: () => import('@/views/DataShow.vue')
                },
            ]
        },
        {
            path: '/login',
            component: () => import('@/views/Login.vue')
        }
    ]
})

router.beforeEach((to) => {
    // 如果没有token, 且访问的是非登录页，拦截到登录，其他情况正常放行return '/login'
    const useStore = useUserStore()
    if (!useStore.token && to.path !== '/login') return '/login'
})

export default router
