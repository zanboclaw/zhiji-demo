import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle,
  Battery,
  Bot,
  Radio,
  ShieldAlert,
  Wifi,
} from 'lucide-react'
import { useDashboardStore, useRobotStore } from '../../store'
import { Card, Button, StatusBadge, ProgressBar, MetricCard } from '../ui'
import { VideoWall } from './VideoWall'

const TelemetryPanel = lazy(() =>
  import('./TelemetryPanel').then((module) => ({ default: module.TelemetryPanel })),
)

const robots = [
  { id: 'Spot-0729', name: 'Spot-0729', model: 'Spot Pro', status: 'online', battery: 70, site: '北京展厅' },
  { id: 'Spot-0730', name: 'Spot-0730', model: 'Spot Guard', status: 'online', battery: 85, site: '上海仓储' },
  { id: 'Atlas-001', name: 'Atlas-001', model: 'Atlas Humanoid', status: 'warning', battery: 25, site: '深圳工厂' },
  { id: 'Tesla-001', name: 'Tesla Bot-001', model: 'Optimus Dev', status: 'offline', battery: 0, site: '测试环境' },
]

function generateTelemetry(seed, baseline, amplitude) {
  return Array.from({ length: 10 }, (_, index) => ({
    time: `${index + 1}s`,
    value: Number((baseline + Math.sin((seed + index) / 2) * amplitude + Math.random() * 2).toFixed(1)),
  }))
}

function TelemetryFallback() {
  return (
    <Card className="rounded-[2rem] p-5">
      <div className="mb-4 text-lg font-semibold text-white">实时遥测图表</div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[0, 1].map((index) => (
          <div
            key={index}
            className="h-72 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-4"
          >
            <div className="mb-4 h-4 w-32 rounded-full bg-white/10" />
            <div className="h-full rounded-[1rem] bg-white/5" />
          </div>
        ))}
      </div>
    </Card>
  )
}

