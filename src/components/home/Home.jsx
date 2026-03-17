import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bot,
  Brain,
  Cloud,
  Monitor,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, Button } from '../ui'
import heroImage from '../../assets/hero.png'

const capabilities = [
  {
    icon: Brain,
    title: 'VLA-Compiler 编排行为',
    description: '把自然语言、视觉意图和动作约束编译为可执行行为树。',
  },
  {
    icon: Bot,
    title: '开放技能生态',
    description: '用技能市场把导航、抓取、巡检等能力快速部署到不同硬件。',
  },
  {
    icon: Cloud,
    title: '数字孪生仿真',
    description: '先在云端画布里验证，再推送到实体机器人，显著降低试错成本。',
  },
  {
    icon: Monitor,
    title: '机队实时控制台',
    description: '以 OS 视角统一监控机器人状态、遥测指标和紧急控制动作。',
  },
  {
    icon: ShieldCheck,
    title: '物理世界安全阈值',
    description: '当执行置信度不足时主动降级、暂停并请求人工接管。',
  },
]

const kpiTargets = [
  { label: '在线机器人', value: 42, suffix: '' },
  { label: '训练数据', value: 12.8, suffix: 'TB' },
  { label: '技能数量', value: 523, suffix: '' },
]

const productPillars = [
  { title: 'Core', desc: '多模态行为编译引擎', accent: 'from-primary to-cyan-400' },
  { title: 'Studio', desc: '协作开发 IDE 与仿真工作室', accent: 'from-accent-purple to-pink-400' },
  { title: 'Edge', desc: '边缘轻量化推理节点', accent: 'from-emerald-400 to-primary' },
  { title: 'Protocol', desc: '跨硬件通用行为协议层', accent: 'from-orange-400 to-accent-pink' },
]

