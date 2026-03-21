import {
  ArrowRight,
  Bot,
  Brain,
  Briefcase,
  Building2,
  Cloud,
  Handshake,
  Lock,
  MessageSquareText,
  Monitor,
} from 'lucide-react'

export const capabilities = [
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

export const kpiTargets = [
  { label: '在线设备', value: 42, suffix: '', unit: 'Fleet', trend: [42, 44, 45, 44, 47, 49, 52] },
  { label: '活跃仿真', value: 18, suffix: '', unit: 'Tasks', trend: [6, 9, 10, 12, 14, 16, 18] },
  { label: '已部署技能', value: 523, suffix: '', unit: 'Skills', trend: [300, 336, 380, 422, 470, 501, 523] },
  { label: '告警响应时间', value: 0.64, suffix: 's', unit: 'Avg', trend: [1.3, 1.1, 0.98, 0.92, 0.81, 0.74, 0.64] },
]

export const workflowStages = [
  { title: '指令输入', desc: '自然语言输入任务、约束和安全边界。', icon: MessageSquareText },
  { title: '技能组合', desc: '自动绑定感知、导航、抓取与告警能力。', icon: Bot },
  { title: '仿真验证', desc: '在数字孪生舞台里先执行、先回放、先纠错。', icon: Cloud },
  { title: '部署执行', desc: '按机器人类型下发策略和运行参数。', icon: ArrowRight },
  { title: '实时监控', desc: '在 OS 控制台持续监控状态、告警和回放。', icon: Monitor },
]

export const pricingPlans = [
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

export const partnershipTracks = [
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

export const consultTopics = ['产品演示', '采购咨询', '私有化部署', '生态合作']

export const promptText = '帮我给安防巡逻机器人生成夜间巡检策略，发现异常就拍照并通知值班室'
export const aiMessage = '已为 A1 Guard 生成夜巡方案，包含巡检、异常检测、告警上报与返航待命四段逻辑。你可以继续补充场景约束，我会实时更新行为树。'

export const chatHighlights = [
  { label: 'Robot', value: 'A1 Guard' },
  { label: 'Mode', value: 'Night Patrol' },
  { label: 'Latency', value: '640ms' },
]

export const orchestrationSteps = [
  '解析任务意图与约束',
  '绑定感知与巡逻技能',
  '生成异常处理分支',
]

export const scenarioTemplates = [
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

export const treeTemplates = {
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
