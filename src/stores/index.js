import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
import { useUserStore } from '@/stores/modules/user'

const pinia = createPinia()
pinia.use(persist)

export * from './modules/user'
export default pinia
