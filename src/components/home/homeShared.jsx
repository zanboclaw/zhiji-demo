import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronRight } from 'lucide-react'

export const text2btScrollbar =
  '[scrollbar-width:thin] [scrollbar-color:rgba(59,130,246,0.65)_rgba(255,255,255,0.04)] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-white/[0.04] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-[1px] [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-[#0b1220] [&::-webkit-scrollbar-thumb]:bg-[linear-gradient(180deg,rgba(96,165,250,0.85),rgba(59,130,246,0.55))] [&::-webkit-scrollbar-thumb:hover]:bg-[linear-gradient(180deg,rgba(125,211,252,0.9),rgba(59,130,246,0.8))] [&::-webkit-scrollbar-corner]:bg-transparent'

const TEXT2BT_STYLE_ID = 'text2bt-left-console-compact-styles'
const TEXT2BT_OBSERVER_KEY = '__text2btLeftCompactObserver'

const text2btCompactStyles = `
@media (min-width: 1024px) {
  [data-text2bt-left-pane] {
    padding: 1.15rem !important;
  }

  [data-text2bt-left-header] {
    margin-bottom: 0.9rem !important;
  }

  [data-text2bt-left-header] > div:first-child {
    align-items: flex-start !important;
    gap: 0.75rem !important;
  }

  [data-text2bt-left-header] .h-10.w-10 {
    height: 2.25rem !important;
    width: 2.25rem !important;
    border-radius: 1rem !important;
  }

  [data-text2bt-left-header] .text-lg {
    font-size: 1rem !important;
    line-height: 1.35rem !important;
  }

  [data-text2bt-left-header] .text-sm {
    font-size: 0.75rem !important;
    line-height: 1rem !important;
  }

  [data-text2bt-scenarios] {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.65rem !important;
  }

  [data-text2bt-scenarios] > * {
    padding: 0.8rem !important;
    border-radius: 1rem !important;
  }

  [data-text2bt-scenarios] > * > div {
    gap: 0.7rem !important;
  }

  [data-text2bt-scenarios] > * .h-10.w-10 {
    height: 2rem !important;
    width: 2rem !important;
    border-radius: 0.85rem !important;
  }

  [data-text2bt-scenarios] > * .text-lg {
    font-size: 0.92rem !important;
    line-height: 1.2rem !important;
  }

  [data-text2bt-scenarios] > * .text-sm {
    display: -webkit-box !important;
    overflow: hidden !important;
    font-size: 0.72rem !important;
    line-height: 1.05rem !important;
    -webkit-box-orient: vertical !important;
    -webkit-line-clamp: 2 !important;
  }

  [data-text2bt-console] {
    display: grid !important;
    grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
    gap: 0.75rem !important;
    margin-top: 0.95rem !important;
    padding: 0.85rem !important;
    border-radius: 1.15rem !important;
  }

  [data-text2bt-console] > :first-child {
    grid-column: 1 / -1 !important;
    margin-bottom: 0 !important;
  }

  [data-text2bt-console-header] .text-sm {
    font-size: 0.9rem !important;
    line-height: 1.2rem !important;
  }

  [data-text2bt-console-header] .text-xs {
    font-size: 0.68rem !important;
    line-height: 0.95rem !important;
  }

  [data-text2bt-console-header] .rounded-full {
    padding: 0.45rem 0.7rem !important;
    font-size: 0.625rem !important;
  }

  [data-text2bt-conversation] {
    grid-column: 1 !important;
    margin-top: 0 !important;
    min-height: 0 !important;
    padding: 0.8rem !important;
    border-radius: 1rem !important;
  }

  [data-text2bt-conversation] > .mt-4 {
    margin-top: 0.75rem !important;
  }

  [data-text2bt-conversation] > .mt-4 > * > * {
    max-width: 100% !important;
    padding: 0.72rem 0.85rem !important;
    font-size: 0.78rem !important;
    line-height: 1.35rem !important;
    border-radius: 0.95rem !important;
  }

  [data-text2bt-conversation] > .mt-5 {
    margin-top: 0.75rem !important;
    gap: 0.45rem !important;
  }

  [data-text2bt-conversation] > .mt-5 > * {
    padding: 0.38rem 0.65rem !important;
    font-size: 0.68rem !important;
  }

  [data-text2bt-controls] {
    display: flex !important;
    flex-direction: column !important;
    grid-column: 2 !important;
    margin-top: 0 !important;
    padding: 0.8rem !important;
    border-radius: 1rem !important;
    min-height: 100% !important;
  }

  [data-text2bt-task-block] {
    margin-bottom: 0 !important;
  }

  [data-text2bt-task-block] > label {
    font-size: 0.65rem !important;
    letter-spacing: 0.18em !important;
  }

  [data-text2bt-task-block] > textarea {
    margin-top: 0.7rem !important;
    min-height: 5.2rem !important;
    padding: 0.75rem 0.85rem !important;
    border-radius: 0.9rem !important;
    font-size: 0.8rem !important;
    line-height: 1.45rem !important;
  }

  [data-text2bt-process-label] {
    margin-top: 0.75rem !important;
    font-size: 0.65rem !important;
    letter-spacing: 0.18em !important;
  }

  [data-text2bt-process="steps"] {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem !important;
    margin-top: 0.65rem !important;
  }

  [data-text2bt-process="steps"] > * {
    display: flex !important;
    min-height: 4.6rem !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 0.55rem !important;
    padding: 0.65rem !important;
    border-radius: 0.95rem !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    background: rgba(255,255,255,0.02) !important;
  }

  [data-text2bt-process="steps"] > * > span:first-child {
    height: 1.35rem !important;
    width: 1.35rem !important;
    font-size: 0.65rem !important;
  }

  [data-text2bt-process="steps"] > * > span:last-child {
    font-size: 0.72rem !important;
    line-height: 1.08rem !important;
  }

  [data-text2bt-process="placeholder"] {
    margin-top: 0.65rem !important;
    padding: 0.7rem 0.8rem !important;
    border-radius: 0.95rem !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    background: rgba(255,255,255,0.02) !important;
    font-size: 0.75rem !important;
    line-height: 1.25rem !important;
  }

  [data-text2bt-actions] {
    grid-column: 1 / -1 !important;
    margin-top: 0 !important;
    justify-content: flex-end !important;
  }

  [data-text2bt-actions] .rounded-full {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }

  [data-text2bt-actions] .rounded-full svg {
    height: 0.95rem !important;
    width: 0.95rem !important;
  }
}
`

