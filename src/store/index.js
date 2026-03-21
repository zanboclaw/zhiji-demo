import { create } from 'zustand'
import { mockLogs } from '../data/mock'

// 机器人状态
export const useRobotStore = create((set) => ({
  selectedRobot: {
    id: 'Spot-0729',
    model: 'Spot Pro',
    station: '#B-12',
    status: 'normal',
    battery: 70,
    signal: 'strong',
    role: 'operator',
  },
  setSelectedRobot: (robot) => set({ selectedRobot: robot }),
  setRobotStatus: (status) => set((state) => ({
    selectedRobot: { ...state.selectedRobot, status },
  })),
  setBattery: (battery) => set((state) => ({
    selectedRobot: { ...state.selectedRobot, battery },
  })),
}))

// 仿真工作室状态
export const useSimulationStore = create((set) => ({
  selectedTool: 'select',
  selectedView: 'front',
  selectedPart: null,
  droppedModules: [],
  codeBlocks: [
    'from robotfigma import Studio\nfrom robotfigma.skills import vision_obstacle_avoidance\n\nstudio = Studio(robot="Spot-0729")\nmission = studio.define_mission("巡检机器人")\nmission.attach_skill(vision_obstacle_avoidance)\n',
    'mission.set_policy(\n    safety_threshold=0.85,\n    navigation_mode="slam_dynamic",\n    report_channel="ops://alerts",\n)\n',
  ],
  parameters: {
    head: {
      sensor: 'SONY IMX RGB-D',
      lidarRate: '10Hz',
      iso: '800',
      refreshStatus: 'active',
    },
    compute: {
      cpu: 45,
      gpu: 62,
      temp: 58,
      tops: 8,
    },
    balance: {
      gyroX: 0.02,
      gyroY: -0.01,
      gyroZ: 0.0,
      stability: 98.5,
      gaitEnabled: true,
      pathPlanning: 'active',
    },
    limb: {
      leftTorque: 42.2,
      rightTorque: 41.8,
      pressure: 'balanced',
      jointLimit: 'normal',
    },
  },
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setSelectedView: (view) => set({ selectedView: view }),
  setSelectedPart: (part) => set({ selectedPart: part }),
  updateParameters: (key, values) => set((state) => ({
    parameters: {
      ...state.parameters,
      [key]: { ...state.parameters[key], ...values },
    },
  })),
  appendCodeBlock: (code) => set((state) => ({
    codeBlocks: [...state.codeBlocks, code],
  })),
  addDroppedModule: (module) => set((state) => ({
    droppedModules: [...state.droppedModules, module],
  })),
}))

// 终端状态
export const useTerminalStore = create((set) => ({
  messages: [
    { id: 1, type: 'system', content: '系统初始化完成', time: '10:00:00' },
    { id: 2, type: 'info', content: '已连接 Spot-0729', time: '10:00:01' },
    { id: 3, type: 'success', content: '状态监控已启动', time: '10:00:02' },
  ],
  inputValue: '',
  selectedModel: 'ChatGPT',
  isThinking: false,
  isRecording: false,
  addMessage: (message) => set((state) => ({
    messages: [
      ...state.messages,
      {
        ...message,
        id: Date.now(),
        time: new Date().toLocaleTimeString('zh-CN'),
      },
    ],
  })),
  setInputValue: (value) => set({ inputValue: value }),
  setSelectedModel: (value) => set({ selectedModel: value }),
  setIsThinking: (value) => set({ isThinking: value }),
  setIsRecording: (value) => set({ isRecording: value }),
  clearMessages: () => set({ messages: [] }),
}))

// 技能市场状态
export const useMarketplaceStore = create((set) => ({
  selectedCategory: 'all',
  selectedSort: 'popular',
  searchQuery: '',
  installedSkills: ['nav-pro'],
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedSort: (sort) => set({ selectedSort: sort }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  installSkill: (skillId) => set((state) => ({
    installedSkills: state.installedSkills.includes(skillId)
      ? state.installedSkills
      : [...state.installedSkills, skillId],
  })),
  uninstallSkill: (skillId) => set((state) => ({
    installedSkills: state.installedSkills.filter((id) => id !== skillId),
  })),
}))

// 监控台状态
export const useDashboardStore = create((set) => ({
  selectedRobotId: 'Spot-0729',
  isEStopActive: false,
  isRemoteControl: false,
  logs: mockLogs,
  setSelectedRobotId: (id) => set({ selectedRobotId: id }),
  setIsEStopActive: (value) => set({ isEStopActive: value }),
  setIsRemoteControl: (value) => set({ isRemoteControl: value }),
  addLog: (log) => set((state) => ({
    logs: [
      ...state.logs,
      { ...log, time: new Date().toLocaleTimeString('zh-CN') },
    ].slice(-80),
  })),
  prependCriticalLogs: (entries) => set((state) => ({
    logs: [...entries, ...state.logs].slice(0, 80),
  })),
  clearLogs: () => set({ logs: [] }),
}))
