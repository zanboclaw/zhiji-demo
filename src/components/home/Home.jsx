import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bot,
  Brain,
  Briefcase,
  Building2,
  Cloud,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  GitBranch,
  Handshake,
  Lock,
  Mail,
  MessageSquareText,
  Monitor,
  PhoneCall,
  Search,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, Button } from '../ui'

const capabilities = [
  {
    icon: Brain,
    title: '仿真编排',
    description: '把自然语言、视觉意图和动作约束编译为可执行行为树。',
    points: ['自然语言转任务树', '策略约束自动补全', '结果直接进入仿真'],
  },
  {
    icon: Bot,
    title: '机器人能力调度',
    description: '把感知、导航、抓取和告警统一编排到一条执行链路。',
    points: ['多模态感知绑定', '异常分支自动生成', '动作链实时回写'],
  },
  {
    icon: Cloud,
    title: '技能市场部署',
    description: '用技能市场把导航、抓取、巡检等能力快速部署到不同硬件。',
    points: ['版本兼容可见', '部署状态可回放', '环境差异可追踪'],
  },
  {
    icon: Monitor,
    title: '监控与回放',
    description: '以 OS 视角统一监控机器人状态、遥测指标和紧急控制动作。',
    points: ['机队状态总览', '任务链路回放', '关键阈值主动告警'],
  },
]

const kpiTargets = [
  { label: '在线设备', value: 42, suffix: '', unit: 'Fleet', trend: [42, 44, 45, 44, 47, 49, 52] },
  { label: '活跃仿真', value: 18, suffix: '', unit: 'Tasks', trend: [6, 9, 10, 12, 14, 16, 18] },
  { label: '已部署技能', value: 523, suffix: '', unit: 'Skills', trend: [300, 336, 380, 422, 470, 501, 523] },
  { label: '告警响应时间', value: 0.64, suffix: 's', unit: 'Avg', trend: [1.3, 1.1, 0.98, 0.92, 0.81, 0.74, 0.64] },
]

const workflowStages = [
  { title: '指令输入', desc: '自然语言输入任务、约束和安全边界。', icon: MessageSquareText },
  { title: '技能组合', desc: '自动绑定感知、导航、抓取与告警能力。', icon: Bot },
  { title: '仿真验证', desc: '在数字孪生舞台里先执行、先回放、先纠错。', icon: Cloud },
  { title: '部署执行', desc: '按机器人类型下发策略和运行参数。', icon: ArrowRight },
  { title: '实时监控', desc: '在 OS 控制台持续监控状态、告警和回放。', icon: Monitor },
]

const pricingPlans = [
  {
    name: 'Starter',
    tag: '验证版',
    price: '联系咨询',
    desc: '适合个人开发者、创新小组和 PoC 团队，用最低门槛验证 Text2BT、仿真编排与基础部署能力。',
    points: ['基础行为编排与行为树生成', '标准仿真工作台与验证流程', '单团队空间与基础权限配置', '适合 0 到 1 场景验证与 Demo 打样'],
    accent: 'border-white/10 bg-white/[0.03]',
  },
  {
    name: 'Studio',
    tag: '团队版',
    price: '按席位 / 机器人规模',
    desc: '面向正式研发团队，覆盖多成员协作、技能复用、版本管理与多机器人验证，是从研发走向交付的核心方案。',
    points: ['团队协作开发与角色分工', '多机器人验证与回放能力', '技能市场管理与版本控制', '适合中型项目交付与持续迭代'],
    accent: 'border-primary/30 bg-primary/10 shadow-[0_22px_44px_rgba(59,130,246,0.16)]',
  },
  {
    name: 'Enterprise',
    tag: '企业版',
    price: '定制报价',
    desc: '支持私有化部署、行业集成与大规模机队控制，适合集团级客户、行业方案商和正式采购落地项目。',
    points: ['私有化部署与企业安全合规', '多组织权限体系与审计能力', '行业方案定制与系统集成', '专属交付、培训与长期支持'],
    accent: 'border-accent-purple/20 bg-accent-purple/10',
  },
]

