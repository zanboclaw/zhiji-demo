# 知肌纪前端 Demo（zhiji-demo）

知肌纪（Robot Figma）是一个基于 React + Vite 的高保真前端 Demo，用来演示具身智能平台的完整工作流：自然语言生成机器人能力、技能部署、仿真验证以及机队监控控制。

当前仓库是纯前端 SPA，所有数据与“实时效果”都由本地 mock、定时器和前端状态模拟完成，适合路演、售前和产品方案展示。

## 当前体验

项目现在包含 4 个核心页面：

- 首页 `/`
  - AI Hero 打字机演示
  - 产品矩阵与 KPI 展示
- AI 技能市场 `/marketplace`
  - 分类筛选、搜索、排序
  - 技能详情弹层与部署 Toast
- 仿真工作室 `/simulation`
  - Copilot 编排区
  - 机器人画布与拖拽模块挂载
  - 多模态终端与快捷指令
- OS 监控台 `/dashboard`
  - 机队列表
  - 多路视频墙
  - 实时遥测图表与滚动日志
  - E-STOP 与远程接管

## 技术栈

- React 18
- React Router DOM 6
- Zustand
- Tailwind CSS v4
- Framer Motion
- Lucide React
- Recharts
- Vite 5

## 项目结构

```text
zhiji-demo/
├─ src/
│  ├─ components/
│  │  ├─ dashboard/
│  │  ├─ home/
│  │  ├─ layout/
│  │  ├─ marketplace/
│  │  ├─ simulation/
│  │  └─ ui/
│  ├─ data/mock.js
│  ├─ store/index.js
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css
├─ docker/
│  ├─ Dockerfile
│  ├─ docker-compose.yml
│  ├─ nginx.conf
│  └─ README.md
├─ vite.config.js
├─ package.json
└─ package-lock.json
```

## 开发方式

```bash
npm install
npm run dev
```

默认开发地址：

```text
http://localhost:3000
```

常用命令：

```bash
npm run build
npm run preview
npm run lint
```

## Docker 部署

项目采用多阶段构建：

- `node:20-alpine` 负责安装依赖与构建静态资源
- `nginx:alpine` 负责托管 `dist`
- 已配置前端路由回退、gzip 和静态资源缓存

启动方式：

```bash
cd docker
docker compose up -d --build
```

访问地址：

```text
http://localhost:3000
```

## 当前实现说明

- 这是高保真演示项目，不接真实后端
- 登录态通过 `localStorage` 模拟
- Dashboard 图表已从主页面拆分成独立懒加载模块，用于降低首包压力
- 页面路由已做懒加载拆包

## 相关文档

- `RobotFigmaBusiness Plan.md`
- `知肌纪 (Robot Figma) 前端高保真 Demo 开发方案.md`
- `docker/README.md`
