/**
 * 应用层 Mock 适配：仅在 VITE_USE_MOCK=true 时被动态加载。
 *
 * 在浏览器端直接使用内存 Mock 服务，请求经 axios 适配器转发，
 * 因此无需依赖 Vite 插件（例如纯静态部署 demo 时）也能使用。
 */
import { handleMockRequest } from './server'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** 把 baseURL + url 拼成 URL 可解析的地址（浏览器内二者均为相对/绝对地址） */
const toAbsolute = (baseURL, url) => {
  const prefix = String(baseURL || '').replace(/\/+$/, '')
  const suffix = String(url || '')
  return prefix + (suffix.startsWith('/') ? suffix : `/${suffix}`)
}

const parseBody = (data) => {
  if (typeof data !== 'string') return data
  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

/**
 * 把 axios 的 params 序列化到 query string。
 * 注意：真实 HTTP 适配器会处理 params，而自定义 adapter 必须自己拼接，否则分页参数会丢失。
 */
const toQuery = (params) => {
  if (!params) return ''
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    search.append(key, Array.isArray(value) ? value.join(',') : String(value))
  })
  const query = search.toString()
  return query ? `?${query}` : ''
}

export const createMockAdapter = () => async (config) => {
  const method = String(config.method || 'get').toUpperCase()
  const body = parseBody(config.data)
  const { pathname, search } = new URL(toAbsolute(config.baseURL, config.url), window.location.origin)
  const query = search + toQuery(config.params)

  // 模拟网络延迟，便于观察 loading 状态
  await delay(120)

  const result = handleMockRequest({ method, url: pathname + query, body })

  return {
    data: result.payload,
    status: result.status,
    statusText: result.status === 200 ? 'OK' : 'Error',
    headers: {},
    config,
    request: {}
  }
}
