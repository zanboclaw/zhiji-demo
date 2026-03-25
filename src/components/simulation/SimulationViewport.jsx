import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useI18n } from '../../i18n/context'
import { getSimulationContent, getSimulationPartDetails } from './simulationI18n'

const RobotScene = lazy(() =>
  import('./RobotScene').then((module) => ({ default: module.RobotScene })),
)

const statusDotMap = {
  'text-emerald-300': 'bg-emerald-300',
  'text-sky-300': 'bg-sky-300',
  'text-amber-300': 'bg-amber-300',
  'text-primary': 'bg-primary',
}

const hotspotStackOrder = ['head', 'shoulder', 'arm', 'hip', 'knee', 'foot']
const zoomMin = 0.68
const zoomMax = 1.04

const viewShortcutMap = {
  '1': 'front',
  '2': 'side',
  '3': 'top',
}

const toolShortcutMap = {
  q: 'select',
  w: 'move',
  e: 'rotate',
  r: 'inspect',
  t: 'measure',
}

function clampZoom(value) {
  return Math.max(zoomMin, Math.min(zoomMax, Number(value.toFixed(2))))
}

function SceneCanvasFallback() {
  const { locale } = useI18n()
  const content = getSimulationContent(locale)

  return (
    <div className="flex h-full min-h-[680px] w-full items-center justify-center bg-[linear-gradient(180deg,#eff3f8_0%,#e7edf5_100%)]">
      <div className="rounded-full border border-slate-300/60 bg-white/72 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-500 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
        {content.viewport.canvasLoading}
      </div>
    </div>
  )
}

