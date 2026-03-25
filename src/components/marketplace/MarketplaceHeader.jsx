import { ShieldCheck, Cpu, Boxes, Activity } from 'lucide-react'

export function MarketplaceHeader({ copy, installedCount }) {
  const metricIcons = [Boxes, Cpu, Activity]

  return (
    <div className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(12,17,24,0.94),rgba(9,13,19,0.9))] px-6 py-6 shadow-[0_18px_48px_rgba(2,6,23,0.32)] lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.10),transparent_26%),radial-gradient(circle_at_18%_0%,rgba(16,185,129,0.06),transparent_24%)]" />

      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.32em] text-primary/75">{copy.eyebrow}</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white lg:text-[2.7rem]">
            {copy.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-[15px]">
            {copy.description}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[430px]">
          {copy.metrics.map((metric, index) => {
            const Icon = metricIcons[index] ?? Boxes
            const metricValue = metric.valueType === 'installedCount' ? installedCount : metric.value

            return (
              <div
                key={metric.label}
                className="rounded-[1.35rem] border border-white/8 bg-white/[0.035] px-4 py-4 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">{metric.label}</div>
                  <Icon className="h-4 w-4 text-gray-500" />
                </div>
                <div className="mt-3 text-[1.75rem] font-semibold tracking-tight text-white">{metricValue}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="relative mt-5 flex flex-col gap-3 rounded-[1.5rem] border border-white/8 bg-black/15 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
            <ShieldCheck className="h-[18px] w-[18px]" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">{copy.healthTitle}</div>
            <div className="mt-1 text-sm text-gray-400">
              {copy.healthDescription}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pl-12 text-xs text-gray-500 lg:pl-0">
          <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">Studio</span>
          <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">Edge</span>
          <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">Fleet OS</span>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 font-medium text-emerald-300">
            {copy.ready}
          </span>
        </div>
      </div>
    </div>
  )
}
