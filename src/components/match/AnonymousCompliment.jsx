import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Loader2, X, Sparkles } from 'lucide-react'
import { complimentService } from '../../services/compliment.service'
import { useAuth } from '../../context/AuthContext'
import { useMatches } from '../../hooks/useMatches'
import Avatar from '../ui/Avatar'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const COMPLIMENT_TEMPLATES = [
  "Your energy is genuinely contagious.",
  "Something about the way you express yourself is really attractive.",
  "Your posts always make me stop scrolling.",
  "You seem like someone who makes rooms better just by being in them.",
  "I find myself thinking about something you said.",
  "You have a rare kind of confidence that isn't loud.",
  "The way you write tells me you actually feel things deeply.",
  "I think you're more interesting than you realize.",
]

export default function AnonymousCompliment({ onClose }) {
  const { user } = useAuth()
  const { matches } = useMatches()
  const [selected, setSelected]     = useState(null)
  const [custom, setCustom]         = useState('')
  const [target, setTarget]         = useState(null)
  const [sending, setSending]       = useState(false)
  const [sent, setSent]             = useState(false)

  const targets = matches.map(m =>
    m.user1_id === user?.id ? m.user2 : m.user1
  ).filter(Boolean)

  const message = custom.trim() || selected

  async function handleSend() {
    if (!message || !target) return
    setSending(true)
    try {
      await complimentService.sendCompliment({
        senderId:   user.id,
        receiverId: target.id,
        message,
      })
      setSent(true)
      // Award points for being sweet
      toast.success('+15 reputation points for spreading good vibes.')
    } catch {
      toast.error('Could not send compliment.')
    } finally {
      setSending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
                 flex items-end max-w-md mx-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 300 }}
        animate={{ y: 0 }}
        exit={{ y: 300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full bg-white rounded-t-4xl p-6 pb-10 max-h-[85vh] overflow-y-auto"
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        <button onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl hover:bg-gray-100 text-gray-400">
          <X size={18} />
        </button>

        {sent ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-center py-8"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: 2 }}
              className="text-6xl mb-4"
            >
              💌
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Sent anonymously
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              {target?.username} just got a mystery compliment.
              They have no idea it was you.
            </p>
            <button onClick={onClose} className="btn-primary px-8">
              Stay mysterious
            </button>
          </motion.div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Anonymous compliment
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              They will never know it was you. Unless they guess correctly.
            </p>

            {/* Pick target */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-600 uppercase
                            tracking-wide mb-2">
                Send to
              </p>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {targets.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTarget(t)}
                    className={clsx(
                      'flex flex-col items-center gap-1.5 flex-shrink-0',
                      'transition-all duration-200'
                    )}
                  >
                    <div className={clsx(
                      'p-0.5 rounded-full transition-all duration-200',
                      target?.id === t.id
                        ? 'bg-gradient-to-tr from-rose-500 to-amber-400'
                        : 'bg-gray-200'
                    )}>
                      <div className="p-0.5 bg-white rounded-full">
                        <Avatar src={t.avatar_url} name={t.username} size="sm" />
                      </div>
                    </div>
                    <span className={clsx(
                      'text-[10px] font-medium',
                      target?.id === t.id ? 'text-rose-500' : 'text-gray-400'
                    )}>
                      {t.username}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pick or write message */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-600 uppercase
                            tracking-wide mb-2">
                Choose a compliment
              </p>
              <div className="flex flex-col gap-2 mb-3">
                {COMPLIMENT_TEMPLATES.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelected(t); setCustom('') }}
                    className={clsx(
                      'text-left text-xs px-3 py-2.5 rounded-2xl border',
                      'transition-all duration-200 leading-relaxed',
                      selected === t && !custom
                        ? 'bg-rose-50 border-rose-300 text-rose-700 font-medium'
                        : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-rose-200'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <p className="text-xs font-semibold text-gray-600 uppercase
                            tracking-wide mb-2">
                Or write your own
              </p>
              <textarea
                value={custom}
                onChange={e => { setCustom(e.target.value); setSelected(null) }}
                placeholder="say something real..."
                className="input-base resize-none h-20 text-sm"
                maxLength={200}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!message || !target || sending}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {sending
                ? <Loader2 size={16} className="animate-spin" />
                : <Heart size={16} />
              }
              Send anonymously
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}