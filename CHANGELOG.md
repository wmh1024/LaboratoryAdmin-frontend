# 更新日志

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 与
[Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 规范。

## [Unreleased]

### Added

- 内置内存 Mock 服务（`src/mock`）：无后端亦可完整运行，支持用户、管理员、实验室、实验室分类、预约记录的增删改查
- 可配置接口地址与 Mock 开关（`VITE_API_BASE_URL` / `VITE_USE_MOCK`），新增 `.env.example`
- 侧边栏退出登录入口、占位页组件、`CONTRIBUTING.md` / `SECURITY.md` / `.prettierrc.json`
- ESLint 9（flat config）+ Prettier，新增 `lint` / `lint:fix` / `format` / `audit` 脚本

### Fixed

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
- 内置 Mock 适配器未传递 axios ，导致分页/查询参数全部失效（列表恒返回第一页）
- 分页器在数据加载前  时被  卸载后不再渲染，改为按总数控制渲染
- 编辑时密码留空被“确认密码”校验拦截，导致编辑无法提交

### Changed

- `LICENSE.txt` 版权人更正为项目作者
- 7 个未实现页面统一为“建设中”占位版式

## [0.0.0] - 2023-11

- 初始版本：Vue3 + Element Plus + Vite 管理端骨架
