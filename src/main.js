import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@/stores/index'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { setupMockAdapter } from '@/utils/request'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
app.use(pinia)

// Mock 适配器必须在挂载前安装完毕，否则首屏请求会抢跑走真实网络
setupMockAdapter().finally(() => app.mount('#app'))
