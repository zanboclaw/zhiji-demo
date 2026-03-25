import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useI18n } from '../../i18n/context'
import { useDashboardStore, useRobotStore } from '../../store'
import { VideoWall } from './VideoWall'
import { TelemetryFallback } from './DashboardCards'
import { DashboardOverview } from './DashboardOverview'
import { AlertsPanel, LogsPanel } from './DashboardStatusPanels'
import { DashboardControlBar } from './DashboardControlBar'
import { appendTelemetryPoint, generateTelemetry } from './dashboardUtils'
import { getDashboardCopy, resolveDashboardRuntimeMessage } from './dashboardI18n'

const TelemetryPanel = lazy(() =>
  import('./TelemetryPanel').then((module) => ({ default: module.TelemetryPanel })),
)

export function Dashboard() {
  const { locale } = useI18n()
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
  const content = useMemo(() => getDashboardCopy(locale), [locale])
  const robots = content.robots

  const onlineCount = robots.filter((robot) => robot.status === 'online').length
  const warningCount = robots.filter((robot) => robot.status === 'warning').length
  const offlineCount = robots.filter((robot) => robot.status === 'offline').length
  const selectedRobotMeta = useMemo(
    () => robots.find((robot) => robot.id === selectedRobotId) ?? robots[0],
    [robots, selectedRobotId],
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
    () => logs
      .filter((log) => log.level === 'danger' || log.level === 'warning')
      .slice(-4)
      .reverse()
      .map((log) => ({ ...log, message: resolveDashboardRuntimeMessage(locale, log) })),
    [locale, logs],
  )

  const displayLogs = useMemo(
    () => logs.map((log) => ({ ...log, message: resolveDashboardRuntimeMessage(locale, log) })),
    [locale, logs],
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
        messageKey: Math.random() > 0.6 ? 'dashboardTempRefreshed' : 'dashboardSlamSynced',
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
    addLog({ level: 'success', messageKey: 'dashboardRobotSwitched', vars: { robotId: robot.id } })
  }

  const handleEStop = () => {
    const nextValue = !isEStopActive
    setIsEStopActive(nextValue)

    if (nextValue) {
      prependCriticalLogs([
        { time: new Date().toLocaleTimeString(), level: 'danger', messageKey: 'dashboardCriticalHalt' },
        { time: new Date().toLocaleTimeString(), level: 'danger', messageKey: 'dashboardCriticalPaused' },
        { time: new Date().toLocaleTimeString(), level: 'danger', messageKey: 'dashboardCriticalWaiting' },
      ])
      addLog({ level: 'danger', messageKey: 'dashboardEStopActivated' })
    } else {
      addLog({ level: 'success', messageKey: 'dashboardEStopReleased' })
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
          copy={content.overview}
          locale={locale}
          onlineCount={onlineCount}
          warningCount={warningCount}
          offlineCount={offlineCount}
          selectedRobotId={selectedRobotId}
          selectedRobotMeta={selectedRobotMeta}
          robots={robots}
          onSelectRobot={handleSelectRobot}
        />

        <div className="grid gap-6">
          <VideoWall copy={content.videoWall} isEStopActive={isEStopActive} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.24fr)_minmax(340px,0.78fr)]">
            <Suspense fallback={<TelemetryFallback title={content.telemetry.fallbackTitle} />}>
              <TelemetryPanel
                copy={content.telemetry}
                temperatureSeries={temperatureSeries}
                imuSeries={imuSeries}
                isEStopActive={isEStopActive}
              />
            </Suspense>

            <div className="grid gap-6 xl:grid-rows-[minmax(0,0.96fr)_minmax(0,0.82fr)]">
              <AlertsPanel alertItems={alertItems} copy={content.alerts} className="xl:min-h-[20rem]" />
              <LogsPanel
                copy={content.logs}
                logRef={logRef}
                logs={displayLogs}
                isEStopActive={isEStopActive}
                className="xl:min-h-[18rem]"
              />
            </div>
          </div>
        </div>

        <DashboardControlBar
          copy={content.controlBar}
          isEStopActive={isEStopActive}
          isRemoteControl={isRemoteControl}
          locale={locale}
          selectedRobot={selectedRobot}
          onToggleRemoteControl={() => setIsRemoteControl(!isRemoteControl)}
          onToggleEStop={handleEStop}
        />
      </div>
    </div>
  )
}
