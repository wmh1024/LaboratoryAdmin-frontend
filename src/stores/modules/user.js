import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
    'lab',
    () => {
        const token = ref('')
        const setToken = (newToken) => {
            token.value = newToken
        }
        const removeToken = () => {
            token.value = ''
        }

        return {
            token,
            setToken,
            removeToken
        }
    },
    {
        // 持久化
        persist: true
    }
)
