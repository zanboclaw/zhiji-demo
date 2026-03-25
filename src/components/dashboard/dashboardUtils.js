const statusLabels = {
  en: { online: 'Online', warning: 'Attention', offline: 'Offline' },
  zh: { online: '在线', warning: '注意', offline: '离线' },
  fr: { online: 'En ligne', warning: 'Attention', offline: 'Hors ligne' },
  ru: { online: 'В сети', warning: 'Внимание', offline: 'Оффлайн' },
  de: { online: 'Online', warning: 'Warnung', offline: 'Offline' },
}

const signalLabels = {
  en: { weak: 'Weak', strong: 'Strong' },
  zh: { weak: '弱', strong: '强' },
  fr: { weak: 'Faible', strong: 'Fort' },
  ru: { weak: 'Слабый', strong: 'Сильный' },
  de: { weak: 'Schwach', strong: 'Stark' },
}

export function generateTelemetry(seed, baseline, amplitude) {
  return Array.from({ length: 10 }, (_, index) => ({
    time: `${index + 1}s`,
    value: Number((baseline + Math.sin((seed + index) / 2) * amplitude + Math.random() * 2).toFixed(1)),
  }))
}

export function appendTelemetryPoint(current, baseline, amplitude, seed = 0) {
  const lastTime = Number.parseInt(current.at(-1)?.time ?? '0', 10) || 0

  return [
    ...current.slice(-9),
    {
      time: `${lastTime + 1}s`,
      value: Number((
        baseline
        + Math.sin((seed + lastTime + 1) / 2) * amplitude
        + Math.random() * (amplitude > 3 ? 1.4 : 0.8)
      ).toFixed(1)),
    },
  ]
}

export function getRobotStatusTone(status) {
  return {
    online: 'bg-status-success',
    warning: 'bg-status-warning',
    offline: 'bg-status-danger',
  }[status]
}

export function getRobotStatusLabel(status, locale = 'en') {
  const labels = statusLabels[locale] ?? statusLabels.en
  return labels[status]
}

export function getRobotStatusBadgeClass(status) {
  return {
    online: 'border-status-success/20 bg-status-success/10 text-status-success',
    warning: 'border-status-warning/20 bg-status-warning/10 text-status-warning',
    offline: 'border-status-danger/20 bg-status-danger/10 text-status-danger',
  }[status]
}

export function getBatteryTone(value) {
  if (value > 40) return 'success'
  if (value > 20) return 'warning'
  return 'danger'
}

export function getLogTone(level) {
  if (level === 'success') return 'text-status-success'
  if (level === 'warning') return 'text-status-warning'
  if (level === 'danger') return 'text-status-danger'
  return 'text-sky-400'
}

export function getEStopCardClass(isEStopActive) {
  return isEStopActive
    ? 'border-status-danger/28 bg-red-950/28 shadow-[0_16px_40px_rgba(239,68,68,0.14)]'
    : 'border-white/8 bg-[rgba(12,17,24,0.86)] shadow-[0_16px_36px_rgba(2,6,23,0.18)]'
}

export function getSignalLabel(signal, locale = 'en') {
  const labels = signalLabels[locale] ?? signalLabels.en
  return labels[signal === 'weak' ? 'weak' : 'strong']
}
