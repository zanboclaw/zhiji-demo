import { Card } from '../ui'
import { TelemetryChartCard } from './TelemetryChartCard'
import { telemetryCharts } from './telemetryData'

export function TelemetryPanel({ temperatureSeries, imuSeries, isEStopActive }) {
  const seriesMap = {
    temperature: temperatureSeries,
    imu: imuSeries,
  }

  return (
    <Card className="rounded-[2rem] border-white/8 bg-[rgba(12,17,24,0.9)] p-5 shadow-[0_18px_42px_rgba(2,6,23,0.2)] lg:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Telemetry Analysis</div>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">核心遥测分析</h3>
          <div className="mt-2 text-sm text-gray-500">以更克制的图表视图持续追踪温度与姿态波动，默认每 2 秒刷新一次。</div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">2 路关键传感器</span>
          <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">采样周期 2s</span>
          <span
            className={`rounded-full border px-3 py-1.5 ${
              isEStopActive
                ? 'border-status-danger/20 bg-status-danger/10 text-status-danger'
                : 'border-sky-400/18 bg-sky-400/10 text-sky-300'
            }`}
          >
            {isEStopActive ? '遥测冻结中' : '数据流稳定'}
          </span>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {telemetryCharts.map((chart) => (
          <TelemetryChartCard
            key={chart.key}
            chart={chart}
            series={seriesMap[chart.key]}
          />
        ))}
      </div>
    </Card>
  )
}
