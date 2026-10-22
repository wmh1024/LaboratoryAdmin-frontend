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
        // 摘取核心响应数据
        if (res.data?.code !== 500) {
            return res
        }
        // 处理业务失败
        ElMessage.error(res.data.msg || '服务异常')
        return Promise.reject(res.data)
    },
    (err) => {
        const status = err.response?.status
        const message = err.response?.data?.msg || err.message || '服务异常'
        // 处理401错误 权限不足 或 token 过期 => 清理登录态并跳转登录
        if (status === 401) {
            const useStore = useUserStore()
            useStore.removeToken()
            router.push('/login')
        }
        ElMessage.error(message)
        return Promise.reject(err)
    }
)

export default request
export { baseURL, useMock }