export function Dashboard() {
  const {
    selectedRobotId,
    isEStopActive,
    isRemoteControl,
    logs,
    setSelectedRobotId,
    setIsEStopActive,
    setIsRemoteControl,
    addLog,
    prependCriticalLogs,
  } = useDashboardStore()
  const { selectedRobot, setSelectedRobot, setBattery, setRobotStatus } = useRobotStore()
  const [temperatureSeries, setTemperatureSeries] = useState(() => generateTelemetry(1, 44, 4))
  const [imuSeries, setImuSeries] = useState(() => generateTelemetry(2, 8, 2))
  const logRef = useRef(null)

  const onlineCount = robots.filter((robot) => robot.status === 'online').length
  const warningCount = robots.filter((robot) => robot.status === 'warning').length
  const selectedRobotMeta = useMemo(
    () => robots.find((robot) => robot.id === selectedRobotId) ?? robots[0],
    [selectedRobotId],
  )

  useEffect(() => {
    setSelectedRobot({
      id: selectedRobotMeta.id,
      model: selectedRobotMeta.model,
      station: selectedRobotMeta.site,
      status: selectedRobotMeta.status === 'warning' ? 'warning' : selectedRobotMeta.status === 'offline' ? 'danger' : 'normal',
      battery: selectedRobotMeta.battery,
      signal: selectedRobotMeta.status === 'offline' ? 'weak' : 'strong',
      role: 'operator',
    })
  }, [selectedRobotMeta, setSelectedRobot])

  useEffect(() => {
    if (isEStopActive) {
      return undefined
    }

    const telemetryTimer = window.setInterval(() => {
      setTemperatureSeries((current) => {
        const nextPoint = {
          time: `${current.length + 1}s`,
          value: Number((42 + Math.random() * 10).toFixed(1)),
        }
        return [...current.slice(-9), nextPoint]
      })
      setImuSeries((current) => {
        const nextPoint = {
          time: `${current.length + 1}s`,
          value: Number((7 + Math.random() * 4).toFixed(1)),
        }
        return [...current.slice(-9), nextPoint]
      })

      const battery = Math.max(15, Number((selectedRobot.battery - Math.random() * 0.5).toFixed(1)))
      setBattery(battery)
      addLog({
        level: Math.random() > 0.78 ? 'warning' : 'info',
        message: Math.random() > 0.6 ? '关节温度采样已刷新' : 'SLAM 点云帧同步完成',
      })
    }, 2000)

    return () => window.clearInterval(telemetryTimer)
  }, [addLog, isEStopActive, selectedRobot.battery, setBattery])

  useEffect(() => {
    if (!logRef.current) {
      return
    }
    logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  const handleSelectRobot = (robot) => {
    setSelectedRobotId(robot.id)
    setRobotStatus(robot.status === 'warning' ? 'warning' : robot.status === 'offline' ? 'danger' : 'normal')
    setBattery(robot.battery)
    addLog({ level: 'success', message: `已切换监控对象至 ${robot.id}` })
  }

  const handleEStop = () => {
    const nextValue = !isEStopActive
    setIsEStopActive(nextValue)

    if (nextValue) {
      prependCriticalLogs([
        { time: new Date().toLocaleTimeString('zh-CN'), level: 'danger', message: '[CRITICAL] EMERGENCY HALT TRIGGERED' },
        { time: new Date().toLocaleTimeString('zh-CN'), level: 'danger', message: '[CRITICAL] ALL VIDEO FEEDS PAUSED' },
        { time: new Date().toLocaleTimeString('zh-CN'), level: 'danger', message: '[CRITICAL] WAITING FOR HUMAN OVERRIDE' },
      ])
      addLog({ level: 'danger', message: '紧急停止已激活，所有遥测流进入冻结态' })
    } else {
      addLog({ level: 'success', message: '紧急停止已解除，遥测恢复' })
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#05070c_0%,#050505_100%)] p-4 sm:p-6">
      <AnimatePresence>
        {isEStopActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.18, 0.35, 0.18] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-0 z-40 bg-red-600/20"
          />
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="在线机器人" value={onlineCount} unit="台" trend={12} />
          <MetricCard title="任务利用率" value={78} unit="%" trend={5} />
          <MetricCard title="当前报警" value={warningCount} unit="个" trend={-20} />
          <Card className="rounded-[1.75rem] p-4">
            <div className="text-sm text-gray-500">当前选中</div>
            <div className="mt-2 flex items-center gap-3">
              <Bot className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xl font-semibold text-white">{selectedRobotId}</div>
                <div className="text-xs text-gray-500">{selectedRobotMeta.site}</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <Card className="rounded-[2rem] p-5">
            <div className="mb-4 text-sm font-medium text-white">机队列表</div>
            <div className="space-y-3">
              {robots.map((robot) => {
                const isActive = robot.id === selectedRobotId
                return (
                  <button
                    key={robot.id}
                    type="button"
                    onClick={() => handleSelectRobot(robot)}
                    className={`w-full rounded-[1.4rem] border px-4 py-4 text-left transition-all ${
                      isActive
                        ? 'border-primary/35 bg-primary/12'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-white">{robot.name}</div>
                        <div className="mt-1 text-xs text-gray-500">{robot.model}</div>
                      </div>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          robot.status === 'online'
                            ? 'bg-status-success'
                            : robot.status === 'warning'
                              ? 'bg-status-warning'
                              : 'bg-gray-500'
                        }`}
                      />
                    </div>
                    <div className="mt-4">
                      <div className="mb-1 flex justify-between text-xs text-gray-500">
                        <span>电量</span>
                        <span>{robot.battery}%</span>
                      </div>
                      <ProgressBar
                        value={robot.battery}
                        color={robot.battery > 40 ? 'success' : robot.battery > 20 ? 'warning' : 'danger'}
                        size="sm"
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>

          <div className="grid gap-6">
            <VideoWall isEStopActive={isEStopActive} />

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <Suspense fallback={<TelemetryFallback />}>
                <TelemetryPanel temperatureSeries={temperatureSeries} imuSeries={imuSeries} />
              </Suspense>

              <Card className="rounded-[2rem] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">实时日志</h3>
                  <StatusBadge status={isEStopActive ? 'danger' : 'info'}>
                    {isEStopActive ? 'Critical' : 'Streaming'}
                  </StatusBadge>
                </div>
                <div ref={logRef} className="h-72 overflow-y-auto rounded-[1.5rem] border border-white/10 bg-black/25 p-4 sm:h-[22.5rem]">
                  <div className="space-y-2 text-xs font-mono">
                    {logs.map((log, index) => (
                      <div key={`${log.time}-${index}`} className="flex gap-2">
                        <span className="text-gray-500">{log.time}</span>
                        <span
                          className={`${
                            log.level === 'success'
                              ? 'text-status-success'
                              : log.level === 'warning'
                                ? 'text-status-warning'
                                : log.level === 'danger'
                                  ? 'text-status-danger'
                                  : 'text-primary'
                          }`}
                        >
                          [{log.level.toUpperCase()}]
                        </span>
                        <span className="text-gray-300">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <Card className={`sticky bottom-3 z-50 rounded-[2rem] border p-4 sm:bottom-4 ${
          isEStopActive ? 'border-status-danger bg-red-950/45 shadow-[0_0_40px_rgba(239,68,68,0.25)]' : 'border-white/10 bg-background-secondary/80'
        }`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  isEStopActive ? 'bg-status-danger/20 text-status-danger' : 'bg-primary/15 text-primary'
                }`}>
                  {isEStopActive ? <ShieldAlert className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">E-STOP 紧急停止</div>
                  <div className="text-xs text-gray-500">
                    {isEStopActive ? '所有视频与遥测流已冻结，等待人工复位' : '一键触发全系统暂停与日志报警'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-primary" />
                  电量 {selectedRobot.battery}%
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-status-success" />
                  信号 {selectedRobot.signal === 'weak' ? '弱' : '强'}
                </div>
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-accent-purple" />
                  控制模式 {isRemoteControl ? '远程' : '本地'}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <Button
                variant={isRemoteControl ? 'primary' : 'secondary'}
                size="lg"
                className="w-full rounded-full sm:w-auto"
                onClick={() => setIsRemoteControl(!isRemoteControl)}
              >
                <Radio className="mr-2 h-5 w-5" />
                {isRemoteControl ? '断开远程接管' : '远程接管'}
              </Button>
              <Button
                variant={isEStopActive ? 'secondary' : 'danger'}
                size="lg"
                className={`w-full rounded-full px-8 sm:w-auto ${isEStopActive ? '' : 'animate-pulse'}`}
                onClick={handleEStop}
              >
                <AlertCircle className="mr-2 h-5 w-5" />
                {isEStopActive ? '解除 E-STOP' : 'E-STOP'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