function injectText2btCompactStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(TEXT2BT_STYLE_ID)) return

  const style = document.createElement('style')
  style.id = TEXT2BT_STYLE_ID
  style.textContent = text2btCompactStyles
  document.head.appendChild(style)
}

function annotateText2btCompactLayout() {
  if (typeof document === 'undefined') return

  const section = document.querySelector('[data-testid="text2bt-section"]')
  const textarea = section?.querySelector('#text2bt-input')
  if (!section || !textarea) return

  const controlsCard = textarea.parentElement?.parentElement
  const leftConsole = controlsCard?.parentElement
  const scenarioList = leftConsole?.previousElementSibling
  const leftHeader = scenarioList?.previousElementSibling
  const leftPane = leftConsole?.parentElement

  if (!leftPane || !leftHeader || !scenarioList || !leftConsole || !controlsCard) return

  leftPane.setAttribute('data-text2bt-left-pane', '')
  leftHeader.setAttribute('data-text2bt-left-header', '')
  scenarioList.setAttribute('data-text2bt-scenarios', '')
  leftConsole.setAttribute('data-text2bt-console', '')

  const consoleHeader = leftConsole.children[0]
  const conversationCard = leftConsole.children[1]
  const actionsRow = leftConsole.children[3]
  const taskBlock = controlsCard.children[0]
  const processLabel = controlsCard.children[1]
  const processBlock = controlsCard.children[2]

  consoleHeader?.setAttribute('data-text2bt-console-header', '')
  conversationCard?.setAttribute('data-text2bt-conversation', '')
  controlsCard.setAttribute('data-text2bt-controls', '')
  taskBlock?.setAttribute('data-text2bt-task-block', '')
  processLabel?.setAttribute('data-text2bt-process-label', '')
  actionsRow?.setAttribute('data-text2bt-actions', '')

  if (!processBlock) return

  if (processBlock.children.length > 0) {
    processBlock.setAttribute('data-text2bt-process', 'steps')
  } else {
    processBlock.setAttribute('data-text2bt-process', 'placeholder')
  }
}

function bootstrapText2btCompactLayout() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  injectText2btCompactStyles()

  let pending = false
  const queueAnnotate = () => {
    if (pending) return
    pending = true
    window.requestAnimationFrame(() => {
      pending = false
      annotateText2btCompactLayout()
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', queueAnnotate, { once: true })
  } else {
    queueAnnotate()
  }

  const existingObserver = window[TEXT2BT_OBSERVER_KEY]
  if (existingObserver) {
    existingObserver.disconnect()
  }

  const observer = new MutationObserver(queueAnnotate)
  observer.observe(document.documentElement, { childList: true, subtree: true })
  window[TEXT2BT_OBSERVER_KEY] = observer
}

bootstrapText2btCompactLayout()

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
