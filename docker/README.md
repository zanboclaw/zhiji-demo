# 知肌纪 Demo 部署文档

## 本地开发

在仓库根目录执行：

```bash
npm install
npm run dev
```

默认访问地址：

```text
http://localhost:3000
```

## Docker 部署

项目使用 Docker 多阶段构建：

- 构建阶段：`node:20-alpine`
- 运行阶段：`nginx:alpine`

启动方式：

```bash
cd docker
docker compose up -d --build
```

停止方式：

```bash
cd docker
docker compose down
```

访问地址：

```text
http://localhost:3000
```

## Nginx 配置能力

当前 `nginx.conf` 已包含：

- SPA 路由回退到 `index.html`
- JS/CSS/图片等静态资源长缓存
- gzip 压缩
- 基础安全响应头

## 目录说明

```text
docker/
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── README.md
```

## 备注

- 这是纯前端 Demo，容器内不依赖后端服务
- 页面中的实时数据、日志、视频墙效果均为前端模拟
