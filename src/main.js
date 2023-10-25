import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@/stores/index'
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
