import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'
import mockPlugin from './build/mock-plugin.js'

export default defineConfig(({ mode, command }) => {
    // 仅加载 VITE_ 前缀的变量，避免把系统环境变量一并读入
    const env = loadEnv(mode, process.cwd(), 'VITE_')

    // 生产构建默认关闭 Mock，即使 .env 里残留 VITE_USE_MOCK=true 也不会打进产物。
    // 需要发布「纯前端 demo」（GitHub Pages / 纯静态演示）时请使用 `npm run build:demo`。
    const useMock = mode === 'demo' || (command === 'serve' && String(env.VITE_USE_MOCK) === 'true')
    if (command === 'build' && mode !== 'demo' && String(env.VITE_USE_MOCK) === 'true') {
        console.warn(
            '[mock] VITE_USE_MOCK=true 仅对开发服务器生效，生产构建已忽略；如需 demo 构建请用 npm run build:demo'
        )
    }

    return {
        plugins: [
            vue(),
            AutoImport({
                imports: ['vue', 'vue-router'],
                resolvers: [ElementPlusResolver()]
            }),
            Components({
                resolvers: [ElementPlusResolver()]
            }),
            // 无后端时可通过 VITE_USE_MOCK=true 启用内置 Mock 服务
            mockPlugin({ useMock })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                // 生产构建把 Mock 目录指向空实现，保证 mock 代码与种子数据不进产物
                ...(useMock ? {} : { '@/mock': fileURLToPath(new URL('./src/__mock_disabled__.js', import.meta.url)) })
            }
        },
        // 让 import.meta.env.VITE_USE_MOCK 在构建期被静态替换，动态 import 才能真正被摇树剔除
        define: {
            'import.meta.env.VITE_USE_MOCK': JSON.stringify(useMock ? 'true' : 'false')
        },
        server: {
            // 仅监听本机，避免 dev server 暴露到局域网
            host: '127.0.0.1',
            port: 5173,
            strictPort: true
        },
        // 静态 demo 构建（mode=demo）产物用于纯静态部署，使用相对路径
        base: mode === 'demo' ? './' : '/'
    }
})