const partnershipTracks = [
  {
    title: '硬件合作',
    desc: '面向机器人本体、传感器、控制器与边缘硬件伙伴，联合适配能力接口、演示环境与交付方案。',
    points: ['联合适配本体、传感器与控制器', '共建演示方案与标准接口', '推动硬件与平台协同销售'],
    icon: Building2,
  },
  {
    title: '渠道合作',
    desc: '与区域渠道、系统集成商和行业伙伴协同拓展园区、仓储、安防和制造客户。',
    points: ['联合拓展行业客户与区域市场', '输出标准化售前材料与 Demo', '支持项目商机协同推进'],
    icon: Handshake,
  },
  {
    title: '方案共建',
    desc: '围绕重点行业场景共建具身智能解决方案，从 Demo、试点到正式落地形成完整路径。',
    points: ['共建行业方案与交付方法论', '推进试点验证与场景打磨', '形成可复用商业化路径'],
    icon: Briefcase,
  },
]

const consultTopics = ['产品演示', '采购咨询', '私有化部署', '生态合作']

const promptText = '帮我给安防巡逻机器人生成夜间巡检策略，发现异常就拍照并通知值班室'
const aiMessage = '已为 A1 Guard 生成夜巡方案，包含巡检、异常检测、告警上报与返航待命四段逻辑。你可以继续补充场景约束，我会实时更新行为树。'

const chatHighlights = [
  { label: 'Robot', value: 'A1 Guard' },
  { label: 'Mode', value: 'Night Patrol' },
  { label: 'Latency', value: '640ms' },
]

const orchestrationSteps = [
  '解析任务意图与约束',
  '绑定感知与巡逻技能',
  '生成异常处理分支',
]

const scenarioTemplates = [
  {
    id: 'warehouse',
    title: '智能仓库巡检',
    desc: '识别货架缺货、检测地面异常、自动上报',
    icon: Bot,
    tone: 'bg-primary/15 text-primary',
  },
  {
    id: 'service',
    title: '服务机器人接待',
    desc: '人脸识别、语音交互、引导访客、递送物品',
    icon: Brain,
    tone: 'bg-accent-purple/15 text-accent-purple',
  },
  {
    id: 'security',
    title: '安防巡逻',
    desc: '夜间巡检、异常检测、入侵告警、轨迹追踪',
    icon: Lock,
    tone: 'bg-emerald-500/15 text-emerald-400',
  },
  {
    id: 'industrial',
    title: '工业抓取装配',
    desc: '6DoF 抓取、精密装配、质量检测、工具更换',
    icon: Cloud,
    tone: 'bg-orange-500/15 text-orange-300',
  },
]

