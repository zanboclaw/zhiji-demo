import { Card } from '../ui'
import { TelemetryChartCard } from './TelemetryChartCard'

export function TelemetryPanel({ copy, temperatureSeries, imuSeries, isEStopActive }) {
  const seriesMap = {
    temperature: temperatureSeries,
    imu: imuSeries,
  }

  return (
    <Card className="rounded-[2rem] border-white/8 bg-[rgba(12,17,24,0.9)] p-5 shadow-[0_18px_42px_rgba(2,6,23,0.2)] lg:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-gray-500">{copy.eyebrow}</div>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">{copy.title}</h3>
          <div className="mt-2 text-sm text-gray-500">{copy.description}</div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          {copy.chips.map((chip) => (
            <span key={chip} className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">{chip}</span>
          ))}
          <span
            className={`rounded-full border px-3 py-1.5 ${
              isEStopActive
                ? 'border-status-danger/20 bg-status-danger/10 text-status-danger'
                : 'border-sky-400/18 bg-sky-400/10 text-sky-300'
            }`}
          >
            {isEStopActive ? copy.frozen : copy.stable}
          </span>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {copy.charts.map((chart) => (
          <TelemetryChartCard
            key={chart.key}
            chart={chart}
            latestLabel={copy.latest}
            series={seriesMap[chart.key]}
          />
        ))}
      </div>
    </Card>
  )
}
