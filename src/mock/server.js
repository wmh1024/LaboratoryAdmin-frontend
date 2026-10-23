/**
 * Mock 服务端（纯内存，无第三方依赖）
 *
 * - 由 Vite 开发服务器中间件 / preview 中间件调用 `handleMockRequest`
 * - 路由与 src/api/* 中的调用保持一致，返回结构与后端约定一致
 * - 数据在开发服务器生命周期内保持，重启后恢复种子数据
 *
 * 鉴权约定（避免把「无鉴权后台」当演示产物）：
 * - 除登录接口外，所有接口都必须携带 `Authorization: Bearer mock-token-<id>-<ts>`
 * - 令牌缺失/无效返回 401，前端 request.js 会清除登录态并跳转登录页
 * - 写操作仅允许「院长」角色（status === 0），其余角色返回 403
 */

import { createSeed } from './seed.js'
import { DEMO_ACCOUNT } from './account.js'

export { DEMO_ACCOUNT }

const PAGE_SIZE = 10

// 开发期浏览器端 mock 适配器与 vite 中间件可能各自加载此模块，挂到 globalThis 上共享同一份数据
const state = globalThis.__LABADMIN_MOCK_STATE__ || (globalThis.__LABADMIN_MOCK_STATE__ = { db: null, tokens: null })

const db = () => {
    if (!state.db) state.db = createSeed()
    return state.db
}

/** 已签发令牌 -> 管理员 id */
const tokens = () => {
    if (!state.tokens) state.tokens = new Map()
    return state.tokens
}

const ok = (data = null, msg = '操作成功') => ({ code: 200, msg, data })

const fail = (msg, code = 500) => ({ code, msg, data: null })

/** 可写字段白名单，防止前端整包提交覆盖 id 与只读统计字段 */
const pick = (source, fields) => {
    const body = source || {}
    return Object.fromEntries(fields.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]))
}

const FIELDS = {
    user: ['username', 'name', 'positionStatus', 'className', 'violationCount', 'violationStatus', 'password'],
    admin: ['username', 'name', 'status', 'phone', 'password'],
    labCategory: ['categoryName', 'categoryStatus'],
    laboratory: [
        'laboratoryName',
        'laboratoryLocation',
        'laboratoryType',
        'laboratoryCategory',
        'laboratoryDirectorId',
        'laboratoryHeadId'
    ]
}

const toInt = (value, fallback = 0) => {
    const num = Number.parseInt(value, 10)
    return Number.isNaN(num) ? fallback : num
}

/** 解析 "1, 2, 3" / "1,2,3" 形式的 ids 参数 */
const parseIds = (raw) =>
    String(raw || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => toInt(item))
        .filter((item) => !Number.isNaN(item))

/** 通用分页，返回后端约定的 { items, counts } */
const paginate = (list, query, pageSize = PAGE_SIZE) => {
    const page = Math.max(toInt(query.get('page'), 1), 1)
    const size = Math.max(toInt(query.get('pageSize'), pageSize), 1)
    const start = (page - 1) * size
    return {
        items: list.slice(start, start + size),
        counts: list.length
    }
}

const nextId = (list) => (list.length ? Math.max(...list.map((item) => item.id)) + 1 : 1)

const makeToken = (id) => `mock-token-${id}-${Date.now()}`

const readToken = (headers = {}) => {
    const raw = String(headers.authorization || headers.Authorization || '')
    return raw.replace(/^Bearer\s+/i, '').trim()
}

/** 由 Authorization 头解析当前管理员，失败返回 null */
const currentAdmin = (headers) => {
    const id = tokens().get(readToken(headers))
    if (id === undefined) return null
    return db().admins.find((item) => item.id === id) || null
}

