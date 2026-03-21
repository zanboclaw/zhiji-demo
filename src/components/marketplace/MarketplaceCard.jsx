import { motion } from 'framer-motion'
import { Cpu, Star, Download, Check, CloudUpload } from 'lucide-react'
import { Button, Card } from '../ui'

export function MarketplaceCard({
  skill,
  index,
  isInstalled,
  isDownloading,
  onShowDetails,
  onDownload,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card className="group relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border-white/8 bg-[linear-gradient(180deg,rgba(18,24,33,0.96),rgba(13,18,26,0.94))] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/14 hover:shadow-[0_20px_44px_rgba(2,6,23,0.24)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.08),transparent_24%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-primary/[0.14] bg-primary/[0.11] text-primary">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.22em] text-gray-500">{skill.author}</div>
              <div className="mt-2 text-xs text-gray-500">版本 {skill.version}</div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-[11px] font-medium ${
                isInstalled
                  ? 'border-emerald-400/[0.18] bg-emerald-400/10 text-emerald-300'
                  : 'border-white/8 bg-white/[0.03] text-gray-400'
              }`}
            >
              {isInstalled ? '已部署' : '待安装'}
            </span>
            <div className="flex items-center gap-1 rounded-full bg-white/[0.03] px-2.5 py-1 text-xs text-gray-300">
              <Star className="h-3.5 w-3.5 fill-status-warning text-status-warning" />
              {skill.rating}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-[1.35rem] font-semibold tracking-tight text-white">{skill.name}</h3>
              <p className="mt-2 min-h-[3rem] text-sm leading-6 text-gray-400">{skill.description}</p>
            </div>

            <div className="shrink-0 text-right">
              <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">安装量</div>
              <div className="mt-1 text-sm font-medium text-gray-300">{skill.downloads.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {skill.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-xs text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 grid gap-4 border-t border-white/8 pt-4 text-sm xl:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">部署状态</div>
            <div className="mt-2 text-sm text-white">
              {isInstalled ? '已同步至 Studio / Fleet OS' : '安装后自动接入平台工作流'}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              输入 {skill.inputs[0]} · 输出 {skill.outputs[0]}
            </div>
          </div>
          <div className="xl:text-right">
            <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">兼容设备</div>
            <div className="mt-2 text-sm text-gray-300">{skill.devices.join(' / ')}</div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/8 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShowDetails(skill)}
            className="px-0 text-gray-400 hover:bg-transparent hover:text-white"
          >
            详情
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => !isInstalled && onDownload(skill.id)}
            disabled={isInstalled || isDownloading}
            className={`rounded-full px-4 shadow-none ${
              isInstalled
                ? 'border border-white/10 bg-white/[0.04] text-gray-300'
                : 'border border-primary/[0.18] bg-primary/[0.12] text-white hover:bg-primary/[0.18] hover:border-primary/[0.28]'
            }`}
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
}
