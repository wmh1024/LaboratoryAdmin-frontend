/**
 * Mock 数据种子（全部为虚构数据，仅用于无后端时的演示）
 *
 * 脱敏约定：
 * - 学号/工号：使用明显虚构的号段（20xx99xx），不指向真实学生
 * - 姓名：常见姓氏 + 虚构名，同名纯属巧合
 * - 联系方式：手机号使用 199-0000-xxxx，邮箱统一 example.com
 * - 地点/IP：文档专用网段（RFC 5737 / 192.0.2.0/24）
 *
 * 该文件只服务于 mock 层，生产构建不会被引用。
 */

export const createSeed = () => ({
    users: [
        {
            id: 1,
            username: '20990101',
            name: '张同学',
            positionStatus: 0,
            className: '计算机科学与技术 2001 班',
            violationCount: 0,
            violationStatus: 0
        },
        {
            id: 2,
            username: '20990102',
            name: '李同学',
            positionStatus: 0,
            className: '软件工程 2002 班',
            violationCount: 2,
            violationStatus: 1
        },
        {
            id: 3,
            username: '20990103',
            name: '王同学',
            positionStatus: 0,
            className: '网络工程 2003 班',
            violationCount: 0,
            violationStatus: 0
        },
        {
            id: 4,
            username: '20990104',
            name: '赵老师',
            positionStatus: 1,
            className: '计算机学院',
            violationCount: 0,
            violationStatus: 0
        },
        {
            id: 5,
            username: '20990105',
            name: '钱同学',
            positionStatus: 1,
            className: '信息与通信工程 2101 班',
            violationCount: 1,
            violationStatus: 0
        }
    ],

    admins: [
        // status 与 src/constants/role.js 的 ADMIN_ROLES 一致：0 院长 / 1 主任 / 2 指导老师 / 3 负责人
        // demo_admin 为演示登录账号，必须是院长（0），否则无写权限
        { id: 1, username: 'demo_admin', name: '演示管理员', status: 0, phone: '199-0000-0001' },
        { id: 2, username: 'demo_director', name: '演示主任', status: 1, phone: '199-0000-0002' },
        { id: 3, username: 'demo_head', name: '演示负责人', status: 3, phone: '199-0000-0003' }
    ],

    labCategories: [
        { id: 1, categoryName: '电子类实验室', categoryStatus: 0 },
        { id: 2, categoryName: '机械类实验室', categoryStatus: 1 },
        { id: 3, categoryName: '计算机类实验室', categoryStatus: 2 }
    ],

    labs: [
        {
            id: 1,
            laboratoryName: '电子电路实验室',
            laboratoryLocation: '实验楼 A-101',
            laboratoryType: '教学实验室',
            laboratoryCategory: 1,
            laboratoryDirectorId: 2,
            laboratoryHeadId: 3,
            laboratoryCount: 128
        },
        {
            id: 2,
            laboratoryName: '机械加工实训室',
            laboratoryLocation: '实验楼 B-203',
            laboratoryType: '实训室',
            laboratoryCategory: 2,
            laboratoryDirectorId: 2,
            laboratoryHeadId: 3,
            laboratoryCount: 76
        },
        {
            id: 3,
            laboratoryName: '计算机组成原理实验室',
            laboratoryLocation: '实验楼 C-305',
            laboratoryType: '教学实验室',
            laboratoryCategory: 3,
            laboratoryDirectorId: 1,
            laboratoryHeadId: 3,
            laboratoryCount: 214
        }
    ],

    labRecords: [
        {
            id: 1,
            laboratoryId: 1,
            laboratoryName: '电子电路实验室',
            className: '计算机科学与技术 2001 班',
            userName: '张同学',
            useTime: '2024-03-11',
            startCourseNumber: 1,
            endCourseNumber: 4,
            teacherId: 4,
            presidentId: 1,
            directorId: 2,
            useTo: '模拟电路实验课',
            status: 0,
            teacherFailReason: '',
            directorFailReason: '',
            presidentFailReason: ''
        },
        {
            id: 2,
            laboratoryId: 2,
            laboratoryName: '机械加工实训室',
            className: '机械设计制造 2001 班',
            userName: '李同学',
            useTime: '2024-03-12',
            startCourseNumber: 5,
            endCourseNumber: 6,
            teacherId: 4,
            presidentId: 1,
            directorId: 2,
            useTo: '数控车床实训',
            status: 1,
            teacherFailReason: '',
            directorFailReason: '该时段已安排其他班级实训',
            presidentFailReason: ''
        },
        {
            id: 3,
            laboratoryId: 3,
            laboratoryName: '计算机组成原理实验室',
            className: '软件工程 2002 班',
            userName: '王同学',
            useTime: '2024-03-13',
            startCourseNumber: 3,
            endCourseNumber: 4,
            teacherId: 4,
            presidentId: 1,
            directorId: 2,
            useTo: '课程设计调试',
            status: 2,
            teacherFailReason: '',
            directorFailReason: '',
            presidentFailReason: '设备检修，暂不开放'
        }
    ]
})
