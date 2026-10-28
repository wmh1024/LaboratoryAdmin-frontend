# 更新日志

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 与
[Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 规范。

## [0.1.0] - 2026-10-28

### Added

- 单元/组件测试体系（Vitest + jsdom + @vue/test-utils）：API 工具、分页、密码校验、Mock 鉴权/契约/适配器、登录页渲染、编辑回填、分页器渲染，共 54 个用例
- `playwright-core` 真实浏览器冒烟：demo 构建登录、用户列表、用户编辑、实验室编辑回填与保存闭环
- 覆盖率基线（`npm run test:coverage`）与生产产物隔离检查（`npm run check:bundle`）
- GitHub Actions CI（lint + format:check + 覆盖率 + test + production build + Mock 隔离断言 + demo build + 浏览器冒烟），Node 20.19 / 22 矩阵
- Release workflow、GitHub Pages demo 部署 workflow、Dependabot、Issue/PR 模板、`CODE_OF_CONDUCT.md`
- `docs/API.md`：后端接口唯一契约（响应包、错误码、鉴权、分页、字段模型与示例）
- `docs/DEPLOYMENT.md`：SPA 回退、Nginx 反向代理与安全响应头示例
- `docs/ASSETS.md`：媒体资源来源与授权说明
- `npm run build:demo`：纯静态演示构建（含 Mock，相对路径 + hash 路由）
- `POST /admin/logout` 接口与前端登出调用
- `composables/usePagedList`、`composables/useCrudDrawer`、`composables/usePasswordConfirm`、`components/CrudTable`、`components/PasswordFormItems`、`constants/role.js`
- 内置内存 Mock 服务（`src/mock`）：无后端亦可完整运行，支持用户、管理员、实验室、实验室分类、预约记录的增删改查
- 可配置接口地址、Mock 开关与开发服务器监听地址（`VITE_API_BASE_URL` / `VITE_USE_MOCK` / `VITE_DEV_HOST`），新增 `.env.example`
- 侧边栏退出登录入口、`CONTRIBUTING.md` / `SECURITY.md` / `.prettierrc.json`
- ESLint 9（flat config）+ Prettier，新增 `lint` / `lint:fix` / `format` / `audit` 脚本
- README 界面截图与在线演示入口

### Fixed

- **登录页全站白屏**：移除 `Login.vue` setup 顶层 `await`，演示账号改由入口注入
- **编辑抽屉字段为空/保存 404**：`useCrudDrawer` 统一解包 axios 响应，并区分新增/编辑默认值
- **生产构建 Mock 隔离机制失效**：改为 `@/mock` 单一门面 + 精确正则 alias，生产产物经结构性断言确认无种子数据与演示凭据
- **Mock 401 不清理登录态**：adapter 对 HTTP >= 400 抛出 AxiosError，并兼容“HTTP 200 + 业务码 401”
- **Mock 服务无鉴权**：除登录外全部接口校验 Bearer 令牌（无效 401），写操作仅院长角色（403）
- **`/admin/update` 与 `/user/update` 路由混用**：已拆分，管理员更新不再复用用户语义
- **Mock 更新接口可被任意字段覆盖**：改为字段白名单，`id` 与只读统计字段不可改写
- **Mock 响应泄露密码**：`password` 改为只写字段，用户/管理员列表、详情、增删改响应均不返回密码
- **Mock 未按契约校验**：补齐新增必填字段、账号唯一、密码最短 6 位、批量删除空 `ids`、`pageSize` 上限 100
- **实验室详情路径拼写不一致**：统一为 `/laboratory/find/{id}`，移除 `findl` 兼容
- **Mock 适配器延迟挂载导致首屏请求走真实网络**：改为 `app.mount` 前 `await` 安装
- **demo 子路径深层链接资源 404**：demo 构建切换为 hash 路由
- **分类下拉静默截断**：拆分列表与字典 service，字典按 50 条步长自动翻页
- 种子数据 `demo_admin` 角色由「指导老师」修正为「院长」，与权限模型一致
- 登录提示改为固定演示账号，不再宣称「任意账号密码可登录」
- 列表页分页响应缺少 `data` 时静默空白：新增 `toPageResult` 统一归一化
- 分页快速切换时旧响应覆盖新数据：`usePagedList` 以请求序号丢弃过期响应
- 编辑表单整包回填并提交只读字段：改为字段白名单构造 payload
- 子路由缺少 `meta.title` 时标题残留：改到 `afterEach` 统一设置
- 请求层硬编码内网 IP、遗留调试日志、超时过短、空响应导致的二次崩溃、401 未清理登录态
- 业务码判定逻辑（仅 `200` 视为成功），并对超时/断网给出明确提示
- 列表页删除确认取消时的未捕获异常、失败无提示、loading 不复位、删除后分页越界
- `LabCategory` 硬编码删除 ID 与未定义变量导致的报错
- `LabManage` 分类下拉字段错误、审核人字段名前后不一致
- `DataAdmin` 角色越界崩溃、管理员编辑接口路径错误（`/user/update` → `/admin/update`）
- `DataUser` / `DataAdmin` 缺少必填与密码确认校验、编辑时会覆盖密码
- `LabLog` 未使用 loading、缺少分页、状态只有二态
- 已登录访问 `/login` 不再重复登录；404 页提供返回首页
- 登录表单校验、回车提交、loading、登录失败提示
- 内置 Mock 适配器未传递 axios `params`，导致分页/查询参数全部失效（列表恒返回第一页）
- 分页器在数据加载前 `total=0` 时被 `hide-on-single-page` 卸载后不再渲染，改为按总数控制渲染
- 编辑时密码留空被“确认密码”校验拦截，导致编辑无法提交

### Changed

- Vue 最低版本提升至 `^3.5.0`（`defineModel` 稳定可用）
- 依赖升级至 Vite 8 / @vitejs/plugin-vue 6 / Vitest 4 / eslint-plugin-vue 10，`npm audit` 归零
- Node 版本要求与 Vite 8 对齐为 `^20.19.0 || >=22.12.0`，CI 使用 Node 20.19 与 22 矩阵
- dev server 默认监听 `127.0.0.1`，可通过 `VITE_DEV_HOST` 覆盖；`loadEnv` 仅加载 `VITE_` 前缀变量
- 全量应用 Prettier（此前 26 个文件不符合配置）
- 分页/超时/Mock 延迟/抽屉尺寸/列宽常量集中到 `src/constants/api.js` 与 `src/constants/ui.js`
- API 目录统一 camelCase：`auth.js` / `user.js` / `admin.js` / `labManage.js` / `labLog.js` / `labCategory.js`
- 密码确认校验与表单项抽成 `usePasswordConfirm` + `PasswordFormItems`
- `LICENSE.txt` 重命名为 `LICENSE`，版权人更正为项目作者
- 第三方校徽/实拍照片/来源不明 logo 替换为项目自有 SVG，新增 `docs/ASSETS.md`
- 补齐 `index.html` description、theme-color、referrer 与 favicon
- `.vscode/extensions.json` 移除已废弃扩展，补充 ESLint / Prettier
- 开启 ESLint `no-undef`，仅声明 `<script setup>` 编译宏为全局
- 图标改为按需引入；移除重复的 `el-message.css` 引入
- 侧边栏支持折叠与窄屏响应式布局
- 包管理器统一为 npm，移除 `yarn.lock` 并提交 `package-lock.json`
- 移除 8 个未实现页面（设备、课表、数据留存/展示、注意事项）及菜单入口，删除 `PlaceholderPage` 与 `favicon.ico`
- README 功能范围收缩为已实现模块，接口说明改由 `docs/API.md` 承载

### Security

- 发布前重写 Git 历史：移除内网 IP、第三方校徽/实拍照片与内部审查文档
- 二次重写 Git 历史：清除历史中携带第三方素材的构建产物 `dist.zip`，
  作者/提交者/标签署名统一为 GitHub noreply
- 新增 `npm run check:sensitive`，覆盖工作区文件、Git 历史对象、提交与标签署名，
  并禁止构建产物入库
- `vite preview` 预览生产产物时不再挂载 Mock，避免"以为 Mock 已剔除"的误判；
  新增 `npm run check:modes` 断言 Mock 只在 dev 与 demo 模式生效

### Removed

- 内部审查报告 `review.md`、临时 `todo.md`（不随开源仓库发布）
- 残留空目录 `demo/`
- 死代码 `selectedIds`、`useMock` 对外导出与空实现中的多余导出

## [0.0.0] - 2023-11

- 初始版本：Vue3 + Element Plus + Vite 管理端骨架
