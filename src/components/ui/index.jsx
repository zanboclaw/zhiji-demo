// UI 基础组件

import { motion } from 'framer-motion'

export function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`bg-background-card/82 backdrop-blur-md border border-white/8 rounded-xl ${
        hover ? 'hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_18px_36px_rgba(249,115,22,0.12)] transition-all duration-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-[linear-gradient(135deg,#f97316,#fb923c)] hover:brightness-105 text-white shadow-[0_14px_32px_rgba(249,115,22,0.22)]',
    secondary: 'bg-white/10 hover:bg-white/20 text-gray-200',
    outline: 'border border-white/14 hover:border-primary/40 hover:bg-primary/8 text-gray-200',
    ghost: 'hover:bg-white/5 text-gray-400 hover:text-gray-200',
    danger: 'bg-status-danger hover:bg-red-600 text-white',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
        variants[variant]
      } ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function StatusBadge({ status, children }) {
  const styles = {
    normal: 'bg-status-success/20 text-status-success border-status-success/30',
    warning: 'bg-status-warning/20 text-status-warning border-status-warning/30',
    danger: 'bg-status-danger/20 text-status-danger border-status-danger/30',
    info: 'bg-primary/20 text-primary border-primary/30',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        styles[status] || styles.info
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === 'normal' ? 'bg-status-success animate-pulse' :
        status === 'warning' ? 'bg-status-warning' :
        status === 'danger' ? 'bg-status-danger animate-pulse' :
        'bg-primary'
      }`} />
      {children}
    </span>
  )
}

export function ProgressBar({ value, max = 100, color = 'primary', size = 'md' }) {
  const colors = {
    primary: 'bg-primary',
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    danger: 'bg-status-danger',
  }

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className={`w-full bg-white/10 rounded-full ${sizes[size]}`}>
      <motion.div
        className={`${colors[color]} rounded-full ${sizes[size]}`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  )
}

export function MetricCard({ title, value, unit, trend }) {
  return (
    <Card className="p-4">
      <div className="text-gray-400 text-sm mb-1">{title}</div>
      <div className="flex items-end space-x-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {unit && <span className="text-gray-500 text-sm mb-1">{unit}</span>}
      </div>
      {trend && (
        <div className={`text-xs mt-2 ${
          trend > 0 ? 'text-status-success' : 'text-status-danger'
        }`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </Card>
  )
}
