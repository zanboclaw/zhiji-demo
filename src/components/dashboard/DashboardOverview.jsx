import { ArrowUpRight, Bot } from 'lucide-react'
import { Card, ProgressBar } from '../ui'
import { OverviewCard } from './DashboardCards'
import {
  getBatteryTone,
  getRobotStatusBadgeClass,
  getRobotStatusLabel,
  getRobotStatusTone,
} from './dashboardUtils'

export function DashboardOverview({
  onlineCount,
  warningCount,
  offlineCount,
  selectedRobotId,
  selectedRobotMeta,
  robots,
  onSelectRobot,
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(14,19,27,0.94),rgba(10,14,20,0.92))] p-5 shadow-[0_18px_46px_rgba(2,6,23,0.28)] lg:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.32em] text-primary/75">Operations Center</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white lg:text-[2.7rem]">Fleet OS 监控台</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400">
              面向实时运行中的机器人集群，把设备状态、视频流、遥测分析与告警日志收敛到一个更稳定的运维中枢。
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
                主链路在线
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
                视频流稳定
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                遥测每 2 秒同步
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[520px] xl:grid-cols-4">
            <OverviewCard title="在线设备" value={onlineCount} unit="fleet" tone="success" bars={[28, 34, 42, 40, 44, 50, 58]} />
            <OverviewCard title="注意设备" value={warningCount} unit="warning" tone="warning" bars={[42, 38, 34, 30, 26, 22, 18]} />
            <OverviewCard title="离线设备" value={offlineCount} unit="offline" tone="danger" bars={[18, 20, 16, 14, 13, 12, 10]} />
            <OverviewCard title="平均延迟" value="42" unit="ms" tone="primary" bars={[22, 28, 26, 30, 34, 32, 36]} />
          </div>
        </div>

        <div className="mt-5 rounded-[1.55rem] border border-white/8 bg-black/15 px-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.12] text-primary">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-gray-500">当前监控对象</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-lg font-semibold text-white">{selectedRobotId}</span>
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] ${getRobotStatusBadgeClass(selectedRobotMeta.status)}`}>
                    {getRobotStatusLabel(selectedRobotMeta.status)}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-400">{selectedRobotMeta.model} · {selectedRobotMeta.site}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">在线 {onlineCount}</span>
              <span className="rounded-full border border-status-warning/18 bg-status-warning/10 px-3 py-1.5 text-status-warning">注意 {warningCount}</span>
              <span className="rounded-full border border-status-danger/18 bg-status-danger/10 px-3 py-1.5 text-status-danger">离线 {offlineCount}</span>
            </div>
          </div>
        </div>
      </div>

      <Card className="rounded-[1.85rem] border-white/8 bg-[rgba(13,18,25,0.9)] p-5 shadow-[0_16px_40px_rgba(2,6,23,0.22)]">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Fleet Roster</div>
            <div className="mt-2 text-lg font-semibold text-white">机器人状态列表</div>
          </div>
          <div className="text-sm text-gray-500">当前在线 {onlineCount} 台，重点关注异常与低电量设备</div>
        </div>
        <div className="grid gap-3 xl:grid-cols-2">
          {robots.map((robot) => {
            const isActive = robot.id === selectedRobotId

            return (
              <button
                key={robot.id}
                type="button"
                onClick={() => onSelectRobot(robot)}
                className={`group relative overflow-hidden rounded-[1.35rem] border px-4 py-4 text-left transition-all ${
                  isActive
                    ? 'border-white/14 bg-white/[0.05]'
                    : 'border-white/8 bg-white/[0.025] hover:border-white/12 hover:bg-white/[0.04]'
                }`}
              >
                <span
                  className={`absolute bottom-4 left-0 top-4 w-[3px] rounded-full transition-opacity ${
                    isActive ? 'bg-primary opacity-100' : 'bg-transparent opacity-0'
                  }`}
                />
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-white">{robot.name}</span>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] ${getRobotStatusBadgeClass(robot.status)}`}>
                        {getRobotStatusLabel(robot.status)}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">{robot.model} · {robot.site}</div>
                  </div>
                  <span className={`mt-1 h-2.5 w-2.5 rounded-full ${getRobotStatusTone(robot.status)}`} />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                  <div>
                    <div className="mb-1.5 flex justify-between text-[11px] uppercase tracking-[0.18em] text-gray-500">
                      <span>电量</span>
                      <span>{robot.battery}%</span>
                    </div>
                    <ProgressBar value={robot.battery} color={getBatteryTone(robot.battery)} size="sm" />
                  </div>
                  <div className="text-right text-[11px] uppercase tracking-[0.16em] text-gray-500">
                    最近更新 · 刚刚
                  </div>
                </div>

                <div className="mt-3 inline-flex items-center gap-1 text-xs text-gray-400 transition-colors group-hover:text-white">
                  查看设备详情
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </button>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
