# 贡献指南

感谢你愿意为这个项目做出贡献！请在提交前阅读以下约定。

## 开发环境

- Node.js >= 18
- 包管理器：yarn（仓库提供 `yarn.lock`）

```sh
yarn            # 安装依赖
yarn dev        # 本地开发（默认读取 .env 中的 VITE_USE_MOCK=true，无需后端）
yarn lint       # 静态检查
yarn build      # 构建检查
```

## 分支与提交

1. 从 `main` 切出分支：`git checkout -b fix/xxx` 或 `feat/xxx`
2. 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)：
   `fix(lab-manage): 修正分类下拉字段`
3. 提交前确保 `yarn lint` 与 `yarn build` 均通过
4. 发起 Pull Request 并描述改动动机与影响范围

## 代码约定

- Vue 3 `<script setup>` 组合式 API，2 空格缩进、单引号、无分号（见 `.prettierrc.json`）
- 接口统一走 `src/utils/request.js`，组件内不要直接使用 axios
- 页面请求需处理失败分支（错误提示由拦截器统一弹出，页面只需 `try/catch/finally` 复位状态）
- 禁止提交调试日志（`console.log`）
- 禁止提交真实的个人信息、内网地址、账号密码

## 数据与接口

- 前端不以后端为唯一运行前提：新增页面时请同步在 `src/mock/server.js` 与 `src/mock/seed.js` 中补充 Mock 路由与**虚构**数据
- Mock 数据要求：姓名、学号、手机号、邮箱、地址全部虚构（手机号使用 `199-0000-xxxx`，邮箱使用 `example.com`）

## 安全问题

请勿在公开 Issue 中披露安全问题，参见 [SECURITY.md](./SECURITY.md)。
