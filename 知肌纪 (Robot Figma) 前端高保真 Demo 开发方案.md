# 知肌纪 (Robot Figma) 前端高保真 Demo 开发方案

## 1. Demo 定位与目标
**产品形态**：无需后端支持的纯前端单页应用 (SPA)。
**核心目标**：构建一个视觉完整、交互流畅、数据看似实时的“具身智能开发平台”演示版本，用于投资路演与客户展示。
**核心逻辑**：通过本地静态 JSON 数据 + 定时器模拟 + 硬编码交互，实现全功能仿真。

## 2. 全局数据模拟策略 (Mock Strategy)
所有“后端交互”均在前端模拟：

1.  **用户状态**：使用 `localStorage` 存储 `isLoggedIn`。点击登录按钮不跳转，直接切换 Nav 状态为“头像+通知”。
2.  **实时数据流**：
    *   使用 `setInterval` 每 1000ms 生成随机波动数据，驱动图表更新。
    *   使用 `setTimeout` (500ms-1500ms) 模拟网络请求延迟（Loading Spinner）。
3.  **视频流替代**：使用 6 个循环播放的本地 MP4/WebM 短视频或高质量 GIF，模拟机器人摄像机回传。

## 3. 页面详细功能规格

### A. 全局导航栏 (Navbar)
*   **样式**：顶部固定，磨砂玻璃效果。
*   **Logo**：左侧“知肌纪 Robot Figma”。
*   **菜单**：首页 | AI 技能市场 | 仿真工作室 | OS 监控台。
*   **右侧**：[登录/注册] 按钮（未登录态） / 用户头像 + 红色通知圆点（登录态）。

### B. 首页 (Landing Page)
*   **Hero 区域 (核心交互)**：
    *   **左侧 (Chat)**：自动打字机演示。
        *   Input: "设计一个具备视觉避障功能的巡检机器人"
        *   Output: AI 文字回复 + 动态生成的代码块（高亮显示）。
    *   **右侧 (Visual)**：3D 机器人模型图（或 Spline 组件）。当左侧代码生成时，机器人模型添加“扫描光效”动画。
    *   **CTA**：[开始构建] 按钮，带呼吸发光效果，点击跳转至仿真工作室。
*   **数据看板**：
    *   三组 KPI 数字滚动动画（0 -> 最终值）：在线机器人(42)、训练数据(12.8TB)、技能数(523)。

### C. AI 技能市场 (Marketplace)
*   **数据源**：`skills.json` (包含 ID, Name, Tag, Stats, Installed status)。
*   **布局**：Grid 网格布局，左侧为分类筛选 Sidebar。
*   **交互逻辑**：
    *   **Filter**：点击“视觉”标签，右侧列表仅展示含 `vision` tag 的卡片。
    *   **Install**：点击卡片 [获取技能] -> 按钮变为 Loading -> 按钮变为绿色的 [已部署] -> 触发全局 Toast 提示“技能已同步至云端”。

### D. 仿真工作室 (Simulation Studio)
*   **布局**：左侧代码/对话栏 (30%) + 右侧可视化画布 (70%)。
*   **左侧 (Copilot)**：
    *   展示模拟的 Python 代码编辑器 (`react-syntax-highlighter`)。
    *   底部输入框支持“快捷指令”（如 `/优化步态`），点击后代码区自动追加一段代码。
*   **右侧 (Canvas)**：
    *   中心展示机器人模型。
    *   **拖拽交互**：
        1.  从工具栏拖拽“激光雷达”图标。
        2.  拖入画布区域。
        3.  松开鼠标，模型对应位置高亮，左侧代码区自动插入 `import lidar_module`。

### E. OS 监控控制台 (Fleet OS Dashboard) - *重点页面*
*   **布局**：Bento Grid (科技感网格布局)。
*   **模块 1：机队列表**
    *   列表项包含：机器人 ID、状态点（绿/灰）、电量百分比。
    *   支持点击切换选中状态。
*   **模块 2：沉浸式多路视频墙 (2x3 布局)**
    *   *技术实现*：使用 `video` 标签，`muted loop autoplay`，覆盖半透明数据层 (HUD)。
    *   **Slot 1 (感知颈部)**: 深度图/热力图效果视频。
    *   **Slot 2 (上帝视角)**: SLAM 点云地图构建动图。
    *   **Slot 3 (步态分析)**: 机器人腿部运动，叠加骨骼识别线。
    *   **Slot 4 (正视)**: 第一人称漫游视角。
    *   **Slot 5 (仰视/操作)**: 机械臂抓取动作特写。
    *   **Slot 6 (行走进尺)**: 地面纹理流/光流法视频。
*   **模块 3：实时遥测图表**
    *   折线图 A：关节温度 (35°C - 60°C 随机波动)。
    *   折线图 B：IMU 震动频率。
    *   滚动日志窗口：每 2 秒自动 push 一条文本日志，自动滚动到底部。
*   **模块 4：E-STOP (紧急停止)**
    *   底部悬浮长条，右侧放置红色大按钮。
    *   **交互**：点击 [E-STOP] -> 触发全屏红色脉冲报警动画 -> 所有 Video 暂停 -> 日志区刷屏 `[CRITICAL] EMERGENCY HALT TRIGGERED`。

## 4. 移动端适配策略 (H5)
*   **首页/市场**：多列转单列，视频背景改为静态图片。
*   **监控台 (Lite Mode)**：
    *   隐藏 6 路视频网格，仅保留一张主视图。
    *   保留 KPI 数据卡片。
    *   **E-STOP 按钮**：固定在屏幕底部，尺寸放大，确保易点击。

## 5. 交付文件结构 (示例)
```text
/src
  /assets
    /videos (6个模拟监控视频文件)
    /images (3D模型图)
  /components
    Navbar.jsx
    Footer.jsx
    SkillCard.jsx
    VideoGrid.jsx (监控墙组件)
    ChartWidget.jsx (图表组件)
  /data
    mockSkills.json
    mockLogs.json
    mockRobotStatus.json
  /pages
    Home.jsx
    Marketplace.jsx
    Simulation.jsx
    Console.jsx
  App.jsx (路由配置)
```