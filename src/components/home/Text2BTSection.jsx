import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, GitBranch, Search, ZoomIn, ZoomOut } from 'lucide-react'
import { Button, Card } from '../ui'
import { scenarioTemplates, treeTemplates } from './homeContent'
import { text2btScrollbar, TreeNode } from './homeShared'
import { flattenVisibleNodes, getSubtreeIds } from './homeTree'

export function Text2BTSection() {
  const [selectedScenarioId, setSelectedScenarioId] = useState('security')
  const [treeZoom, setTreeZoom] = useState(1)
  const [collapsedNodeIds, setCollapsedNodeIds] = useState(new Set())
  const activeTree = useMemo(() => treeTemplates[selectedScenarioId], [selectedScenarioId])
  const visibleTreeNodes = useMemo(
    () => flattenVisibleNodes(activeTree.nodes, collapsedNodeIds),
    [activeTree.nodes, collapsedNodeIds],
  )
  const [selectedNodeId, setSelectedNodeId] = useState(activeTree.nodes[0].id)

  useEffect(() => {
    setCollapsedNodeIds(new Set())
    setSelectedNodeId(treeTemplates[selectedScenarioId].nodes[0].id)
    setTreeZoom(1)
  }, [selectedScenarioId])

  const selectedNode = useMemo(() => {
    const allNodes = flattenVisibleNodes(activeTree.nodes, new Set())
    return allNodes.find((node) => node.id === selectedNodeId) || allNodes[0]
  }, [activeTree.nodes, selectedNodeId])

  const highlightedIds = useMemo(() => {
    if (!selectedNode) return new Set()
    return new Set(getSubtreeIds(selectedNode))
  }, [selectedNode])

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

  return (
    <section className="relative overflow-hidden border-t border-white/6 bg-[linear-gradient(180deg,#030507_0%,#05070b_100%)] py-24">
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
                    <div
                      key={template.title}
                      className={`cursor-pointer rounded-[1.5rem] border p-4 transition-all duration-300 ${
                        selectedScenarioId === template.id
                          ? 'border-primary/35 bg-primary/10 shadow-[0_18px_36px_rgba(59,130,246,0.12)]'
                          : 'border-white/10 bg-white/[0.03] hover:border-primary/30 hover:bg-white/[0.05]'
                      }`}
                      onClick={() => setSelectedScenarioId(template.id)}
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
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
                <div className="min-h-[140px] rounded-[1.2rem] border border-white/8 bg-black/20 px-4 py-4 text-sm leading-7 text-gray-500">
                  或描述你自己的场景...
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="primary" className="rounded-full px-5">
                    生成
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
                    <div className="text-sm text-gray-500">AI 已生成 {scenarioTemplates.find((item) => item.id === selectedScenarioId)?.title} 结构</div>
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
                    className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="text-[11px] uppercase tracking-[0.24em] text-gray-500">{item.label}</div>
                    <div className="mt-2 text-lg font-semibold text-white">{item.value}</div>
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

                  <div className={`absolute inset-0 overflow-auto p-6 ${text2btScrollbar}`}>
                    <motion.div
                      animate={{ scale: treeZoom }}
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
                                  dimmed={highlightedIds.size > 0 && !highlightedIds.has(node.id) && selectedNodeId !== node.id}
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
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.4rem] border border-white/10 bg-black/30 p-4">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-primary/70">
                      Node Detail
                    </div>
                    <div className="mt-3 text-lg font-semibold text-white">{selectedNode.label}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                        {selectedNode.type}
                      </div>
                      <div className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs text-primary">
                        {selectedNode.status}
                      </div>
                    </div>
                    <div className="mt-4 text-sm leading-7 text-gray-400">
                      {selectedNode.detail}
                    </div>
                  </div>

                  <div className="rounded-[1.4rem] border border-white/10 bg-black/30 p-4">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-primary/70">
                      Generated Summary
                    </div>
                    <div className="mt-3 text-sm leading-7 text-gray-300">
                      {activeTree.summary}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300">
                        {selectedScenarioId}_tree_v1
                      </div>
                      <div className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                        点击节点查看详情
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