const routes = () => [
    /* ---------------- 登录 ---------------- */
    {
        method: 'POST',
        public: true,
        test: /^\/admin\/login$/,
        handle: ({ body }) => {
            const username = String(body?.username ?? '').trim()
            const password = String(body?.password ?? '')
            if (!username || !password) return fail('用户名和密码不能为空', 400)
            if (username !== DEMO_ACCOUNT.username || password !== DEMO_ACCOUNT.password) {
                return fail('用户名或密码错误', 401)
            }
            const admin = db().admins.find((item) => item.username === username) || db().admins[0]
            const token = makeToken(admin.id)
            tokens().set(token, admin.id)
            return ok({ token })
        }
    },
    {
        method: 'POST',
        public: true,
        test: /^\/admin\/logout$/,
        handle: ({ headers }) => {
            tokens().delete(readToken(headers))
            return ok(null, '已退出登录')
        }
    },

    /* ---------------- 用户 ---------------- */
    {
        method: 'GET',
        test: /^\/user\/list$/,
        handle: ({ query }) => ok(paginate(db().users, query))
    },
    {
        method: 'GET',
        test: /^\/user\/find\/(\d+)$/,
        handle: ({ params }) => {
            const user = db().users.find((item) => item.id === toInt(params[0]))
            return user ? ok(user) : fail('用户不存在', 404)
        }
    },
    {
        method: 'POST',
        write: true,
        test: /^\/user\/add$/,
        handle: ({ body }) => {
            const user = { ...pick(body, FIELDS.user), id: nextId(db().users) }
            db().users.push(user)
            return ok(user, '添加成功')
        }
    },
    {
        method: 'PUT',
        write: true,
        test: /^\/user\/update$/,
        handle: ({ body }) => {
            const index = db().users.findIndex((item) => item.id === toInt(body?.id))
            if (index < 0) return fail('用户不存在', 404)
            db().users[index] = { ...db().users[index], ...pick(body, FIELDS.user) }
            return ok(db().users[index], '修改成功')
        }
    },
    {
        method: 'DELETE',
        write: true,
        test: /^\/user\/delete$/,
        handle: ({ query }) => {
            const ids = parseIds(query.get('ids'))
            db().users = db().users.filter((item) => !ids.includes(item.id))
            return ok(null, '删除成功')
        }
    },

    /* ---------------- 管理员 ---------------- */
    {
        method: 'GET',
        test: /^\/admin\/list$/,
        handle: ({ query }) => ok(paginate(db().admins, query))
    },
    {
        method: 'GET',
        test: /^\/admin\/find\/(\d+)$/,
        handle: ({ params }) => {
            const admin = db().admins.find((item) => item.id === toInt(params[0]))
            return admin ? ok(admin) : fail('管理员不存在', 404)
        }
    },
    {
        method: 'POST',
        write: true,
        test: /^\/admin\/add$/,
        handle: ({ body }) => {
            const admin = { ...pick(body, FIELDS.admin), id: nextId(db().admins) }
            db().admins.push(admin)
            return ok(admin, '添加成功')
        }
    },
    {
        method: 'PUT',
        write: true,
        test: /^\/admin\/update$/,
        handle: ({ body }) => {
            const index = db().admins.findIndex((item) => item.id === toInt(body?.id))
            if (index < 0) return fail('管理员不存在', 404)
            db().admins[index] = { ...db().admins[index], ...pick(body, FIELDS.admin) }
            return ok(db().admins[index], '修改成功')
        }
    },
    {
        method: 'DELETE',
        write: true,
        test: /^\/admin\/delete$/,
        handle: ({ query }) => {
            const ids = parseIds(query.get('ids'))
            db().admins = db().admins.filter((item) => !ids.includes(item.id))
            return ok(null, '删除成功')
        }
    },

    /* ---------------- 实验室分类 ---------------- */
    {
        method: 'GET',
        test: /^\/lab\/category\/list$/,
        handle: ({ query }) => ok(paginate(db().labCategories, query, 50))
    },
    {
        method: 'GET',
        test: /^\/lab\/category\/find\/(\d+)$/,
        handle: ({ params }) => {
            const category = db().labCategories.find((item) => item.id === toInt(params[0]))
            return category ? ok(category) : fail('分类不存在', 404)
        }
    },
    {
        method: 'POST',
        write: true,
        test: /^\/lab\/category\/add$/,
        handle: ({ body }) => {
            const category = { ...pick(body, FIELDS.labCategory), id: nextId(db().labCategories) }
            db().labCategories.push(category)
            return ok(category, '添加成功')
        }
    },
    {
        method: 'PUT',
        write: true,
        test: /^\/lab\/category\/update$/,
        handle: ({ body }) => {
            const index = db().labCategories.findIndex((item) => item.id === toInt(body?.id))
            if (index < 0) return fail('分类不存在', 404)
            db().labCategories[index] = { ...db().labCategories[index], ...pick(body, FIELDS.labCategory) }
            return ok(db().labCategories[index], '修改成功')
        }
    },
    {
        method: 'DELETE',
        write: true,
        test: /^\/lab\/category\/delete$/,
        handle: ({ query }) => {
            const ids = parseIds(query.get('ids'))
            db().labCategories = db().labCategories.filter((item) => !ids.includes(item.id))
            return ok(null, '删除成功')
        }
    },

    /* ---------------- 实验室 ---------------- */
    {
        method: 'GET',
        test: /^\/laboratory\/list$/,
        handle: ({ query }) => ok(paginate(db().labs, query))
    },
    {
        method: 'GET',
        test: /^\/laboratory\/findl?\/(\d+)$/,
        handle: ({ params }) => {
            const lab = db().labs.find((item) => item.id === toInt(params[0]))
            return lab ? ok(lab) : fail('实验室不存在', 404)
        }
    },
    {
        method: 'POST',
        write: true,
        test: /^\/laboratory\/add$/,
        handle: ({ body }) => {
            const lab = { ...pick(body, FIELDS.laboratory), id: nextId(db().labs), laboratoryCount: 0 }
            db().labs.push(lab)
            return ok(lab, '添加成功')
        }
    },
    {
        method: 'PUT',
        write: true,
        test: /^\/laboratory\/update$/,
        handle: ({ body }) => {
            const index = db().labs.findIndex((item) => item.id === toInt(body?.id))
            if (index < 0) return fail('实验室不存在', 404)
            db().labs[index] = { ...db().labs[index], ...pick(body, FIELDS.laboratory) }
            return ok(db().labs[index], '修改成功')
        }
    },
    {
        method: 'DELETE',
        write: true,
        test: /^\/laboratory\/delete$/,
        handle: ({ query }) => {
            const ids = parseIds(query.get('ids'))
            db().labs = db().labs.filter((item) => !ids.includes(item.id))
            return ok(null, '删除成功')
        }
    },

    /* ---------------- 实验室预约记录 ---------------- */
    {
        method: 'GET',
        test: /^\/laboratory\/record\/list$/,
        handle: ({ query }) => ok(paginate(db().labRecords, query))
    },
    {
        method: 'GET',
        test: /^\/laboratory\/record\/find\/(\d+)$/,
        handle: ({ params }) => {
            const record = db().labRecords.find((item) => item.id === toInt(params[0]))
            return record ? ok(record) : fail('预约记录不存在', 404)
        }
    }
]

