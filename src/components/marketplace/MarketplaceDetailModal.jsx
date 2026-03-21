import { motion } from 'framer-motion'
import { X, Play, Download, Cpu } from 'lucide-react'
import { Button, Card } from '../ui'

export function MarketplaceDetailModal({ selectedSkill, onClose, onDownload }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="w-full max-w-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <Card className="rounded-[2rem] border-white/8 bg-[linear-gradient(180deg,rgba(16,21,29,0.96),rgba(12,17,24,0.94))] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.35)]">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-primary/[0.14] bg-primary/[0.11] text-primary">
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
              onClick={onClose}
              className="rounded-full border border-white/10 p-2 text-gray-400 transition-colors hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-5">
                <div className="text-sm font-medium text-white">核心能力</div>
                <p className="mt-3 text-sm leading-6 text-gray-400">{selectedSkill.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-5">
                  <div className="mb-3 text-sm font-medium text-white">输入</div>
                  <div className="space-y-2 text-sm text-gray-400">
                    {selectedSkill.inputs.map((item) => (
                      <div key={item}>{item}</div>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-5">
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
              <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-5">
                <div className="text-sm font-medium text-white">适用场景</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedSkill.scenes.map((scene) => (
                    <span
                      key={scene}
                      className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-sm text-gray-300"
                    >
                      {scene}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-black/40 p-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(249,115,22,0.10),transparent_42%)]" />
                <div className="relative aspect-video rounded-2xl border border-white/8 bg-gradient-to-br from-slate-900 to-black">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="mx-auto h-14 w-14 text-primary/85" />
                      <div className="mt-3 text-sm text-gray-400">仿真演示占位</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 border-t border-white/8 pt-6">
            <Button
              variant="secondary"
              className="flex-1 rounded-full border border-primary/[0.18] bg-primary/[0.12] text-white shadow-none hover:bg-primary/[0.18]"
              onClick={() => onDownload(selectedSkill.id)}
            >
              <Download className="mr-2 h-4 w-4" />
              获取技能
            </Button>
            <Button variant="secondary" className="flex-1 rounded-full border border-white/10 bg-white/[0.04] shadow-none">
              <Play className="mr-2 h-4 w-4" />
              仿真测试
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
