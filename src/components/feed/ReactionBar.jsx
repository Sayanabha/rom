import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { useAuth } from '../../context/AuthContext'

const REACTIONS = [
  { type: 'fire',  emoji: '🔥' },
  { type: 'heart', emoji: '❤️' },
  { type: 'laugh', emoji: '😂' },
  { type: 'wow',   emoji: '😮' },
  { type: 'sad',   emoji: '😢' },
]

export default function ReactionBar({ reactions = [], postId, onReact }) {
  const { user } = useAuth()
  const [showPicker, setShowPicker] = useState(false)

  const myReaction    = reactions.find(r => r.user_id === user?.id)
  const totalReactions = reactions.length

  const counts = REACTIONS.reduce((acc, { type }) => {
    acc[type] = reactions.filter(r => r.type === type).length
    return acc
  }, {})

  async function handleReact(type) {
    setShowPicker(false)
    await onReact(postId, type)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => setShowPicker(!showPicker)}
          className={clsx(
            'flex items-center gap-1.5 text-sm font-medium transition-all duration-200',
            myReaction ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'
          )}
        >
          <motion.span
            key={myReaction?.type ?? 'default'}
            initial={{ scale: 0.5, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="text-base"
          >
            {myReaction
              ? REACTIONS.find(r => r.type === myReaction.type)?.emoji
              : '🤍'
            }
          </motion.span>
          {totalReactions > 0 && (
            <motion.span
              key={totalReactions}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {totalReactions}
            </motion.span>
          )}
        </motion.button>

        {totalReactions > 0 && (
          <div className="flex items-center gap-0.5">
            {REACTIONS.filter(r => counts[r.type] > 0)
              .slice(0, 3)
              .map(r => (
                <span key={r.type} className="text-sm">{r.emoji}</span>
              ))
            }
          </div>
        )}
      </div>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="absolute bottom-9 left-0 bg-white rounded-2xl shadow-lg
                       border border-gray-100 p-2 flex gap-1 z-20"
          >
            {REACTIONS.map(({ type, emoji }, i) => (
              <motion.button
                key={type}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.3, y: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleReact(type)}
                className={clsx(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-xl',
                  'hover:bg-rose-50 transition-colors duration-150',
                  myReaction?.type === type && 'bg-rose-50'
                )}
              >
                {emoji}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}