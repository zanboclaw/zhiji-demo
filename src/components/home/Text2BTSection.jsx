import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, GitBranch, Search, SendHorizonal, Sparkles, ZoomIn, ZoomOut } from 'lucide-react'
import { Button, Card } from '../ui'
import { orchestrationSteps, scenarioTemplates, treeTemplates } from './homeContent'
import { text2btScrollbar, TreeNode, TypingDots } from './homeShared'
import { flattenVisibleNodes, getSubtreeIds } from './homeTree'

const AUTO_SCENARIO_ID = 'security'
const DEFAULT_PROMPTS = {
  warehouse: '仓库巡检，发现缺货就上报并派发补货任务',
  service: '服务机器人接待，识别人脸后引导访客到会议室',
  security: '安防巡逻',
  industrial: '装配作业，先抓取零件再完成姿态校正与装配执行',
}
const ASSISTANT_RESPONSES = {
  warehouse: '收到，我会先解析仓库巡检任务，再绑定库存识别、缺货判定和异常上报能力，最后生成仓储巡检行为树。',
  service: '收到，我会先解析接待任务，再绑定识别、问询、引导与递送能力，最后生成服务接待行为树。',
  security: '收到，我会先理解安防巡逻目标，再绑定感知、巡逻、拍照和告警能力，最后输出安防巡逻行为树。',
  industrial: '收到，我会先解析装配作业流程，再绑定抓取、定位、姿态校正和执行能力，最后生成装配行为树。',
}
const CHAT_TYPING_DELAY = 36
const AUTO_STEP_DELAY = 900
const AUTO_TREE_START_DELAY = 700

