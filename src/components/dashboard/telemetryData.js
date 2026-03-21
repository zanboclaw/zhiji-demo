import { Activity, Thermometer } from 'lucide-react'

export const telemetryCharts = [
  {
    key: 'temperature',
    title: '关节温度',
    icon: Thermometer,
    iconTone: 'text-status-warning',
    chartColor: '#38bdf8',
    yDomain: [35, 65],
    description: '热管理采样曲线',
    unit: '°C',
    tooltipLabel: 'Temperature',
    valueTone: 'text-white',
  },
  {
    key: 'imu',
    title: 'IMU 震动频率',
    icon: Activity,
    iconTone: 'text-sky-400',
    chartColor: '#60a5fa',
    yDomain: [5, 12],
    description: '惯导频率波动曲线',
    unit: 'Hz',
    tooltipLabel: 'IMU',
    valueTone: 'text-sky-200',
  },
]

export const telemetryTooltipStyle = {
  backgroundColor: 'rgba(9, 14, 21, 0.94)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '14px',
  boxShadow: '0 14px 34px rgba(2, 6, 23, 0.28)',
}

export const telemetryGridStroke = 'rgba(255,255,255,0.05)'
export const telemetryAxisStroke = '#667085'
