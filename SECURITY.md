# 安全策略

## 支持版本

本项目为教学/演示性质的前端管理端，仅维护最新发布版本与 `main` 分支。

| 版本    | 支持状态              |
| ------- | --------------------- |
| `0.1.x` | ✅ 接收安全报告并修复 |
| `< 0.1` | ❌ 不再维护，请升级   |

## 报告漏洞

请通过 GitHub 私密漏洞报告提交：

<https://github.com/wmh1024/LaboratoryAdmin-frontend/security/advisories/new>

不要提交公开 Issue、Discussion 或 PR。报告请尽量包含：

- 复现步骤、影响版本与运行环境
- 受影响文件 / 组件 / 接口
- 可能的影响范围与建议的缓解方式
- 是否已在公开渠道披露

## 响应承诺

以下为尽最大努力的承诺，不构成法律意义上的 SLA：

- 收到报告后 **72 小时**内确认并开始评估
- **30 天**内给出修复、缓解方案或明确的后续计划
- 修复发布后，在 GitHub Security Advisory 中披露致谢（除非报告者要求匿名）

## 前端安全提示

本项目**没有后端实现**，前端无法独立保证认证与授权安全：

- 登录令牌由后端签发，前端仅做持久化与请求携带，切勿在前端存放真实密钥
- 生产部署请通过环境变量配置后端地址（`VITE_API_BASE_URL`），避免硬编码内网地址
- 仓库内置的 Mock 服务仅用于本地演示：`npm run dev` 按 `VITE_USE_MOCK` 决定是否启用；
  `npm run build` / `npm run build:prod` 会在构建期把唯一门面 `@/mock` 替换为空实现，
  排除 Mock 代码与种子数据；只有显式的 `npm run build:demo` 会打包 Mock（用于纯静态演示）。
  `npm run preview` 预览**生产**产物时不会挂载 Mock，请勿把 demo 产物当作生产环境部署。
- Mock 服务同样校验令牌（除登录外一律 401）与角色（写操作仅院长），演示账号固定为 `demo_admin` / `demo1234`
- 仓库中的示例数据均为虚构数据，请勿替换为真实用户信息
- 登录令牌以明文存放于浏览器 localStorage，请勿在管理端存放超出演示需要的高敏感数据；
  生产部署建议改为 HttpOnly Cookie
- 部署时请配置 CSP、`X-Content-Type-Options`、`Referrer-Policy` 等安全响应头，
  示例见 [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## 依赖漏洞

- `npm audit --omit=dev`：生产依赖需保持 0 漏洞
- 开发依赖链（vite / esbuild 等）出现高危告警时，应在 7 个工作日内评估升级或缓解措施
- Dependabot 每周检查 npm minor/patch 更新，major 升级由维护者人工评估
