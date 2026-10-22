import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 后端基础地址通过环境变量配置，见 .env.example
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'
// 是否使用内置 Mock 服务（无需后端）
const useMock = String(import.meta.env.VITE_USE_MOCK) === 'true'

const request = axios.create({
    // 基础地址，超时时间
    baseURL,
    timeout: 10000
})

if (useMock) {
    // Mock 适配器按需加载，生产环境不会打包进主包
    import('@/mock/browser').then(({ createMockAdapter }) => {
        request.defaults.adapter = createMockAdapter()
    })
}

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        // 携带token
        const useStore = useUserStore()
        if (useStore.token) {
            config.headers.Authorization = useStore.token
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
            const useStore = useUserStore()
            useStore.removeToken()
            ElMessage.error('登录已过期，请重新登录')
            router.push('/login')
            return Promise.reject(err)
        }
        if (status) {
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
export { baseURL, useMock }
