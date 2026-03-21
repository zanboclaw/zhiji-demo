import { Card } from '../ui'

export function TelemetryFallback() {
  return (
    <Card className="rounded-[1.75rem] border-white/8 bg-[rgba(14,19,27,0.9)] p-5 shadow-[0_14px_34px_rgba(2,6,23,0.18)]">
      <div className="mb-4 text-lg font-semibold text-white">实时遥测图表</div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[0, 1].map((index) => (
          <div
            key={index}
            className="h-72 rounded-[1.35rem] border border-white/8 bg-white/[0.03] p-4"
          >
            <div className="mb-4 h-4 w-32 rounded-full bg-white/10" />
            <div className="h-full rounded-[1rem] bg-white/[0.04]" />
          </div>
        ))}
      </div>
    </Card>
  )
}

export function OverviewCard({ title, value, unit, tone = 'primary', bars = [] }) {
  const toneMap = {
    primary: {
      text: 'text-primary',
      bar: 'bg-primary/80',
    },
    success: {
      text: 'text-status-success',
      bar: 'bg-status-success/80',
    },
    warning: {
      text: 'text-status-warning',
      bar: 'bg-status-warning/80',
    },
    danger: {
      text: 'text-status-danger',
      bar: 'bg-status-danger/80',
    },
  }

  const currentTone = toneMap[tone] ?? toneMap.primary

  return (
    <Card className="rounded-[1.5rem] border-white/8 bg-white/[0.035] p-4 shadow-none">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-gray-500">{title}</div>
          <div className="mt-3 flex items-end gap-2">
            <div className="text-[2rem] font-semibold tracking-tight text-white">{value}</div>
            <div className={`pb-1 text-xs uppercase tracking-[0.18em] ${currentTone.text}`}>{unit}</div>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-gray-500">
          <span className={`h-1.5 w-1.5 rounded-full ${currentTone.bar}`} />
          live
        </div>
      </div>
      <div className="mt-4 flex h-9 items-end gap-1.5">
        {bars.map((bar, index) => (
          <div key={`${title}-${index}`} className="flex h-full flex-1 items-end rounded-full bg-white/[0.04]">
            <div
              className={`w-full rounded-full ${currentTone.bar}`}
              style={{ height: `${bar}%` }}
            />
          </div>
        ))}
      </div>
    </Card>
  )
}
