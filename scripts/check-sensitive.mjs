/**
 * 敏感信息扫描：检查 Git 跟踪的文本文件。
 *
 * 目标不是替代专业密钥扫描，而是阻止内网地址、个人邮箱、私钥/云密钥
 * 再次进入仓库。CI 每次运行，历史清理脚本也在发布前执行。
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const ROOT = new URL('..', import.meta.url)

const TRACKED = execFileSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' }).split('\0').filter(Boolean)

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

const failures = []

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

if (failures.length) {
    for (const failure of failures) process.stderr.write(`[check-sensitive] ${failure}\n`)
    process.exit(1)
}

process.stdout.write(`[check-sensitive] 通过：${TRACKED.length} 个跟踪文件未发现内网地址/个人邮箱/密钥标识\n`)