export function SimulationViewport({
  currentSelection,
  selectedPart,
  selectedTool,
  selectedView,
  zoom,
  setSelectedTool,
  setSelectedPart,
  setSelectedView,
  setZoom,
}) {
  const { locale } = useI18n()
  const content = useMemo(() => getSimulationContent(locale), [locale])
  const { parts, tools, viewport, views } = content
  const [interactionHint, setInteractionHint] = useState(viewport.interactionHint)
  const selectedToolMeta = useMemo(
    () => tools.find((tool) => tool.id === selectedTool) ?? tools[0],
    [selectedTool, tools],
  )
  const selectedViewMeta = useMemo(
    () => views.find((view) => view.id === selectedView) ?? views[0],
    [selectedView, views],
  )
  const selectedToolGuide = useMemo(
    () => viewport.guide[selectedTool] ?? viewport.guide.select,
    [selectedTool, viewport.guide],
  )
  const selectedPartInsight = useMemo(
    () => getSimulationPartDetails(locale, selectedPart),
    [locale, selectedPart],
  )
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setInteractionHint(viewport.interactionHint)
    }, 2200)

    return () => window.clearTimeout(timer)
  }, [interactionHint, viewport.interactionHint])

  const updateHint = (message) => {
    setInteractionHint(message)
  }

  const handleSelectPart = (nextPart) => {
    setSelectedPart(nextPart)
    updateHint(nextPart ? viewport.focusedHint(parts[nextPart]?.label ?? viewport.defaultTitle) : viewport.overviewHint)
  }

  const handleSelectView = (viewId) => {
    setSelectedView(viewId)
    updateHint(viewport.viewHint(views.find((view) => view.id === viewId)?.label ?? selectedViewMeta.label))
  }

  const handleSelectTool = (toolId) => {
    setSelectedTool(toolId)
    updateHint(viewport.toolHint(tools.find((tool) => tool.id === toolId)?.label ?? selectedToolMeta.label))
  }

  const handleZoomChange = (nextZoom) => {
    const clampedZoom = clampZoom(nextZoom)
    setZoom(clampedZoom)
    updateHint(viewport.zoomHint(Math.round(clampedZoom * 100)))
  }

  const handleResetViewport = () => {
    setSelectedPart(null)
    setSelectedView('front')
    setSelectedTool('select')
    setZoom(0.84)
    updateHint(viewport.resetHint)
  }

  const handleViewportKeyDown = (event) => {
    const key = event.key.toLowerCase()

    if (viewShortcutMap[key]) {
      event.preventDefault()
      handleSelectView(viewShortcutMap[key])
      return
    }

    if (toolShortcutMap[key]) {
      event.preventDefault()
      handleSelectTool(toolShortcutMap[key])
      return
    }

    if (key === 'escape') {
      event.preventDefault()
      handleSelectPart(null)
      return
    }

    if (key === '0') {
      event.preventDefault()
      handleResetViewport()
      return
    }

    if (event.key === '+' || event.key === '=') {
      event.preventDefault()
      handleZoomChange(zoom + 0.05)
      return
    }

    if (event.key === '-' || event.key === '_') {
      event.preventDefault()
      handleZoomChange(zoom - 0.05)
    }
  }

  return (
    <div
      id="simulation-viewport-panel"
      className="flex w-full min-w-0 flex-col rounded-[1.8rem] border border-white/8 bg-[linear-gradient(180deg,rgba(12,17,25,0.96),rgba(10,14,20,0.94))] p-3 shadow-[0_18px_42px_rgba(2,6,23,0.18)] sm:p-4"
    >
      <div className="mb-2.5 flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.22em] text-gray-500">{viewport.sectionLabel}</div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-white">
              {currentSelection ? currentSelection.label : viewport.defaultTitle}
            </h3>
            <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-gray-400">
              {currentSelection ? currentSelection.badge : viewport.defaultBadge}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {viewport.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-primary/16 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
              {selectedToolGuide.label}
            </span>
            <span className="text-[11px] text-gray-500">{selectedToolGuide.description}</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1 rounded-full border border-white/8 bg-white/[0.03] p-1">
          {views.map((view) => (
            <button
              key={view.id}
              type="button"
              data-testid={`view-chip-${view.id}`}
              onClick={() => handleSelectView(view.id)}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                selectedView === view.id
                  ? 'bg-white/[0.08] text-white shadow-[0_8px_18px_rgba(2,6,23,0.12)]'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-[1.55rem] border border-slate-900/5 bg-[linear-gradient(180deg,#eef3f8_0%,#e4ebf4_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]"
        tabIndex={0}
        role="region"
        aria-label={viewport.ariaLabel}
        onKeyDown={handleViewportKeyDown}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.82),rgba(255,255,255,0)_44%),linear-gradient(180deg,rgba(255,255,255,0.22),rgba(226,232,240,0.08))]" />
        <div className="pointer-events-none absolute inset-x-[16%] top-[8%] h-[20%] rounded-full border border-slate-300/22" />
        <div className="pointer-events-none absolute bottom-[-10%] left-1/2 h-[30%] w-[118%] -translate-x-1/2 rounded-full border border-slate-300/18 bg-[linear-gradient(180deg,rgba(226,232,240,0.18),rgba(255,255,255,0))]" />

        <button
          type="button"
          data-testid="viewport-reset-overview"
          onClick={() => handleSelectPart(null)}
          className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition-all ${
            selectedPart
              ? 'bg-[rgba(15,23,42,0.68)] text-white hover:bg-[rgba(15,23,42,0.8)]'
              : 'bg-[rgba(15,23,42,0.82)] text-white ring-1 ring-white/12'
          }`}
        >
          {viewport.resetOverview}
        </button>
        <div className="absolute right-4 top-4 z-10 rounded-full bg-white/74 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-slate-500 shadow-[0_8px_18px_rgba(15,23,42,0.08)]">
          {selectedViewMeta.label}
        </div>
        <div className="absolute left-4 top-14 z-10 hidden max-w-[30rem] items-center gap-2 rounded-full border border-white/55 bg-white/82 px-3 py-2 text-[11px] text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.08)] md:flex">
          <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(249,115,22,0.18)]" />
          <span data-testid="viewport-interaction-hint">{interactionHint}</span>
        </div>
        <div className="absolute left-4 right-4 top-[5.55rem] z-10 flex flex-wrap gap-2 md:hidden">
          <div className="rounded-full border border-white/55 bg-white/82 px-3 py-2 text-[11px] text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            {interactionHint}
          </div>
        </div>

        <div
          id="simulation-scene"
          className="w-full"
          style={{ height: 'clamp(420px, 62vh, 700px)' }}
        >
          <Suspense fallback={<SceneCanvasFallback />}>
            <RobotScene
              selectedPart={selectedPart}
              selectedTool={selectedTool}
              selectedView={selectedView}
              zoom={zoom}
            />
          </Suspense>
        </div>

        <div className="absolute left-4 top-[6.8rem] z-10 hidden max-w-[min(42rem,62vw)] flex-wrap gap-2 xl:flex">
          {hotspotStackOrder.map((id) => {
            const meta = parts[id]
            const isActive = selectedPart === id
            if (!meta) return null

            return (
              <button
                key={`focus-chip-${id}`}
                type="button"
                data-testid={`focus-chip-${id}`}
                onClick={() => handleSelectPart(isActive ? null : id)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all ${
                  isActive
                    ? 'border-primary/22 bg-primary/12 text-slate-900 shadow-[0_8px_18px_rgba(249,115,22,0.16)]'
                    : 'border-white/55 bg-white/78 text-slate-600 hover:border-slate-300/80 hover:bg-white'
                }`}
              >
                {meta.shortLabel ?? meta.label}
              </button>
            )
          })}
        </div>

        {selectedPartInsight ? (
          <div className="absolute bottom-4 left-4 z-10 hidden w-[312px] rounded-[1.15rem] border border-slate-900/10 bg-white/82 p-3 text-slate-700 shadow-[0_14px_28px_rgba(15,23,42,0.1)] backdrop-blur-sm md:block">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{viewport.sectionLabel}</div>
                <div className="mt-1 text-sm font-semibold text-slate-800">{currentSelection?.label}</div>
              </div>
              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${selectedPartInsight.badgeTone}`}>
                {selectedPartInsight.status}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {selectedPartInsight.metrics.map((metric) => (
                <div key={metric.label} className="rounded-[0.95rem] border border-slate-900/8 bg-white/55 px-3 py-2">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">{metric.label}</div>
                  <div className="mt-1 text-sm font-medium text-slate-800">{metric.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-[0.95rem] border border-slate-900/8 bg-slate-900/[0.03] px-3 py-2.5 text-[11px] leading-5 text-slate-600">
              <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${statusDotMap[selectedPartInsight.statusTone] ?? 'bg-slate-400'}`} />
              <span>{selectedPartInsight.recommendation}</span>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-4 left-4 z-10 hidden md:flex md:flex-wrap md:items-center md:gap-2">
            <span className="rounded-full border border-slate-900/10 bg-white/82 px-3 py-2 text-[11px] font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
              {currentSelection ? currentSelection.label : viewport.resetOverview}
            </span>
            <span className="rounded-full border border-slate-900/10 bg-white/72 px-3 py-2 text-[11px] text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
              {selectedToolMeta.label}
            </span>
            <span className="rounded-full border border-slate-900/10 bg-white/72 px-3 py-2 text-[11px] text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
              {selectedToolGuide.shortHint}
            </span>
          </div>
        )}

        <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col gap-2 rounded-[1rem] border border-white/30 bg-[rgba(15,23,42,0.66)] p-2 shadow-[0_8px_20px_rgba(15,23,42,0.1)] md:flex">
          {tools.map((tool) => {
            const Icon = tool.icon
            const isActive = selectedTool === tool.id

            return (
              <button
                key={tool.id}
                type="button"
                title={tool.label}
                aria-pressed={isActive}
                data-testid={`viewport-tool-${tool.id}`}
                onClick={() => handleSelectTool(tool.id)}
                className={`flex h-9 w-9 items-center justify-center rounded-[0.8rem] transition-colors ${
                  isActive
                    ? 'bg-white/[0.14] text-white shadow-[inset_0_0_0_1px_rgba(249,115,22,0.25)]'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
              </button>
            )
          })}
        </div>

      </div>
    </div>
  )
}
