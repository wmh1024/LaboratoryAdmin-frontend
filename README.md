<div align="center">

<img src="images/logo.png" alt="logo" width="120" height="120" />

# 实验室预约系统 · 管理端

基于 **Vue 3 + Element Plus + Vite** 的实验室预约管理端。
内置 **离线 Mock 服务**：克隆后无需任何后端即可登录并浏览、增删改全部演示数据。

[![License][license-shield]][license-url]
[![Vue][vue-shield]][vue-url]
[![Vite][vite-shield]][vite-url]
[![Node][node-shield]][node-url]

</div>

## 功能概览

| 模块 | 状态 |
| --- | --- |
| 管理员登录 / 退出 | ✅ |
| 用户信息管理（增删改查、分页） | ✅ |
| 管理员信息管理（增删改查、分页） | ✅ |
| 实验室管理（增删改查、分页、分类关联） | ✅ |
| 实验室类别（增删改查） | ✅ |
| 实验室预约记录（列表、分页、详情） | ✅ |
| 实验室注意事项 | 🚧 后端接口暂缺，仅占位 |
| 设备类别 / 负责人 / 预约记录 / 注意事项 | 🚧 占位 |
| 课表数据 / 数据留存 / 数据展示 | 🚧 占位 |

> 🚧 为尚未实现的模块，页面以“建设中”占位展示，不影响其他功能。

## 快速开始

环境要求：Node.js >= 18，包管理器 yarn（仓库提供 `yarn.lock`）。

```sh
git clone https://github.com/wmh1024/LaboratoryAdmin-frontend.git
cd LaboratoryAdmin-frontend
yarn

# 复制环境变量示例（默认已开启 Mock，无需后端）
cp .env.example .env

yarn dev         # 开发模式（默认 Mock）
yarn build:demo  # 纯静态演示构建（含 Mock，可直接静态托管）
yarn build       # 生产构建（排除 Mock，产物在 dist/）
yarn preview     # 预览构建产物
yarn test        # 单元测试（vitest）
```

Mock 模式下使用固定演示账号登录（登录页会提示）：

| 账号 | 密码 | 角色 |
| --- | --- | --- |
| `demo_admin` | `demo1234` | 院长（可增删改） |

Mock 服务会校验令牌：除登录外的接口都必须携带有效 `Authorization`，且只有「院长」角色可以写入数据，
因此演示环境与真实后端的鉴权行为一致，不会出现「打开页面就是管理员」的情况。

## 环境变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | 后端接口基础地址。前后端分离部署时填写完整地址，如 `https://api.example.com` |
| `VITE_USE_MOCK` | `true` | 是否启用内置 Mock 服务。**仅对开发服务器生效**，接入真实后端时设为 `false` |

### 构建方式

| 命令 | 用途 | Mock |
| --- | --- | --- |
| `yarn dev` | 本地开发 | 由 `VITE_USE_MOCK` 控制 |
| `yarn build` / `yarn build:prod` | 对接真实后端的生产构建 | ❌ 强制排除（Mock 代码与种子数据不会进入产物） |
| `yarn build:demo` | 纯静态演示（GitHub Pages 等） | ✅ 内置，产物使用相对路径 |

`.env` 已被 `.gitignore` 忽略，仓库只提交 `.env.example`。

## Mock 说明

- 实现位置：`src/mock/`
  - `seed.js`：种子数据（全部为虚构数据）
  - `account.js`：演示账号（生产构建不会进入产物）
  - `server.js`：类 REST 路由分发（内存存储，重启后重置）
  - `browser.js`：axios 适配器，浏览器内直接使用同一套路由
- 同时提供 Vite 中间件（`build/mock-plugin.js`），`/api/*` 请求在开发服务器阶段即可响应
- 新增接口时，请同步补充 Mock 路由，保证“无后端也能运行”

Mock 数据脱敏约定：学号为虚构号段，姓名为虚构姓名，手机号 `199-0000-xxxx`，
邮箱统一使用 `example.com`，地点使用“实验楼 A-101”等虚构地址。

## 接口约定

