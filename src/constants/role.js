/**
 * 管理员角色字典（唯一来源）。
 * 首页/管理员管理/实验室分类/预约记录共用，避免各页面各维护一套枚举。
 */
export const ADMIN_ROLES = [
    { id: 0, name: '院长' },
    { id: 1, name: '主任' },
    { id: 2, name: '指导老师' },
    { id: 3, name: '负责人' }
]

export const roleName = (id) => ADMIN_ROLES.find((role) => role.id === id)?.name || '未知'

/** 用户职位字典 */
export const POSITIONS = [
    { id: 0, name: '学生' },
    { id: 1, name: '教职工' }
]

export const positionName = (id) => POSITIONS.find((item) => item.id === id)?.name || '未知'

/** 实验室预约状态：0 审批通过，1 指导教师拒绝，2 主任拒绝，3 院长拒绝 */
export const RECORD_STATUS = {
    0: { text: '审批通过', type: 'success' },
    1: { text: '指导教师未通过', type: 'danger' },
    2: { text: '主任未通过', type: 'danger' },
    3: { text: '院长未通过', type: 'danger' }
}

export const recordStatus = (status) => RECORD_STATUS[status] || { text: '未知', type: 'info' }
