import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'
import mockPlugin from './build/mock-plugin.js'

export default defineConfig(({ mode, command, isPreview }) => {
    // 仅加载 VITE_ 前缀的变量，避免把系统环境变量一并读入
    const env = loadEnv(mode, process.cwd(), 'VITE_')

    // 生产构建默认关闭 Mock，即使 .env 里残留 VITE_USE_MOCK=true 也不会打进产物。
    // 需要发布「纯前端 demo」（GitHub Pages / 纯静态演示）时请使用 `npm run build:demo`。
    // preview 的 command 同样是 serve，必须显式排除，否则 `npm run preview` 会在生产产物上挂出 Mock，
    // 让「构建期已剔除 Mock」的验证结论失真。
    const useMock = mode === 'demo' || (!isPreview && command === 'serve' && String(env.VITE_USE_MOCK) === 'true')
    // 单元测试由 jsdom 运行，不需要也不支持 Element Plus 的 CSS 副作用导入
    const isTest = mode === 'test' || !!process.env.VITEST
    const elementPlusResolver = ElementPlusResolver({ importStyle: isTest ? false : 'css' })
    if (command === 'build' && mode !== 'demo' && String(env.VITE_USE_MOCK) === 'true') {
        console.warn(
            '[mock] VITE_USE_MOCK=true 仅对 dev server 生效，生产构建已忽略；如需 demo 构建请用 npm run build:demo'
        )
    }
    if (isPreview && mode !== 'demo' && String(env.VITE_USE_MOCK) === 'true') {
        console.warn('[mock] preview 生产构建时不启用 Mock；如需预览带 Mock 的产物请用 npm run preview:demo')
    }

    return {
        plugins: [
            vue(),
            AutoImport({
                imports: ['vue', 'vue-router'],
                resolvers: [elementPlusResolver]
            }),
            Components({
                resolvers: [elementPlusResolver]
            }),
            // 无后端时可通过 VITE_USE_MOCK=true 启用内置 Mock 服务
            mockPlugin({ useMock })
        ],
        resolve: {
            // alias 数组按顺序匹配；`@/mock` 必须精确匹配，不能影响 `@/mock/xxx` 子路径
            alias: [
                ...(useMock
                    ? []
                    : [
                          {
                              find: /^@\/mock$/,
                              replacement: fileURLToPath(new URL('./src/__mock_disabled__.js', import.meta.url))
                          }
                      ]),
                { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }
            ]
        },
        // 让 import.meta.env.VITE_USE_MOCK 在构建期被静态替换，动态 import 才能真正被摇树剔除
        define: {
            'import.meta.env.VITE_USE_MOCK': JSON.stringify(useMock ? 'true' : 'false'),
            // demo 构建部署在任意静态子路径下，使用 hash 路由避免深层链接依赖 404 回退
            'import.meta.env.VITE_ROUTER_MODE': JSON.stringify(mode === 'demo' ? 'hash' : 'history')
        },
        server: {
            // 仅监听本机，避免 dev server 暴露到局域网
            host: env.VITE_DEV_HOST || '127.0.0.1',
            port: 5173,
            strictPort: true
        },
        // 静态 demo 构建（mode=demo）产物用于纯静态部署，使用相对路径
        base: mode === 'demo' ? './' : '/',
        test: {
            environment: 'jsdom',
            setupFiles: ['./tests/setup.js'],
            coverage: {
                provider: 'v8',
                reporter: ['text', 'html'],
                include: ['src/**/*.{js,vue}'],
                exclude: ['src/main.js', 'src/mock/seed.js', 'src/**/*.test.js']
            }
        }
    }
})
