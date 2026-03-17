import { motion } from 'framer-motion'
import { Card, StatusBadge } from '../ui'

const feeds = [
  { id: 'neck', name: '感知颈部', hud: 'Depth / Heat', tone: 'from-cyan-500/20 via-blue-500/10 to-transparent' },
  { id: 'top', name: '上帝视角', hud: 'SLAM / Mapping', tone: 'from-emerald-500/20 via-transparent to-transparent' },
  { id: 'gait', name: '步态分析', hud: 'Pose / Skeleton', tone: 'from-orange-500/20 via-transparent to-transparent' },
  { id: 'front', name: '正视', hud: 'FPV / Guide', tone: 'from-primary/20 via-transparent to-transparent' },
  { id: 'arm', name: '仰视操作', hud: 'Arm / Grip', tone: 'from-pink-500/20 via-transparent to-transparent' },
  { id: 'flow', name: '行走进尺', hud: 'Optical Flow', tone: 'from-violet-500/20 via-transparent to-transparent' },
]

const mobileFeeds = feeds.slice(0, 1)

function FeedTile({ feed, index, isEStopActive }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-[1.5rem] border border-white/10 bg-black">
      <div className={`absolute inset-0 bg-gradient-to-br ${feed.tone}`} />
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,0,0,0.32)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_75%_65%,rgba(255,255,255,0.08),transparent_22%)]" />
      {!isEStopActive && (
        <>
          <motion.div
            className="absolute left-0 right-0 h-px bg-primary/35"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 2.8 + index * 0.2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-y-0 w-px bg-cyan-300/30"
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 4.4 + index * 0.15, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}
      <div className="absolute inset-0 p-3">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-primary/90">{feed.name}</span>
          <span className={isEStopActive ? 'text-status-danger' : 'text-status-success'}>
            {isEStopActive ? 'PAUSED' : 'REC'}
          </span>
        </div>
        <div className="absolute right-3 top-10 rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[10px] font-mono text-gray-400">
          HUD {index + 1}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="mb-2 text-xs text-gray-400">{feed.hud}</div>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              {!isEStopActive && (
                <motion.div
                  className="h-full rounded-full bg-primary"
                  animate={{ width: ['18%', '76%', '42%'] }}
                  transition={{ duration: 3.2 + index * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </div>
            <span className="text-[11px] font-mono text-primary/80">SYNC</span>
          </div>
          <div className="flex justify-between text-[11px] font-mono text-gray-500">
            <span>ISO 800</span>
            <span>Latency 38ms</span>
            <span>FPS 60</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function VideoWall({ isEStopActive }) {
  return (
    <Card className="rounded-[2rem] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.28em] text-primary/70">Fleet OS</div>
          <h2 className="mt-2 text-2xl font-semibold text-white">沉浸式多路视频墙</h2>
        </div>
        <StatusBadge status={isEStopActive ? 'danger' : 'normal'}>
          {isEStopActive ? '信号冻结中' : '实时流传输中'}
        </StatusBadge>
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
