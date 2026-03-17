import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MousePointer2,
  Move,
  RotateCw,
  Maximize2,
  Eye,
  EyeOff,
  LayoutGrid,
  Send,
  Mic,
  Lightbulb,
  Armchair,
  Camera,
  Video,
  Download,
  Play,
  RotateCcw,
  Footprints,
  Hand,
} from 'lucide-react'
import { useSimulationStore, useTerminalStore, useRobotStore } from '../../store'
import { robotParts, aiResponses } from '../../data/mock'
import { Card, Button, StatusBadge, ProgressBar } from '../ui'

const tools = [
  { id: 'select', icon: MousePointer2, label: '选择' },
  { id: 'move', icon: Move, label: '移动' },
  { id: 'rotate', icon: RotateCw, label: '旋转' },
  { id: 'scale', icon: Maximize2, label: '缩放' },
]

const views = [
  { id: 'front', label: '前视' },
  { id: 'side', label: '侧视' },
  { id: 'top', label: '俯视' },
]

export function SimulationStudio() {
  const {
    selectedTool,
    selectedView,
    selectedPart,
    parameters,
    setSelectedTool,
    setSelectedView,
    setSelectedPart,
  } = useSimulationStore()

  const { selectedRobot } = useRobotStore()
  const { messages, inputValue, isThinking, isRecording, addMessage, setInputValue, setIsThinking, setIsRecording } = useTerminalStore()

  // 模拟参数波动
  useEffect(() => {
    const interval = setInterval(() => {
      // 随机波动参数
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    
    addMessage({ type: 'user', content: inputValue })
    setInputValue('')
    setIsThinking(true)
    
    setTimeout(() => {
      const response = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      addMessage({ type: 'ai', content: response })
      setIsThinking(false)
    }, 1500)
  }

  const handleAction = (action) => {
    addMessage({ type: 'system', content: `执行动作：${action}` })
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* 顶部状态栏 */}
      <div className="h-14 bg-background-secondary/50 border-b border-white/10 flex items-center px-4 space-x-6">
        {/* 设备身份 */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <Armchair className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">{selectedRobot.id}</div>
            <div className="text-xs text-gray-500">{selectedRobot.model}</div>
          </div>
          <div className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
            {selectedRobot.station}
          </div>
        </div>

        {/* 监控核心 */}
        <div className="flex items-center space-x-2 px-4 border-l border-white/10">
          <StatusBadge status={selectedRobot.status}>
            机器人状态监控
          </StatusBadge>
        </div>

        {/* 系统指标 */}
        <div className="flex items-center space-x-4 ml-auto">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">运行状态</span>
            <span className="text-xs text-status-success">正常</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">通信</span>
            <span className="text-xs text-primary">Wi-Fi 强</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">电量</span>
            <div className="w-16">
              <ProgressBar value={selectedRobot.battery} color={selectedRobot.battery > 20 ? 'success' : 'danger'} size="sm" />
            </div>
            <span className="text-xs text-white">{selectedRobot.battery}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">权限</span>
            <span className="text-xs text-gray-300">操作员</span>
          </div>
        </div>
      </div>

      {/* 主工作区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧工具栏 */}
        <div className="w-14 bg-background-secondary/30 border-r border-white/10 flex flex-col items-center py-4 space-y-2">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  selectedTool === tool.id
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                title={tool.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            )
          })}
          
          <div className="w-8 h-px bg-white/10 my-2" />
          
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setSelectedView(view.id)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                selectedView === view.id
                  ? 'bg-accent-purple text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* 中心画布 */}
        <div className="flex-1 relative bg-gradient-to-b from-background to-background-secondary flex items-center justify-center">
          {/* 机器人可视化区域 */}
          <div className="relative w-96 h-[500px]">
            {/* 机器人轮廓 - 使用 CSS 绘制简化版 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-96">
                {/* 头部 */}
                <motion.div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedPart === 'head'
                      ? 'border-primary bg-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.5)]'
                      : 'border-white/20 bg-white/5 hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedPart(selectedPart === 'head' ? null : 'head')}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-accent-purple/50" />
                  </div>
                </motion.div>

                {/* 躯干 */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-24 h-32 rounded-2xl border-2 border-white/20 bg-white/5">
                  <div className="absolute inset-2 rounded-xl bg-gradient-to-b from-white/10 to-transparent" />
                  {/* 胸部显示屏 */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-10 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center">
                    <span className="text-xs font-mono text-primary">{selectedRobot.battery}%</span>
                  </div>
                </div>

                {/* 手臂 */}
                <motion.div
                  className={`absolute top-24 left-0 w-12 h-24 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedPart === 'arm'
                      ? 'border-primary bg-primary/20'
                      : 'border-white/20 bg-white/5 hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedPart(selectedPart === 'arm' ? null : 'arm')}
                />
                <div className="absolute top-24 right-0 w-12 h-24 rounded-xl border-2 border-white/20 bg-white/5" />

                {/* 髋部 */}
                <motion.div
                  className={`absolute top-56 left-1/2 -translate-x-1/2 w-20 h-12 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedPart === 'hip'
                      ? 'border-primary bg-primary/20'
                      : 'border-white/20 bg-white/5 hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedPart(selectedPart === 'hip' ? null : 'hip')}
                />

                {/* 腿部 */}
                <div className="absolute top-72 left-8 w-10 h-32 rounded-xl border-2 border-white/20 bg-white/5" />
                <div className="absolute top-72 right-8 w-10 h-32 rounded-xl border-2 border-white/20 bg-white/5" />

                {/* 脚部 */}
                <motion.div
                  className={`absolute bottom-0 left-6 w-14 h-8 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedPart === 'foot'
                      ? 'border-primary bg-primary/20'
                      : 'border-white/20 bg-white/5 hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedPart(selectedPart === 'foot' ? null : 'foot')}
                />
                <div className="absolute bottom-0 right-6 w-14 h-8 rounded-lg border-2 border-white/20 bg-white/5" />
              </div>
            </div>

            {/* 选中部位提示 */}
            {selectedPart && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-primary/90 rounded-lg text-sm font-medium text-white"
              >
                已选择: {robotParts.find(p => p.id === selectedPart)?.name}
              </motion.div>
            )}
          </div>
        </div>

        {/* 右侧参数面板 */}
        <div className="w-80 bg-background-secondary/30 border-l border-white/10 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* 头部感知系统 */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Eye className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-white">头部感知系统</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">传感器</span>
                  <span className="text-gray-300">{parameters.head.sensor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">LiDAR 刷新率</span>
                  <span className="text-gray-300">{parameters.head.lidarRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">感光度</span>
                  <span className="text-gray-300">ISO {parameters.head.iso}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">数据状态</span>
                  <StatusBadge status="normal">正常</StatusBadge>
                </div>
              </div>
            </Card>

            {/* 核心计算系统 */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <LayoutGrid className="w-4 h-4 text-accent-purple" />
                <span className="text-sm font-medium text-white">核心计算系统</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">CPU</span>
                    <span className="text-gray-300">{parameters.compute.cpu}%</span>
                  </div>
                  <ProgressBar value={parameters.compute.cpu} color={parameters.compute.cpu > 80 ? 'warning' : 'primary'} size="sm" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">GPU</span>
                    <span className="text-gray-300">{parameters.compute.gpu}%</span>
                  </div>
                  <ProgressBar value={parameters.compute.gpu} color={parameters.compute.gpu > 80 ? 'warning' : 'primary'} size="sm" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">温度</span>
                    <span className="text-gray-300">{parameters.compute.temp}°C</span>
                  </div>
                  <ProgressBar value={parameters.compute.temp} max={100} color={parameters.compute.temp > 70 ? 'warning' : 'success'} size="sm" />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">算力</span>
                  <span className="text-primary font-mono">{parameters.compute.tops} TOPS</span>
                </div>
              </div>
            </Card>

            {/* 平衡操作系统 */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <RotateCw className="w-4 h-4 text-accent-pink" />
                <span className="text-sm font-medium text-white">平衡操作系统</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">陀螺仪 X/Y/Z</span>
                  <span className="text-gray-300 font-mono">
                    {parameters.balance.gyroX.toFixed(2)} / {parameters.balance.gyroY.toFixed(2)} / {parameters.balance.gyroZ.toFixed(2)}
                  </span>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">姿态稳定度</span>
                    <span className="text-gray-300">{parameters.balance.stability}%</span>
                  </div>
                  <ProgressBar value={parameters.balance.stability} color="success" size="sm" />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">步态逻辑</span>
                  <StatusBadge status={parameters.balance.gaitEnabled ? 'normal' : 'warning'}>
                    {parameters.balance.gaitEnabled ? '已启用' : '已禁用'}
                  </StatusBadge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">路径规划</span>
                  <span className="text-status-success">{parameters.balance.pathPlanning}</span>
                </div>
              </div>
            </Card>

            {/* 肢体支撑系统 */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Footprints className="w-4 h-4 text-status-success" />
                <span className="text-sm font-medium text-white">肢体支撑系统</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">左腿电机扭矩</span>
                  <span className="text-gray-300 font-mono">{parameters.limb.leftTorque} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">右腿电机扭矩</span>
                  <span className="text-gray-300 font-mono">{parameters.limb.rightTorque} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">足端压力分布</span>
                  <span className="text-primary">{parameters.limb.pressure}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">关节限位</span>
                  <StatusBadge status="normal">{parameters.limb.jointLimit}</StatusBadge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* 底部多模态控制终端 */}
      <div className="h-48 bg-background-secondary/50 border-t border-white/10 flex">
        {/* 左侧动作宏命令 */}
        <div className="w-48 border-r border-white/10 p-4">
          <div className="text-xs text-gray-500 mb-3">动作宏命令</div>
          <div className="space-y-2">
            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleAction('行走')}
            >
              <Footprints className="w-4 h-4 mr-2" />
              行走
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleAction('举起')}
            >
              <Hand className="w-4 h-4 mr-2" />
              举起
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleAction('复位')}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              复位
            </Button>
          </div>
        </div>

        {/* 中间智能交互区 */}
        <div className="flex-1 flex flex-col">
          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 text-sm ${
                  msg.type === 'user' ? 'justify-end' : ''
                }`}
              >
                {msg.type !== 'user' && (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    msg.type === 'system' ? 'bg-gray-600' :
                    msg.type === 'ai' ? 'bg-primary' : 'bg-status-success'
                  }`}>
                    {msg.type === 'system' ? 'S' : msg.type === 'ai' ? 'AI' : '✓'}
                  </div>
                )}
                <div className={`max-w-[70%] px-3 py-2 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white/10 text-gray-200'
                }`}>
                  {msg.content}
                </div>
                {msg.type === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-accent-purple flex items-center justify-center text-xs">
                    U
                  </div>
                )}
              </div>
            ))}
            {isThinking && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RotateCw className="w-3 h-3 text-white" />
                  </motion.div>
                </div>
                <span>思考中...</span>
              </div>
            )}
          </div>

          {/* 输入区 */}
          <div className="h-14 border-t border-white/10 px-4 flex items-center space-x-3">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Lightbulb className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Armchair className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="请输入指令..."
                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
              />
            </div>
            <button
              onClick={() => setIsThinking(!isThinking)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isThinking
                  ? 'bg-primary text-white'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              思考模式
            </button>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-2 rounded-lg transition-colors ${
                isRecording
                  ? 'bg-status-danger text-white animate-pulse'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 右侧多媒体工具 */}
        <div className="w-48 border-l border-white/10 p-4">
          <div className="text-xs text-gray-500 mb-3">多媒体工具</div>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex flex-col items-center space-y-1">
              <Camera className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-500">拍照</span>
            </button>
            <button className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex flex-col items-center space-y-1">
              <Video className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-500">录制</span>
            </button>
            <button className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex flex-col items-center space-y-1">
              <Eye className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-500">监控</span>
            </button>
            <button className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex flex-col items-center space-y-1">
              <Download className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-500">导出</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
