import { motion } from 'framer-motion'
import { Check, Clock, X } from 'lucide-react'
import Avatar from '../ui/Avatar'
import clsx from 'clsx'

const OUTCOME_STYLES = {
  pending: {
    icon: Clock,
    color: 'text-amber-500',
    bg:   'bg-amber-50',
    label: 'Pending',
  },
  won: {
    icon: Check,
    color: 'text-emerald-500',
    bg:   'bg-emerald-50',
    label: 'Won',
  },
  lost: {
    icon: X,
    color: 'text-rose-500',
    bg:   'bg-rose-50',
    label: 'Lost',
  },
}

export default function PredictionCard({ prediction }) {
  const style  = OUTCOME_STYLES[prediction.outcome] ?? OUTCOME_STYLES.pending
  const Icon   = style.icon
  const options = typeof prediction.options === 'string'
    ? JSON.parse(prediction.options)
    : prediction.options

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-card p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Avatar
            src={prediction.target?.avatar_url}
            name={prediction.target?.username}
            size="xs"
          />
          <span className="text-xs font-semibold text-gray-500">
            {prediction.target?.username}
          </span>
        </div>
        <div className={clsx(
          'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
          style.bg, style.color
        )}>
          <Icon size={10} />
          {style.label}
        </div>
      </div>

      {/* Question */}
      <p className="text-sm font-semibold text-gray-900 mb-3">
        {prediction.question}
      </p>

      {/* Options */}
      {options && (
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {options.map((opt, i) => (
            <div
              key={i}
              className={clsx(
                'text-xs px-3 py-2 rounded-xl font-medium transition-all',
                prediction.answer === opt
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-50 text-gray-400'
              )}
            >
              {opt}
            </div>
          ))}
        </div>
      )}

      {/* Points */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <span className="text-xs text-gray-400">
          {new Date(prediction.created_at).toLocaleDateString()}
        </span>
        <span className="text-xs font-bold text-amber-500">
          +{prediction.points_wagered * 2} pts
        </span>
      </div>
    </motion.div>
  )
}