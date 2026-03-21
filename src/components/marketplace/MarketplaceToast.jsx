import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export function MarketplaceToast({ toast }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="flex items-center gap-3 rounded-full border border-emerald-400/[0.18] bg-emerald-400/10 px-5 py-3 text-sm text-emerald-200 shadow-[0_14px_32px_rgba(16,185,129,0.16)]">
        <Check className="h-4 w-4" />
        {toast}
      </div>
    </motion.div>
  )
}
