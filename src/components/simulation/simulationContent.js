import {
  Brain,
  Cpu,
  Eye,
  Hand,
  Maximize2,
  Move,
  MousePointer2,
  Radar,
  RotateCw,
  ScanLine,
} from 'lucide-react'

export const tools = [
  { id: 'select', icon: MousePointer2, label: '选择' },
  { id: 'move', icon: Move, label: '移动' },
  { id: 'rotate', icon: RotateCw, label: '旋转' },
  { id: 'inspect', icon: ScanLine, label: '巡检' },
  { id: 'measure', icon: Maximize2, label: '测量' },
]

export const modelOptions = [
  { id: 'ChatGPT', label: 'ChatGPT', provider: 'OpenAI' },
  { id: 'DeepSeek', label: 'DeepSeek', provider: 'DeepSeek' },
  { id: 'Qwen', label: 'Qwen', provider: 'Tongyi' },
]

export const partConfig = {
  head: { label: '头部感知', badge: '视觉中枢' },
  shoulder: { label: '颈部关节', badge: '平衡联动' },
  arm: { label: '上肢执行', badge: '抓取控制' },
  hip: { label: '躯干核心', badge: '姿态稳定' },
  knee: { label: '下肢联动', badge: '步态规划' },
  foot: { label: '足端支撑', badge: '着地反馈' },
}

export const partInsights = {
  head: {
    status: '视觉链路稳定',
    statusTone: 'text-emerald-300',
    badgeTone: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    metrics: [
      { label: '感知识别', value: '98.2%' },
      { label: 'LiDAR 延迟', value: '14 ms' },
    ],
    recommendation: '建议执行环境扫描与目标重识别联调。',
  },
  shoulder: {
    status: '关节补偿生效',
    statusTone: 'text-sky-300',
    badgeTone: 'border-sky-400/20 bg-sky-400/10 text-sky-300',
    metrics: [
      { label: '姿态偏移', value: '0.7°' },
      { label: '补偿频率', value: '82 Hz' },
    ],
    recommendation: '可继续进行颈肩联动和姿态微调。',
  },
  arm: {
    status: '抓取链路待检',
    statusTone: 'text-amber-300',
    badgeTone: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
    metrics: [
      { label: '扭矩输出', value: '44.6 N·m' },
      { label: '末端误差', value: '0.4 mm' },
    ],
    recommendation: '建议切换巡检模式，确认上肢执行器重复精度。',
  },
  hip: {
    status: '主控负载均衡',
    statusTone: 'text-primary',
    badgeTone: 'border-primary/20 bg-primary/10 text-primary',
    metrics: [
      { label: '算力占用', value: '66%' },
      { label: '热管理', value: '63.8°C' },
    ],
    recommendation: '适合继续做步态规划与核心稳定性验证。',
  },
  knee: {
    status: '步态关节正常',
    statusTone: 'text-sky-300',
    badgeTone: 'border-sky-400/20 bg-sky-400/10 text-sky-300',
    metrics: [
      { label: '联动延迟', value: '11 ms' },
      { label: '支撑角度', value: '92.4°' },
    ],
    recommendation: '建议联动足端支撑，观察下肢协同响应。',
  },
  foot: {
    status: '着地反馈在线',
    statusTone: 'text-emerald-300',
    badgeTone: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    metrics: [
      { label: '触地采样', value: '120 Hz' },
      { label: '压力波动', value: '3.1%' },
    ],
    recommendation: '可继续执行平衡保持与落脚路径校准。',
  },
}

export const quickActions = [
  { label: '姿态校准', action: '姿态校准' },
  { label: '关节诊断', action: '关节诊断' },
  { label: '步态优化', action: '步态优化' },
]

export const viewOptions = [
  { id: 'front', label: '正视' },
  { id: 'side', label: '左视' },
  { id: 'top', label: '俯视' },
]

