import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@/stores/index'
import 'element-plus/dist/index.css'
import { setupMockAdapter } from '@/utils/request'
import { DEMO_ACCOUNT_KEY } from '@/constants/injection'

const app = createApp(App)

app.use(router)
app.use(pinia)

/**
 * 挂载前完成所有异步初始化：
 * - 演示账号在入口处 await 一次并通过 provide 注入，避免页面 setup 变成 async setup
 * - Mock 适配器必须先安装，否则首屏请求会抢跑走真实网络
 */
const bootstrap = async () => {
    const demoAccount = import.meta.env.VITE_USE_MOCK === 'true' ? (await import('@/mock/demo')).DEMO_ACCOUNT : null
    app.provide(DEMO_ACCOUNT_KEY, demoAccount)

    try {
        await setupMockAdapter()
    } catch (err) {
        console.error('[mock] 初始化失败，将按真实后端模式运行', err)
    } finally {
        app.mount('#app')
    }
}

bootstrap()