完整契约（字段、枚举、错误码、请求/响应示例）见 **[docs/API.md](./docs/API.md)**，本文件与 `src/api/*`、`src/mock/*` 均以此为准。

- 响应结构：`{ code: number, msg: string, data: any }`，`code === 200` 视为成功，失败时 HTTP 状态与业务码一致
- 分页数据：`data = { items: T[], counts: number }`，请求参数为 `page` / `pageSize`
- 认证：登录返回 `data.token`，前端以 `Authorization: Bearer <token>` 携带；令牌无效返回 `401`
- 权限：写接口（add/update/delete）仅「院长」（`status === 0`）可调用，否则返回 `403`
- 批量删除：`DELETE .../delete?ids=1,2,3`，`ids` 为必填的逗号分隔正整数
- 密码为只写字段：可随新增/修改提交，任何响应都不会返回 `password`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/admin/login` | 管理员登录 |
| POST | `/admin/logout` | 退出登录（作废当前令牌） |
| GET/POST/PUT/DELETE | `/user/list` `/user/find/{id}` `/user/add` `/user/update` `/user/delete` | 用户增删改查 |
| GET/POST/PUT/DELETE | `/admin/list` `/admin/find/{id}` `/admin/add` `/admin/update` `/admin/delete` | 管理员增删改查 |
| GET/POST/PUT/DELETE | `/lab/category/list` `/lab/category/find/{id}` `/lab/category/add` `/lab/category/update` `/lab/category/delete` | 实验室类别 |
| GET/POST/PUT/DELETE | `/laboratory/list` `/laboratory/find/{id}` `/laboratory/add` `/laboratory/update` `/laboratory/delete` | 实验室 |
| GET | `/laboratory/record/list` `/laboratory/record/find/{id}` | 实验室预约记录 |

## 技术栈

- Vue 3（组合式 API）+ Vue Router
- Element Plus（按需自动引入）
- Pinia（登录态持久化）
- Axios（统一请求/响应拦截）
- Vite + Sass

## 开发规范

- 静态检查：`yarn lint`（ESLint 9 + eslint-plugin-vue），格式化：`yarn format`（Prettier）
- 单元测试：`yarn test`（Vitest），覆盖 API 工具、分页 composable 与 Mock 服务
- 提交前请确保 `yarn lint`、`yarn format:check`、`yarn test`、`yarn build` 全部通过（CI 会自动检查）
- 详见 [CONTRIBUTING.md](./CONTRIBUTING.md)

## 部署

| 场景 | 命令 | 产物 | 注意事项 |
| --- | --- | --- | --- |
| 对接真实后端 | `yarn build`（或 `build:prod`） | `dist/` | Mock 已被构建期剔除，可用 CI 断言校验 |
| 纯静态演示（无后端） | `yarn build:demo` | `dist/`（`base` 为相对路径） | 含 Mock 与演示账号，**请勿当作生产环境部署** |

> `yarn preview` 预览 demo 时同样可用；若直接 `scp dist/` 部署，请先确认所用的是哪种构建。

## 参与贡献

1. Fork 本仓库
2. 新建分支：`git checkout -b feat/your-feature`
3. 提交改动：`git commit -m 'feat: your feature'`
4. 推送分支并发起 Pull Request

## 安全

请勿在仓库中提交真实个人信息、内网地址或账号密码；发现安全问题请参见 [SECURITY.md](./SECURITY.md)。

## 许可证

本项目基于 [MIT License](./LICENSE.txt) 开源。

<!-- links -->
[license-shield]: https://img.shields.io/github/license/wmh1024/LaboratoryAdmin-frontend.svg?style=flat-square
[license-url]: ./LICENSE.txt
[vue-shield]: https://img.shields.io/badge/Vue-3.x-42b883?style=flat-square&logo=vue.js
[vue-url]: https://vuejs.org/
[vite-shield]: https://img.shields.io/badge/Vite-5.x-646cff?style=flat-square&logo=vite
[vite-url]: https://vitejs.dev/
[node-shield]: https://img.shields.io/badge/Node-%3E%3D18-339933?style=flat-square&logo=node.js
[node-url]: https://nodejs.org/
