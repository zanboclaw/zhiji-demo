import { create } from 'zustand'

// 机器人状态
export const useRobotStore = create((set) => ({
  selectedRobot: {
    id: 'Spot-0729',
    model: 'Spot Pro',
    station: '#B-12',
    status: 'normal', // normal, warning, danger
    battery: 70,
    signal: 'strong',
    role: 'operator',
  },
  setRobotStatus: (status) => set((state) => ({
    selectedRobot: { ...state.selectedRobot, status }
  })),
  setBattery: (battery) => set((state) => ({
    selectedRobot: { ...state.selectedRobot, battery }
  })),
}))

// 仿真工作室状态
export const useSimulationStore = create((set) => ({
  selectedTool: 'select', // select, move, rotate, scale
  selectedView: 'front', // front, side, top
  selectedPart: null, // null, head, shoulder, arm, hip, knee, foot
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
      gyroZ: 0.00,
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
      [key]: { ...state.parameters[key], ...values }
    }
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
  isThinking: false,
  isRecording: false,
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, { ...message, id: Date.now(), time: new Date().toLocaleTimeString('zh-CN') }]
  })),
  setInputValue: (value) => set({ inputValue: value }),
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
    installedSkills: [...state.installedSkills, skillId]
  })),
  uninstallSkill: (skillId) => set((state) => ({
    installedSkills: state.installedSkills.filter(id => id !== skillId)
  })),
}))

// 监控台状态
export const useDashboardStore = create((set) => ({
  selectedRobotId: 'Spot-0729',
  isEStopActive: false,
  isRemoteControl: false,
  logs: [
    { time: '10:00:00', level: 'info', message: '系统启动' },
    { time: '10:00:01', level: 'success', message: '连接建立' },
    { time: '10:00:02', level: 'info', message: '状态正常' },
  ],
  setSelectedRobotId: (id) => set({ selectedRobotId: id }),
  setIsEStopActive: (value) => set({ isEStopActive: value }),
  setIsRemoteControl: (value) => set({ isRemoteControl: value }),
  addLog: (log) => set((state) => ({
    logs: [...state.logs, { ...log, time: new Date().toLocaleTimeString('zh-CN') }].slice(-50)
  })),
}))
