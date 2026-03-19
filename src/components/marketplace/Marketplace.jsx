import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Download,
  Star,
  Cpu,
  X,
  Play,
  Check,
  CloudUpload,
  SlidersHorizontal,
  ShieldCheck,
  Layers3,
} from 'lucide-react'
import { useMarketplaceStore } from '../../store'
import { skillsData, categories } from '../../data/mock'
import { Card, Button, StatusBadge } from '../ui'

const sortOptions = [
  { id: 'popular', label: '最受欢迎' },
  { id: 'rating', label: '评分优先' },
  { id: 'latest', label: '最近更新' },
]

export function Marketplace() {
  const {
    selectedCategory,
    selectedSort,
    searchQuery,
    installedSkills,
    setSelectedCategory,
    setSelectedSort,
    setSearchQuery,
    installSkill,
  } = useMarketplaceStore()

  const [selectedSkill, setSelectedSkill] = useState(null)
  const [downloadingId, setDownloadingId] = useState(null)
  const [toast, setToast] = useState('')
  const installedCount = installedSkills.length

  const filteredSkills = useMemo(() => {
    const categoryFiltered = skillsData.filter((skill) => {
      const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !query ||
        skill.name.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query) ||
        skill.tags.some((tag) => tag.toLowerCase().includes(query))

      return matchesCategory && matchesSearch
    })

    const sorted = [...categoryFiltered]
    if (selectedSort === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating)
    } else if (selectedSort === 'latest') {
      sorted.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }))
    } else {
      sorted.sort((a, b) => b.downloads - a.downloads)
    }

    return sorted
  }, [searchQuery, selectedCategory, selectedSort])

  const handleDownload = (skillId) => {
    setDownloadingId(skillId)
    window.setTimeout(() => {
      installSkill(skillId)
      setDownloadingId(null)
      setToast('技能已同步至云端')
      window.setTimeout(() => setToast(''), 2400)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(5,8,13,0.96)_0%,rgba(5,5,5,1)_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(13,17,23,0.96),rgba(10,14,20,0.9))] p-6 shadow-[0_20px_60px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-primary/70">Marketplace</div>
              <h1 className="mt-3 text-3xl font-semibold text-white lg:text-4xl">
                AI 技能市场
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                把这里理解为机器人能力平台，而不是应用商店。每个技能都带着部署状态、兼容环境和能力边界进入研发流程。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="rounded-2xl p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-gray-500">上线技能</div>
                <div className="mt-2 text-2xl font-semibold text-white">523</div>
              </Card>
              <Card className="rounded-2xl p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-gray-500">已部署到环境</div>
                <div className="mt-2 text-2xl font-semibold text-white">{installedCount}</div>
              </Card>
              <Card className="rounded-2xl p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-gray-500">云端部署成功率</div>
                <div className="mt-2 text-2xl font-semibold text-white">98.4%</div>
              </Card>
            </div>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-gray-300">
              当前环境已连接 Studio、仿真验证和 Fleet OS，技能安装后会自动同步到统一工作流。
            </div>
            <div className="flex items-center justify-between rounded-[1.5rem] border border-emerald-400/15 bg-emerald-400/10 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">分发环境健康</div>
                  <div className="text-xs text-emerald-300">Studio / Edge / Fleet OS 已连接</div>
                </div>
              </div>
              <div className="rounded-full border border-emerald-400/20 px-3 py-1 text-xs text-emerald-300">Ready</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <Card className="h-fit rounded-[1.75rem] p-5">
            <div className="mb-5 flex items-center gap-2 text-sm font-medium text-white">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              分类筛选
            </div>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition-all ${
                    selectedCategory === category.id
                      ? 'border border-primary/35 bg-primary/15 text-white'
                      : 'border border-transparent bg-white/5 text-gray-400 hover:border-white/10 hover:text-white'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className="text-xs text-gray-500">
                    {category.id === 'all'
                      ? skillsData.length
                      : skillsData.filter((skill) => skill.category === category.id).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Layers3 className="h-4 w-4 text-primary" />
                平台分发能力
              </div>
              <div className="mt-3 text-sm leading-6 text-gray-400">
                点击获取技能后，页面会模拟部署延迟、同步提示与设备兼容状态，用于展示真实
                SaaS 工作流。
              </div>
            </div>
          </Card>

          <div>
            <Card className="mb-6 rounded-[1.75rem] p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="搜索技能、标签、作者或能力..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:border-primary/40 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedSort(option.id)}
                      className={`rounded-full px-4 py-2 text-sm transition-colors ${
                        selectedSort === option.id
                          ? 'bg-primary text-white'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-400">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">统一部署状态</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">兼容设备可见</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">支持仿真验证</span>
              </div>
            </Card>

            <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
              <span>共 {filteredSkills.length} 个技能</span>
              <span>安装后自动同步至 Studio 与 Fleet OS</span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredSkills.map((skill, index) => {
                const isInstalled = installedSkills.includes(skill.id)
                const isDownloading = downloadingId === skill.id

                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Card className="flex h-full flex-col rounded-[1.75rem] p-5" hover>
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                          <Cpu className="h-7 w-7" />
                        </div>
                        {isInstalled ? (
                          <StatusBadge status="normal">已部署</StatusBadge>
                        ) : (
                          <span className="text-xs text-gray-500">{skill.downloads.toLocaleString()} 安装</span>
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                          <p className="mt-2 text-sm leading-6 text-gray-400">{skill.description}</p>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-xs text-gray-300">
                          <Star className="h-3.5 w-3.5 fill-status-warning text-status-warning" />
                          {skill.rating}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {skill.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-2xl bg-white/5 p-3">
                          <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">输入 / 输出</div>
                          <div className="mt-1 text-white">{skill.inputs[0]} / {skill.outputs[0]}</div>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-3">
                          <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">兼容设备</div>
                          <div className="mt-1 text-white">{skill.devices.join(' / ')}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm">
                        <div>
                          <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">部署状态</div>
                          <div className="mt-1 text-white">{isInstalled ? '已同步至 Studio / Fleet OS' : '等待安装到工作流'}</div>
                        </div>
                        <div className="text-xs text-gray-400">v{skill.version}</div>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedSkill(skill)}>
                          详情
                        </Button>
                        <Button
                          variant={isInstalled ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => !isInstalled && handleDownload(skill.id)}
                          disabled={isInstalled || isDownloading}
                          className="rounded-full px-4"
                        >
                          {isDownloading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                              <CloudUpload className="h-4 w-4" />
                            </motion.div>
                          ) : isInstalled ? (
                            <>
                              <Check className="mr-1 h-4 w-4" />
                              已部署
                            </>
                          ) : (
                            <>
                              <Download className="mr-1 h-4 w-4" />
                              获取技能
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {selectedSkill && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
              onClick={() => setSelectedSkill(null)}
            >
              <motion.div
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                className="w-full max-w-3xl"
                onClick={(event) => event.stopPropagation()}
              >
                <Card className="rounded-[2rem] p-6">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/15 text-primary">
                        <Cpu className="h-8 w-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-white">{selectedSkill.name}</h2>
                        <p className="mt-1 text-sm text-gray-400">
                          版本 {selectedSkill.version} · {selectedSkill.author}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedSkill(null)}
                      className="rounded-full border border-white/10 p-2 text-gray-400 transition-colors hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-5">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <div className="text-sm font-medium text-white">核心能力</div>
                        <p className="mt-3 text-sm leading-6 text-gray-400">{selectedSkill.description}</p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                          <div className="mb-3 text-sm font-medium text-white">输入</div>
                          <div className="space-y-2 text-sm text-gray-400">
                            {selectedSkill.inputs.map((item) => (
                              <div key={item}>{item}</div>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                          <div className="mb-3 text-sm font-medium text-white">输出</div>
                          <div className="space-y-2 text-sm text-gray-400">
                            {selectedSkill.outputs.map((item) => (
                              <div key={item}>{item}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <div className="text-sm font-medium text-white">适用场景</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedSkill.scenes.map((scene) => (
                            <span
                              key={scene}
                              className="rounded-full bg-primary/15 px-3 py-1 text-sm text-primary"
                            >
                              {scene}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/50 p-5">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.18),transparent_40%)]" />
                        <div className="relative aspect-video rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-black">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <Play className="mx-auto h-14 w-14 text-primary" />
                              <div className="mt-3 text-sm text-gray-400">仿真演示占位</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 border-t border-white/10 pt-6">
                    <Button
                      variant="primary"
                      className="flex-1 rounded-full"
                      onClick={() => handleDownload(selectedSkill.id)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      获取技能
                    </Button>
                    <Button variant="secondary" className="flex-1 rounded-full">
                      <Play className="mr-2 h-4 w-4" />
                      仿真测试
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="fixed bottom-6 right-6 z-50"
            >
              <div className="flex items-center gap-3 rounded-full border border-emerald-400/25 bg-emerald-400/12 px-5 py-3 text-sm text-emerald-200 shadow-[0_16px_40px_rgba(16,185,129,0.2)]">
                <Check className="h-4 w-4" />
                {toast}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
