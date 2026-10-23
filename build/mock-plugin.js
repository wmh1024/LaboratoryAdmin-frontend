/**
 * Vite Mock 插件：在开发服务器 / preview 服务器上挂载 mock 中间件。
 *
 * 仅当 VITE_USE_MOCK=true 时启用，生产构建不受影响。
 */
import { handleMockRequest } from '../src/mock/server.js'

const readBody = (req) =>
    new Promise((resolve) => {
        const chunks = []
        req.on('data', (chunk) => chunks.push(chunk))
        req.on('end', () => {
            const raw = Buffer.concat(chunks).toString('utf8')
            if (!raw) return resolve(undefined)
            try {
                resolve(JSON.parse(raw))
            } catch {
                resolve(raw)
            }
        })
        req.on('error', () => resolve(undefined))
    })

const send = (res, status, payload) => {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    res.end(JSON.stringify(payload))
}

export const createMockMiddleware = () => {
    const middleware = async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next()
        const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await readBody(req) : undefined
        // 模拟网络延迟，便于观察 loading 状态
        await new Promise((resolve) => setTimeout(resolve, 120))
        const result = handleMockRequest({
            method: req.method,
            url: req.url,
            body,
            headers: { authorization: req.headers.authorization || '' }
        })
        if (!result) return next()
        send(res, result.status, result.payload)
    }
    return middleware
}

export default function mockPlugin(options = {}) {
    const enabled = String(options.useMock) === 'true'
    return {
        name: 'labadmin-mock',
        // apply 用于按 command 过滤插件；这里用显式常量避免误读为「每次都应用」
        apply: enabled ? () => true : () => false,
        configResolved(config) {
            if (enabled) config.logger.info('[mock] 已启用内存 Mock 服务（/api）')
        },
        configureServer(server) {
            server.middlewares.use(createMockMiddleware())
        },
        configurePreviewServer(server) {
            server.middlewares.use(createMockMiddleware())
        }
    }
}
