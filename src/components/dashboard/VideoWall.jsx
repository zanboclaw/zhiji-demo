import { motion } from 'framer-motion'
import { Card } from '../ui'

const feeds = [
  { id: 'neck', name: '感知颈部', hud: 'Depth / Heat', tone: 'from-cyan-400/10 via-transparent to-transparent', accent: 'bg-cyan-300/55' },
  { id: 'top', name: '上帝视角', hud: 'SLAM / Mapping', tone: 'from-emerald-400/10 via-transparent to-transparent', accent: 'bg-emerald-300/55' },
  { id: 'gait', name: '步态分析', hud: 'Pose / Skeleton', tone: 'from-amber-400/10 via-transparent to-transparent', accent: 'bg-amber-300/55' },
  { id: 'front', name: '正视', hud: 'FPV / Guide', tone: 'from-primary/10 via-transparent to-transparent', accent: 'bg-primary/55' },
  { id: 'arm', name: '仰视操作', hud: 'Arm / Grip', tone: 'from-rose-400/10 via-transparent to-transparent', accent: 'bg-rose-300/50' },
  { id: 'flow', name: '行走进尺', hud: 'Optical Flow', tone: 'from-violet-400/10 via-transparent to-transparent', accent: 'bg-violet-300/50' },
]

const mobileFeeds = feeds.slice(0, 1)

function FeedTile({ feed, index, isEStopActive }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-[1.4rem] border border-white/8 bg-[linear-gradient(180deg,#0b1016,#090d13)]">
      <div className={`absolute inset-0 bg-gradient-to-br ${feed.tone}`} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.01),rgba(0,0,0,0.42))]" />
      <div className="absolute inset-x-4 top-4 h-px bg-white/[0.08]" />

      {!isEStopActive && (
        <motion.div
          className={`absolute inset-x-4 top-4 h-px ${feed.accent}`}
          animate={{ opacity: [0.2, 0.85, 0.2] }}
          transition={{ duration: 2.6 + index * 0.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="absolute inset-0 p-3.5">
        <div className="flex items-start justify-between text-xs font-mono">
          <div>
            <div className="text-white">{feed.name}</div>
            <div className="mt-1 text-[11px] text-gray-500">{feed.hud}</div>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] ${
              isEStopActive
                ? 'border-status-danger/20 bg-status-danger/10 text-status-danger'
                : 'border-status-success/16 bg-status-success/10 text-status-success'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isEStopActive ? 'bg-status-danger' : 'bg-status-success'}`} />
            {isEStopActive ? 'PAUSED' : 'LIVE'}
          </span>
        </div>

        <div className="absolute bottom-3.5 left-3.5 right-3.5">
          {!isEStopActive && (
            <div className="mb-3 h-[3px] overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className={`h-full rounded-full ${feed.accent}`}
                animate={{ width: ['24%', '68%', '42%'] }}
                transition={{ duration: 3.4 + index * 0.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-gray-500">
            <span>ISO 800</span>
            <span className="text-center">38ms</span>
            <span className="text-right">FPS 60</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function VideoWall({ isEStopActive }) {
  return (
    <Card className="rounded-[1.9rem] border-white/8 bg-[rgba(13,18,25,0.9)] p-4 shadow-[0_16px_38px_rgba(2,6,23,0.2)]">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-gray-500">Vision Grid</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">多路视频监控矩阵</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">6 路在线</span>
          <span
            className={`rounded-full border px-3 py-1.5 ${
              isEStopActive
                ? 'border-status-danger/20 bg-status-danger/10 text-status-danger'
                : 'border-status-success/16 bg-status-success/10 text-status-success'
            }`}
          >
            {isEStopActive ? '流已冻结' : '实时传输中'}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:hidden">
        {mobileFeeds.map((feed, index) => (
          <FeedTile key={feed.id} feed={feed} index={index} isEStopActive={isEStopActive} />
        ))}
      </div>

      <div className="hidden gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-3">
        {feeds.map((feed, index) => (
          <FeedTile key={feed.id} feed={feed} index={index} isEStopActive={isEStopActive} />
        ))}
      </div>
    </Card>
  )
}
