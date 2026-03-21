import { BellRing, History } from 'lucide-react'
import { Card } from '../ui'
import { getLogTone } from './dashboardUtils'

function getAlertStyles(level) {
  return level === 'danger'
    ? {
      bar: 'bg-status-danger',
      badge: 'border-status-danger/18 bg-status-danger/10 text-status-danger',
      label: 'critical',
    }
    : {
      bar: 'bg-status-warning',
      badge: 'border-status-warning/18 bg-status-warning/10 text-status-warning',
      label: 'warning',
    }
}

export function AlertsPanel({ alertItems, className = '' }) {
  return (
    <Card className={`rounded-[1.9rem] border-white/8 bg-[rgba(12,17,24,0.9)] p-5 shadow-[0_16px_38px_rgba(2,6,23,0.16)] ${className}`}>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.04] text-gray-300">
            <BellRing className="h-[18px] w-[18px]" />
          </span>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Alerts</div>
            <h3 className="mt-1 text-lg font-semibold text-white">告警与事件</h3>
          </div>
        </div>
        <div className="text-xs text-gray-500">按严重级别排序</div>
      </div>

      <div className="space-y-3">
        {alertItems.length > 0 ? alertItems.map((item, index) => (
          <div key={`${item.time}-${index}`} className="relative overflow-hidden rounded-[1.2rem] bg-white/[0.03] px-4 py-3.5 ring-1 ring-white/6">
            <span
              className={`absolute bottom-3.5 left-0 top-3.5 w-[3px] rounded-full ${getAlertStyles(item.level).bar}`}
            />
            <div className="flex items-start justify-between gap-4 pl-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] ${getAlertStyles(item.level).badge}`}>
                    {getAlertStyles(item.level).label}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-gray-500">事件上报</span>
                </div>
                <div className="mt-2 text-sm leading-6 text-gray-100">{item.message}</div>
              </div>
              <div className="shrink-0 pt-1 text-xs text-gray-500">{item.time}</div>
            </div>
          </div>
        )) : (
          <div className="rounded-[1.25rem] bg-white/[0.03] px-4 py-4 text-sm text-gray-400 ring-1 ring-white/6">
            当前没有高优先级告警，系统运行稳定。
          </div>
        )}
      </div>
    </Card>
  )
}

export function LogsPanel({ logRef, logs, isEStopActive, className = '' }) {
  return (
    <Card className={`rounded-[1.9rem] border-white/8 bg-[rgba(11,16,22,0.88)] p-5 shadow-none ${className}`}>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.04] text-gray-400">
            <History className="h-[18px] w-[18px]" />
          </span>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Runtime Logs</div>
            <h3 className="mt-1 text-base font-semibold text-white">实时日志</h3>
          </div>
        </div>
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] ${
            isEStopActive
              ? 'border-status-danger/20 bg-status-danger/10 text-status-danger'
              : 'border-white/8 bg-white/[0.03] text-gray-400'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isEStopActive ? 'bg-status-danger' : 'bg-sky-400'}`} />
          {isEStopActive ? 'critical state' : 'streaming'}
        </div>
      </div>

      <div ref={logRef} className="h-72 overflow-y-auto rounded-[1.35rem] bg-black/20 p-3.5 sm:h-[18rem]">
        <div className="space-y-1.5 text-xs font-mono">
          {logs.map((log, index) => (
            <div
              key={`${log.time}-${index}`}
              className="grid grid-cols-[auto_auto_minmax(0,1fr)] gap-2 rounded-[0.95rem] px-2.5 py-2 text-[11px] ring-1 ring-transparent transition-colors hover:bg-white/[0.02] hover:ring-white/6"
            >
              <span className="text-gray-500">{log.time}</span>
              <span className={getLogTone(log.level)}>
                [{log.level.toUpperCase()}]
              </span>
              <span className="min-w-0 text-gray-300">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
