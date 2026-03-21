import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronRight } from 'lucide-react'

export const text2btScrollbar =
  '[scrollbar-width:thin] [scrollbar-color:rgba(59,130,246,0.65)_rgba(255,255,255,0.04)] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-white/[0.04] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-[1px] [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-[#0b1220] [&::-webkit-scrollbar-thumb]:bg-[linear-gradient(180deg,rgba(96,165,250,0.85),rgba(59,130,246,0.55))] [&::-webkit-scrollbar-thumb:hover]:bg-[linear-gradient(180deg,rgba(125,211,252,0.9),rgba(59,130,246,0.8))] [&::-webkit-scrollbar-corner]:bg-transparent'

export function TreeNode({ node, active, dimmed, onSelect, onToggle, canToggle }) {
  const className = {
    sequence: 'border-primary/35 bg-primary/18 text-white shadow-[0_14px_28px_rgba(59,130,246,0.2)]',
    selector: 'border-accent-purple/30 bg-accent-purple/12 text-gray-100',
    condition: 'border-emerald-400/20 bg-emerald-400/8 text-emerald-100',
    action: 'border-white/10 bg-black/35 text-gray-200',
  }[node.type]

  const statusTone = {
    running: 'bg-primary',
    success: 'bg-emerald-400',
    ready: 'bg-white/40',
  }[node.status]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: dimmed ? 0.45 : 1, y: 0, scale: active ? 1.02 : 1 }}
      className={`rounded-2xl border px-4 py-3 text-sm backdrop-blur-sm transition-all ${className}`}
      onClick={() => onSelect(node)}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-1 h-2.5 w-2.5 rounded-full ${statusTone}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="truncate font-medium">{node.label}</div>
            <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-gray-400">
              {node.type}
            </div>
          </div>
          <div className="mt-1 text-xs text-gray-400">{node.status}</div>
        </div>
        {canToggle && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onToggle(node.id)
            }}
            className="rounded-full border border-white/10 bg-white/5 p-1 text-gray-300"
          >
            {node.collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </motion.div>
  )
}

export function TypingDots() {
  return (
    <div className="mt-3 flex gap-1.5">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          animate={{ y: [0, -4, 0], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.16 }}
          className="h-2 w-2 rounded-full bg-primary"
        />
      ))}
    </div>
  )
}

export function AnimatedNumber({ value, suffix }) {
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
