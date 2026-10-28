/**
 * 构建模式守卫：确认 Mock 只在「该出现的地方」出现。
 *
 * 覆盖三种服务形态，任何一种回归都会让 CI 失败：
 * 1. `vite preview`（生产产物）：/api 不得被 Mock 接管，否则"构建期已剔除 Mock"的验证结论失真；
 * 2. `vite preview --mode demo`（demo 产物）：/api 必须可用，否则冒烟脚本与线上演示站会失去数据源；
 * 3. `vite`（dev server）：/api 必须可用，否则本地开发无法脱离后端。
 *
 * 判定方式用「登录接口是否返回 200 + token」而不是日志文案，避免被日志改动骗过。
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const VITE_BIN = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url))

const LOGIN_BODY = JSON.stringify({ username: 'demo_admin', password: 'demo1234' })

const start = (args, port) =>
    spawn(process.execPath, [VITE_BIN, ...args, '--port', String(port), '--strictPort'], {
        cwd: ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, VITE_DEV_HOST: '127.0.0.1' }
    })

const waitForServer = async (port, timeoutMs = 30000) => {
    const started = Date.now()
    while (Date.now() - started < timeoutMs) {
        try {
            const res = await fetch(`http://127.0.0.1:${port}/`)
            if (res.ok) return
        } catch {
            // 服务尚未就绪
        }
        await new Promise((resolve) => setTimeout(resolve, 250))
    }
    throw new Error(`服务在 ${timeoutMs}ms 内未就绪: :${port}`)
}

/** 返回 { ok, status }，ok 表示 Mock 登录是否成功接管了 /api */
const probeLogin = async (port) => {
    try {
        const res = await fetch(`http://127.0.0.1:${port}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: LOGIN_BODY
        })
        if (!res.ok) return { ok: false, status: res.status }
        const body = await res.json().catch(() => null)
        return { ok: Boolean(body?.data?.token), status: res.status, body }
    } catch (err) {
        return { ok: false, status: 0, error: err.message }
    }
}

const scenario = async ({ name, args, port, expectMock }) => {
    const child = start(args, port)
    let output = ''
    child.stdout.on('data', (chunk) => (output += chunk))
    child.stderr.on('data', (chunk) => (output += chunk))
    try {
        await waitForServer(port)
        const result = await probeLogin(port)
        if (result.ok !== expectMock) {
            const expectation = expectMock ? '应当' : '不应当'
            throw new Error(
                `${name}：Mock ${expectation}接管 /api，实际 status=${result.status}` +
                    (result.body ? ` body=${JSON.stringify(result.body)}` : '') +
                    `\n--- 服务输出 ---\n${output.trim()}`
            )
        }
        process.stdout.write(`[check-modes] ${name}: ${expectMock ? 'Mock 已启用' : 'Mock 未启用'} ✓\n`)
    } finally {
        child.kill()
    }
}

const ensureDist = () => {
    if (!existsSync(`${ROOT}dist/index.html`)) {
        throw new Error('未找到 dist/index.html，请先运行 npm run build')
    }
}

const main = async () => {
    ensureDist()
    // 生产产物：preview 必须拿不到 Mock（R2 的回归断言）
    await scenario({
        name: 'preview（生产产物）',
        args: ['preview'],
        port: 4311,
        expectMock: false
    })
    // demo 产物：preview --mode demo 必须有 Mock
    await scenario({
        name: 'preview --mode demo（演示产物）',
        args: ['preview', '--mode', 'demo'],
        port: 4312,
        expectMock: true
    })
    // dev server：必须有 Mock
    await scenario({
        name: 'dev server',
        args: [],
        port: 4313,
        expectMock: true
    })
    process.stdout.write('[check-modes] 通过：Mock 只在 dev 与 demo 模式生效\n')
}

main().catch((err) => {
    console.error(`[check-modes] 失败：${err.message}`)
    process.exitCode = 1
})
