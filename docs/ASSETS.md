# 媒体资源授权说明

本项目代码以 [MIT License](../LICENSE) 发布。以下媒体资源同样由项目作者为
`LaboratoryAdmin-frontend` 专门创作，可随项目以 MIT 许可自由使用、修改与再分发：

| 文件                          | 用途                    | 来源 / 授权                         |
| ----------------------------- | ----------------------- | ----------------------------------- |
| `src/assets/brand.svg`        | 登录页与 404 页品牌标识 | 项目作者原创 SVG，随项目以 MIT 发布 |
| `src/assets/login-bg.svg`     | 登录页背景              | 项目作者原创 SVG，随项目以 MIT 发布 |
| `images/logo.svg`             | README 头部 logo        | 与 `brand.svg` 相同，项目作者原创   |
| `public/favicon.svg`          | 浏览器 favicon          | 与 `brand.svg` 相同，项目作者原创   |
| `docs/images/login.jpg`       | README 演示截图         | 由本项目 demo 构建实际运行截图生成  |
| `docs/images/user-list.jpg`   | README 演示截图         | 由本项目 demo 构建实际运行截图生成  |
| `docs/images/edit-drawer.jpg` | README 演示截图         | 由本项目 demo 构建实际运行截图生成  |

## 已移除的第三方资源

早期版本曾包含高校校徽图片与来源不明的实拍实验室照片，因无法确认授权已全部移除，
不再随本仓库分发。若你从旧版本 fork 中保留了这些文件，请自行确认授权或删除。

## 依赖许可

运行时依赖（`dependencies`）全部为 MIT 许可；开发依赖中 `playwright-core` 为 Apache-2.0，
仅用于浏览器冒烟测试，不会进入构建产物。其余开发依赖均为 MIT。

安装依赖后可通过各包 `package.json` 的 `license` 字段复核。若未来引入其他许可的资源
（字体、图标、图片、音视频），请在本文件登记来源、作者与许可，并确认与 MIT 兼容。
