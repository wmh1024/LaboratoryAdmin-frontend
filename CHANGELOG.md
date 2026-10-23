# 更新日志

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 与
[Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 规范。

## [Unreleased]

### Added

- 单元测试体系（Vitest）：API 工具、分页 composable、Mock 鉴权/白名单/适配器，共 31 个用例
- GitHub Actions CI（lint + format:check + test + build + 产物无 Mock 断言）
- `yarn build:demo`：纯静态演示构建（含 Mock，相对路径）
- `POST /admin/logout` 接口与前端登出调用
- `composables/usePagedList`、`composables/useCrudDrawer`、`components/CrudTable`、`constants/role.js`
- 内置内存 Mock 服务（`src/mock`）：无后端亦可完整运行，支持用户、管理员、实验室、实验室分类、预约记录的增删改查
- 可配置接口地址与 Mock 开关（`VITE_API_BASE_URL` / `VITE_USE_MOCK`），新增 `.env.example`
- 侧边栏退出登录入口、占位页组件、`CONTRIBUTING.md` / `SECURITY.md` / `.prettierrc.json`
- ESLint 9（flat config）+ Prettier，新增 `lint` / `lint:fix` / `format` / `audit` 脚本

### Fixed

- **Mock 服务无鉴权**：除登录外全部接口校验 Bearer 令牌（无效 401），写操作仅院长角色（403）
- **`/admin/update` 与 `/user/update` 路由混用**：已拆分，管理员更新不再复用用户语义
- **Mock 更新接口可被任意字段覆盖**：改为字段白名单，`id` 与只读统计字段不可改写
- **生产构建仍打包 Mock 与种子数据**：`@/mock` 别名指向空实现 + `define` 静态化开关，产物已无 Mock
- **Mock 适配器延迟挂载导致首屏请求走真实网络**：改为 `app.mount` 前 `await` 安装
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

- 依赖升级至 Vite 8 / @vitejs/plugin-vue 6 / Vitest 4 / eslint-plugin-vue 10，`npm audit` 归零
- dev server 仅监听 `127.0.0.1`；`loadEnv` 仅加载 `VITE_` 前缀变量
- 全量应用 Prettier（此前 26 个文件不符合配置）
- `PAGE_SIZE` 统一由 `api/common.js` 派生，Mock 复用同一常量
- 图标改为按需引入；移除重复的 `el-message.css` 引入
- 侧边栏支持折叠与窄屏响应式布局
- `LICENSE.txt` 版权人更正为项目作者
- 7 个未实现页面统一为“建设中”占位版式

## [0.0.0] - 2023-11

- 初始版本：Vue3 + Element Plus + Vite 管理端骨架
