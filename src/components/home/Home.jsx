import { motion } from 'framer-motion'
import { ArrowRight, Play, Bot, Brain, Cloud, Monitor, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, Button } from '../ui'

const capabilities = [
  {
    icon: Brain,
    title: '自然语言生成控制逻辑',
    description: '用自然语言描述任务，AI 自动生成机器人控制程序',
  },
  {
    icon: Bot,
    title: '机器人AI 技能市场',
    description: '丰富的预训练技能库，快速集成导航、抓取、视觉等能力',
  },
  {
    icon: Cloud,
    title: '云端仿真测试',
    description: '在虚拟环境中验证机器人行为，降低实地测试成本',
  },
  {
    icon: Monitor,
    title: '多机监控与管理',
    description: '统一管理机器人机队，实时监控状态与任务执行',
  },
  {
    icon: Users,
    title: '多模态交互控制终端',
    description: '语音、手势、文本多种交互方式，灵活控制机器人',
  },
]

const stats = [
  { value: '10,000+', label: '在线机器人', suffix: '' },
  { value: '50M+', label: '训练数据规模', suffix: '' },
  { value: '200+', label: '预训练技能', suffix: '' },
  { value: '1M+', label: '任务执行次数', suffix: '' },
]

const scenes = [
  { title: '仓储巡检', desc: '自动化库存盘点与安全巡检' },
  { title: '家庭陪护', desc: '老人看护与日常生活辅助' },
  { title: '工业质检', desc: '精密零部件缺陷检测' },
  { title: '多机协同', desc: '复杂任务的多机器人协作' },
]

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero 首屏 */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* 背景渐变 */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 左侧内容 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-primary via-accent-purple to-accent-pink bg-clip-text text-transparent">
                  用自然语言
                </span>
                <br />
                <span className="text-white">构建机器人大脑</span>
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-lg">
                知肌纪平台提供机器人设计、预训练技能集成、仿真控制与实时监控能力，让机器人开发更简单
              </p>
              <div className="flex space-x-4">
                <Link to="/simulation">
                  <Button variant="primary" size="lg">
                    开始构建
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/simulation">
                  <Button variant="outline" size="lg">
                    <Play className="w-5 h-5 mr-2" />
                    查看演示
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* 右侧 AI 对话区 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <Card className="p-6 glow-border">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-status-danger" />
                  <div className="w-3 h-3 rounded-full bg-status-warning" />
                  <div className="w-3 h-3 rounded-full bg-status-success" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary text-sm">AI</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-sm text-gray-300">
                      你好！我是知肌纪 AI 助手。请描述你想让机器人执行的任务，我来帮你生成控制逻辑。
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 justify-end">
                    <div className="bg-primary/20 rounded-lg p-3 text-sm text-white">
                      让机器人在仓库中巡逻，发现异常时拍照并报警
                    </div>
                    <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center">
                      <span className="text-accent-purple text-sm">U</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary text-sm">AI</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-sm text-gray-300">
                      已理解任务！正在为你生成巡逻控制程序...
                      <br />
                      ✓ 导航路径规划
                      <br />
                      ✓ 异常检测配置
                      <br />
                      ✓ 拍照与报警联动
                    </div>
                  </div>
                </div>
              </Card>

              {/* 装饰元素 */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-purple/20 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 核心能力 */}
      <section className="py-24 bg-background-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">核心能力</h2>
            <p className="text-gray-400">一站式机器人开发与管理平台</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, index) => {
              const Icon = cap.icon
              return (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full hover" hover>
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{cap.title}</h3>
                    <p className="text-gray-400 text-sm">{cap.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 平台数据 */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 应用场景 */}
      <section className="py-24 bg-background-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">应用场景</h2>
            <p className="text-gray-400">覆盖多个行业的机器人解决方案</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {scenes.map((scene, index) => (
              <motion.div
                key={scene.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover" hover>
                  <h3 className="text-lg font-semibold text-white mb-2">{scene.title}</h3>
                  <p className="text-gray-400 text-sm">{scene.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
