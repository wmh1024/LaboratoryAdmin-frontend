# 部署与安全响应头

## 构建选择

| 场景         | 命令                                   | 路由模式 | 适用环境                         |
| ------------ | -------------------------------------- | -------- | -------------------------------- |
| 对接真实后端 | `npm run build` / `npm run build:prod` | history  | Nginx、对象存储 + 回退、同域后端 |
| 纯静态演示   | `npm run build:demo`                   | hash     | GitHub Pages、任意静态子路径     |

生产构建会把 `@/mock` 门面替换为空实现；`npm run check:bundle` 可再次确认产物不含
Mock 种子数据或演示凭据。

## Nginx 示例（history 模式）

```nginx
server {
    listen 80;
    server_name labadmin.example.com;
    root /var/www/labadmin/dist;
    index index.html;

    # SPA 深层链接回退
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端接口反向代理（按实际后端地址调整）
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 基础安全响应头
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header X-Frame-Options "DENY" always;

    # Element Plus 会注入内联样式，因此 style-src 需要 'unsafe-inline'
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" always;
}
```

如果后端部署在其他域名，请把该域名加入 `connect-src`，并同步配置
`VITE_API_BASE_URL`。

## 纯静态 demo

`npm run build:demo` 使用相对路径与 hash 路由，可部署到任意子目录（如 GitHub Pages），
无需宿主提供 404 回退。demo 产物内置 Mock 与演示账号，**不得作为生产环境**使用。

仓库提供 `.github/workflows/deploy-demo.yml`：`main` 推送后自动构建 demo 并部署到
GitHub Pages。首次使用需在仓库 **Settings → Pages → Build and deployment** 中选择
**GitHub Actions**，并确保 Actions 有 Pages 写权限。

演示地址：<https://wmh1024.github.io/LaboratoryAdmin-frontend/>

## 本地容器 / 远程开发

开发服务器默认只监听 `127.0.0.1`。在 Dev Container、WSL2 或远程 SSH 场景下，可设置：

```sh
VITE_DEV_HOST=0.0.0.0 npm run dev
```

请仅在可信网络中暴露开发服务器。
