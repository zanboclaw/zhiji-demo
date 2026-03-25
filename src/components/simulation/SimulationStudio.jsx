import { useEffect, useMemo, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { useI18n } from '../../i18n/context'
import { useSimulationStore, useTerminalStore, useRobotStore } from '../../store'
import { SimulationStatusPanel, SimulationTaskComposer } from './SimulationConsole'
import { SimulationHeader } from './SimulationHeader'
import { SimulationParameterSidebar } from './SimulationParameterSidebar'
import { SimulationToolDock } from './SimulationToolDock'
import { SimulationViewport } from './SimulationViewport'
import {
  buildSimulationParameterSections,
  getSimulationContent,
  getSimulationPartDetails,
  getSimulationToolProfile,
} from './simulationI18n'

export function SimulationStudio() {
  const { locale } = useI18n()
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
  const content = useMemo(() => getSimulationContent(locale), [locale])
  const { composer, header, sidebar, statusPanel, telemetry, tools, views } = content

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
    () => getSimulationPartDetails(locale, selectedPart),
    [locale, selectedPart],
  )

  const selectedToolMeta = useMemo(
    () => tools.find((tool) => tool.id === selectedTool) ?? tools[0],
    [selectedTool, tools],
  )
  const selectedViewMeta = useMemo(
    () => views.find((view) => view.id === selectedView) ?? views[0],
    [selectedView, views],
  )
  const selectedToolProfile = useMemo(
    () => getSimulationToolProfile(locale, selectedTool),
    [locale, selectedTool],
  )
  const sections = useMemo(
    () => buildSimulationParameterSections(parameters, locale),
    [locale, parameters],
  )
  const postureMetrics = useMemo(() => ([
    {
      label: telemetry.pitch,
      value: `${(parameters.balance.gyroX * 120).toFixed(1)}°`,
      tone: 'text-sky-300',
    },
    {
      label: telemetry.roll,
      value: `${(parameters.balance.gyroY * 120).toFixed(1)}°`,
      tone: 'text-violet-300',
    },
    {
      label: telemetry.stability,
      value: `${parameters.balance.stability}%`,
      tone: 'text-emerald-300',
    },
    {
      label: telemetry.currentTool,
      value: selectedToolMeta.label,
      tone: 'text-primary',
    },
  ]), [parameters.balance.gyroX, parameters.balance.gyroY, parameters.balance.stability, selectedToolMeta.label, telemetry.currentTool, telemetry.pitch, telemetry.roll, telemetry.stability])

  const telemetryChips = [
    {
      label: telemetry.link,
      value: selectedRobot.signal === 'weak' ? telemetry.fluctuating : telemetry.stable,
      tone: 'border-sky-400/18 bg-sky-400/10 text-sky-300',
    },
    {
      label: telemetry.battery,
      value: `${selectedRobot.battery}%`,
      tone: 'border-emerald-400/18 bg-emerald-400/10 text-emerald-300',
    },
    {
      label: telemetry.workspace,
      value: currentSelection?.label ?? telemetry.defaultWorkspace,
      tone: 'border-white/8 bg-white/[0.03] text-gray-300',
    },
  ]

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addMessage({ type: 'user', content: inputValue })
    setInputValue('')
    setIsThinking(true)

    window.setTimeout(() => {
      const responses = [
        locale === 'en' ? 'Instruction received. Planning the next route...' : locale === 'fr' ? 'Instruction reçue. Planification du prochain trajet...' : locale === 'ru' ? 'Команда получена. Планирую следующий маршрут...' : 'Anweisung empfangen. Nächste Route wird geplant...',
        locale === 'en' ? 'Target object detected. Preparing the grasp action.' : locale === 'fr' ? 'Objet cible détecté. Préparation de la prise.' : locale === 'ru' ? 'Целевой объект обнаружен. Подготовка захвата.' : 'Zielobjekt erkannt. Greifaktion wird vorbereitet.',
        locale === 'en' ? 'Battery level is sufficient. The task can continue.' : locale === 'fr' ? 'Le niveau de batterie est suffisant. La tâche peut continuer.' : locale === 'ru' ? 'Заряда достаточно. Задачу можно продолжать.' : 'Akkustand ausreichend. Aufgabe kann fortgesetzt werden.',
      ]
      const response = responses[Math.floor(Math.random() * responses.length)]
      addMessage({ type: 'ai', content: response, model: selectedModel })
      setIsThinking(false)
    }, 1200)
  }

  const handleQuickAction = (action) => {
    addMessage({ type: 'system', content: composer.executedAction(action) })
  }

  return (
    <div
      id="simulation-studio"
      className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.08),transparent_22%),linear-gradient(180deg,#06090f_0%,#0b1018_100%)] text-slate-100"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[28%] bg-[radial-gradient(circle_at_left,rgba(56,189,248,0.04),transparent_62%)]" />
      <div className="pointer-events-none absolute right-0 top-[18%] h-[32rem] w-[28rem] bg-[radial-gradient(circle,rgba(249,115,22,0.05),transparent_72%)] blur-3xl" />

      <SimulationHeader
        copy={header}
        selectedRobot={selectedRobot}
        telemetryChips={telemetryChips}
      />

      <div className="mx-auto w-full max-w-[1860px] px-2 pb-3 pt-2.5 sm:px-3 lg:px-4 xl:pb-4">
        <div
          id="simulation-grid"
          className="grid w-full gap-3 xl:grid-cols-[64px_minmax(0,1fr)_288px] xl:items-start xl:gap-3 2xl:grid-cols-[68px_minmax(0,1fr)_300px] 2xl:gap-4"
        >
          <SimulationToolDock tools={tools} selectedTool={selectedTool} setSelectedTool={setSelectedTool} />

          <div
            id="simulation-main-column"
            className="order-2 min-w-0 space-y-3 xl:order-none 2xl:space-y-4"
          >
            <div className="grid gap-3 xl:grid-cols-[320px_minmax(0,1fr)] xl:grid-rows-[auto_auto] xl:items-start 2xl:grid-cols-[340px_minmax(0,1fr)] 2xl:gap-4">
              <SimulationStatusPanel
                currentSelection={currentSelection}
                copy={statusPanel}
                isRecording={isRecording}
                isThinking={isThinking}
                logRef={logRef}
                messages={messages}
                postureMetrics={postureMetrics}
                selectedRobot={selectedRobot}
                selectedToolLabel={selectedToolMeta.label}
                selectedViewLabel={selectedViewMeta.label}
                setIsRecording={setIsRecording}
                toolProfile={selectedToolProfile}
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
            copy={sidebar}
            currentSelection={currentSelection}
            sections={sections}
            selectedPart={selectedPart}
            selectedRobot={selectedRobot}
            selectedTool={selectedTool}
            selectedToolLabel={selectedToolMeta.label}
            selectedViewLabel={selectedViewMeta.label}
            toolProfile={selectedToolProfile}
          />
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-20">
        <button
          type="button"
          className="flex h-12 items-center gap-2 rounded-full border border-red-400/20 bg-[rgba(127,29,29,0.88)] px-4 text-sm font-medium text-white shadow-[0_14px_26px_rgba(239,68,68,0.18)] transition-colors hover:bg-[rgba(153,27,27,0.92)]"
          onClick={() => addMessage({ type: 'system', content: composer.estopTriggered })}
        >
          <RotateCcw className="h-4 w-4" />
          E-STOP
        </button>
      </div>
    </div>
  )
}