const treeTemplates = {
  security: {
    summary: '当前逻辑树已覆盖感知、巡检、异常抓拍与通知分支，并为夜间低照环境附加视觉增强策略。',
    outputs: [
      { label: '节点总数', value: '14' },
      { label: '执行深度', value: '4 层' },
      { label: '推理耗时', value: '0.64s' },
    ],
    nodes: [
      {
        id: 'security-root',
        label: '安防夜巡',
        type: 'sequence',
        status: 'running',
        detail: '根节点，负责串联巡逻主链路，保证环境感知、路线执行和异常处理依次完成。',
        children: [
          {
            id: 'security-sense',
            label: '环境感知',
            type: 'selector',
            status: 'success',
            detail: '对视觉、热成像和运动检测结果进行融合，决定是否进入告警链路。',
            children: [
              { id: 'security-vision', label: '视觉检测', type: 'condition', status: 'success', detail: '识别异常人员、遗留物和区域遮挡。' },
              { id: 'security-report', label: '状态上报', type: 'action', status: 'ready', detail: '周期性同步设备状态与巡逻日志。' },
            ],
          },
          {
            id: 'security-route',
            label: '路径巡检',
            type: 'sequence',
            status: 'running',
            detail: '按巡逻航点执行移动任务，并持续监控通行状态。',
            children: [
              { id: 'security-avoid', label: '动态避障', type: 'action', status: 'running', detail: '遇到动态障碍时实时重规划路径。' },
              { id: 'security-waypoint', label: '航点执行', type: 'action', status: 'ready', detail: '按既定顺序完成所有巡逻航点。' },
            ],
          },
          {
            id: 'security-alert',
            label: '异常处理',
            type: 'selector',
            status: 'ready',
            detail: '当检测到风险事件时切换到取证、告警与返航待命分支。',
            children: [
              { id: 'security-photo', label: '拍照存证', type: 'action', status: 'ready', detail: '触发高清图像采集并附带位姿信息。' },
              { id: 'security-notify', label: '告警通知', type: 'action', status: 'ready', detail: '通知值班室并推送异常摘要。' },
            ],
          },
        ],
      },
    ],
  },
  warehouse: {
    summary: '仓储巡检树图包含库存识别、缺货判定、地面异常检测和补货任务派发分支。',
    outputs: [
      { label: '节点总数', value: '12' },
      { label: '执行深度', value: '4 层' },
      { label: '推理耗时', value: '0.58s' },
    ],
    nodes: [
      {
        id: 'warehouse-root',
        label: '仓库巡检',
        type: 'sequence',
        status: 'running',
        detail: '执行货架扫描、库存核对与异常上报。',
        children: [
          {
            id: 'warehouse-scan',
            label: '货架扫描',
            type: 'sequence',
            status: 'running',
            detail: '依次扫描通道货架并记录 SKU 状态。',
            children: [
              { id: 'warehouse-stock', label: '库存识别', type: 'condition', status: 'success', detail: '识别货位和物料数量。' },
              { id: 'warehouse-gap', label: '缺货判定', type: 'action', status: 'ready', detail: '判定是否需要补货。' },
            ],
          },
          {
            id: 'warehouse-floor',
            label: '地面异常',
            type: 'selector',
            status: 'ready',
            detail: '检查漏液、异物和通道堵塞。',
            children: [
              { id: 'warehouse-liquid', label: '漏液检测', type: 'condition', status: 'ready', detail: '识别液体反光与湿滑区域。' },
              { id: 'warehouse-block', label: '堵塞上报', type: 'action', status: 'ready', detail: '将堵塞信息同步至调度系统。' },
            ],
          },
          {
            id: 'warehouse-task',
            label: '任务派发',
            type: 'action',
            status: 'ready',
            detail: '向补货或保洁机器人派发后续任务。',
          },
        ],
      },
    ],
  },
  service: {
    summary: '接待流程包含来访识别、意图问询、路线引导和递送服务四类子流程。',
    outputs: [
      { label: '节点总数', value: '11' },
      { label: '执行深度', value: '3 层' },
      { label: '推理耗时', value: '0.49s' },
    ],
    nodes: [
      {
        id: 'service-root',
        label: '访客接待',
        type: 'sequence',
        status: 'running',
        detail: '从识别来访者到完成引导或递送。',
        children: [
          {
            id: 'service-identify',
            label: '身份识别',
            type: 'selector',
            status: 'success',
            detail: '识别员工、访客与陌生人。',
            children: [
              { id: 'service-face', label: '人脸识别', type: 'condition', status: 'success', detail: '进行人脸和证件比对。' },
              { id: 'service-register', label: '访客登记', type: 'action', status: 'ready', detail: '收集来访人信息并生成通行记录。' },
            ],
          },
          {
            id: 'service-intent',
            label: '意图理解',
            type: 'sequence',
            status: 'running',
            detail: '通过语音对话判断来访需求。',
            children: [
              { id: 'service-ask', label: '问询需求', type: 'action', status: 'running', detail: '通过多轮对话明确目标。' },
              { id: 'service-guide', label: '路线引导', type: 'action', status: 'ready', detail: '导航到会议室或服务台。' },
            ],
          },
          { id: 'service-delivery', label: '物品递送', type: 'action', status: 'ready', detail: '在有递送需求时切换递送流程。' },
        ],
      },
    ],
  },
  industrial: {
    summary: '装配行为树覆盖抓取定位、姿态校正、装配执行和质量复检分支。',
    outputs: [
      { label: '节点总数', value: '13' },
      { label: '执行深度', value: '4 层' },
      { label: '推理耗时', value: '0.72s' },
    ],
    nodes: [
      {
        id: 'industrial-root',
        label: '装配作业',
        type: 'sequence',
        status: 'running',
        detail: '串联抓取、校准、装配和质量确认四个步骤。',
        children: [
          {
            id: 'industrial-grasp',
            label: '工件抓取',
            type: 'sequence',
            status: 'running',
            detail: '完成目标识别和抓取姿态规划。',
            children: [
              { id: 'industrial-locate', label: '目标定位', type: 'condition', status: 'success', detail: '识别零件位姿与抓取点。' },
              { id: 'industrial-grab', label: '夹爪闭合', type: 'action', status: 'running', detail: '控制夹爪完成抓取。' },
            ],
          },
          {
            id: 'industrial-align',
            label: '姿态校准',
            type: 'action',
            status: 'ready',
            detail: '对零件姿态进行微调，保证装配精度。',
          },
          {
            id: 'industrial-assemble',
            label: '装配执行',
            type: 'selector',
            status: 'ready',
            detail: '根据工艺路径执行插装、锁附和力控。',
            children: [
              { id: 'industrial-force', label: '力控装配', type: 'action', status: 'ready', detail: '在接触阶段启用力反馈。' },
              { id: 'industrial-check', label: '质量复检', type: 'condition', status: 'ready', detail: '验证装配位置与质量。' },
            ],
          },
        ],
      },
    ],
  },
}

