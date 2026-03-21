import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  MessageSquareText,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Card } from '../ui'
import {
  aiMessage,
  chatHighlights,
  kpiTargets,
  orchestrationSteps,
  promptText,
} from './homeContent'
import { AnimatedNumber, TypingDots } from './homeShared'

export function HomeHeroSection() {
  const [typedPromptLength, setTypedPromptLength] = useState(0)
  const [typedAiLength, setTypedAiLength] = useState(0)
  const typedPrompt = useMemo(() => promptText.slice(0, typedPromptLength), [typedPromptLength])
  const typedAi = useMemo(() => aiMessage.slice(0, typedAiLength), [typedAiLength])

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

  return (
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
  )
}
