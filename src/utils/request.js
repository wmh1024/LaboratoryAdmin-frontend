import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'http://192.168.126.131:8081'

const request = axios.create({
    // 基础地址，超时时间
    baseURL,
    timeout: 3000
})

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        console.log("config", config)
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
        // 查看res
        console.log("res", res)
        // 摘取核心响应数据
        if (res.data.code !== 500) {
            return res
        } else {
            // 处理业务失败
            ElMessage.error(res.data.msg || '服务异常')
            return Promise.reject(res.data)
        }
    },
    (err) => {
        // 处理401错误 权限不足 或 token 过期 => 拦截到登录
        if (err.response?.status === 401) {
            router.push('/login')
        }
        // 错误的默认情况 => 只要给提示
        ElMessage.error(err.response.data.msg || '服务异常')
        return Promise.reject(err)
    }
)

export default request
export { baseURL }