export const toolModeProfiles = {
  select: {
    title: '选择聚焦',
    description: '用于快速锁定部件并联动参数面板，适合先做范围判断。',
    emphasis: '部件上下文',
    focusHint: '建议先选中模型热点，再查看对应参数组。',
    sections: ['compute', 'head', 'body'],
  },
  move: {
    title: '位移校验',
    description: '观察机体平移、姿态变化和支撑域响应。',
    emphasis: '姿态与支撑',
    focusHint: '优先关注整机姿态、下肢支撑和执行链稳定性。',
    sections: ['body', 'leftArm', 'rightArm', 'compute'],
  },
  rotate: {
    title: '旋转调试',
    description: '适合检查机体转向、关节联动和姿态回正能力。',
    emphasis: '关节联动',
    focusHint: '建议优先查看颈部补偿和主控姿态反馈。',
    sections: ['neck', 'compute', 'body'],
  },
  inspect: {
    title: '巡检诊断',
    description: '强调局部观测与系统诊断，适合查看异常和关键部件。',
    emphasis: '感知与诊断',
    focusHint: '建议先检查头部感知链路，再查看颈部与主控状态。',
    sections: ['head', 'neck', 'compute'],
  },
  measure: {
    title: '测量对比',
    description: '用于观察尺寸、间距和构型关系，便于做尺度验证。',
    emphasis: '几何测量',
    focusHint: '适合对整机尺度、上肢范围和足端间距进行对比。',
    sections: ['body', 'leftArm', 'rightArm', 'head'],
  },
}

export const focusHotspots = [
  { id: 'head', label: '头部', position: 'top-[10%] left-[49.5%] -translate-x-1/2' },
  { id: 'shoulder', label: '肩部', position: 'top-[22%] left-[30%]' },
  { id: 'arm', label: '上肢', position: 'top-[42%] right-[20%]' },
  { id: 'hip', label: '躯干', position: 'top-[46%] left-[50%] -translate-x-1/2' },
  { id: 'knee', label: '膝部', position: 'bottom-[23%] left-[36%]' },
  { id: 'foot', label: '足端', position: 'bottom-[10%] right-[35%]' },
]

export const partSectionMap = {
  head: 'head',
  shoulder: 'neck',
  arm: 'leftArm',
  hip: 'compute',
  knee: 'body',
  foot: 'body',
}

export function getContextSectionKeys(selectedTool, selectedPart) {
  const profile = toolModeProfiles[selectedTool] ?? toolModeProfiles.select
  const partSection = selectedPart ? partSectionMap[selectedPart] : null

  return Array.from(new Set([partSection, ...profile.sections, 'compute'].filter(Boolean)))
}

export function orderSectionsForContext(sections, selectedTool, selectedPart) {
  const priorityKeys = getContextSectionKeys(selectedTool, selectedPart)
  const priorityMap = new Map(priorityKeys.map((key, index) => [key, index]))

  return [...sections].sort((left, right) => {
    const leftIndex = priorityMap.has(left.key) ? priorityMap.get(left.key) : Number.MAX_SAFE_INTEGER
    const rightIndex = priorityMap.has(right.key) ? priorityMap.get(right.key) : Number.MAX_SAFE_INTEGER

    if (leftIndex === rightIndex) return 0
    return leftIndex - rightIndex
  })
}

export function getDefaultOpenSectionKeys(sections, selectedTool, selectedPart) {
  const availableKeys = new Set(sections.map((section) => section.key))
  const prioritized = getContextSectionKeys(selectedTool, selectedPart)
    .filter((key) => availableKeys.has(key))

  const defaultCount = selectedPart ? 3 : 2
  const openKeys = prioritized.slice(0, defaultCount)

  if (openKeys.length > 0) return openKeys
  return sections[0] ? [sections[0].key] : []
}