export function Text2BTSection() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(AUTO_SCENARIO_ID)
  const [treeZoom, setTreeZoom] = useState(1)
  const [collapsedNodeIds, setCollapsedNodeIds] = useState(new Set())
  const [draftPrompt, setDraftPrompt] = useState(DEFAULT_PROMPTS[AUTO_SCENARIO_ID])
  const [submittedPrompt, setSubmittedPrompt] = useState('')
  const [assistantMessage, setAssistantMessage] = useState('')
  const [generationPhase, setGenerationPhase] = useState('idle')
  const [generationStepIndex, setGenerationStepIndex] = useState(-1)
  const activeTree = useMemo(() => treeTemplates[selectedScenarioId], [selectedScenarioId])
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
  }, [generationPhase, generationStepIndex])
  const showTreeVisualization = generationPhase === 'complete'
  const showGeneratedMeta = generationPhase === 'complete'

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

  const runGenerationDemo = useCallback((scenarioId, prompt) => {
    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt) return

    clearAnimationTimers()
    setSelectedScenarioId(scenarioId)
    setSubmittedPrompt(trimmedPrompt)
    setAssistantMessage('')
    setGenerationPhase('chatting')
    setGenerationStepIndex(-1)
    setCollapsedNodeIds(new Set())
    setSelectedNodeId(treeTemplates[scenarioId].nodes[0].id)
    setTreeZoom(1)

    const assistantReply = ASSISTANT_RESPONSES[scenarioId] ?? `收到，我正在为“${trimmedPrompt}”生成行为树。`
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
  }, [clearAnimationTimers])

  const generationStatus = useMemo(() => {
    if (generationPhase === 'chatting') return '对话生成中...'
    if (generationPhase === 'planning') return orchestrationSteps[generationStepIndex] ?? '正在解析任务意图'
    if (generationPhase === 'rendering') return '正在装配可视化行为树...'
    if (generationPhase === 'complete') return `${scenarioTemplates.find((item) => item.id === selectedScenarioId)?.title ?? '目标场景'}行为树已生成`
    return '等待点击生成'
  }, [generationPhase, generationStepIndex, selectedScenarioId])

  return (
    <section
      data-testid="text2bt-section"
      className="relative overflow-hidden border-t border-white/6 bg-[linear-gradient(180deg,#030507_0%,#05070b_100%)] py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.1),transparent_26%),linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:auto,40px_40px,40px_40px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="text-sm uppercase tracking-[0.3em] text-primary/70">Text2BT</div>
          <h2 className="mt-4 text-3xl font-semibold text-white lg:text-5xl">
            一句话生成行为树
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            观看 AI 如何将自然语言转换为可执行的机器人逻辑
          </p>
        </div>

        <Card className="overflow-hidden rounded-[2rem] border-white/10 bg-black/40 p-0 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
          <div className="grid lg:grid-cols-[430px_minmax(0,1fr)]">
            <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">选择场景模板</div>
                    <div className="text-sm text-gray-500">实时生成</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {scenarioTemplates.map((template) => {
                  const Icon = template.icon

                  return (
                    <button
                      key={template.title}
                      type="button"
                      className={`w-full rounded-[1.5rem] border p-4 text-left transition-all duration-300 ${
                        selectedScenarioId === template.id
                          ? 'border-primary/35 bg-primary/10 shadow-[0_18px_36px_rgba(59,130,246,0.12)]'
                          : 'border-white/10 bg-white/[0.03] hover:border-primary/30 hover:bg-white/[0.05]'
                      }`}
                      onClick={() => {
                        setSelectedScenarioId(template.id)
                        setDraftPrompt(DEFAULT_PROMPTS[template.id] ?? template.title)
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${template.tone}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-lg font-medium text-white">{template.title}</div>
                          <div className="mt-1 text-sm leading-6 text-gray-500">{template.desc}</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">任务输入</div>
                    <div className="text-xs text-gray-500">输入一句话任务并点击生成行为树</div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/18 bg-primary/10 px-3 py-1.5 text-[11px] font-medium text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Ready
                  </div>
                </div>
                <div
                  data-testid="text2bt-prompt"
                  className="min-h-[220px] rounded-[1.2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(15,23,42,0.62),rgba(2,6,23,0.36))] px-4 py-4"
                >
                  <div className="text-[11px] uppercase tracking-[0.22em] text-primary/60">Conversation</div>
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-end">
                      <div className="max-w-[88%] rounded-[1.1rem] rounded-br-md border border-primary/20 bg-primary/12 px-4 py-3 text-sm leading-7 text-white shadow-[0_14px_32px_rgba(59,130,246,0.12)]">
                        {submittedPrompt || '输入你的任务描述，例如：安防巡逻'}
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[92%] rounded-[1.1rem] rounded-bl-md border border-white/8 bg-black/24 px-4 py-3 text-sm leading-7 text-gray-300">
                        {assistantMessage || (
                          <span className="text-gray-500">点击右下角的生成按钮后，我会在这里回复并开始构建行为树。</span>
                        )}
                        {generationPhase === 'chatting' && assistantMessage ? <TypingDots /> : null}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300">
                      场景：{scenarioTemplates.find((item) => item.id === selectedScenarioId)?.title}
                    </span>
                    <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 text-xs text-primary">
                      {generationStatus}
                    </span>
                  </div>
                </div>
                <div className="mt-4 rounded-[1.2rem] border border-white/8 bg-black/20 p-4">
                  <div className="mb-3">
                    <label htmlFor="text2bt-input" className="text-[11px] uppercase tracking-[0.22em] text-gray-500">
                      用户输入
                    </label>
                    <textarea
                      id="text2bt-input"
                      data-testid="text2bt-input"
                      value={draftPrompt}
                      onChange={(event) => setDraftPrompt(event.target.value)}
                      placeholder="输入一句话任务，例如：安防巡逻"
                      className="mt-3 min-h-[96px] w-full resize-none rounded-[1rem] border border-white/8 bg-[#060913] px-4 py-3 text-sm leading-7 text-white outline-none transition-colors placeholder:text-gray-600 focus:border-primary/35"
                    />
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-gray-500">生成流程</div>
                  {visibleFlowSteps.length === 0 ? (
                    <div className="mt-3 text-sm leading-7 text-gray-500">
                      等待点击生成按钮...
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2.5">
                      {visibleFlowSteps.map((step, index) => {
                        const isActive = generationPhase !== 'complete' && generationStepIndex === index
                        const isComplete = generationPhase === 'rendering' || generationPhase === 'complete'

                        return (
                          <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                            className="flex items-center gap-3 text-sm"
                          >
                            <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] ${
                              isActive || (isComplete && index <= generationStepIndex)
                                ? 'border-primary/20 bg-primary text-white'
                                : 'border-white/10 bg-white/[0.04] text-gray-500'
                            }`}
                            >
                              {index + 1}
                            </span>
                            <span className={isActive || (isComplete && index <= generationStepIndex) ? 'text-white' : 'text-gray-500'}>
                              {step}
                            </span>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="primary"
                    className="rounded-full px-5"
                    data-testid="text2bt-generate"
                    disabled={generationPhase !== 'idle' && generationPhase !== 'complete'}
                    onClick={() => runGenerationDemo(selectedScenarioId, draftPrompt)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <SendHorizonal className="h-4 w-4" />
                      {generationPhase === 'idle' || generationPhase === 'complete' ? '生成行为树' : '生成中'}
                    </span>
                  </Button>
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
                    <div className="text-lg font-semibold text-white">可视化行为树</div>
                    <div data-testid="text2bt-status" className="text-sm text-gray-500">
                      {showTreeVisualization
                        ? `AI 已生成 ${scenarioTemplates.find((item) => item.id === selectedScenarioId)?.title} 结构`
                        : '等待生成流程完成后展示行为树'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTreeZoom((value) => Math.max(0.82, Number((value - 0.08).toFixed(2))))}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300"
                  >
                    <span className="inline-flex items-center gap-2"><ZoomOut className="h-4 w-4" />缩小</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTreeZoom((value) => Math.min(1.28, Number((value + 0.08).toFixed(2))))}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300"
                  >
                    <span className="inline-flex items-center gap-2"><ZoomIn className="h-4 w-4" />放大</span>
                  </button>
                  <button type="button" className="rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-primary">
                    <span className="inline-flex items-center gap-2"><Download className="h-4 w-4" />导出</span>
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

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
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
                          {generationPhase === 'rendering' ? '正在高亮行为树' : '等待点击生成'}
                        </div>
                        <div className="mt-2 text-sm leading-7 text-gray-400">
                          {generationPhase === 'rendering'
                            ? '生成流程已完成，正在装配并高亮最终行为树。'
                            : '先在左侧输入任务并点击生成，完成对话和流程推演后再展示可视化行为树。'}
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

                <div className="space-y-4">
                  <div className="rounded-[1.4rem] border border-white/10 bg-black/30 p-4">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-primary/70">
                      Node Detail
                    </div>
                    <div className="mt-3 text-lg font-semibold text-white">{showGeneratedMeta ? selectedNode.label : '等待节点生成'}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                        {showGeneratedMeta ? selectedNode.type : 'pending'}
                      </div>
                      <div className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs text-primary">
                        {showGeneratedMeta ? selectedNode.status : 'waiting'}
                      </div>
                    </div>
                    <div className="mt-4 text-sm leading-7 text-gray-400">
                      {showGeneratedMeta ? selectedNode.detail : '当前仍在执行生成流程，节点详情将在行为树生成后出现。'}
                    </div>
                  </div>

                  <div className="rounded-[1.4rem] border border-white/10 bg-black/30 p-4">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-primary/70">
                      Generated Summary
                    </div>
                    <div className="mt-3 text-sm leading-7 text-gray-300">
                      {showGeneratedMeta ? activeTree.summary : '先完成任务理解与技能绑定，再输出安防巡逻的可执行行为树摘要。'}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300">
                        {showGeneratedMeta ? `${selectedScenarioId}_tree_v1` : 'waiting_generation'}
                      </div>
                      <div className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                        {showGeneratedMeta ? '点击节点查看详情' : '等待树图生成'}
                      </div>
                    </div>
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
