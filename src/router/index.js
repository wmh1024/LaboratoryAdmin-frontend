import { createRouter, createWebHistory } from 'vue-router'

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
        // {
        //     // 数据录入
        //     path: '/info',
        //     name: 'info',
        //     component: Info,
        //     children: [
        //         { path: '/info/student', component: InfoStudent }
        //         // {path: '/info/teacher', component: () => import('../views/AboutView.vue')},
        //         // {path: '/info/admin', component: () => import('../views/AboutView.vue')},
        //         // {path: '/info/director', component: () => import('../views/AboutView.vue')},
        //         // {path: '/info/president', component: () => import('../views/AboutView.vue')},
        //     ]
        // }
        // {
        //     // 实验室数据
        //     path: '/lab',
        //     name: 'lab',
        //     children: [
        //         {path: '/lab/category', component: () => import('../views/AboutView.vue')},
        //         {path: '/lab/log', component: () => import('../views/AboutView.vue')},
        //         {path: '/lab/head', component: () => import('../views/AboutView.vue')},
        //         {path: '/lab/notice', component: () => import('../views/AboutView.vue')},
        //     ]
        // }, {
        //     // 设备数据
        //     path: '/device',
        //     name: 'device',
        //     children: [
        //         {path: '/device/category', component: () => import('../views/AboutView.vue')},
        //         {path: '/device/log', component: () => import('../views/AboutView.vue')},
        //         {path: '/device/head', component: () => import('../views/AboutView.vue')},
        //         {path: '/device/notice', component: () => import('../views/AboutView.vue')},
        //     ]
        // }, {
        //     // 课表数据
        //     path: '/timetable',
        //     name: 'timetable',
        //     component: () => import('../views/AboutView.vue')
        // }, {
        //     // 数据展示
        //     path: '/show',
        //     name: 'show',
        //     component: () => import('../views/AboutView.vue')
        // }, {
        //     // 数据留存
        //     path: '/backups',
        //     name: 'backups',
        //     component: () => import('../views/AboutView.vue')
        // }, {
        //     // 首页轮播
        //     path: '/image',
        //     name: 'image',
        //     component: () => import('../views/AboutView.vue')
        // }, {
        //     // 其他处理
        //     path: '/*',
        //     redirect: '/'
        // },
    ]
})

// router.beforeEach((to) => {
//     // 如果没有token, 且访问的是非登录页，拦截到登录，其他情况正常放行return '/login'
//     // const useStore = useUserStore()
//     // if (!useStore.token && to.path !== '/login') return '/login'
//     // if (to.path !== '/login') return '/login'
// })

export default router