function flattenVisibleNodes(nodes, collapsedIds, depth = 0, parentId = null, acc = []) {
  nodes.forEach((node) => {
    acc.push({ ...node, depth, parentId })
    if (node.children?.length && !collapsedIds.has(node.id)) {
      flattenVisibleNodes(node.children, collapsedIds, depth + 1, node.id, acc)
    }
  })

  return acc
}

function getSubtreeIds(node) {
  const ids = [node.id]
  node.children?.forEach((child) => {
    ids.push(...getSubtreeIds(child))
  })
  return ids
}

function TreeNode({ node, active, dimmed, onSelect, onToggle, canToggle }) {
  const className = {
    sequence: 'border-primary/35 bg-primary/18 text-white shadow-[0_14px_28px_rgba(59,130,246,0.2)]',
    selector: 'border-accent-purple/30 bg-accent-purple/12 text-gray-100',
    condition: 'border-emerald-400/20 bg-emerald-400/8 text-emerald-100',
    action: 'border-white/10 bg-black/35 text-gray-200',
  }[node.type]

  const statusTone = {
    running: 'bg-primary',
    success: 'bg-emerald-400',
    ready: 'bg-white/40',
  }[node.status]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: dimmed ? 0.45 : 1, y: 0, scale: active ? 1.02 : 1 }}
      className={`rounded-2xl border px-4 py-3 text-sm backdrop-blur-sm transition-all ${className}`}
      onClick={() => onSelect(node)}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-1 h-2.5 w-2.5 rounded-full ${statusTone}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="truncate font-medium">{node.label}</div>
            <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-gray-400">
              {node.type}
            </div>
          </div>
          <div className="mt-1 text-xs text-gray-400">{node.status}</div>
        </div>
        {canToggle && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onToggle(node.id)
            }}
            className="rounded-full border border-white/10 bg-white/5 p-1 text-gray-300"
          >
            {node.collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </motion.div>
  )
}

function TypingDots() {
  return (
    <div className="mt-3 flex gap-1.5">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          animate={{ y: [0, -4, 0], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.16 }}
          className="h-2 w-2 rounded-full bg-primary"
        />
      ))}
    </div>
  )
}

const text2btScrollbar =
  '[scrollbar-width:thin] [scrollbar-color:rgba(59,130,246,0.65)_rgba(255,255,255,0.04)] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-white/[0.04] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-[1px] [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-[#0b1220] [&::-webkit-scrollbar-thumb]:bg-[linear-gradient(180deg,rgba(96,165,250,0.85),rgba(59,130,246,0.55))] [&::-webkit-scrollbar-thumb:hover]:bg-[linear-gradient(180deg,rgba(125,211,252,0.9),rgba(59,130,246,0.8))] [&::-webkit-scrollbar-corner]:bg-transparent'

