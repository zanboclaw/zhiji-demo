import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, GitBranch, Search, SendHorizonal, Sparkles, ZoomIn, ZoomOut } from 'lucide-react'
import { Button, Card } from '../ui'
import { useI18n } from '../../i18n/context'
import { getHomeCopy } from './homeI18n'
import { text2btScrollbar, TreeNode, TypingDots } from './homeShared'
import { flattenVisibleNodes, getSubtreeIds } from './homeTree'

const AUTO_SCENARIO_ID = 'security'
const CHAT_TYPING_DELAY = 36
const AUTO_STEP_DELAY = 900
const AUTO_TREE_START_DELAY = 700

export function Text2BTSection() {
  const { locale } = useI18n()
  const content = useMemo(() => getHomeCopy(locale), [locale])
  const {
    assistantResponses,
    defaultPrompts,
    orchestrationSteps,
    scenarioTemplates,
    text2btSection,
    treeTemplates,
  } = content
  const scenarioLabel = locale === 'fr' ? 'Scénario' : locale === 'ru' ? 'Сценарий' : locale === 'de' ? 'Szenario' : 'Scenario'
  const readyLabel = locale === 'fr' ? 'Prêt' : locale === 'ru' ? 'Готово' : locale === 'de' ? 'Bereit' : locale === 'zh' ? '可生成' : 'Ready'
  const footerStatusLabel = locale === 'fr' ? 'Statut' : locale === 'ru' ? 'Статус' : locale === 'de' ? 'Status' : locale === 'zh' ? '当前状态' : 'Status'
  const intentCardLabel = locale === 'fr' ? 'Intention' : locale === 'ru' ? 'Цель' : locale === 'de' ? 'Ziel' : locale === 'zh' ? '任务目标' : 'Intent'
  const actionCardLabel = locale === 'fr' ? 'Actions' : locale === 'ru' ? 'Действия' : locale === 'de' ? 'Aktionen' : locale === 'zh' ? '动作组合' : 'Action Set'
  const outputCardLabel = locale === 'fr' ? 'Sortie' : locale === 'ru' ? 'Выход' : locale === 'de' ? 'Ausgabe' : locale === 'zh' ? '输出结果' : 'Output'
  const movedPanelLabel = locale === 'fr' ? 'Panneaux déplacés sous l’arbre' : locale === 'ru' ? 'Панели перенесены под дерево' : locale === 'de' ? 'Panels unter den Baum verschoben' : locale === 'zh' ? '已下移到树下方' : 'Moved below tree'
  const reserveAreaLabel = locale === 'fr' ? 'Zone réservée pour logs, historique de nœud et télémétrie' : locale === 'ru' ? 'Резервная зона для логов, истории узлов и телеметрии' : locale === 'de' ? 'Reservebereich für Logs, Knotenhistorie und Telemetrie' : locale === 'zh' ? '预留区域：后续可放运行日志、节点历史、遥测快照' : 'Reserved area for logs, node history, and telemetry snapshots'
  const generatedStatus = (title) => locale === 'fr'
    ? `L’IA a généré la structure ${title}`
    : locale === 'ru'
      ? `ИИ сгенерировал структуру ${title}`
      : locale === 'de'
        ? `Die KI hat die Struktur ${title} erzeugt`
        : `AI generated the ${title} structure`
  const zoomOutLabel = locale === 'fr' ? 'Réduire' : locale === 'ru' ? 'Уменьшить' : locale === 'de' ? 'Verkleinern' : 'Zoom out'
  const zoomInLabel = locale === 'fr' ? 'Agrandir' : locale === 'ru' ? 'Увеличить' : locale === 'de' ? 'Vergrößern' : 'Zoom in'
  const exportLabel = locale === 'fr' ? 'Exporter' : locale === 'ru' ? 'Экспорт' : locale === 'de' ? 'Exportieren' : 'Export'
  const [selectedScenarioId, setSelectedScenarioId] = useState(AUTO_SCENARIO_ID)
  const [treeZoom, setTreeZoom] = useState(1)
  const [collapsedNodeIds, setCollapsedNodeIds] = useState(new Set())
  const [draftPrompt, setDraftPrompt] = useState(defaultPrompts[AUTO_SCENARIO_ID])
  const [assistantMessage, setAssistantMessage] = useState('')
  const [generationPhase, setGenerationPhase] = useState('idle')
  const [generationStepIndex, setGenerationStepIndex] = useState(-1)
  const activeTree = useMemo(() => treeTemplates[selectedScenarioId], [selectedScenarioId, treeTemplates])
  const visibleTreeNodes = useMemo(
    () => flattenVisibleNodes(activeTree.nodes, collapsedNodeIds),
    [activeTree.nodes, collapsedNodeIds],
  )
  const [selectedNodeId, setSelectedNodeId] = useState(activeTree.nodes[0].id)
  const timerRefs = useRef([])

  const selectedNode = useMemo(() => {
    const allNodes = flattenVisibleNodes(activeTree.nodes, new Set())
    return allNodes.find((node) => node.id === selectedNodeId) || allNodes[0]
  }, [activeTree.nodes, selectedNodeId])
  const visibleFlowSteps = useMemo(() => {
    if (generationPhase === 'idle' || generationPhase === 'chatting') return []
    if (generationPhase === 'planning') return orchestrationSteps.slice(0, generationStepIndex + 1)
    return orchestrationSteps
  }, [generationPhase, generationStepIndex, orchestrationSteps])
  const showTreeVisualization = generationPhase === 'complete'
  const showGeneratedMeta = generationPhase === 'complete'
  const selectedScenario = useMemo(
    () => scenarioTemplates.find((item) => item.id === selectedScenarioId) ?? scenarioTemplates[0],
    [scenarioTemplates, selectedScenarioId],
  )
  const summaryActionValue = useMemo(() => (
    activeTree.nodes?.[0]?.children?.slice(0, 3).map((node) => node.label).join(' / ') ?? '--'
  ), [activeTree.nodes])
  const processSummary = useMemo(() => {
    if (generationPhase === 'planning') return orchestrationSteps[generationStepIndex] ?? text2btSection.statusIdle
    if (generationPhase === 'rendering') return text2btSection.statusRendering
    if (generationPhase === 'complete') return text2btSection.generatedTreeLabel
    if (generationPhase === 'chatting') return text2btSection.statusChatting
    return text2btSection.processPlaceholder
  }, [generationPhase, generationStepIndex, orchestrationSteps, text2btSection])

  const highlightedIds = useMemo(() => {
    if (!selectedNode || !showGeneratedMeta) return new Set()
    return new Set(getSubtreeIds(selectedNode))
  }, [selectedNode, showGeneratedMeta])

  const toggleNodeCollapse = (nodeId) => {
    setCollapsedNodeIds((current) => {
      const next = new Set(current)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }

  const clearAnimationTimers = useCallback(() => {
    timerRefs.current.forEach((timer) => window.clearTimeout(timer))
    timerRefs.current = []
  }, [])

  useEffect(() => () => clearAnimationTimers(), [clearAnimationTimers])
  useEffect(() => {
    setDraftPrompt(defaultPrompts[selectedScenarioId] ?? '')
  }, [defaultPrompts, selectedScenarioId])

  const runGenerationDemo = useCallback((scenarioId, prompt) => {
    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt) return

    clearAnimationTimers()
    setSelectedScenarioId(scenarioId)
    setAssistantMessage('')
    setGenerationPhase('chatting')
    setGenerationStepIndex(-1)
    setCollapsedNodeIds(new Set())
    setSelectedNodeId(treeTemplates[scenarioId].nodes[0].id)
    setTreeZoom(1)

    const assistantReply = assistantResponses[scenarioId] ?? `Generating a behavior tree for "${trimmedPrompt}".`
    Array.from(assistantReply).forEach((_, index) => {
      const timer = window.setTimeout(() => {
        setAssistantMessage(assistantReply.slice(0, index + 1))
      }, CHAT_TYPING_DELAY * (index + 1))
      timerRefs.current.push(timer)
    })

    const typingDuration = CHAT_TYPING_DELAY * assistantReply.length + 420
    orchestrationSteps.forEach((_, index) => {
      const timer = window.setTimeout(() => {
        setGenerationPhase('planning')
        setGenerationStepIndex(index)
      }, typingDuration + index * AUTO_STEP_DELAY)
      timerRefs.current.push(timer)
    })

    const revealStart = typingDuration + orchestrationSteps.length * AUTO_STEP_DELAY + AUTO_TREE_START_DELAY
    const renderingTimer = window.setTimeout(() => {
      setGenerationPhase('rendering')
    }, revealStart - 420)
    timerRefs.current.push(renderingTimer)

    const completeTimer = window.setTimeout(() => {
      setGenerationPhase('complete')
      setGenerationStepIndex(orchestrationSteps.length - 1)
    }, revealStart)
    timerRefs.current.push(completeTimer)
  }, [assistantResponses, clearAnimationTimers, orchestrationSteps, treeTemplates])

  return (
    <section
      data-testid="text2bt-section"
      className="relative overflow-hidden border-t border-white/6 bg-[linear-gradient(180deg,#030507_0%,#05070b_100%)] py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.1),transparent_26%),linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:auto,40px_40px,40px_40px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="text-sm uppercase tracking-[0.3em] text-primary/70">{text2btSection.label}</div>
          <h2 className="mt-4 text-3xl font-semibold text-white lg:text-5xl">{text2btSection.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            {text2btSection.description}
          </p>
        </div>

        <Card className="overflow-hidden rounded-[2rem] border-white/10 bg-black/40 p-0 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
          <div className="grid lg:grid-cols-[minmax(0,490px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
            <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r lg:p-6">
              <div className="rounded-[1.8rem] border border-white/8 bg-[linear-gradient(180deg,rgba(9,13,21,0.96),rgba(5,8,14,0.95))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-[linear-gradient(135deg,rgba(249,115,22,0.16),rgba(59,130,246,0.12))] text-primary shadow-[0_12px_30px_rgba(15,23,42,0.22)]">
                      <Search className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xl font-semibold leading-tight text-white">{text2btSection.title}</div>
                      <div className="mt-1 text-sm leading-6 text-gray-500">{text2btSection.description}</div>
                    </div>
                  </div>
                  <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/18 bg-emerald-400/10 px-3 py-2 text-[11px] font-semibold text-emerald-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    {readyLabel}
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="rounded-[1.5rem] border border-white/6 bg-white/[0.02] p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-gray-500">
                        {text2btSection.taskInputTitle}
                      </div>
                      <div className="rounded-full border border-primary/18 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
                        {scenarioLabel}: {selectedScenario.title}
                      </div>
                    </div>
                    <textarea
                      id="text2bt-input"
                      data-testid="text2bt-input"
                      value={draftPrompt}
                      onChange={(event) => setDraftPrompt(event.target.value)}
                      placeholder={text2btSection.conversationPlaceholder}
                      className="min-h-[116px] w-full resize-none rounded-[1.2rem] border border-sky-400/10 bg-[linear-gradient(180deg,rgba(11,15,24,0.96),rgba(8,12,20,0.94))] px-4 py-4 text-2xl font-semibold leading-tight tracking-[-0.03em] text-white outline-none transition-colors placeholder:text-gray-600 focus:border-primary/35 sm:text-[1.95rem]"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      {scenarioTemplates.map((template) => {
                        const Icon = template.icon
                        const isActive = selectedScenarioId === template.id

                        return (
                          <button
                            key={template.id}
                            type="button"
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition-colors ${
                              isActive
                                ? 'border-primary/20 bg-primary/12 text-primary'
                                : 'border-white/10 bg-white/[0.03] text-gray-300 hover:border-primary/20 hover:text-white'
                            }`}
                            onClick={() => {
                              setSelectedScenarioId(template.id)
                              setDraftPrompt(defaultPrompts[template.id] ?? template.title)
                            }}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{template.title}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div
                    data-testid="text2bt-prompt"
                    className="rounded-[1.5rem] border border-white/6 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_34%),linear-gradient(180deg,rgba(13,18,29,0.98),rgba(9,13,20,0.96))] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/12 text-primary">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.28em] text-primary/75">Robot Figma AI</div>
                    </div>
                    <div className="mt-4 text-sm leading-7 text-gray-200">
                      {assistantMessage || (
                        <span className="text-gray-500">{text2btSection.assistantPlaceholder}</span>
                      )}
                      {generationPhase === 'chatting' && assistantMessage ? <TypingDots /> : null}
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {[
                        { label: intentCardLabel, value: selectedScenario.title },
                        { label: actionCardLabel, value: summaryActionValue },
                        { label: outputCardLabel, value: text2btSection.generatedTreeLabel },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`rounded-[1.1rem] border px-3.5 py-3 transition-all duration-300 ${
                            showGeneratedMeta
                              ? 'border-white/8 bg-white/[0.03]'
                              : 'border-white/6 bg-white/[0.02] opacity-70'
                          }`}
                        >
                          <div className="text-[10px] uppercase tracking-[0.24em] text-gray-500">{item.label}</div>
                          <div className="mt-2 text-sm font-medium leading-6 text-white">
                            {showGeneratedMeta ? item.value : '--'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/6 bg-white/[0.02] p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-gray-500">{text2btSection.processLabel}</div>
                      <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-gray-300">
                        {orchestrationSteps.length} steps
                      </div>
                    </div>
                    <div className="grid gap-2.5 sm:grid-cols-3">
                      {orchestrationSteps.map((step, index) => {
                        const isActive = generationPhase !== 'complete' && generationStepIndex === index
                        const isComplete = generationPhase === 'rendering' || generationPhase === 'complete'
                        const isVisible = visibleFlowSteps.length > 0 && index <= generationStepIndex

                        return (
                          <motion.div
                            key={step}
                            initial={{ opacity: 0.85, y: 0 }}
                            animate={{ opacity: isActive || isVisible || isComplete ? 1 : 0.62, y: 0 }}
                            transition={{ duration: 0.24, ease: 'easeOut' }}
                            className={`rounded-[1.15rem] border p-3.5 ${
                              isActive || (isComplete && index <= generationStepIndex)
                                ? 'border-primary/25 bg-primary/10'
                                : 'border-white/8 bg-white/[0.025]'
                            }`}
                          >
                            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                              isActive || (isComplete && index <= generationStepIndex)
                                ? 'bg-primary text-white'
                                : 'bg-white/[0.05] text-gray-400'
                            }`}
                            >
                              {index + 1}
                            </div>
                            <div className={`mt-3 text-sm leading-6 ${
                              isActive || (isComplete && index <= generationStepIndex) ? 'text-white' : 'text-gray-400'
                            }`}
                            >
                              {step}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm text-gray-400">
                        <span className="font-medium text-gray-200">{footerStatusLabel}:</span> {processSummary}
                      </div>
                      <Button
                        variant="primary"
                        className="w-full rounded-[1.2rem] px-5 py-3 sm:w-auto"
                        data-testid="text2bt-generate"
                        disabled={generationPhase !== 'idle' && generationPhase !== 'complete'}
                        onClick={() => runGenerationDemo(selectedScenarioId, draftPrompt)}
                      >
                        <span className="inline-flex items-center gap-2">
                          <SendHorizonal className="h-4 w-4" />
                          {generationPhase === 'idle' || generationPhase === 'complete' ? text2btSection.generateButton : text2btSection.generatingButton}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-purple/15 text-accent-purple">
                    <GitBranch className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">{text2btSection.treeTitle}</div>
                    <div data-testid="text2bt-status" className="text-sm text-gray-500">
                      {showTreeVisualization
                        ? generatedStatus(scenarioTemplates.find((item) => item.id === selectedScenarioId)?.title)
                        : text2btSection.treeWaiting}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTreeZoom((value) => Math.max(0.82, Number((value - 0.08).toFixed(2))))}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300"
                  >
                    <span className="inline-flex items-center gap-2"><ZoomOut className="h-4 w-4" />{zoomOutLabel}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTreeZoom((value) => Math.min(1.28, Number((value + 0.08).toFixed(2))))}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300"
                  >
                    <span className="inline-flex items-center gap-2"><ZoomIn className="h-4 w-4" />{zoomInLabel}</span>
                  </button>
                  <button type="button" className="rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-primary">
                    <span className="inline-flex items-center gap-2"><Download className="h-4 w-4" />{exportLabel}</span>
                  </button>
                </div>
              </div>

              <div className="mb-5 grid gap-3 sm:grid-cols-3">
                {activeTree.outputs.map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-[1.2rem] border px-4 py-3 transition-all duration-500 ${
                      showGeneratedMeta
                        ? 'border-white/10 bg-white/[0.03]'
                        : 'border-white/6 bg-white/[0.015] opacity-45'
                    }`}
                  >
                    <div className="text-[11px] uppercase tracking-[0.24em] text-gray-500">{item.label}</div>
                    <div className="mt-2 text-lg font-semibold text-white">{showGeneratedMeta ? item.value : '--'}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="relative min-h-[560px] overflow-hidden rounded-[1.8rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),rgba(255,255,255,0.01)_42%,rgba(0,0,0,0.18)_100%)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(59,130,246,0.1),transparent_18%)]" />
                  <motion.div
                    animate={{ opacity: [0.25, 0.55, 0.25], scale: [0.98, 1.02, 0.98] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute left-1/2 top-[10rem] h-48 w-48 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
                  />

                  {!showTreeVisualization ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
                      <motion.div
                        animate={{ opacity: [0.32, 0.72, 0.32], scale: [0.96, 1.02, 0.96] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                        className="rounded-[1.6rem] border border-primary/18 bg-black/28 px-8 py-6 shadow-[0_18px_44px_rgba(59,130,246,0.12)]"
                      >
                        <div className="text-[11px] uppercase tracking-[0.28em] text-primary/70">Behavior Tree</div>
                        <div className="mt-3 text-xl font-semibold text-white">
                          {generationPhase === 'rendering' ? text2btSection.renderingTitle : text2btSection.waitingTitle}
                        </div>
                        <div className="mt-2 text-sm leading-7 text-gray-400">
                          {generationPhase === 'rendering'
                            ? text2btSection.renderingDescription
                            : text2btSection.waitingDescription}
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <div className={`absolute inset-0 overflow-auto p-6 ${text2btScrollbar}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 18, scale: 0.985 }}
                        animate={{ opacity: 1, y: 0, scale: treeZoom }}
                        className="origin-top min-h-full"
                      >
                        <div className="space-y-5">
                          {visibleTreeNodes.map((node) => (
                            <div key={node.id}>
                              <div className="flex items-start gap-4">
                                <div
                                  className="mt-2 flex items-center"
                                  style={{ paddingLeft: `${node.depth * 32}px` }}
                                >
                                  {node.depth > 0 && (
                                    <div className={`mr-3 h-px w-6 ${
                                      highlightedIds.has(node.id) || highlightedIds.has(node.parentId)
                                        ? 'bg-primary/70'
                                        : 'bg-white/10'
                                    }`}
                                    />
                                  )}
                                </div>

                                <div className="flex-1">
                                  <TreeNode
                                    node={{ ...node, collapsed: collapsedNodeIds.has(node.id) }}
                                    active={selectedNodeId === node.id}
                                    dimmed={false}
                                    onSelect={(target) => setSelectedNodeId(target.id)}
                                    onToggle={toggleNodeCollapse}
                                    canToggle={Boolean(node.children?.length)}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>

                <div className="rounded-[1.5rem] border border-primary/16 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.08),transparent_36%),linear-gradient(180deg,rgba(8,12,20,0.92),rgba(6,10,16,0.9))] p-3.5 sm:p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-primary/70">{movedPanelLabel}</div>
                    <div className="text-xs text-gray-500">{text2btSection.nodeDetailTitle} + {text2btSection.summaryTitle}</div>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-2">
                    <div className="rounded-[1.2rem] border border-white/10 bg-black/30 p-4">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-primary/70">
                        {text2btSection.nodeDetailTitle}
                      </div>
                      <div className="mt-3 text-lg font-semibold text-white">{showGeneratedMeta ? selectedNode.label : text2btSection.nodeDetailWaiting}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                          {showGeneratedMeta ? selectedNode.type : text2btSection.nodeDetailPending}
                        </div>
                        <div className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs text-primary">
                          {showGeneratedMeta ? selectedNode.status : text2btSection.nodeDetailStatus}
                        </div>
                      </div>
                      <div className="mt-4 text-sm leading-7 text-gray-400">
                        {showGeneratedMeta ? selectedNode.detail : text2btSection.nodeDetailDescription}
                      </div>
                    </div>

                    <div className="rounded-[1.2rem] border border-white/10 bg-black/30 p-4">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-primary/70">
                        {text2btSection.summaryTitle}
                      </div>
                      <div className="mt-3 text-sm leading-7 text-gray-300">
                        {showGeneratedMeta ? activeTree.summary : text2btSection.summaryWaiting}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300">
                          {showGeneratedMeta ? `${selectedScenarioId}_tree_v1` : text2btSection.summaryChipWaiting}
                        </div>
                        <div className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                          {showGeneratedMeta ? text2btSection.generatedTreeLabel : text2btSection.summaryChipHint}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-dashed border-white/12 bg-white/[0.02] px-3 py-2.5 text-xs text-gray-500">
                    {reserveAreaLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
