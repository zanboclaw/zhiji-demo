import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Brain,
  ChevronDown,
  Cpu,
  Eye,
  Hand,
  Maximize2,
  Mic,
  Move,
  MousePointer2,
  Radar,
  RotateCcw,
  RotateCw,
  Send,
  ScanLine,
} from 'lucide-react'
import { useSimulationStore, useTerminalStore, useRobotStore } from '../../store'
import { aiResponses } from '../../data/mock'
import { ProgressBar, StatusBadge } from '../ui'
import { RobotScene } from './RobotScene'

const tools = [
  { id: 'select', icon: MousePointer2, label: '选择' },
  { id: 'move', icon: Move, label: '移动' },
  { id: 'rotate', icon: RotateCw, label: '旋转' },
  { id: 'inspect', icon: ScanLine, label: '巡检' },
  { id: 'measure', icon: Maximize2, label: '缩放' },
]

const partConfig = {
  head: { label: '头部感知', badge: '视觉中枢' },
  shoulder: { label: '颈部关节', badge: '平衡联动' },
  arm: { label: '上肢执行', badge: '抓取控制' },
  hip: { label: '躯干核心', badge: '姿态稳定' },
  knee: { label: '下肢联动', badge: '步态规划' },
  foot: { label: '足端支撑', badge: '着地反馈' },
}

const quickActions = [
  { label: '姿态校准', action: '姿态校准' },
  { label: '关节诊断', action: '关节诊断' },
  { label: '步态优化', action: '步态优化' },
]

const viewOptions = [
  { id: 'front', label: '正视' },
  { id: 'side', label: '左视' },
  { id: 'top', label: '俯视' },
]

const focusHotspots = [
  { id: 'head', label: '头部', position: 'top-[11%] left-1/2 -translate-x-1/2' },
  { id: 'shoulder', label: '肩部', position: 'top-[24%] left-[26%]' },
  { id: 'arm', label: '上肢', position: 'top-[44%] right-[18%]' },
  { id: 'hip', label: '躯干', position: 'top-[45%] left-1/2 -translate-x-1/2' },
  { id: 'knee', label: '膝部', position: 'bottom-[24%] left-[34%]' },
  { id: 'foot', label: '足端', position: 'bottom-[11%] right-[32%]' },
]

const parameterSections = [
  {
    title: '头部感知系统',
    icon: Eye,
    tone: 'text-cyan-600',
    rows: [
      { label: '视觉传感器型号', value: 'Sony IMX586 + RGB-D' },
      { label: '视场角 / FOV', value: '120° / 90°' },
      { label: '头部旋转范围', value: 'Pan ±30° | Tilt ±45°' },
      { label: '观测距离范围', value: '0.3m - 10m' },
    ],
    sliders: [
      { label: 'LiDAR 刷新速率', value: 67 },
      { label: '人脸识别置信度', value: 84 },
      { label: '夜视模式', value: 38 },
    ],
  },
  {
    title: '颈部关节模组',
    icon: Radar,
    tone: 'text-sky-600',
    rows: [
      { label: '关节驱动', value: '行星齿轮' },
      { label: '校准目标', value: '0N·m' },
      { label: '最大功率', value: '0 / 5' },
    ],
    stats: [
      { label: '当前角度', value: '23°' },
      { label: '中立位', value: '63°' },
      { label: '极限角', value: '63°' },
    ],
  },
  {
    title: '躯干主控系统',
    icon: Cpu,
    tone: 'text-indigo-600',
    rows: [
      { label: '主运算板', value: 'NVIDIA Jetson AGX Orin' },
      { label: '热值', value: '15W' },
      { label: 'AI 算力', value: '0 TOPS' },
      { label: '驱动芯片', value: 'OG8' },
      { label: '存储颗粒', value: 'OG8' },
    ],
    sliders: [
      { label: 'CPU 使用率', value: 32 },
      { label: 'GPU 使用率', value: 32 },
      { label: '内存占用', value: 66 },
    ],
    footer: '42.3 / 64 GB',
  },
  {
    title: '左臂操作系统',
    icon: Hand,
    tone: 'text-violet-600',
    rows: [
      { label: '自由度', value: '请选择' },
      { label: '最大负载', value: '请选择负载KG' },
      { label: '臂长校准', value: '请选择长度CM' },
      { label: '重复定位精度', value: '请选择' },
      { label: '末端执行器', value: '三指自适应夹爪' },
      { label: '力学补偿', value: '6轴力/力矩传感器' },
    ],
  },
  {
    title: '右臂操作系统',
    icon: Hand,
    tone: 'text-fuchsia-600',
    rows: [
      { label: '自由度', value: '请选择' },
      { label: '最大负载', value: '请选择负载KG' },
      { label: '臂长校准', value: '请选择长度CM' },
      { label: '重复定位精度', value: '请选择' },
      { label: '末端执行器', value: '三指自适应夹爪' },
      { label: '力学补偿', value: '6轴力/力矩传感器' },
    ],
  },
  {
    title: '全局系统参数',
    icon: Brain,
    tone: 'text-emerald-600',
    rows: [
      { label: '机体高度', value: '0cm' },
      { label: '整机重量', value: '0kg' },
      { label: '最大行走速度', value: '0km/h' },
      { label: '续航时间', value: '0h' },
    ],
  },
]

