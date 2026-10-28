/**
 * 生产产物与源码的 Mock 隔离检查。
 *
 * 1. 产物（dist/ 及同类构建目录）中不得出现种子数据、演示凭据或 Mock 运行时状态标识；
 * 2. src/ 中应用代码只能从精确门面 `@/mock` 引入 —— 任何能解析到 `src/mock/` 的写法都算绕过，
 *    包括 `@/mock/xxx`、`./mock/xxx`、`../mock`、以及 `@/mock/index.js` 这类等价写法。
 *
 * 第 2 条用「白名单 specifier + 路径解析」实现，而不是只匹配 `@/mock/` 前缀：
 * 前缀式正则对相对路径完全无效（`import '@/mock'` 之外的一切写法都能溜过去）。
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const DIST = join(ROOT, 'dist')
const SRC = join(ROOT, 'src')
const MOCK_DIR = join(SRC, 'mock')

const FORBIDDEN_BUNDLE_MARKERS = [
    '__LABADMIN_MOCK_STATE__',
    'createSeed',
    'DEMO_ACCOUNT',
    'demo_admin',
    'demo1234',
    '20990101',
    'mock-token-'
]

/** 允许的 Mock 引入写法：精确门面 `@/mock`（可带 `.js`） */
const ALLOWED_MOCK_SPECIFIERS = new Set(['@/mock', '@/mock.js'])

/** 抽取源文件里所有静态/动态 import 的 specifier */
const collectSpecifiers = (content) => {
    const specifiers = []
    // 先移除注释，避免把注释里的示例 import 当成真实依赖
    const stripped = content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')
    const patterns = [
        /\bfrom\s*['"]([^'"]+)['"]/g,
        /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
        /\bimport\s+['"]([^'"]+)['"]/g,
        /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g
    ]
    for (const pattern of patterns) {
        let match
        while ((match = pattern.exec(stripped))) specifiers.push(match[1])
    }
    return specifiers
}

/** 把 specifier 解析为绝对路径；解析不出来就返回 null */
const resolveSpecifier = (specifier, fromFile) => {
    if (specifier.startsWith('@/')) return join(SRC, specifier.slice(2))
    if (specifier.startsWith('.')) return resolve(join(fromFile, '..'), specifier)
    return null
}

const isInsideMockDir = (absolutePath) => absolutePath === MOCK_DIR || absolutePath.startsWith(MOCK_DIR + sep)

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

// 产物检查：dist/ 之外，也覆盖 Vite 生成的临时/预览目录（dist-probe 之类）
const BUNDLE_DIRS = readdirSync(ROOT).filter(
    (name) => name === 'dist' || (name.startsWith('dist-') && statSync(join(ROOT, name)).isDirectory())
)

if (!statSync(DIST, { throwIfNoEntry: false })) {
    failures.push('未找到 dist/，请先运行 npm run build')
} else {
    for (const dirName of BUNDLE_DIRS) {
        const dir = join(ROOT, dirName)
        for (const file of walk(dir)) {
            if (!/\.(js|css|html)$/.test(file)) continue
            const content = readFileSync(file, 'utf8')
            for (const marker of FORBIDDEN_BUNDLE_MARKERS) {
                if (content.includes(marker))
                    failures.push(`${dirName}/${relative(dir, file)} 包含 Mock 标识: ${marker}`)
            }
        }
    }
}

// 源码检查：白名单 specifier + 解析后不得落入 src/mock/
for (const file of walk(SRC)) {
    if (!/\.(js|vue)$/.test(file) || file.endsWith('.test.js')) continue
    const relPath = relative(ROOT, file).split(sep).join('/')
    // Mock 层自身与它的测试不受限制
    if (isInsideMockDir(file)) continue
    const content = readFileSync(file, 'utf8')
    for (const specifier of collectSpecifiers(content)) {
        const resolved = resolveSpecifier(specifier, file)
        if (!resolved) continue
        if (!isInsideMockDir(resolved)) continue
        if (ALLOWED_MOCK_SPECIFIERS.has(specifier)) continue
        failures.push(`${relPath} 绕过 Mock 门面直接引用 (${specifier})`)
    }
}

if (failures.length) {
    for (const failure of [...new Set(failures)]) process.stderr.write(`[check-bundle] ${failure}\n`)
    process.exit(1)
}

process.stdout.write('[check-bundle] 通过：生产产物无 Mock 标识，源码只通过 @/mock 门面引入\n')
