/**
 * 真实浏览器冒烟：验证 demo 构建的关键链路。
 *
 * 覆盖：
 * 1. /login 渲染出表单（回归：async setup 无 Suspense 导致白屏）
 * 2. 演示账号登录后进入用户列表且有数据
 * 3. 实验室管理“编辑 → 保存”闭环，编辑抽屉能正确回填
 *
 * 使用系统已安装的 Chrome（playwright-core 不下载浏览器），
 * 可通过 CHROME_PATH 指定可执行文件。
 */
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PORT = Number(process.env.SMOKE_PORT || 4173)
const BASE_URL = `http://127.0.0.1:${PORT}`
const WITH_SCREENSHOTS = process.argv.includes('--screenshots')

const CHROME_CANDIDATES = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].filter(Boolean)

const assert = (condition, message) => {
    if (!condition) throw new Error(message)
}

const waitForServer = async (timeoutMs = 30000) => {
    const started = Date.now()
    while (Date.now() - started < timeoutMs) {
        try {
            const res = await fetch(`${BASE_URL}/login`)
            if (res.ok) return
        } catch {
            // 服务尚未就绪
        }
        await new Promise((resolve) => setTimeout(resolve, 300))
    }
    throw new Error(`预览服务器在 ${timeoutMs}ms 内未就绪: ${BASE_URL}`)
}

const launchBrowser = async () => {
    try {
        return await chromium.launch({ channel: 'chrome', headless: true })
    } catch {
        // 某些环境没有注册 Chrome channel，继续尝试显式路径
    }
    let lastError
    for (const executablePath of CHROME_CANDIDATES) {
        if (!existsSync(executablePath)) continue
        try {
            return await chromium.launch({ executablePath, headless: true })
        } catch (err) {
            lastError = err
        }
    }
    throw new Error(`未找到可用的 Chrome，请设置 CHROME_PATH。${lastError?.message || ''}`)
}

const startPreview = () => {
    const viteBin = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url))
    const child = spawn(
        process.execPath,
        [viteBin, 'preview', '--mode', 'demo', '--port', String(PORT), '--strictPort'],
        { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], env: process.env }
    )
    child.stdout.on('data', (chunk) => process.stdout.write(`[preview] ${chunk}`))
    child.stderr.on('data', (chunk) => process.stderr.write(`[preview] ${chunk}`))
    return child
}

const screenshot = async (page, name) => {
    if (!WITH_SCREENSHOTS) return
    const dir = fileURLToPath(new URL('../docs/images', import.meta.url))
    mkdirSync(dir, { recursive: true })
    await page.screenshot({ path: `${dir}/${name}.jpg`, type: 'jpeg', quality: 82, fullPage: false })
    process.stdout.write(`[smoke] 截图已保存: docs/images/${name}.jpg\n`)
}

const main = async () => {
    if (!existsSync(`${ROOT}dist/index.html`)) {
        throw new Error('未找到 dist/index.html，请先运行 npm run build:demo')
    }

    const preview = startPreview()
    let browser
    try {
        await waitForServer()
        browser = await launchBrowser()
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

        const browserErrors = []
        page.on('console', (msg) => {
            // favicon 在 P4 补齐前会 404，不应影响功能冒烟
            if (msg.type() === 'error' && !msg.location().url.endsWith('/favicon.ico')) {
                browserErrors.push(`${msg.text()} @ ${msg.location().url}`)
            }
        })
        page.on('pageerror', (err) => browserErrors.push(err.message))

        // 1. 登录页真实渲染（demo 使用 hash 路由）
        await page.goto(`${BASE_URL}/#/login`, { waitUntil: 'networkidle' })
        await page.waitForSelector('.login-page')
        assert((await page.locator('#app').innerHTML()).trim().length > 0, '登录页 #app 为空（疑似白屏）')
        assert(await page.getByText('管理员登录').isVisible(), '未渲染登录标题')
        const inputs = page.locator('.login-page input')
        assert((await inputs.count()) >= 2, '登录表单输入框缺失')
        await screenshot(page, 'login')

        // 2. 演示账号登录 -> 用户列表
        await inputs.nth(0).fill('demo_admin')
        await inputs.nth(1).fill('demo1234')
        await page.getByRole('button', { name: '登录', exact: true }).click()
        await page.waitForURL(/data\/user/, { timeout: 15000 })
        await page.waitForSelector('.el-table__row')
        assert((await page.locator('.el-table__row').count()) > 0, '用户列表没有数据')
        await screenshot(page, 'user-list')

        // 3. 用户编辑抽屉：验证共享密码表单项与字段回填
        await page.locator('.el-table__row').first().locator('button').first().click()
        await page.waitForSelector('.el-drawer.open')
        const userDrawer = page.locator('.el-drawer.open')
        assert((await userDrawer.locator('input').count()) >= 6, '用户编辑抽屉字段不完整')
        const usernameValue = (await userDrawer.locator('input').first().inputValue()).trim()
        assert(usernameValue.length > 0, '用户编辑抽屉未回填学号(工号)')
        await page.keyboard.press('Escape')
        await page.waitForSelector('.el-drawer.open', { state: 'detached' })

        // 4. 实验室编辑回填 + 保存闭环（在 SPA 内跳转，避免 demo 内存 Mock 因整页刷新丢令牌）
        await page.locator('.el-sub-menu__title', { hasText: '实验室数据' }).click()
        await page.locator('.el-menu-item', { hasText: '实验室管理' }).click()
        await page.waitForURL(/lab\/manage/)
        await page.waitForSelector('.el-table__row')
        const firstRow = page.locator('.el-table__row').first()
        // 第 0 列是多选框，名称在第 1 列
        const originalName = (await firstRow.locator('td').nth(1).innerText()).trim()
        await firstRow.locator('button').first().click()
        await page.waitForSelector('.el-drawer.open')
        const drawer = page.locator('.el-drawer.open')
        const nameInput = drawer.locator('input').first()
        const locationInput = drawer.locator('input').nth(1)
        const filledName = (await nameInput.inputValue()).trim()
        assert(filledName === originalName, `编辑回填失败：表单=${filledName || '(空)'}，列表=${originalName}`)
        assert((await locationInput.inputValue()).trim().length > 0, '编辑抽屉位置字段未回填')
        await screenshot(page, 'edit-drawer')

        const nextLocation = `${(await locationInput.inputValue()).trim()}（冒烟）`
        await locationInput.fill(nextLocation)
        await drawer.getByRole('button', { name: '修改', exact: true }).click()
        await page.getByText('修改成功').waitFor({ timeout: 15000 })
        await page.waitForSelector('.el-drawer.open', { state: 'detached' })

        // 重新打开确认保存成功
        await page.locator('.el-table__row').first().locator('button').first().click()
        await page.waitForSelector('.el-drawer.open')
        const savedLocation = (await page.locator('.el-drawer.open input').nth(1).inputValue()).trim()
        assert(savedLocation === nextLocation, `编辑保存未生效：期望=${nextLocation}，实际=${savedLocation}`)

        assert(browserErrors.length === 0, `浏览器控制台出现错误：\n${browserErrors.join('\n')}`)
        process.stdout.write('[smoke] 通过：登录渲染、登录跳转、列表加载、编辑回填与保存闭环\n')
    } finally {
        await browser?.close()
        preview.kill()
    }
}

main().catch((err) => {
    console.error(`[smoke] 失败：${err.message}`)
    process.exitCode = 1
})
