import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDashboardStore, useRobotStore } from '../../store'
import { VideoWall } from './VideoWall'
import { TelemetryFallback } from './DashboardCards'
import { DashboardOverview } from './DashboardOverview'
import { AlertsPanel, LogsPanel } from './DashboardStatusPanels'
import { DashboardControlBar } from './DashboardControlBar'
import { appendTelemetryPoint, generateTelemetry } from './dashboardUtils'
import { robots } from './dashboardData'

const TelemetryPanel = lazy(() =>
  import('./TelemetryPanel').then((module) => ({ default: module.TelemetryPanel })),
)

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
  const offlineCount = robots.filter((robot) => robot.status === 'offline').length
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

  const alertItems = useMemo(
    () => logs.filter((log) => log.level === 'danger' || log.level === 'warning').slice(-4).reverse(),
    [logs],
  )

  useEffect(() => {
    if (isEStopActive) {
      return undefined
    }

    const telemetryTimer = window.setInterval(() => {
      setTemperatureSeries((current) => appendTelemetryPoint(current, 44, 4, 1))
      setImuSeries((current) => appendTelemetryPoint(current, 8, 2, 2))

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
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.08),transparent_26%),linear-gradient(180deg,#05070c_0%,#050505_100%)] px-4 py-4 sm:px-6 sm:py-5">
      <AnimatePresence>
        {isEStopActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.08, 0.16, 0.08] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-0 z-40 bg-red-600/15"
          />
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-[1500px] space-y-5">
        <DashboardOverview
          onlineCount={onlineCount}
          warningCount={warningCount}
          offlineCount={offlineCount}
          selectedRobotId={selectedRobotId}
          selectedRobotMeta={selectedRobotMeta}
          robots={robots}
          onSelectRobot={handleSelectRobot}
        />

        <div className="grid gap-6">
          <VideoWall isEStopActive={isEStopActive} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.24fr)_minmax(340px,0.78fr)]">
            <Suspense fallback={<TelemetryFallback />}>
              <TelemetryPanel
                temperatureSeries={temperatureSeries}
                imuSeries={imuSeries}
                isEStopActive={isEStopActive}
              />
            </Suspense>

            <div className="grid gap-6 xl:grid-rows-[minmax(0,0.96fr)_minmax(0,0.82fr)]">
              <AlertsPanel alertItems={alertItems} className="xl:min-h-[20rem]" />
              <LogsPanel
                logRef={logRef}
                logs={logs}
                isEStopActive={isEStopActive}
                className="xl:min-h-[18rem]"
              />
            </div>
          </div>
        </div>

        <DashboardControlBar
          isEStopActive={isEStopActive}
          isRemoteControl={isRemoteControl}
          selectedRobot={selectedRobot}
          onToggleRemoteControl={() => setIsRemoteControl(!isRemoteControl)}
          onToggleEStop={handleEStop}
        />
      </div>
    </div>
  )
}
