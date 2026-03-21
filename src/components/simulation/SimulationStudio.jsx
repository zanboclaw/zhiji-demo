import { useEffect, useMemo, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { useSimulationStore, useTerminalStore, useRobotStore } from '../../store'
import { aiResponses } from '../../data/mock'
import { SimulationStatusPanel, SimulationTaskComposer } from './SimulationConsole'
import { SimulationHeader } from './SimulationHeader'
import { SimulationParameterSidebar } from './SimulationParameterSidebar'
import { SimulationToolDock } from './SimulationToolDock'
import { SimulationViewport } from './SimulationViewport'
import { buildParameterSections, partConfig, tools, viewOptions } from './simulationContent'

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
    selectedModel,
    isThinking,
    isRecording,
    addMessage,
    setInputValue,
    setSelectedModel,
    setIsThinking,
    setIsRecording,
  } = useTerminalStore()

  const [zoom, setZoom] = useState(0.84)
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

  const selectedToolMeta = useMemo(
    () => tools.find((tool) => tool.id === selectedTool) ?? tools[0],
    [selectedTool],
  )
  const selectedViewMeta = useMemo(
    () => viewOptions.find((view) => view.id === selectedView) ?? viewOptions[0],
    [selectedView],
  )
  const sections = useMemo(
    () => buildParameterSections(parameters),
    [parameters],
  )
  const postureMetrics = useMemo(() => ([
    {
      label: '俯仰角',
      value: `${(parameters.balance.gyroX * 120).toFixed(1)}°`,
      tone: 'text-sky-300',
    },
    {
      label: '滚转角',
      value: `${(parameters.balance.gyroY * 120).toFixed(1)}°`,
      tone: 'text-violet-300',
    },
    {
      label: '稳定度',
      value: `${parameters.balance.stability}%`,
      tone: 'text-emerald-300',
    },
    {
      label: '当前工具',
      value: selectedToolMeta.label,
      tone: 'text-primary',
    },
  ]), [parameters.balance.gyroX, parameters.balance.gyroY, parameters.balance.stability, selectedToolMeta.label])

  const telemetryChips = [
    {
      label: '链路',
      value: selectedRobot.signal === 'weak' ? '波动' : '稳定',
      tone: 'border-sky-400/18 bg-sky-400/10 text-sky-300',
    },
    {
      label: '电量',
      value: `${selectedRobot.battery}%`,
      tone: 'border-emerald-400/18 bg-emerald-400/10 text-emerald-300',
    },
    {
      label: '工作区',
      value: currentSelection?.label ?? '整机仿真',
      tone: 'border-white/8 bg-white/[0.03] text-gray-300',
    },
  ]

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addMessage({ type: 'user', content: inputValue })
    setInputValue('')
    setIsThinking(true)

    window.setTimeout(() => {
      const response = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      addMessage({ type: 'ai', content: response, model: selectedModel })
      setIsThinking(false)
    }, 1200)
  }

  const handleQuickAction = (action) => {
    addMessage({ type: 'system', content: `已执行：${action}` })
  }

  return (
    <div
      id="simulation-studio"
      className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.08),transparent_22%),linear-gradient(180deg,#06090f_0%,#0b1018_100%)] text-slate-100"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[28%] bg-[radial-gradient(circle_at_left,rgba(56,189,248,0.04),transparent_62%)]" />
      <div className="pointer-events-none absolute right-0 top-[18%] h-[32rem] w-[28rem] bg-[radial-gradient(circle,rgba(249,115,22,0.05),transparent_72%)] blur-3xl" />

      <SimulationHeader
        selectedRobot={selectedRobot}
        telemetryChips={telemetryChips}
      />

      <div className="mx-auto w-full max-w-[1860px] px-2 pb-3 pt-2.5 sm:px-3 lg:px-4 xl:pb-4">
        <div
          id="simulation-grid"
          className="grid w-full gap-3 xl:grid-cols-[64px_minmax(0,1fr)_288px] xl:items-start xl:gap-3 2xl:grid-cols-[68px_minmax(0,1fr)_300px] 2xl:gap-4"
        >
          <SimulationToolDock selectedTool={selectedTool} setSelectedTool={setSelectedTool} />

          <div
            id="simulation-main-column"
            className="order-2 min-w-0 space-y-3 xl:order-none 2xl:space-y-4"
          >
            <div className="grid gap-3 xl:grid-cols-[320px_minmax(0,1fr)] xl:grid-rows-[auto_auto] xl:items-start 2xl:grid-cols-[340px_minmax(0,1fr)] 2xl:gap-4">
              <SimulationStatusPanel
                currentSelection={currentSelection}
                isRecording={isRecording}
                isThinking={isThinking}
                logRef={logRef}
                messages={messages}
                postureMetrics={postureMetrics}
                selectedRobot={selectedRobot}
                selectedTool={selectedTool}
                selectedToolLabel={selectedToolMeta.label}
                selectedViewLabel={selectedViewMeta.label}
                setIsRecording={setIsRecording}
                className="xl:row-span-2"
              />

              <SimulationViewport
                currentSelection={currentSelection}
                selectedPart={selectedPart}
                selectedRobot={selectedRobot}
                selectedTool={selectedTool}
                selectedView={selectedView}
                zoom={zoom}
                setSelectedTool={setSelectedTool}
                setSelectedPart={setSelectedPart}
                setSelectedView={setSelectedView}
                setZoom={setZoom}
              />

              <SimulationTaskComposer
                currentSelection={currentSelection}
                inputValue={inputValue}
                selectedModel={selectedModel}
                selectedPart={selectedPart}
                selectedRobot={selectedRobot}
                selectedTool={selectedTool}
                selectedToolLabel={selectedToolMeta.label}
                selectedViewLabel={selectedViewMeta.label}
                setInputValue={setInputValue}
                setSelectedModel={setSelectedModel}
                onQuickAction={handleQuickAction}
                onSendMessage={handleSendMessage}
                setSelectedPart={setSelectedPart}
              />
            </div>
          </div>

          <SimulationParameterSidebar
            currentSelection={currentSelection}
            sections={sections}
            selectedPart={selectedPart}
            selectedRobot={selectedRobot}
            selectedTool={selectedTool}
            selectedToolLabel={selectedToolMeta.label}
            selectedViewLabel={selectedViewMeta.label}
          />
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-20">
        <button
          type="button"
          className="flex h-12 items-center gap-2 rounded-full border border-red-400/20 bg-[rgba(127,29,29,0.88)] px-4 text-sm font-medium text-white shadow-[0_14px_26px_rgba(239,68,68,0.18)] transition-colors hover:bg-[rgba(153,27,27,0.92)]"
          onClick={() => addMessage({ type: 'system', content: '已触发紧急停止演示' })}
        >
          <RotateCcw className="h-4 w-4" />
          E-STOP
        </button>
      </div>
    </div>
  )
}