function SectionCard({ section }) {
  const Icon = section.icon

  return (
    <div className="rounded-[1.35rem] border border-white/8 bg-[linear-gradient(180deg,rgba(17,24,33,0.94),rgba(14,18,27,0.92))] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.24)]">
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 ${section.tone}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-sm font-semibold text-white">{section.title}</div>
      </div>

      <div className="space-y-3">
        {section.rows?.map((row) => (
          <div key={row.label}>
            <div className="mb-1 text-[11px] tracking-[0.12em] text-gray-500">{row.label}</div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-gray-200">
              <span>{row.value}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        ))}
      </div>

      {section.sliders && (
        <div className="mt-4 space-y-3">
          {section.sliders.map((slider) => (
            <div key={slider.label}>
              <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                <span>{slider.label}</span>
                <span>{slider.value}%</span>
              </div>
              <ProgressBar value={slider.value} color="primary" size="sm" />
            </div>
          ))}
          {section.footer && (
            <div className="text-right text-xs text-gray-500">{section.footer}</div>
          )}
        </div>
      )}

      {section.stats && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {section.stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-center">
              <div className="text-[11px] text-gray-500">{stat.label}</div>
              <div className="mt-1 text-sm font-semibold text-white">{stat.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function SimulationStudio() {
  const {
    selectedTool,
    selectedView,
    selectedPart,
    parameters,
    setSelectedTool,
    setSelectedView,
    setSelectedPart,
    updateParameters,
  } = useSimulationStore()
  const { selectedRobot } = useRobotStore()
  const {
    messages,
    inputValue,
    isThinking,
    isRecording,
    addMessage,
    setInputValue,
    setIsThinking,
    setIsRecording,
  } = useTerminalStore()

  const [zoom, setZoom] = useState(0.9)
  const logRef = useRef(null)

  useEffect(() => {
    const interval = window.setInterval(() => {
      updateParameters('compute', {
        cpu: Math.max(20, Math.min(92, Number((parameters.compute.cpu + (Math.random() * 12 - 6)).toFixed(0)))),
        gpu: Math.max(20, Math.min(96, Number((parameters.compute.gpu + (Math.random() * 14 - 7)).toFixed(0)))),
        temp: Math.max(45, Math.min(76, Number((parameters.compute.temp + (Math.random() * 4 - 2)).toFixed(1)))),
      })
      updateParameters('balance', {
        gyroX: Number((Math.random() * 0.08 - 0.04).toFixed(2)),
        gyroY: Number((Math.random() * 0.08 - 0.04).toFixed(2)),
        stability: Number((96 + Math.random() * 3).toFixed(1)),
      })
      updateParameters('limb', {
        leftTorque: Number((40 + Math.random() * 5).toFixed(1)),
        rightTorque: Number((40 + Math.random() * 5).toFixed(1)),
      })
    }, 1500)

    return () => window.clearInterval(interval)
  }, [parameters.compute.cpu, parameters.compute.gpu, parameters.compute.temp, updateParameters])

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [messages, isThinking])

  const currentSelection = useMemo(
    () => (selectedPart ? partConfig[selectedPart] : null),
    [selectedPart],
  )

  const telemetryChips = [
    { label: '通信', value: '强', tone: 'bg-sky-100 text-sky-700' },
    { label: '电量', value: `${selectedRobot.battery}%`, tone: 'bg-emerald-100 text-emerald-700' },
    { label: '操作员', value: '操作员', tone: 'bg-blue-100 text-blue-700' },
  ]

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addMessage({ type: 'user', content: inputValue })
    setInputValue('')
    setIsThinking(true)

    window.setTimeout(() => {
      const response = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      addMessage({ type: 'ai', content: response })
      setIsThinking(false)
    }, 1200)
  }

  const handleQuickAction = (action) => {
    addMessage({ type: 'system', content: `已执行：${action}` })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(180deg,#070b11_0%,#0b1018_100%)] text-slate-100">
      <div className="border-b border-white/8 bg-[rgba(10,14,20,0.9)] shadow-[0_12px_30px_rgba(2,6,23,0.32)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1900px] flex-wrap items-center justify-between gap-4 px-3 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl border border-emerald-400/50 bg-emerald-400/8" />
            <div>
              <div className="text-sm font-semibold text-white">{selectedRobot.id}</div>
              <div className="text-[11px] text-gray-500">工位 · {selectedRobot.station}</div>
            </div>
          </div>

          <div className="hidden rounded-full border border-white/8 bg-white/[0.03] px-5 py-3 shadow-[0_8px_24px_rgba(2,6,23,0.24)] md:flex md:items-center md:gap-3">
            <span className="text-sm text-gray-300">机器人状态监控</span>
            <StatusBadge status={selectedRobot.status}>正常</StatusBadge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {telemetryChips.map((chip) => (
              <div key={chip.label} className={`rounded-full px-3 py-2 text-xs font-medium ${chip.tone}`}>
                {chip.label} {chip.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1900px] flex-col gap-4 px-3 py-4 sm:px-4 lg:flex-row">
        <div className="order-2 flex gap-3 overflow-x-auto rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-2 shadow-[0_10px_30px_rgba(2,6,23,0.24)] lg:order-1 lg:w-[84px] lg:flex-col lg:overflow-visible">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => setSelectedTool(tool.id)}
                className={`flex min-w-fit items-center gap-2 rounded-2xl px-3 py-3 text-xs transition-all lg:flex-col lg:justify-center ${
                  selectedTool === tool.id
                    ? 'bg-primary text-white shadow-[0_12px_22px_rgba(249,115,22,0.24)]'
                    : 'bg-white/[0.03] text-gray-400 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tool.label}</span>
              </button>
            )
          })}
        </div>

        <div className="order-1 flex min-h-[760px] min-w-0 flex-1 flex-col rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(12,17,25,0.96),rgba(10,14,20,0.94))] shadow-[0_18px_60px_rgba(2,6,23,0.32)] lg:order-2">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              {viewOptions.map((view) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setSelectedView(view.id)}
                  className={`rounded-full px-3 py-2 text-xs font-medium ${
                    selectedView === view.id
                      ? 'bg-primary text-white'
                      : 'bg-white/[0.03] text-gray-400 shadow-[0_6px_14px_rgba(2,6,23,0.18)]'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>

            <div className="hidden rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-gray-300 shadow-[0_8px_20px_rgba(2,6,23,0.18)] sm:flex">
              {currentSelection ? `${currentSelection.label} · ${currentSelection.badge}` : '机器人状态监控'}
            </div>
          </div>

          <div className="relative flex-1 px-3 pb-4 sm:px-5">
            <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full border border-white/8 bg-[rgba(12,17,25,0.85)] px-4 py-3 text-xs text-gray-300 shadow-[0_10px_24px_rgba(2,6,23,0.24)] sm:text-sm">
              {currentSelection ? (
                <span>
                  {currentSelection.label} · <span className="text-emerald-500">{currentSelection.badge}</span>
                </span>
              ) : (
                <span>
                  机器人状态监控 · <span className="text-emerald-500">正常</span>
                </span>
              )}
            </div>

            <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[1.8rem] border border-white/8 bg-[radial-gradient(circle_at_center,#111722_0%,#0d1420_62%,#09111a_100%)]">
              <div className="absolute inset-x-6 top-5 z-10 flex flex-wrap gap-2">
                <div className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-gray-400">mode · {selectedTool}</div>
                <div className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-gray-400">fps · 60</div>
                <div className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-emerald-300">link · stable</div>
              </div>
              <div className="pointer-events-none absolute inset-x-[14%] top-[8%] h-[68%] rounded-[45%] border border-white/8 bg-[radial-gradient(circle_at_50%_32%,rgba(56,189,248,0.15),rgba(255,255,255,0)_58%)]" />
              <div className="pointer-events-none absolute inset-x-[18%] bottom-[7%] h-24 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.14),rgba(255,255,255,0)_72%)] blur-2xl" />
              <div className="h-full w-full">
                <RobotScene
                  selectedPart={selectedPart}
                  selectedTool={selectedTool}
                  selectedView={selectedView}
                  zoom={zoom}
                />
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
                      className={`pointer-events-auto absolute ${hotspot.position} rounded-full border px-3 py-2 text-xs font-medium transition-all ${
                        isActive
                          ? 'border-primary/40 bg-primary text-white shadow-[0_18px_34px_rgba(249,115,22,0.26)]'
                          : 'border-white/12 bg-[rgba(12,17,25,0.86)] text-gray-300 shadow-[0_12px_24px_rgba(2,6,23,0.24)] hover:border-primary/20 hover:text-white'
                      }`}
                    >
                      <span className="block">{hotspot.label}</span>
                      <span className={`block text-[10px] ${isActive ? 'text-orange-100' : 'text-gray-500'}`}>
                        {meta.badge}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col gap-3 rounded-full border border-white/8 bg-[rgba(12,17,25,0.86)] p-2 shadow-[0_12px_28px_rgba(2,6,23,0.24)] md:flex">
                {[Hand, Move, Maximize2, ScanLine].map((Icon, index) => (
                  <button
                    key={index}
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>

              <div className="absolute bottom-24 right-4 hidden rounded-full border border-white/8 bg-[rgba(12,17,25,0.86)] p-2 shadow-[0_12px_28px_rgba(2,6,23,0.24)] lg:flex lg:flex-col">
                <button
                  type="button"
                  onClick={() => setZoom((value) => Math.max(0.72, Number((value - 0.05).toFixed(2))))}
                  className="rounded-full px-3 py-2 text-sm text-gray-400 hover:bg-white/[0.06]"
                >
                  -
                </button>
                <div className="px-3 py-1 text-xs text-primary">{Math.round(zoom * 100)}%</div>
                <button
                  type="button"
                  onClick={() => setZoom((value) => Math.min(1.08, Number((value + 0.05).toFixed(2))))}
                  className="rounded-full px-3 py-2 text-sm text-gray-400 hover:bg-white/[0.06]"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-white/8 bg-[rgba(10,14,20,0.92)] px-3 py-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:px-4">
            <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-3 text-xs text-gray-400 shadow-[0_10px_24px_rgba(2,6,23,0.18)]">
              <div className="mb-2 text-sm font-semibold text-white">姿态数据</div>
              <div className="space-y-1">
                <div className="flex justify-between"><span>俯仰角</span><span>-5.2°</span></div>
                <div className="flex justify-between"><span>滚转角</span><span>-1.6°</span></div>
                <div className="flex justify-between"><span>航向角</span><span>100.9°</span></div>
              </div>
            </div>

            <div className="rounded-[1.2rem] border border-white/8 bg-[rgba(12,17,25,0.92)] p-3 shadow-[0_10px_24px_rgba(2,6,23,0.18)]">
              <div className="mb-3 flex flex-wrap gap-2 xl:hidden">
                {focusHotspots.map((hotspot) => (
                  <button
                    key={hotspot.id}
                    type="button"
                    onClick={() => setSelectedPart(selectedPart === hotspot.id ? null : hotspot.id)}
                    className={`rounded-full border px-3 py-2 text-xs ${
                      selectedPart === hotspot.id
                        ? 'border-primary/30 bg-primary/12 text-primary'
                        : 'border-white/10 bg-white/[0.03] text-gray-400'
                    }`}
                  >
                    {partConfig[hotspot.id].label}
                  </button>
                ))}
              </div>

              <div ref={logRef} className="mb-3 max-h-24 space-y-2 overflow-y-auto text-sm">
                {messages.slice(-3).map((message) => (
                  <div key={message.id} className="rounded-xl bg-white/[0.03] px-3 py-2 text-gray-300">
                    {message.content}
                  </div>
                ))}
                {isThinking && (
                  <div className="rounded-xl bg-primary/10 px-3 py-2 text-primary">Robot Figma 正在生成动作策略...</div>
                )}
              </div>

              <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
                <div className="min-w-0 flex-1">
                  <textarea
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="请输入机器人指令内容"
                    className="min-h-[84px] w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-200 outline-none transition-colors focus:border-primary/35"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {quickActions.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleQuickAction(item.action)}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-gray-400"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRecording(!isRecording)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isRecording ? 'bg-status-danger text-white' : 'bg-white/[0.06] text-gray-400'
                    }`}
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_22px_rgba(249,115,22,0.24)]"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-3 w-full rounded-[2rem] lg:w-[360px] xl:w-[380px]">
          <div className="max-h-[calc(100vh-8rem)] space-y-4 overflow-y-auto pr-1">
            {parameterSections.map((section) => (
              <SectionCard key={section.title} section={section} />
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-20">
        <button
          type="button"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-[0_18px_30px_rgba(239,68,68,0.28)]"
          onClick={() => addMessage({ type: 'system', content: '已触发紧急停止演示' })}
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