const promptText = '设计一个具备视觉避障功能的巡检机器人'
const responseLines = [
  '已生成 Spot-0729 的巡检任务编排。',
  '融合视觉避障、动态重规划与异常上报策略。',
  '预计编译延迟 640ms，可直接进入仿真验证。',
]
const codeSnippet = [
  'from robotfigma.compiler import compile_task',
  '',
  'task = compile_task(',
  '    robot="Spot-0729",',
  '    instruction="巡检并避障，异常时拍照告警",',
  '    sensors=["rgbd_camera", "lidar"],',
  '    policy="inspection_guard_v2",',
  ')',
  '',
  'task.deploy(target="studio://simulation")',
].join('\n')

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
  const [typedCodeLength, setTypedCodeLength] = useState(0)
  const typedPrompt = useMemo(
    () => promptText.slice(0, typedPromptLength),
    [typedPromptLength],
  )
  const typedCode = useMemo(
    () => codeSnippet.slice(0, typedCodeLength),
    [typedCodeLength],
    )

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

    const codeTimer = window.setInterval(() => {
      setTypedCodeLength((current) => {
        if (current >= codeSnippet.length) {
          window.clearInterval(codeTimer)
          return current
        }
        return current + 3
      })
    }, 22)

    return () => window.clearInterval(codeTimer)
  }, [typedPromptLength])

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.16),transparent_22%),linear-gradient(180deg,#06080d_0%,#04070c_54%,#050505_100%)]" />
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
                className="max-w-3xl text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-7xl"
              >
                把自然语言
                <span className="block bg-gradient-to-r from-primary via-cyan-300 to-accent-pink bg-clip-text text-transparent">
                  编译成机器人行为
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.12 }}
                className="mt-5 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg"
              >
                知肌纪是面向具身智能时代的 Robot Figma。我们把 VLA 编译、技能部署、
                数字孪生仿真和机队控制台收敛到一个高保真工作流里，帮助团队把两周的开发
                缩短到两小时的验证与发布。
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

              <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-3">
                {kpiTargets.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Card className="rounded-3xl border-white/8 p-5 sm:p-6">
                      <div className="text-3xl font-semibold text-white">
                        <AnimatedNumber value={item.value} suffix={item.suffix} />
                      </div>
                      <div className="mt-2 text-sm text-gray-400">{item.label}</div>
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

                <div className="grid gap-0 lg:grid-cols-[minmax(220px,0.34fr)_minmax(0,0.66fr)]">
                  <div className="border-b border-white/10 p-4 sm:p-6 lg:border-b-0 lg:border-r">
                    <div className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-500">
                      Prompt
                    </div>
                    <div className="rounded-2xl border border-primary/15 bg-primary/10 p-4 text-sm text-primary">
                      {typedPrompt}
                      <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-primary align-middle" />
                    </div>

                    <div className="mt-5 space-y-3">
                      {responseLines.map((line, index) => (
                        <motion.div
                          key={line}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: typedPromptLength === promptText.length ? 1 : 0,
                            y: typedPromptLength === promptText.length ? 0 : 10,
                          }}
                          transition={{ delay: index * 0.12 + 0.1 }}
                          className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm leading-6 text-gray-300"
                        >
                          {line}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="relative overflow-hidden p-4 sm:p-6">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_35%)]" />
                    <motion.div
                      animate={{
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.04, 1],
                      }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-x-6 top-1/3 h-28 rounded-full bg-cyan-400/10 blur-3xl sm:inset-x-10"
                    />

                    <div className="relative mb-5 overflow-hidden rounded-[2rem] border border-primary/20 bg-[linear-gradient(180deg,rgba(10,16,28,0.95)_0%,rgba(7,12,22,0.72)_100%)] p-4 sm:mb-6 sm:rounded-[2.3rem] sm:p-5">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_34%)]" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-1/2 top-1/2 h-[min(34vw,15rem)] w-[min(34vw,15rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/20 lg:h-[min(24vw,18rem)] lg:w-[min(24vw,18rem)]"
                      />
                      <motion.div
                        animate={{ y: ['-8%', '10%', '-8%'] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-x-8 top-1/2 h-20 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-2xl"
                      />

                      <div className="relative grid items-start gap-4 sm:gap-5 md:grid-cols-[minmax(0,1.08fr)_minmax(180px,0.62fr)] lg:grid-cols-[minmax(0,1.08fr)_minmax(210px,0.58fr)]">
                        <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(145deg,rgba(13,20,34,0.92),rgba(8,13,23,0.68))]">
                          <img
                            src={heroImage}
                            alt="知肌纪机器人视觉主图"
                            className="aspect-[4/3] w-full object-cover object-center"
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,13,0.05)_0%,rgba(6,8,13,0.32)_100%)]" />
                          <div className="absolute left-4 top-4 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-emerald-300">
                            Studio Preview
                          </div>
                          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                            <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-sm">
                              <div className="text-[11px] uppercase tracking-[0.26em] text-gray-400">Vision Lock</div>
                              <div className="mt-1 text-sm font-medium text-white">Obstacle-Aware Patrol</div>
                            </div>
                            <div className="hidden rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-right backdrop-blur-sm sm:block">
                              <div className="text-[11px] uppercase tracking-[0.24em] text-primary/80">Compile</div>
                              <div className="mt-1 text-lg font-semibold text-white">640ms</div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                          <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                            <div className="text-[11px] uppercase tracking-[0.24em] text-gray-500">Devices</div>
                            <div className="mt-2 text-sm font-medium text-white">Spot / Atlas</div>
                          </div>
                          <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                            <div className="text-[11px] uppercase tracking-[0.24em] text-gray-500">Policy</div>
                            <div className="mt-2 text-sm font-medium text-white">inspection_guard_v2</div>
                          </div>
                          <div className="col-span-2 rounded-[1.25rem] border border-white/10 bg-white/5 p-4 lg:col-span-1">
                            <div className="text-[11px] uppercase tracking-[0.24em] text-gray-500">Signals</div>
                            <div className="mt-3 flex gap-2">
                              <span className="h-2.5 w-2.5 rounded-full bg-status-success" />
                              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                              <span className="h-2.5 w-2.5 rounded-full bg-accent-pink" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0 rounded-[1.5rem] border border-white/10 bg-black/40 p-4">
                        <div className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-500">
                          Generated Code
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-white/8 bg-slate-950/90">
                          <div className="flex items-center gap-2 border-b border-white/8 px-3 py-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-status-danger/90" />
                            <span className="h-2.5 w-2.5 rounded-full bg-status-warning/90" />
                            <span className="h-2.5 w-2.5 rounded-full bg-status-success/90" />
                            <span className="ml-auto text-[10px] uppercase tracking-[0.24em] text-gray-500">
                              policy.py
                            </span>
                          </div>
                          <pre className="overflow-x-auto whitespace-pre-wrap break-all px-3 py-3 text-[11px] leading-6 text-cyan-100 sm:text-xs">
                            <code>{typedCode}</code>
                          </pre>
                        </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/6 bg-background-secondary/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-primary/70">Product Matrix</div>
              <h2 className="mt-3 text-3xl font-semibold text-white lg:text-4xl">
                把融资叙事里的产品矩阵真正可视化
              </h2>
            </div>
            <p className="max-w-2xl text-gray-400">
              Business Plan 里的 Core、Studio、Edge、Protocol 在站点中对应为可理解、可点击、
              可演示的界面能力，而不是抽象名词。
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {productPillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="h-full rounded-[1.75rem] p-6" hover>
                  <div className={`mb-5 inline-flex rounded-full bg-gradient-to-r px-4 py-1 text-sm font-medium text-white ${pillar.accent}`}>
                    {pillar.title}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{pillar.desc}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    围绕开发者工作流设计页面和反馈，让产品故事、技术壁垒与演示动作保持一致。
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="text-sm uppercase tracking-[0.3em] text-primary/70">Capabilities</div>
            <h2 className="mt-3 text-3xl font-semibold text-white lg:text-4xl">一站式具身智能开发平台</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{capability.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-400">{capability.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
