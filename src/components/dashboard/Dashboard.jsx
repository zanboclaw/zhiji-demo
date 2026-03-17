import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Thermometer,
  Battery,
  Wifi,
  AlertCircle,
  Play,
  Square,
  Radio,
  Bot,
} from 'lucide-react'
import { useDashboardStore, useRobotStore } from '../../store'
import { mockLogs } from '../../data/mock'
import { Card, Button, StatusBadge, ProgressBar, MetricCard } from '../ui'

const robots = [
  { id: 'Spot-0729', name: 'Spot-0729', status: 'online', battery: 70 },
  { id: 'Spot-0730', name: 'Spot-0730', status: 'online', battery: 85 },
  { id: 'Atlas-001', name: 'Atlas-001', status: 'warning', battery: 25 },
  { id: 'Tesla-001', name: 'Tesla Bot-001', status: 'offline', battery: 0 },
]

const videoViews = [
  { id: 'neck', name: '感知颈部', active: true },
  { id: 'top', name: '俯视', active: true },
  { id: 'bottom', name: '仰视', active: false },
  { id: 'side', name: '侧视', active: true },
  { id: 'front', name: '正视', active: true },
  { id: 'action', name: '动作视图', active: true },
]

export function Dashboard() {
  const { selectedRobotId, isEStopActive, isRemoteControl, setIsEStopActive, setIsRemoteControl, addLog } = useDashboardStore()
  const { selectedRobot } = useRobotStore()

  const onlineCount = robots.filter(r => r.status === 'online').length
  const warningCount = robots.filter(r => r.status === 'warning').length

  useEffect(() => {
    const interval = setInterval(() => {
      const levels = ['info', 'success', 'warning']
      const messages = [
        '心跳检测正常',
        '数据同步完成',
        '传感器数据更新',
        '任务进度 45%',
        '电池电量下降 1%',
      ]
      const randomLevel = levels[Math.floor(Math.random() * levels.length)]
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      addLog({ level: randomLevel, message: randomMessage })
    }, 5000)

    return () => clearInterval(interval)
  }, [addLog])

  const handleEStop = () => {
    setIsEStopActive(!isEStopActive)
    addLog({
      level: isEStopActive ? 'success' : 'danger',
      message: isEStopActive ? '紧急停止已解除' : '紧急停止已激活！'
    })
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 机队状态总览 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="在线机器人" value={onlineCount} unit="台" trend={12} />
          <MetricCard title="任务利用率" value={78} unit="%" trend={5} />
          <MetricCard title="当前报警" value={warningCount} unit="个" trend={-20} />
          <Card className="p-4">
            <div className="text-gray-400 text-sm mb-1">当前选中</div>
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-primary" />
              <span className="text-xl font-bold text-white">{selectedRobotId}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">已加载：自主导航 Pro</div>
          </Card>
        </div>

        {/* 多视角监控视频墙 */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">多视角监控</h3>
            <StatusBadge status="normal">实时流传输中</StatusBadge>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {videoViews.map((view) => (
              <div key={view.id} className="aspect-video bg-black/50 rounded-lg border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/5 flex items-center justify-center">
                      <Bot className="w-8 h-8 text-gray-600" />
                    </div>
                    <span className="text-gray-500 text-sm">{view.name}</span>
                  </div>
                </div>
                <div className="absolute inset-0 p-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono text-primary/80">{view.name}</span>
                    {view.active && (
                      <span className="flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-status-danger rounded-full animate-pulse" />
                        <span className="text-xs text-status-danger">REC</span>
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex justify-between text-xs font-mono text-gray-500">
                      <span>ISO 800</span>
                      <span>f/2.8</span>
                      <span>1/60s</span>
                    </div>
                  </div>
                </div>
                <motion.div className="absolute left-0 right-0 h-px bg-primary/30" animate={{ top: ['0%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
              </div>
            ))}
          </div>
        </Card>

        {/* 健康监测与日志 */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-4 lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">健康监测</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="w-4 h-4 text-status-warning" />
                      <span className="text-sm text-gray-300">关节温度</span>
                    </div>
                    <span className="text-sm text-white">45°C</span>
                  </div>
                  <ProgressBar value={45} max={80} color="warning" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-status-success" />
                      <span className="text-sm text-gray-300">IMU 稳定性</span>
                    </div>
                    <span className="text-sm text-white">98.5%</span>
                  </div>
                  <ProgressBar value={98.5} max={100} color="success" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Battery className="w-4 h-4 text-primary" />
                      <span className="text-sm text-gray-300">电池状态</span>
                    </div>
                    <span className="text-sm text-white">{selectedRobot.battery}%</span>
                  </div>
                  <ProgressBar value={selectedRobot.battery} color={selectedRobot.battery > 20 ? 'primary' : 'danger'} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Wifi className="w-4 h-4 text-status-success" />
                      <span className="text-sm text-gray-300">通信质量</span>
                    </div>
                    <span className="text-sm text-status-success">优秀</span>
                  </div>
                  <ProgressBar value={95} max={100} color="success" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">实时日志</h3>
            <div className="h-48 overflow-y-auto space-y-2 text-xs font-mono">
              {mockLogs.map((log, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-gray-500">{log.time}</span>
                  <span className={`${
                    log.level === 'success' ? 'text-status-success' :
                    log.level === 'warning' ? 'text-status-warning' :
                    log.level === 'danger' ? 'text-status-danger' :
                    'text-gray-400'
                  }`}>[{log.level.toUpperCase()}]</span>
                  <span className="text-gray-300">{log.message}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 紧急控制 */}
        <Card className={`p-4 ${isEStopActive ? 'border-status-danger shadow-[0_0_30px_rgba(239,68,68,0.3)]' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant={isEStopActive ? 'secondary' : 'danger'} size="lg" onClick={handleEStop} className={`${isEStopActive ? '' : 'animate-pulse'} px-8`}>
                <AlertCircle className="w-5 h-5 mr-2" />
                {isEStopActive ? '解除 E-STOP' : 'E-STOP 紧急停止'}
              </Button>
              <Button variant={isRemoteControl ? 'primary' : 'secondary'} size="lg" onClick={() => setIsRemoteControl(!isRemoteControl)}>
                <Radio className="w-5 h-5 mr-2" />
                {isRemoteControl ? '断开远程接管' : '远程接管'}
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                <span className="text-gray-300">系统正常</span>
              </div>
              <div className="text-gray-500">
                控制模式: {isRemoteControl ? '远程' : '本地'}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
