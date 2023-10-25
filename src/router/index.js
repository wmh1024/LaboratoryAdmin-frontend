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
                    component: () => import('@/views/data/DataStudent.vue'),
                    meta: {
                        title: '学生信息管理'
                    }
                }, {
                    path: '/data/teacher',
                    component: () => import('@/views/data/DataTeacher.vue'),
                    meta: {
                        title: '教师信息管理'
                    }
                }, {
                    path: '/data/admin',
                    component: () => import('@/views/data/DataAdmin.vue'),
                    meta: {
                        title: '管理员信息管理'
                    }
                }, {
                    path: '/data/director',
                    component: () => import('@/views/data/DataDirector.vue'),
                    meta: {
                        title: '主任信息管理'
                    }
                }, {
                    path: '/data/president',
                    component: () => import('@/views/data/DataPresident.vue'),
                    meta: {
                        title: '院长信息管理'
                    }
                }, {
                    path: '/lab/category',
                    component: () => import('@/views/lab/LabCategory.vue'),
                    meta: {
                        title: '实验室分类'
                    }
                }, {
                    path: '/lab/log',
                    component: () => import('@/views/lab/LabLog.vue'),
                    meta: {
                        title: '实验室预约记录'
                    }
                }, {
                    path: '/lab/head',
                    component: () => import('@/views/lab/LabHead.vue'),
                    meta: {
                        title: '实验室负责人数据'
                    }
                }, {
                    path: '/lab/note',
                    component: () => import('@/views/lab/LabNote.vue'),
                    meta: {
                        title: '实验室注意事项'
                    }
                }, {
                    path: '/dev/category',
                    component: () => import('@/views/dev/DevCategory.vue'),
                    meta: {
                        title: '设备分类'
                    }
                }, {
                    path: '/dev/log',
                    component: () => import('@/views/dev/DevLog.vue'),
                    meta: {
                        title: '设备预约记录'
                    }
                }, {
                    path: '/dev/head',
                    component: () => import('@/views/dev/DevHead.vue'),
                    meta: {
                        title: '设备负责人数据'
                    }
                }, {
                    path: '/dev/note',
                    component: () => import('@/views/dev/DevNote.vue'),
                    meta: {
                        title: '设备注意事项'
                    }
                }, {
                    path: '/timetable',
                    component: () => import('@/views/TimeTable.vue'),
                    meta: {
                        title: '课表管理'
                    }
                }, {
                    path: '/datalog',
                    component: () => import('@/views/DataLog.vue'),
                    meta: {
                        title: '数据留存'
                    }
                }, {
                    path: '/image',
                    component: () => import('@/views/Image.vue'),
                    meta: {
                        title: '首页轮播图'
                    }
                }, {
                    path: '/datashow',
                    component: () => import('@/views/DataShow.vue'),
                    meta: {
                        title: '数据展示'
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
                title: '页面未找到',
            }
        }
    ]
})

router.beforeEach((to) => {
    // 如果没有token, 且访问的是非登录页，拦截到登录，其他情况正常放行return '/login'
    if (to.meta.title) {
        document.title = to.meta.title + ' | 实验室预约系统'
    }
    const useStore = useUserStore()
    if (!useStore.token && to.path !== '/login') return '/login'
})

export default router
