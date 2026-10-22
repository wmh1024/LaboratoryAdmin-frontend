/**
 * Mock 服务端（纯内存，无第三方依赖）
 *
 * - 由 Vite 开发服务器中间件 / preview 中间件调用 `handleMockRequest`
 * - 路由与 src/api/* 中的调用保持一致，返回结构与后端约定一致
 * - 数据在开发服务器生命周期内保持，重启后恢复种子数据
 */
import { createSeed } from './seed.js'

const PAGE_SIZE = 10

const state = {
  db: null
}

const db = () => {
  if (!state.db) state.db = createSeed()
  return state.db
}

const ok = (data = null, msg = '操作成功') => ({ code: 200, msg, data })

const fail = (msg, code = 500) => ({ code, msg, data: null })

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

/** token 中携带管理员 id，便于后续接口按登录人区分数据 */
const makeToken = (id) => `mock-token-${id}-${Date.now()}`

const listRoutes = () => [
  /* ---------------- 登录 ---------------- */
  {
    method: 'POST',
    test: /^\/admin\/login$/,
    handle: ({ body }) => {
      const username = String(body?.username ?? '').trim()
      const password = String(body?.password ?? '')
      if (!username || !password) return fail('用户名和密码不能为空', 400)
      // Mock 模式：任意非空账号密码均可登录，返回演示管理员
      const admin = db().admins.find((item) => item.username === username) || db().admins[0]
      return ok({ token: makeToken(admin.id) })
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
      return user ? ok(user) : fail('用户不存在')
    }
  },
  {
    method: 'POST',
    test: /^\/user\/add$/,
    handle: ({ body }) => {
      const user = { ...body, id: nextId(db().users) }
      db().users.push(user)
      return ok(user, '添加成功')
    }
  },
  {
    method: 'PUT',
    test: /^\/user\/update$/,
    handle: ({ body }) => {
      const index = db().users.findIndex((item) => item.id === toInt(body?.id))
      if (index < 0) return fail('用户不存在')
      db().users[index] = { ...db().users[index], ...body }
      return ok(db().users[index], '修改成功')
    }
  },
  {
    method: 'DELETE',
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
      return admin ? ok(admin) : fail('管理员不存在')
    }
  },
  {
    method: 'POST',
    test: /^\/admin\/add$/,
    handle: ({ body }) => {
      const admin = { ...body, id: nextId(db().admins) }
      db().admins.push(admin)
      return ok(admin, '添加成功')
    }
  },
  {
    method: 'PUT',
    test: /^\/(?:admin|user)\/update$/,
    handle: ({ body }) => {
      const index = db().admins.findIndex((item) => item.id === toInt(body?.id))
      if (index < 0) return fail('管理员不存在')
      db().admins[index] = { ...db().admins[index], ...body }
      return ok(db().admins[index], '修改成功')
    }
  },
  {
    method: 'DELETE',
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
      return category ? ok(category) : fail('分类不存在')
    }
  },
  {
    method: 'POST',
    test: /^\/lab\/category\/add$/,
    handle: ({ body }) => {
      const category = { ...body, id: nextId(db().labCategories) }
      db().labCategories.push(category)
      return ok(category, '添加成功')
    }
  },
  {
    method: 'PUT',
    test: /^\/lab\/category\/update$/,
    handle: ({ body }) => {
      const index = db().labCategories.findIndex((item) => item.id === toInt(body?.id))
      if (index < 0) return fail('分类不存在')
      db().labCategories[index] = { ...db().labCategories[index], ...body }
      return ok(db().labCategories[index], '修改成功')
    }
  },
  {
    method: 'DELETE',
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
      return lab ? ok(lab) : fail('实验室不存在')
    }
  },
  {
    method: 'POST',
    test: /^\/laboratory\/add$/,
    handle: ({ body }) => {
      const lab = { ...body, id: nextId(db().labs) }
      db().labs.push(lab)
      return ok(lab, '添加成功')
    }
  },
  {
    method: 'PUT',
    test: /^\/laboratory\/update$/,
    handle: ({ body }) => {
      const index = db().labs.findIndex((item) => item.id === toInt(body?.id))
      if (index < 0) return fail('实验室不存在')
      db().labs[index] = { ...db().labs[index], ...body }
      return ok(db().labs[index], '修改成功')
    }
  },
  {
    method: 'DELETE',
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
    handle: ({ query }) => {
      const page = Math.max(toInt(query.get('page'), 1), 1)
      const size = Math.max(toInt(query.get('pageSize'), PAGE_SIZE), 1)
      const start = (page - 1) * size
      return ok({
        items: db().labRecords.slice(start, start + size),
        counts: db().labRecords.length
      })
    }
  },
  {
    method: 'GET',
    test: /^\/laboratory\/record\/find\/(\d+)$/,
    handle: ({ params }) => {
      const record = db().labRecords.find((item) => item.id === toInt(params[0]))
      return record ? ok(record) : fail('预约记录不存在')
    }
  }
]

/**
 * 处理一次 mock 请求
 * @param {{ method: string, url: string, body?: any }} req
 * @returns {{ status: number, payload: object } | null} 未命中路由时返回 null
 */
export const handleMockRequest = ({ method, url, body }) => {
  const [pathname, search = ''] = String(url || '').split('?')
  const path = pathname.replace(/^\/api(?=\/)/, '')
  const query = new URLSearchParams(search)
  const upperMethod = String(method || 'GET').toUpperCase()

  for (const route of listRoutes()) {
    if (route.method !== upperMethod) continue
    const matched = route.test.exec(path)
    if (!matched) continue
    try {
      return { status: 200, payload: route.handle({ params: matched.slice(1), query, body }) }
    } catch (err) {
      return { status: 500, payload: fail(err?.message || 'Mock 服务异常') }
    }
  }

  return {
    status: 404,
    payload: fail(`Mock 未实现的接口: ${upperMethod} ${path}`, 404)
  }
}

/** 仅供测试/热更新使用：重置内存数据 */
export const resetMockDb = () => {
  state.db = createSeed()
}