function AnimatedNumber({ value, suffix }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let frameId
    const startedAt = performance.now()
    const duration = 1400

    const tick = (timestamp) => {
      const progress = Math.min((timestamp - startedAt) / duration, 1)
      setDisplay(value * progress)
      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frameId)
  }, [value])

  const formatted = Number.isInteger(value) ? Math.round(display) : display.toFixed(1)

  return (
    <span>
      {formatted}
      {suffix}
    </span>
  )
}

export function Home() {
  const [typedPromptLength, setTypedPromptLength] = useState(0)
  const [typedAiLength, setTypedAiLength] = useState(0)
  const [selectedScenarioId, setSelectedScenarioId] = useState('security')
  const [treeZoom, setTreeZoom] = useState(1)
  const [collapsedNodeIds, setCollapsedNodeIds] = useState(new Set())
  const typedPrompt = useMemo(() => promptText.slice(0, typedPromptLength), [typedPromptLength])
  const typedAi = useMemo(() => aiMessage.slice(0, typedAiLength), [typedAiLength])
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

  useEffect(() => {
    const promptTimer = window.setInterval(() => {
      setTypedPromptLength((current) => {
        if (current >= promptText.length) {
          window.clearInterval(promptTimer)
          return current
        }
        return current + 1
      })
    }, 45)

    return () => window.clearInterval(promptTimer)
  }, [])

  useEffect(() => {
    if (typedPromptLength < promptText.length) {
      return undefined
    }

    const aiTimer = window.setInterval(() => {
      setTypedAiLength((current) => {
        if (current >= aiMessage.length) {
          window.clearInterval(aiTimer)
          return current
        }
        return current + 2
      })
    }, 22)

    return () => window.clearInterval(aiTimer)
  }, [typedPromptLength])

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
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.14),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(56,189,248,0.12),transparent_26%),linear-gradient(180deg,#060709_0%,#06090f_54%,#050505_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute left-1/2 top-24 h-[min(70vw,38rem)] w-[min(70vw,38rem)] -translate-x-1/2 rounded-full border border-primary/10 bg-primary/5 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[min(96vw,1680px)] px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
          <div className="grid items-center gap-10 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.12fr)] xl:gap-12 2xl:gap-16">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs text-primary sm:text-sm"
              >
                <Sparkles className="h-4 w-4" />
                具身智能的协议层与开发平台
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.05 }}
                className="max-w-3xl text-4xl font-semibold leading-[1.02] text-white sm:text-5xl lg:text-[4.5rem]"
              >
                把自然语言
                <span className="block bg-gradient-to-r from-primary via-orange-200 to-sky-300 bg-clip-text text-transparent">
                  编译成机器人行为
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.12 }}
                className="mt-5 max-w-xl text-base leading-8 text-gray-400 sm:text-lg"
              >
                知肌纪把 VLA 编译、技能部署、数字孪生仿真和机队控制台收敛到一条工作流里，
                帮助团队用更少的人力和更短的时间完成机器人验证与发布。
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.18 }}
                className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4"
              >
                <Link to="/simulation">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full rounded-full px-8 shadow-[0_0_30px_rgba(59,130,246,0.3)] sm:w-auto"
                  >
                    开始构建
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg" className="w-full rounded-full px-8 sm:w-auto">
                    查看实时监控
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.22 }}
                className="mt-5 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-gray-500 sm:mt-6"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-status-success" />
                  Studio / Edge / OS 一体化
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  支持安防、仓储、接待、工业四类场景
                </span>
              </motion.div>

              <div className="mt-10 grid gap-4 sm:mt-12 xl:grid-cols-4">
                {kpiTargets.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Card className="relative h-full rounded-[1.6rem] border-white/8 p-5 sm:p-6">
                      <div className="grid h-full grid-rows-[3.5rem_3.5rem_2.5rem]">
                        <div className="h-14 pr-12">
                          <div className="max-w-none text-[12px] leading-5 tracking-[0.04em] text-gray-500">
                            {item.label}
                          </div>
                        </div>

                        <div className="mt-3 flex h-14 items-end gap-2">
                          <div className="text-3xl font-semibold text-white">
                            <AnimatedNumber value={item.value} suffix={item.suffix} />
                          </div>
                          <div className="pb-1 text-[13px] uppercase tracking-[0.18em] text-primary/80">{item.unit}</div>
                        </div>

                        <div className="mt-5 flex h-10 items-end gap-1.5">
                          {item.trend.map((point, trendIndex) => (
                            <div
                              key={`${item.label}-${point}-${trendIndex}`}
                              className="flex-1 rounded-full bg-[linear-gradient(180deg,rgba(56,189,248,0.85),rgba(249,115,22,0.28))]"
                              style={{ height: `${Math.max(18, (point / Math.max(...item.trend)) * 100)}%` }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[13px] leading-none text-gray-400 sm:right-6 sm:top-6">
                        live
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative order-first mx-auto w-full max-w-[min(100%,980px)] xl:order-none xl:max-w-none"
            >
              <div className="absolute -right-4 top-8 h-[clamp(10rem,20vw,14rem)] w-[clamp(10rem,20vw,14rem)] rounded-full bg-accent-pink/10 blur-3xl" />
              <div className="absolute -left-6 bottom-8 h-[clamp(11rem,22vw,15rem)] w-[clamp(11rem,22vw,15rem)] rounded-full bg-primary/15 blur-3xl" />

              <Card className="overflow-hidden rounded-[2rem] border-primary/20 bg-slate-950/80 p-0 shadow-[0_24px_80px_rgba(2,6,23,0.65)]">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-status-danger" />
                    <span className="h-3 w-3 rounded-full bg-status-warning" />
                    <span className="h-3 w-3 rounded-full bg-status-success" />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-gray-500 sm:text-xs sm:tracking-[0.3em]">
                    VLA Compiler Session
                  </div>
                </div>

                <div className="relative overflow-hidden p-4 sm:p-6">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_34%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.12),transparent_28%)]" />

                  <div className="relative rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,10,18,0.94)_0%,rgba(7,10,18,0.78)_100%)] p-4 sm:p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.28em] text-primary/70">
                          A1 Assistant Mode
                        </div>
                        <div className="mt-1 text-base font-semibold text-white">
                          用对话完成机器人任务编排
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {chatHighlights.map((item) => (
                          <div
                            key={item.label}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-gray-300"
                          >
                            <span className="text-gray-500">{item.label}</span>
                            <span className="ml-2 text-white">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
                        <div className="rounded-[1.3rem] border border-white/8 bg-black/20 p-3">
                          <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-gray-500">
                            <MessageSquareText className="h-4 w-4 text-primary/80" />
                            Conversation Context
                          </div>
                          <div className="text-sm leading-7 text-gray-400">
                            A1 正在根据安防巡逻场景自动补全感知链路、任务分支和异常告警逻辑。
                          </div>
                        </div>

                        <div className="rounded-[1.3rem] border border-white/8 bg-black/20 p-3">
                          <div className="text-[11px] uppercase tracking-[0.24em] text-gray-500">Pipeline</div>
                          <div className="mt-3 space-y-2">
                            {orchestrationSteps.map((step, index) => (
                              <div key={step} className="flex items-center gap-2 text-sm text-gray-300">
                                <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                                  typedAiLength === aiMessage.length || index === 0
                                    ? 'bg-primary/20 text-primary'
                                    : 'bg-white/5 text-gray-500'
                                }`}>
                                  {index + 1}
                                </div>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="max-w-[88%] rounded-[1.4rem] rounded-br-md bg-[linear-gradient(135deg,#3b82f6,#2563eb)] px-4 py-3 text-sm leading-7 text-white shadow-[0_16px_34px_rgba(59,130,246,0.35)]">
                          {typedPrompt}
                          <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-white/80 align-middle" />
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div className="max-w-[90%] rounded-[1.4rem] rounded-bl-md border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-gray-200 shadow-[0_14px_30px_rgba(0,0,0,0.28)]">
                          <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                              <Bot className="h-4 w-4" />
                            </div>
                            <div className="text-xs uppercase tracking-[0.24em] text-primary/70">
                              Robot Figma AI
                            </div>
                          </div>
                          <div>{typedAi}</div>
                          {typedAiLength < aiMessage.length && <TypingDots />}

                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                              opacity: typedAiLength === aiMessage.length ? 1 : 0,
                              y: typedAiLength === aiMessage.length ? 0 : 10,
                            }}
                            className="mt-4 grid gap-3 sm:grid-cols-3"
                          >
                            <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                              <div className="text-[11px] uppercase tracking-[0.24em] text-gray-500">Intent</div>
                              <div className="mt-2 text-sm text-white">夜间巡检</div>
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                              <div className="text-[11px] uppercase tracking-[0.24em] text-gray-500">Action Set</div>
                              <div className="mt-2 text-sm text-white">巡逻 / 拍照 / 告警</div>
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                              <div className="text-[11px] uppercase tracking-[0.24em] text-gray-500">Output</div>
                              <div className="mt-2 text-sm text-white">Behavior Tree</div>
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                              opacity: typedAiLength === aiMessage.length ? 1 : 0,
                              y: typedAiLength === aiMessage.length ? 0 : 10,
                            }}
                            className="mt-4 flex flex-wrap gap-2"
                          >
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              已生成可执行逻辑树
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 text-xs text-primary">
                              下一步：进入仿真验证
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      <div className="rounded-[1.3rem] border border-white/8 bg-black/25 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-gray-500">
                            继续补充场景约束，例如“进入禁区时先录像，再通知值班室”
                          </div>
                          <button
                            type="button"
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-[0_14px_26px_rgba(59,130,246,0.35)]"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="text-sm uppercase tracking-[0.3em] text-primary/70">Capabilities</div>
            <h2 className="mt-3 text-3xl font-semibold text-white lg:text-4xl">四个核心能力模块</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              每个模块只承担一个明确价值点，让首页信息层级更清楚，也更接近可路演的产品页面。
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon
              return (
                <motion.div
                  key={capability.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card className="h-full rounded-[1.75rem] p-6" hover>
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{capability.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-400">{capability.description}</p>
                    <div className="mt-5 space-y-2">
                      {capability.points.map((point) => (
                        <div key={point} className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

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

      <section className="border-y border-white/6 bg-background-secondary/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-primary/70">Workflow</div>
              <h2 className="mt-3 text-3xl font-semibold text-white lg:text-4xl">
                从指令到机队执行的产品闭环
              </h2>
            </div>
            <p className="max-w-2xl text-gray-400">
              用更偏产品叙事的方式，把输入、组合、验证、部署和监控串成一条可理解的业务链路。
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-5">
            {workflowStages.map((stage, index) => {
              const Icon = stage.icon
              return (
                <motion.div
                  key={stage.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card className="relative h-full rounded-[1.75rem] p-6" hover>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-gray-500">Step {index + 1}</div>
                    <h3 className="mt-3 text-xl font-semibold text-white">{stage.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-400">
                      {stage.desc}
                    </p>
                    {index < workflowStages.length - 1 && (
                      <div className="pointer-events-none absolute -right-3 top-10 hidden h-px w-6 bg-gradient-to-r from-primary/70 to-sky-400/0 xl:block" />
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-white/6 bg-background-secondary/20 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-primary/70">Pricing</div>
              <h2 className="mt-3 text-3xl font-semibold text-white lg:text-4xl">收费方案</h2>
            </div>
            <p className="max-w-2xl text-gray-400">
              提供从验证版到企业级私有化部署的收费方案，适配个人验证、团队研发与企业采购场景。
            </p>
          </div>

          <Card className="rounded-[2rem] border-primary/20 p-8 lg:p-10">
            <div className="grid gap-4 lg:grid-cols-3">
              {pricingPlans.map((plan) => (
                <div key={plan.name} className={`rounded-[1.35rem] border p-5 ${plan.accent}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold text-white">{plan.name}</div>
                      <div className="mt-1 text-xs text-primary/80">{plan.tag}</div>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-gray-300">
                      {plan.name === 'Studio' ? '热门' : '方案'}
                    </div>
                  </div>

                  <div className="mt-3 text-lg font-semibold text-white">{plan.price}</div>
                  <p className="mt-3 text-sm leading-6 text-gray-300">{plan.desc}</p>

                  <div className="mt-4 space-y-2">
                    {plan.points.slice(0, 3).map((point) => (
                      <div key={point} className="flex items-start gap-2 text-sm text-gray-300">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button variant="outline" className="rounded-full px-6">查看方案详情</Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="border-t border-white/6 bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-primary/70">Business Cooperation</div>
              <h2 className="mt-3 text-3xl font-semibold text-white lg:text-4xl">合作方式</h2>
            </div>
            <p className="max-w-2xl text-gray-400">
              面向硬件伙伴、渠道伙伴与行业方案伙伴，支持联合适配、联合拓展和解决方案共建。
            </p>
          </div>

          <Card className="rounded-[2rem] border-white/12 p-8 lg:p-10">
            <div className="grid gap-4 lg:grid-cols-3">
              {partnershipTracks.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-base font-semibold text-white">{item.title}</div>
                    </div>
                    <div className="mt-3 text-sm leading-6 text-gray-300">{item.desc}</div>
                    <div className="mt-4 space-y-2">
                      {item.points.map((point) => (
                        <div key={point} className="flex items-start gap-2 text-sm text-gray-300">
                          <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6">
              <Button variant="outline" className="rounded-full px-6">查看合作方式</Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden rounded-[2rem] border-primary/20 bg-[linear-gradient(135deg,rgba(17,24,33,0.96),rgba(13,17,23,0.88))] p-8 lg:p-12">
            <div className="absolute -right-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
            <div className="absolute left-1/3 top-0 h-px w-48 bg-gradient-to-r from-transparent via-sky-300/70 to-transparent" />
            <div className="relative">
              <div className="flex flex-col gap-8 border-b border-white/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <div className="text-sm uppercase tracking-[0.3em] text-primary/70">Final CTA</div>
                  <h2 className="mt-3 text-3xl font-semibold text-white lg:text-4xl">
                    让机器人项目进入可落地的商务流程
                  </h2>
                  <p className="mt-4 text-base leading-8 text-gray-400">
                    从方案评估到部署落地，用更清晰的方式推进下一步。
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="primary" size="lg" className="rounded-full px-8">
                    获取部署资料
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full px-8">
                    查看合作方式
                  </Button>
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
                <div>
                  <div className="text-sm uppercase tracking-[0.28em] text-primary/70">Business Contact</div>
                  <div className="mt-3 text-2xl font-semibold text-white">咨询范围</div>
                  <p className="mt-3 text-sm leading-7 text-gray-400">
                    如果你正在评估采购方案、私有化部署、产品演示或生态合作，可通过以下方式与我们联系。
                  </p>

                  <div className="mt-6">
                    <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-gray-500">咨询方向</div>
                    <div className="flex flex-wrap gap-2">
                    {consultTopics.map((topic) => (
                      <div
                        key={topic}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300"
                      >
                        {topic}
                      </div>
                    ))}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2 text-[11px] uppercase tracking-[0.22em] text-gray-500">联系方式</div>
                    <div className="flex items-center gap-3 rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>business@robotfigma.ai</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
                      <PhoneCall className="h-4 w-4 text-primary" />
                      <span>400-800-2048</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.65rem] border border-primary/18 bg-[linear-gradient(180deg,rgba(249,115,22,0.12),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_40px_rgba(249,115,22,0.08)]">
                  <div className="text-sm uppercase tracking-[0.22em] text-primary/75">Priority Contact</div>
                  <div className="mt-3 text-2xl font-semibold text-white">立即发起咨询</div>
                  <div className="mt-3 text-sm leading-7 text-gray-300">
                    提交项目方向后，我们将在 1 个工作日内安排商务或产品团队与你对接。
                  </div>

                  <div className="mt-6 rounded-[1.2rem] border border-white/10 bg-black/20 px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-gray-500">适用场景</div>
                    <div className="mt-2 text-sm text-white">适用于采购评估、部署咨询、合作对接。</div>
                  </div>

                  <div className="mt-6">
                    <Button variant="primary" className="w-full rounded-full">立即发起咨询</Button>
                  </div>

                  <div className="mt-4 text-center text-sm text-gray-400">
                    或发送邮件至 <span className="text-white">business@robotfigma.ai</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
