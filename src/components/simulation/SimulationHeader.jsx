import { StatusBadge } from '../ui'

export function SimulationHeader({
  copy,
  selectedRobot,
  telemetryChips,
}) {
  const keyTelemetry = telemetryChips.filter((chip) => chip.label !== copy.workspaceLabel).slice(0, 2)
  const statusLabel = copy.status[selectedRobot.status] ?? copy.status.normal
  const statusHint = copy.hint[selectedRobot.status] ?? copy.hint.normal

  return (
    <div className="border-b border-white/[0.06] bg-[rgba(7,11,17,0.9)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1860px] flex-col gap-1.5 px-2 py-2 sm:px-3 lg:flex-row lg:items-center lg:justify-between lg:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/18 bg-emerald-400/[0.06]">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.26em] text-gray-500">{copy.title}</div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="truncate text-sm font-semibold tracking-[0.01em] text-white">
                {selectedRobot.id}
              </span>
              <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-2 py-0.5 text-[11px] text-gray-400">
                {copy.robotPrefix} · {selectedRobot.station}
              </span>
              <StatusBadge status={selectedRobot.status}>{statusLabel}</StatusBadge>
            </div>
            <div className="mt-0.5 text-[11px] text-gray-500">
              {copy.robotSummary} · {statusHint} · {copy.robotSuffix}
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <div className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-gray-300">
            <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500">{copy.workspaceLabel}</span>
            <span className="ml-2 text-white/90">{copy.workspaceValue}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
          {keyTelemetry.map((chip) => (
            <div
              key={chip.label}
              className={`rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium ${chip.tone}`}
            >
              <span className="text-gray-400">{chip.label}</span>
              <span className="ml-1.5">{chip.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
