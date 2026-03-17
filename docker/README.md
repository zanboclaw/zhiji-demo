# 知肌纪 Demo 部署文档

## 本地开发

```bash
# 进入项目目录
cd projects/zhiji-demo

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

## Docker 部署

```bash
# 构建并启动
cd docker
docker-compose up -d

# 访问 http://localhost:3000
```

## Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

## 项目结构

```
src/
├── components/
│   ├── layout/      # 布局组件
│   ├── ui/          # 基础 UI 组件
│   ├── home/        # 首页
│   ├── marketplace/ # 技能市场
│   ├── simulation/  # 仿真工作室
│   └── dashboard/   # 监控台
├── data/            # Mock 数据
├── store/           # Zustand 状态管理
├── App.jsx          # 主应用
└── main.jsx         # 入口
```

## 技术栈

- React 18 + Vite 5
- Tailwind CSS
- Framer Motion
- Zustand
- React Router v6
- Recharts
- Lucide React

## 注意事项

- 所有数据均为模拟，不涉及真实后端
- 仿真工作室使用 CSS 绘制简化版机器人模型
- 视频流使用占位符展示