export function buildConsoleTemplates({
  selectedTool,
  selectedPart,
  currentSelection,
  robotId,
}) {
  const focusLabel = currentSelection?.label ?? '整机系统'
  const robotLabel = robotId ?? '当前机器人'

  if (selectedTool === 'inspect') {
    return [
      {
        id: 'inspect-focus',
        label: '载入巡检任务',
        description: `围绕${focusLabel}生成诊断步骤与风险点`,
        prompt: `为 ${robotLabel} 执行${focusLabel}巡检，输出检查步骤、关键指标和异常判断建议。`,
        targetPart: selectedPart ?? 'head',
      },
      {
        id: 'sensor-check',
        label: '感知链路复核',
        description: '检查视觉、LiDAR 与延迟状态',
        prompt: `复核 ${robotLabel} 的感知链路健康度，重点关注视觉传感器、LiDAR 延迟和观测稳定性。`,
        targetPart: 'head',
      },
      {
        id: 'joint-audit',
        label: '关节补偿确认',
        description: '查看颈肩联动和姿态补偿反馈',
        prompt: `检查 ${robotLabel} 的颈部补偿与姿态联动状态，并给出下一步联调建议。`,
        targetPart: 'shoulder',
      },
    ]
  }

  if (selectedTool === 'move') {
    return [
      {
        id: 'move-balance',
        label: '平移稳定测试',
        description: '验证重心转移与支撑稳定性',
        prompt: `为 ${robotLabel} 模拟平移移动，评估重心变化、下肢支撑和稳定度表现。`,
        targetPart: selectedPart ?? 'knee',
      },
      {
        id: 'gait-check',
        label: '步态响应检查',
        description: '关注下肢联动与路径规划反馈',
        prompt: `检查 ${robotLabel} 的步态响应，输出下肢联动延迟、支撑角度与路径规划建议。`,
        targetPart: 'knee',
      },
      {
        id: 'load-shift',
        label: '负载迁移分析',
        description: '查看躯干与手臂在位移中的负载变化',
        prompt: `分析 ${robotLabel} 在位移过程中躯干与双臂的负载分布变化，并标注风险点。`,
        targetPart: 'hip',
      },
    ]
  }

  if (selectedTool === 'rotate') {
    return [
      {
        id: 'yaw-check',
        label: '旋转联动验证',
        description: '检查躯干转向与关节跟随',
        prompt: `执行 ${robotLabel} 的旋转联动验证，输出躯干转向、颈部补偿与姿态回正结果。`,
        targetPart: selectedPart ?? 'shoulder',
      },
      {
        id: 'recenter',
        label: '姿态回正脚本',
        description: '生成旋转后回正与补偿建议',
        prompt: `为 ${robotLabel} 生成旋转后的姿态回正流程，并说明补偿参数调整建议。`,
        targetPart: 'hip',
      },
      {
        id: 'torque-compare',
        label: '关节扭矩对比',
        description: '对比旋转前后的关节扭矩表现',
        prompt: `对比 ${robotLabel} 旋转前后的关节扭矩与稳定度指标，输出差异和建议。`,
        targetPart: 'arm',
      },
    ]
  }

  if (selectedTool === 'measure') {
    return [
      {
        id: 'body-measure',
        label: '整机尺度检查',
        description: '输出高度、重量与足距等关键尺寸',
        prompt: `整理 ${robotLabel} 的整机尺度信息，包括高度、重量、足距和最大工作范围。`,
        targetPart: selectedPart ?? 'hip',
      },
      {
        id: 'arm-reach',
        label: '上肢范围测量',
        description: '查看手臂长度、抓取范围与重复精度',
        prompt: `测量 ${robotLabel} 的上肢工作范围，输出臂长、抓取半径和重复定位精度。`,
        targetPart: 'arm',
      },
      {
        id: 'foot-spacing',
        label: '足端间距校验',
        description: '评估步态宽度与接地支撑关系',
        prompt: `校验 ${robotLabel} 的足端间距、支撑宽度和接地反馈，并给出稳定性结论。`,
        targetPart: 'foot',
      },
    ]
  }

  return [
    {
      id: 'selection-summary',
      label: '聚焦当前部件',
      description: `生成${focusLabel}的控制与状态摘要`,
      prompt: `总结 ${robotLabel} 当前聚焦部件 ${focusLabel} 的状态、关键指标和建议动作。`,
      targetPart: selectedPart ?? 'hip',
    },
    {
      id: 'system-overview',
      label: '整机状态概览',
      description: '汇总主控、姿态与执行链健康度',
      prompt: `输出 ${robotLabel} 的整机状态概览，覆盖主控算力、姿态稳定和执行链健康度。`,
      targetPart: 'hip',
    },
    {
      id: 'alignment-plan',
      label: '联调建议',
      description: '给出下一步联调顺序与检查重点',
      prompt: `基于当前仿真状态，为 ${robotLabel} 生成下一步联调顺序和检查重点。`,
      targetPart: selectedPart ?? 'head',
    },
  ]
}

function getUsageTone(value) {
  if (value >= 82) return 'danger'
  if (value >= 64) return 'warning'
  if (value >= 42) return 'primary'
  return 'success'
}

