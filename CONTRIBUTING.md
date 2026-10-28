# 贡献指南

感谢你愿意为这个项目做出贡献！请在提交前阅读以下约定。

## 开发环境

- Node.js `^20.19.0` 或 `>=22.12.0`（Vite 8 要求）
- 包管理器：npm（仓库提供 `package-lock.json`）

```sh
npm ci                  # 按锁文件安装依赖（首次或新增依赖可用 npm install）
cp .env.example .env    # 必须复制；否则 VITE_USE_MOCK 为空，Mock 不会启用
# Windows PowerShell / cmd：Copy-Item .env.example .env

npm run dev             # 本地开发（.env 中 VITE_USE_MOCK=true 时使用 Mock）
npm run lint            # 静态检查
npm run format:check    # 格式检查
npm test                # 单元/组件测试（Vitest + jsdom）
npm run test:coverage   # 覆盖率基线
npm run build           # 生产构建检查
npm run check:bundle    # 确认生产产物不含 Mock
npm run smoke           # 构建 demo 并用真实 Chrome 验证关键链路
```

## 分支与提交

1. 从 `main` 切出分支：`git checkout -b fix/xxx` 或 `feat/xxx`
2. 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)：
   `fix(lab-manage): 修正分类下拉字段`
3. 提交前确保 `npm run lint`、`npm run format:check`、`npm test`、`npm run build` 与
   `npm run check:bundle` 均通过；涉及 UI 时再跑 `npm run smoke`
4. 发起 Pull Request 并填写模板中的改动动机、影响范围与自测清单

## 代码约定

- Vue 3 `<script setup>` 组合式 API，4 空格缩进、单引号、无分号（以 `.prettierrc.json` 为准，提交前请跑 `npm run format`）
- 接口统一走 `src/utils/request.js`，组件内不要直接使用 axios
- 页面请求需处理失败分支（错误提示由拦截器统一弹出，页面只需 `try/catch/finally` 复位状态）
- 列表页优先复用 `composables/usePagedList`、`composables/useCrudDrawer` 与 `components/CrudTable`，不要重复实现分页/删除/抽屉逻辑
- 密码/确认密码校验复用 `composables/usePasswordConfirm` 与 `components/PasswordFormItems`
- 角色、状态等枚举统一维护在 `src/constants/`，禁止在页面内另行定义一套
- 分页、超时、Mock 延迟、抽屉尺寸等常量统一从 `src/constants/api.js` 与 `src/constants/ui.js` 引用
- 应用代码只能从 `@/mock` 门面引入 Mock，禁止直接引用 `@/mock/*` 子路径
- 禁止提交调试日志（`console.log`）
- 禁止提交真实的个人信息、内网地址、账号密码
- 新增媒体资源请在 `docs/ASSETS.md` 登记来源与许可

## 数据与接口

- 前端不以后端为唯一运行前提：新增页面时请同步在 `src/mock/server.js` 与 `src/mock/seed.js` 中补充 Mock 路由与**虚构**数据
- Mock 数据要求：姓名、学号、手机号、邮箱、地址全部虚构（手机号使用 `199-0000-xxxx`，邮箱使用 `example.com`）
- 新增 Mock 路由时同时补充 `src/mock/server.test.js` 用例，保持契约与文档一致
- 接口契约以 [docs/API.md](./docs/API.md) 为唯一来源，变更时请同步文档与 Mock

## 分发说明

本项目以**应用**形式分发，不发布到 npm。`package.json` 的 `private: true` 仅用于防止误发布，
请勿在贡献中移除该字段；如未来需要作为库发布，应单独讨论 `files` / `publishConfig` 方案。

## 安全问题

请勿在公开 Issue 中披露安全问题，参见 [SECURITY.md](./SECURITY.md)。
