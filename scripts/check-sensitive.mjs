/**
 * 敏感信息扫描，覆盖四个维度：
 *
 * 1. 工作区文件内容：内网地址、个人邮箱、私钥/云密钥标识；
 * 2. Git 历史对象：所有可达 blob 的路径与内容（防止第三方素材、构建产物、旧配置藏在历史里）；
 * 3. 仓库元数据：author / committer / tagger 邮箱白名单；
 * 4. 构建产物入库：仓库内不得出现 dist.zip、*.zip 之类的打包结果。
 *
 * 历史维度用 `git rev-list --objects --all` + `git cat-file` 抽样读取，不依赖外部工具；
 * 内容比对限制在文本类扩展名与体积上限内，避免拖慢 CI。
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const ROOT = new URL('..', import.meta.url)
const MAX_HISTORY_BLOB_BYTES = 2 * 1024 * 1024

const git = (args, options = {}) =>
    execFileSync('git', args, {
        cwd: ROOT,
        encoding: options.encoding ?? 'utf8',
        maxBuffer: options.maxBuffer ?? 64 * 1024 * 1024,
        input: options.input
    })

const TRACKED = git(['ls-files', '-z']).split('\0').filter(Boolean)

const RULES = [
    {
        name: '内网 IP 地址',
        pattern:
            /\b(?:192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/
    },
    {
        name: '维护者个人邮箱',
        pattern: /wmh031024@163\.com/i
    },
    {
        name: '私钥文件头',
        pattern: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/
    },
    {
        name: '云服务访问密钥',
        pattern: /\bAKIA[0-9A-Z]{16}\b/
    },
    {
        name: 'GitHub Token',
        pattern: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}\b|\bgithub_pat_[A-Za-z0-9_]{20,}\b/
    }
]

const BINARY_EXTENSIONS = /\.(png|jpe?g|gif|webp|ico|pdf|zip|gz|tgz|woff2?|ttf|otf|mp4|webm|jar|exe)$/i

/** 禁止入库的构建产物 / 打包文件 */
const FORBIDDEN_ARTIFACTS = [/\.zip$/i, /^dist\//i, /(^|\/)dist-[^/]+\//i, /\.tar\.gz$/i, /\.bundle$/i]

/** 允许出现在提交/标签元数据里的邮箱 */
const ALLOWED_EMAILS = [
    /^wmh1024@users\.noreply\.github\.com$/i,
    /^88307754\+wmh1024@users\.noreply\.github\.com$/i,
    /^noreply@github\.com$/i,
    /^github-actions\[bot\]@users\.noreply\.github\.com$/i,
    /^actions@github\.com$/i
]

const failures = []

/** 维度 1：工作区文件内容 */
for (const file of TRACKED) {
    if (BINARY_EXTENSIONS.test(file)) continue
    let content
    try {
        content = readFileSync(new URL(file, ROOT), 'utf8')
    } catch {
        continue
    }
    for (const rule of RULES) {
        if (rule.pattern.test(content)) failures.push(`${file}: ${rule.name}`)
    }
}

/** 维度 2：禁止入库的构建产物（按路径） */
for (const file of TRACKED) {
    if (FORBIDDEN_ARTIFACTS.some((pattern) => pattern.test(file))) {
        failures.push(`${file}: 构建产物不应入库（请删除并在 .gitignore 中排除）`)
    }
}

/** 维度 3：Git 历史对象（路径 + 内容） */
const historyLines = git(['rev-list', '--objects', '--all']).split('\n').filter(Boolean)
const historyPaths = new Map()
for (const line of historyLines) {
    const [sha, ...rest] = line.split(' ')
    if (!rest.length) continue
    historyPaths.set(rest.join(' '), sha)
}

for (const [path, sha] of historyPaths) {
    if (FORBIDDEN_ARTIFACTS.some((pattern) => pattern.test(path))) {
        failures.push(`历史对象 ${sha.slice(0, 8)} (${path}): 构建产物不应入库`)
    }
}

// 用一次 batch-check 拿到所有对象的类型与体积，只对 blob 做内容检查
const batchInput = [...new Set(historyPaths.values())].join('\n') + '\n'
const batchOutput = git(['cat-file', '--batch-check=%(objectname) %(objecttype) %(objectsize)'], {
    input: batchInput
})
const blobInfo = new Map()
for (const row of batchOutput.split('\n').filter(Boolean)) {
    const [sha, type, size] = row.split(' ')
    if (type === 'blob') blobInfo.set(sha, Number(size))
}

const seenBlobs = new Set()
for (const [path, sha] of historyPaths) {
    if (!blobInfo.has(sha)) continue
    if (BINARY_EXTENSIONS.test(path)) continue
    if (seenBlobs.has(sha)) continue
    seenBlobs.add(sha)
    const size = blobInfo.get(sha)
    if (!Number.isFinite(size) || size > MAX_HISTORY_BLOB_BYTES) continue
    let content
    try {
        content = git(['cat-file', 'blob', sha])
    } catch {
        continue
    }
    for (const rule of RULES) {
        if (rule.pattern.test(content)) failures.push(`历史对象 ${sha.slice(0, 8)} (${path}): ${rule.name}`)
    }
}

/** 维度 4：提交与标签的邮箱白名单 */
const emailRows = git(['log', '--all', '--format=%H%x09%ae%x09%ce'])
for (const row of emailRows.split('\n').filter(Boolean)) {
    const [sha, authorEmail, committerEmail] = row.split('\t')
    for (const email of [authorEmail, committerEmail]) {
        if (!email) continue
        if (!ALLOWED_EMAILS.some((pattern) => pattern.test(email))) {
            failures.push(`提交 ${sha.slice(0, 8)}: 邮箱不在白名单内 (${email})`)
        }
    }
}

const tagRows = git(['for-each-ref', 'refs/tags', '--format=%(refname:short)%09%(taggeremail)'])
for (const row of tagRows.split('\n').filter(Boolean)) {
    const [tag, taggerEmail] = row.split('\t')
    const email = (taggerEmail || '').replace(/^<|>$/g, '')
    if (!email) continue
    if (!ALLOWED_EMAILS.some((pattern) => pattern.test(email))) {
        failures.push(`标签 ${tag}: 署名邮箱不在白名单内 (${email})`)
    }
}

let acceptedCount = 0
if (failures.length) {
    const unique = [...new Set(failures)]
    // 基线白名单：只用于「已确认、已有明确处理计划」的历史遗留项，且必须逐条列出。
    // 新增任何条目都应当在 PR 中说明原因与移除时间；清空基线是发布前的硬性要求。
    const baselinePath = new URL('../security-baseline.json', import.meta.url)
    let baseline = []
    try {
        baseline = JSON.parse(readFileSync(baselinePath, 'utf8')).accepted ?? []
    } catch {
        baseline = []
    }
    // 比对前把问题行末尾的括号内容（例如具体的邮箱地址）去掉，
    // 这样基线条目本身就不必写入敏感串，避免"豁免清单自己变成泄漏源"。
    const normalize = (text) =>
        text
            .replace(/（[^）]*）\s*$/, '')
            .replace(/\s*\([^)]*\)\s*$/, '')
            .trim()
    const isAccepted = (failure) => {
        const normalized = normalize(failure)
        return baseline.some((entry) => normalized === normalize(entry.match) || failure === entry.match)
    }
    const blocking = unique.filter((failure) => !isAccepted(failure))
    const accepted = unique.filter(isAccepted)
    acceptedCount = accepted.length

    for (const failure of accepted) {
        process.stdout.write(`[check-sensitive] 已知遗留（基线豁免）：${failure}\n`)
    }
    if (blocking.length) {
        for (const failure of blocking) process.stderr.write(`[check-sensitive] ${failure}\n`)
        process.stderr.write(
            '[check-sensitive] 失败：存在未登记的敏感信息问题。若确认是已知遗留项，请登记到 security-baseline.json 并说明处理计划。\n'
        )
        process.exit(1)
    }
}

process.stdout.write(
    `[check-sensitive] 扫描完成：${TRACKED.length} 个跟踪文件、${seenBlobs.size} 个历史文本对象、` +
        `${emailRows.split('\n').filter(Boolean).length} 个提交、${tagRows.split('\n').filter(Boolean).length} 个标签` +
        `${acceptedCount > 0 ? `；其中 ${acceptedCount} 项为已登记的基线遗留（见 security-baseline.json）` : '；无任何问题'}\n`
)
if (acceptedCount > 0) {
    process.stdout.write('[check-sensitive] 注意：基线豁免必须在发布前清空，当前仍有遗留项\n')
}