export function buildParameterSections(parameters) {
  const pitch = Number((parameters.balance.gyroX * 120).toFixed(1))
  const roll = Number((parameters.balance.gyroY * 120).toFixed(1))
  const stability = parameters.balance.stability

  return [
    {
      key: 'head',
      title: '头部感知系统',
      description: '视觉感知与观测范围',
      summary: `${parameters.head.lidarRate} / 观测稳定`,
      icon: Eye,
      tone: 'text-sky-400',
      rows: [
        { label: '视觉传感器型号', value: parameters.head.sensor },
        { label: '视场角 / FOV', value: '120° / 90°' },
        { label: '头部旋转范围', value: 'Pan ±30° | Tilt ±45°' },
        { label: '观测距离范围', value: '0.3m - 10m' },
      ],
      sliders: [
        { label: 'LiDAR 刷新速率', value: 67, color: 'primary' },
        { label: '人脸识别置信度', value: 84, color: 'success' },
        { label: '夜视模式', value: 38, color: 'warning' },
      ],
    },
    {
      key: 'neck',
      title: '颈部关节模组',
      description: '姿态联动与微调校准',
      summary: `稳定度 ${stability}%`,
      icon: Radar,
      tone: 'text-emerald-400',
      rows: [
        { label: '关节驱动', value: '行星齿轮' },
        { label: '校准目标', value: '0N·m' },
        { label: '动态补偿', value: parameters.balance.pathPlanning === 'active' ? '已开启' : '待确认' },
      ],
      stats: [
        { label: '俯仰', value: `${pitch > 0 ? '+' : ''}${pitch}°` },
        { label: '滚转', value: `${roll > 0 ? '+' : ''}${roll}°` },
        { label: '稳定度', value: `${stability}%` },
      ],
    },
    {
      key: 'compute',
      title: '躯干主控系统',
      description: '算力分配与热管理',
      summary: `${parameters.compute.temp}°C / ${parameters.compute.tops} TOPS`,
      icon: Cpu,
      tone: 'text-violet-400',
      rows: [
        { label: '主运算板', value: 'NVIDIA Jetson AGX Orin' },
        { label: '热设计功耗', value: '15W' },
        { label: 'AI 算力', value: `${parameters.compute.tops} TOPS` },
        { label: '驱动芯片', value: 'OG8' },
        { label: '存储颗粒', value: 'OG8' },
      ],
      sliders: [
        { label: 'CPU 使用率', value: parameters.compute.cpu, color: getUsageTone(parameters.compute.cpu) },
        { label: 'GPU 使用率', value: parameters.compute.gpu, color: getUsageTone(parameters.compute.gpu) },
        { label: '内存占用', value: 66, color: 'primary' },
      ],
      footer: `${parameters.compute.temp}°C · 42.3 / 64 GB`,
    },
    {
      key: 'leftArm',
      title: '左臂操作系统',
      description: '执行器与负载补偿',
      summary: `${parameters.limb.leftTorque} N·m`,
      icon: Hand,
      tone: 'text-fuchsia-400',
      rows: [
        { label: '自由度', value: '7 轴' },
        { label: '最大负载', value: '5 kg' },
        { label: '臂长校准', value: '76 cm' },
        { label: '重复定位精度', value: '±0.2 mm' },
        { label: '末端执行器', value: '三指自适应夹爪' },
        { label: '力学补偿', value: '6 轴力/力矩传感器' },
      ],
    },
    {
      key: 'rightArm',
      title: '右臂操作系统',
      description: '镜像执行链与抓取控制',
      summary: `${parameters.limb.rightTorque} N·m`,
      icon: Hand,
      tone: 'text-rose-400',
      rows: [
        { label: '自由度', value: '7 轴' },
        { label: '最大负载', value: '5 kg' },
        { label: '臂长校准', value: '76 cm' },
        { label: '重复定位精度', value: '±0.2 mm' },
        { label: '末端执行器', value: '三指自适应夹爪' },
        { label: '力学补偿', value: '6 轴力/力矩传感器' },
      ],
    },
    {
      key: 'body',
      title: '全局系统参数',
      description: '整机姿态与基础能力',
      summary: '数字孪生标定',
      icon: Brain,
      tone: 'text-amber-400',
      rows: [
        { label: '机体高度', value: '1.74 m' },
        { label: '整机重量', value: '82 kg' },
        { label: '最大行走速度', value: '4.5 km/h' },
        { label: '续航时间', value: '4.2 h' },
      ],
    },
  ]
}
