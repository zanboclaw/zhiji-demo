import { lazy, Suspense, useMemo } from 'react'
import { focusHotspots, partConfig, partInsights, tools, viewOptions } from './simulationContent'

const RobotScene = lazy(() =>
  import('./RobotScene').then((module) => ({ default: module.RobotScene })),
)

const statusDotMap = {
  'text-emerald-300': 'bg-emerald-300',
  'text-sky-300': 'bg-sky-300',
  'text-amber-300': 'bg-amber-300',
  'text-primary': 'bg-primary',
}

const toolGuideMap = {
  select: {
    label: '选择模式',
    shortHint: '点击模型标注聚焦部件',
    description: '用于快速定位部件并联动右侧参数面板。',
  },
  move: {
    label: '移动模式',
    shortHint: '观察姿态平移与支撑变化',
    description: '聚焦位移与重心变化，适合检查支撑与偏移响应。',
  },
  rotate: {
    label: '旋转模式',
    shortHint: '观察模型旋转与关节联动',
    description: '用于检查机体转向、姿态调整和旋转控制反馈。',
  },
  inspect: {
    label: '巡检模式',
    shortHint: '启用扫描辅助观察重点区域',
    description: '强调局部检查与状态扫描，适合查看异常和关键部件。',
  },
  measure: {
    label: '测量模式',
    shortHint: '观察尺度、距离与构型关系',
    description: '辅助查看部件尺度关系和空间尺寸感知。',
  },
}

function SceneCanvasFallback() {
  return (
    <div className="flex h-full min-h-[680px] w-full items-center justify-center bg-[linear-gradient(180deg,#eff3f8_0%,#e7edf5_100%)]">
      <div className="rounded-full border border-slate-300/60 bg-white/72 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-500 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
        Loading Scene
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
  const selectedToolMeta = useMemo(
    () => tools.find((tool) => tool.id === selectedTool) ?? tools[0],
    [selectedTool],
  )
  const selectedViewMeta = useMemo(
    () => viewOptions.find((view) => view.id === selectedView) ?? viewOptions[0],
    [selectedView],
  )
  const selectedToolGuide = useMemo(
    () => toolGuideMap[selectedTool] ?? toolGuideMap.select,
    [selectedTool],
  )
  const selectedPartInsight = useMemo(
    () => (selectedPart ? partInsights[selectedPart] : null),
    [selectedPart],
  )

  return (
    <div
      id="simulation-viewport-panel"
      className="flex w-full min-w-0 flex-col rounded-[1.8rem] border border-white/8 bg-[linear-gradient(180deg,rgba(12,17,25,0.96),rgba(10,14,20,0.94))] p-3 shadow-[0_18px_42px_rgba(2,6,23,0.18)] sm:p-4"
    >
      <div className="mb-2.5 flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.22em] text-gray-500">数字孪生</div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-white">
              {currentSelection ? currentSelection.label : '数字孪生主视图'}
            </h3>
            <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-gray-400">
              {currentSelection ? currentSelection.badge : '总体姿态'}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            聚焦机器人三维姿态与部件联动，点击模型标注可快速查看对应参数与联动面板。
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-primary/16 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
              {selectedToolGuide.label}
            </span>
            <span className="text-[11px] text-gray-500">{selectedToolGuide.description}</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1 rounded-full border border-white/8 bg-white/[0.03] p-1">
          {viewOptions.map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => setSelectedView(view.id)}
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

      <div className="relative overflow-hidden rounded-[1.55rem] border border-slate-900/5 bg-[linear-gradient(180deg,#eef3f8_0%,#e4ebf4_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.82),rgba(255,255,255,0)_44%),linear-gradient(180deg,rgba(255,255,255,0.22),rgba(226,232,240,0.08))]" />
        <div className="pointer-events-none absolute inset-x-[16%] top-[8%] h-[20%] rounded-full border border-slate-300/22" />
        <div className="pointer-events-none absolute bottom-[-10%] left-1/2 h-[30%] w-[118%] -translate-x-1/2 rounded-full border border-slate-300/18 bg-[linear-gradient(180deg,rgba(226,232,240,0.18),rgba(255,255,255,0))]" />

        <div className="absolute left-4 top-4 z-10 rounded-full bg-[rgba(15,23,42,0.76)] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
          {currentSelection ? currentSelection.badge : '整机总览'}
        </div>
        <div className="absolute right-4 top-4 z-10 rounded-full bg-white/74 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-slate-500 shadow-[0_8px_18px_rgba(15,23,42,0.08)]">
          视角 · {selectedViewMeta.label}
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

        <div className="pointer-events-none absolute inset-0 hidden xl:block">
          {focusHotspots.map((hotspot) => {
            const isActive = selectedPart === hotspot.id
            const meta = partConfig[hotspot.id]

            return (
              <button
                key={hotspot.id}
                type="button"
                onClick={() => setSelectedPart(isActive ? null : hotspot.id)}
                className={`group pointer-events-auto absolute ${hotspot.position} rounded-[0.95rem] px-2.5 py-2 text-left text-xs transition-all ${
                  isActive
                    ? 'bg-[rgba(15,23,42,0.88)] text-white shadow-[0_10px_22px_rgba(15,23,42,0.14)] ring-1 ring-primary/18'
                    : 'bg-[rgba(15,23,42,0.64)] text-gray-300 shadow-[0_8px_18px_rgba(15,23,42,0.1)] ring-1 ring-white/6 backdrop-blur-sm hover:bg-[rgba(15,23,42,0.74)] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-primary' : 'bg-emerald-400/75'}`} />
                  {hotspot.label}
                </span>
                <span className={`mt-1 ${isActive ? 'block text-[10px] text-orange-100/90' : 'hidden text-[10px] text-gray-400 group-hover:block'}`}>
                  {meta.badge}
                </span>
              </button>
            )
          })}
        </div>

        {selectedPartInsight ? (
          <div className="absolute bottom-4 left-4 z-10 hidden w-[312px] rounded-[1.15rem] border border-slate-900/10 bg-white/82 p-3 text-slate-700 shadow-[0_14px_28px_rgba(15,23,42,0.1)] backdrop-blur-sm md:block">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">部件聚焦</div>
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
              {currentSelection ? currentSelection.label : '整机总览'}
            </span>
            <span className="rounded-full border border-slate-900/10 bg-white/72 px-3 py-2 text-[11px] text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
              工具 · {selectedToolMeta.label}
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
                onClick={() => setSelectedTool(tool.id)}
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

        <div className="absolute bottom-4 right-4 hidden rounded-[1rem] border border-white/30 bg-[rgba(15,23,42,0.66)] p-2 shadow-[0_8px_20px_rgba(15,23,42,0.1)] lg:flex lg:flex-col">
          <button
            type="button"
            onClick={() => setZoom((value) => Math.max(0.68, Number((value - 0.05).toFixed(2))))}
            className="rounded-[0.8rem] px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            -
          </button>
          <div className="px-3 py-1 text-center text-xs font-medium text-primary">{Math.round(zoom * 100)}%</div>
          <button
            type="button"
            onClick={() => setZoom((value) => Math.min(1.04, Number((value + 0.05).toFixed(2))))}
            className="rounded-[0.8rem] px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
