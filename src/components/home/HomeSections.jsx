import { motion } from 'framer-motion'
import { Mail, PhoneCall } from 'lucide-react'
import { Button, Card } from '../ui'
import {
  capabilities,
  consultTopics,
  partnershipTracks,
  pricingPlans,
  workflowStages,
} from './homeContent'

export function CapabilitiesSection() {
  return (
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
  )
}

export function WorkflowSection() {
  return (
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
  )
}

export function PricingSection() {
  return (
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
  )
}

export function PartnershipSection() {
  return (
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
  )
}

export function FinalCtaSection() {
  return (
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
  )
}
