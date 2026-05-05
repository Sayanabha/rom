import { Sparkles, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SmartReplySuggestions({
  replies,
  loading,
  onSelect,
}) {
  if (!loading && replies.length === 0) return null

  return (
    <div className="px-4 py-2 border-t border-gray-100 bg-white">
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkles size={11} className="text-rose-400" />
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
          Smart replies
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-gray-300 py-1">
            <Loader2 size={12} className="animate-spin text-rose-300" />
            <span>Thinking of something good...</span>
          </div>
        ) : (
          <AnimatePresence>
            {replies.map((reply, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => onSelect(reply)}
                className="flex-shrink-0 bg-rose-50 hover:bg-rose-100
                           text-rose-600 text-xs font-medium px-3 py-2
                           rounded-2xl border border-rose-100
                           transition-all duration-200 active:scale-95
                           max-w-[180px] text-left leading-snug"
              >
                {reply}
              </motion.button>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}