/**
 * 处理一次 mock 请求
 * @param {{ method: string, url: string, body?: any, headers?: Record<string, string> }} req
 * @returns {{ status: number, payload: object }}
 */
export const handleMockRequest = ({ method, url, body, headers = {} }) => {
    const [pathname, search = ''] = String(url || '').split('?')
    const path = pathname.replace(/^\/api(?=\/)/, '')
    const query = new URLSearchParams(search)
    const upperMethod = String(method || 'GET').toUpperCase()

    for (const route of routes()) {
        if (route.method !== upperMethod) continue
        const matched = route.test.exec(path)
        if (!matched) continue

        // 鉴权：非公开接口必须携带有效令牌；写操作仅限院长角色
        if (!route.public) {
            const admin = currentAdmin(headers)
            if (!admin) return { status: 401, payload: fail('登录已过期，请重新登录', 401) }
            if (route.write && admin.status !== 0) return { status: 403, payload: fail('权限不足', 403) }
        }

        try {
            const payload = route.handle({ params: matched.slice(1), query, body, headers })
            return { status: payload.code === 200 ? 200 : payload.code, payload }
        } catch (err) {
            return { status: 500, payload: fail(err?.message || 'Mock 服务异常') }
        }
    }

    return {
        status: 404,
        payload: fail(`Mock 未实现的接口: ${upperMethod} ${path}`, 404)
    }
}

/** 仅供测试/热更新使用：重置内存数据与令牌 */
export const resetMockDb = () => {
    state.db = createSeed()
    state.tokens = new Map()
}
