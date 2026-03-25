import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { telemetryAxisStroke, telemetryGridStroke, telemetryTooltipStyle } from './telemetryData'

export function TelemetryChartCard({ chart, latestLabel = 'Latest', series }) {
  const Icon = chart.icon
  const latestPoint = series.at(-1)
  const latestValue = latestPoint ? `${latestPoint.value}${chart.unit}` : `--${chart.unit}`

  return (
    <div className="rounded-[1.45rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04]">
              <Icon className={`h-4 w-4 ${chart.iconTone}`} />
            </span>
            <span className="font-medium">{chart.title}</span>
          </div>
          <div className="mt-2 text-xs tracking-[0.14em] text-gray-500">{chart.description}</div>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500">{latestLabel}</div>
          <div className={`mt-2 text-2xl font-semibold tracking-tight ${chart.valueTone}`}>
            {latestValue}
          </div>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}>
            <CartesianGrid stroke={telemetryGridStroke} vertical={false} />
            <XAxis dataKey="time" stroke={telemetryAxisStroke} tickLine={false} axisLine={false} />
            <YAxis
              stroke={telemetryAxisStroke}
              tickLine={false}
              axisLine={false}
              domain={chart.yDomain}
              tickFormatter={(value) => `${value}${chart.unit}`}
              width={44}
            />
            <Tooltip
              contentStyle={telemetryTooltipStyle}
              cursor={{ stroke: 'rgba(148, 163, 184, 0.2)', strokeWidth: 1 }}
              formatter={(value) => [`${value}${chart.unit}`, chart.tooltipLabel]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={chart.chartColor}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: chart.chartColor, stroke: '#08111c', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
