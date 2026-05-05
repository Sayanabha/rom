import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, HelpCircle } from 'lucide-react'
import { complimentService } from '../../services/compliment.service'
import { useAuth } from '../../context/AuthContext'
import { useMatches } from '../../hooks/useMatches'
import Avatar from '../ui/Avatar'
import toast from 'react-hot-toast'
import clsx from 'clsx'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hrs = Math.floor(diff / 3600000)
  if (hrs < 1) return 'just now'
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function ComplimentsInbox() {
  const { user } = useAuth()
  const { matches } = useMatches()
  const [compliments, setCompliments] = useState([])
  const [guessing, setGuessing]       = useState(null)
  const [loading, setLoading]         = useState(true)

  const matchedUsers = matches.map(m =>
    m.user1_id === user?.id ? m.user2 : m.user1
  ).filter(Boolean)

  useEffect(() => {
    if (!user) return
    complimentService.getMyCompliments(user.id).then(data => {
      setCompliments(data)
      setLoading(false)
    })
  }, [user])

  async function handleGuess(complimentId, guessUserId) {
    try {
      const { isCorrect, senderId } = await complimentService
        .guessComplimentSender(complimentId, guessUserId)

      if (isCorrect) {
        toast.success('You got it! Mystery solved.')
        setCompliments(prev => prev.map(c =>
          c.id === complimentId
            ? { ...c, is_revealed: true, guess_id: guessUserId }
            : c
        ))
      } else {
        toast.error('Wrong guess. They stay mysterious.')
        setCompliments(prev => prev.map(c =>
          c.id === complimentId
            ? { ...c, guess_id: guessUserId }
            : c
        ))
      }
      setGuessing(null)
    } catch {
      toast.error('Could not submit guess.')
    }
  }

  if (loading) return null

  if (compliments.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 text-center px-6">
        <span className="text-4xl mb-3 animate-float">💌</span>
        <p className="text-sm font-semibold text-gray-900 mb-1">
          No compliments yet
        </p>
        <p className="text-xs text-gray-400">
          When someone sends you one anonymously, it appears here.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 px-4 pt-2">
      {compliments.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="bg-white rounded-3xl shadow-card p-4"
        >
          {/* Mystery sender */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full gradient-rose flex items-center
                            justify-center flex-shrink-0">
              <Heart size={16} className="text-white" fill="white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {c.is_revealed
                  ? matchedUsers.find(u => u.id === c.guess_id)?.username ?? 'Someone'
                  : 'A secret admirer'
                }
              </p>
              <p className="text-xs text-gray-400">{timeAgo(c.created_at)}</p>
            </div>
          </div>

          {/* Message */}
          <p className="text-sm text-gray-700 leading-relaxed italic mb-4 px-1">
            "{c.message}"
          </p>

          {/* Guess or revealed */}
          {c.is_revealed ? (
            <div className="flex items-center gap-2 bg-rose-50 rounded-2xl px-3 py-2">
              <span className="text-rose-500 text-sm">💡</span>
              <p className="text-xs text-rose-600 font-medium">
                Mystery solved! It was {matchedUsers.find(u => u.id === c.guess_id)?.username}.
              </p>
            </div>
          ) : c.guess_id ? (
            <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-3 py-2">
              <span className="text-sm">🙈</span>
              <p className="text-xs text-gray-500 font-medium">
                Wrong guess. They stay anonymous.
              </p>
            </div>
          ) : (
            <>
              {guessing === c.id ? (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    Who do you think sent this?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {matchedUsers.map(u => (
                      <button
                        key={u.id}
                        onClick={() => handleGuess(c.id, u.id)}
                        className="flex items-center gap-1.5 bg-gray-50 hover:bg-rose-50
                                   border border-gray-100 hover:border-rose-200
                                   rounded-2xl px-3 py-1.5 transition-all duration-200"
                      >
                        <Avatar src={u.avatar_url} name={u.username} size="xs" />
                        <span className="text-xs font-medium text-gray-700">
                          {u.username}
                        </span>
                      </button>
                    ))}
                    <button
                      onClick={() => setGuessing(null)}
                      className="text-xs text-gray-400 px-3 py-1.5"
                    >
                      cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setGuessing(c.id)}
                  className="flex items-center gap-1.5 text-xs font-medium
                             text-rose-500 hover:text-rose-600 transition-colors"
                >
                  <HelpCircle size={13} />
                  Guess who sent this
                </button>
              )}
            </>
          )}
        </motion.div>
      ))}
    </div>
  )
}