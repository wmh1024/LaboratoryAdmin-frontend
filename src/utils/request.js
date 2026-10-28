import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { REQUEST_TIMEOUT_MS } from '@/constants/api'

// 后端基础地址通过环境变量配置，见 .env.example
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'
// 是否使用内置 Mock 服务（无需后端）
const useMock = import.meta.env.VITE_USE_MOCK === 'true'

const request = axios.create({
    // 基础地址，超时时间
    baseURL,
    timeout: REQUEST_TIMEOUT_MS
})

/**
 * 安装 Mock 适配器。
 *
 * 必须在应用挂载前 await 完成，否则页面 setup 阶段发出的首批请求
 * 可能抢在适配器安装之前走真实网络（见 main.js）。
 */
export const setupMockAdapter = async () => {
    if (!useMock) return
    const { createMockAdapter } = await import('@/mock')
    request.defaults.adapter = createMockAdapter()
}

/** 统一处理登录失效：清理本地令牌并回到登录页 */
const handleUnauthorized = (message) => {
    const useStore = useUserStore()
    useStore.removeToken()
    ElMessage.error(message || '登录已过期，请重新登录')
    router.push('/login')
}

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        // 携带 token
        const useStore = useUserStore()
        if (useStore.token) {
            config.headers.Authorization = `Bearer ${useStore.token}`
        }
        return config
    },
    (err) => Promise.reject(err)
)

// 响应拦截器
request.interceptors.response.use(
    (res) => {
        const body = res.data
        // 兼容二进制/无 code 的响应
        if (!body || typeof body !== 'object' || !('code' in body)) {
            return res
        }
        // 兼容“HTTP 200 + 业务码 401”的后端实现，与网络层 401 做相同清理
        if (body.code === 401) {
            handleUnauthorized(body.msg)
            return Promise.reject(body)
        }
        // 仅 code === 200 视为业务成功，其余业务码均提示并中断
        if (body.code === 200) {
            return res
        }
        // 处理业务失败：提示并中断后续逻辑
        ElMessage.error(body.msg || '服务异常')
        return Promise.reject(body)
    },
    (err) => {
        const status = err.response?.status
        const body = err.response?.data
        const message = body?.msg || err.message || '服务异常'
        // 处理401错误 权限不足 或 token 过期 => 清理登录态并跳转登录
        if (status === 401) {
            handleUnauthorized(message === '服务异常' ? '登录已过期，请重新登录' : message)
            return Promise.reject(err)
        }
        if (status === 403) {
            ElMessage.error(message === '服务异常' ? '权限不足' : message)
        } else if (status) {
            ElMessage.error(message)
        } else if (err.code === 'ECONNABORTED') {
            ElMessage.error('请求超时，请稍后重试')
        } else {
            ElMessage.error('网络异常，请检查网络或后端服务')
        }
        return Promise.reject(err)
    }
)

export default request
export { baseURL }
