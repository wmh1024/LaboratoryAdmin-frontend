/**
 * 生产产物与源码的 Mock 隔离检查。
 *
 * 1. dist/ 中不得出现种子数据、演示凭据或 Mock 运行时状态标识
 * 2. src/ 中应用代码只能从门面 `@/mock` 引入，禁止绕过门面直接引用子路径
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const DIST = join(ROOT, 'dist')
const SRC = join(ROOT, 'src')

const FORBIDDEN_BUNDLE_MARKERS = [
    '__LABADMIN_MOCK_STATE__',
    'createSeed',
    'DEMO_ACCOUNT',
    'demo_admin',
    'demo1234',
    '20990101',
    'mock-token-'
]

// 只允许精确门面 `@/mock`，禁止 `@/mock/browser` 等子路径绕过生产替换
const FORBIDDEN_IMPORT = /(?:from\s+|import\(\s*)['"]@\/mock\//

const walk = (dir) => {
    const files = []
    for (const name of readdirSync(dir)) {
        const full = join(dir, name)
        if (statSync(full).isDirectory()) files.push(...walk(full))
        else files.push(full)
    }
    return files
}

const failures = []

if (!statSync(DIST, { throwIfNoEntry: false })) {
    failures.push('未找到 dist/，请先运行 npm run build')
} else {
    for (const file of walk(DIST)) {
        if (!/\.(js|css|html)$/.test(file)) continue
        const content = readFileSync(file, 'utf8')
        for (const marker of FORBIDDEN_BUNDLE_MARKERS) {
            if (content.includes(marker)) failures.push(`dist/${relative(DIST, file)} 包含 Mock 标识: ${marker}`)
        }
    }
}

for (const file of walk(SRC)) {
    if (!/\.(js|vue)$/.test(file) || file.endsWith('.test.js')) continue
    const content = readFileSync(file, 'utf8')
    if (FORBIDDEN_IMPORT.test(content)) {
        failures.push(`src/${relative(SRC, file)} 绕过 Mock 门面直接引用子路径`)
    }
}

if (failures.length) {
    for (const failure of failures) process.stderr.write(`[check-bundle] ${failure}\n`)
    process.exit(1)
}

process.stdout.write('[check-bundle] 通过：生产产物无 Mock 标识，源码只通过 @/mock 门面引入\n')
