import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import PageWrapper from '../components/layout/PageWrapper'
import Avatar from '../components/ui/Avatar'
import Loader from '../components/ui/Loader'
import AnonymousCompliment from '../components/match/AnonymousCompliment'
import ComplimentsInbox from '../components/match/ComplimentsInbox'

import { useMatches } from '../hooks/useMatches'
import { useAuth } from '../context/AuthContext'
import clsx from 'clsx'

const TABS = ['Matches', 'Compliments']

export default function Matches() {
  const { user } = useAuth()
  const { matches, loading } = useMatches()
  const navigate = useNavigate()

  const [tab, setTab] = useState(0)
  const [showCompliment, setShowCompliment] = useState(false)

  function getOtherUser(match) {
    return match.user1_id === user?.id ? match.user2 : match.user1
  }

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  const topBarRight = (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={() => setShowCompliment(true)}
      className="p-2 -mr-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
    >
      <Heart size={20} className="text-rose-400" />
    </motion.button>
  )

  return (
    <PageWrapper title="Matches" topBarRight={topBarRight}>

      {/* Tabs */}
      <div className="flex items-center gap-1 mx-4 mt-4 mb-4 bg-gray-100 rounded-2xl p-1">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={clsx(
              'flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-200',
              tab === i
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-400'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Matches Tab */}
      {tab === 0 && (
        loading ? (
          <Loader />
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <span className="text-6xl mb-4 animate-float">💫</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No matches yet
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Go swipe on some people. The right one is probably one card away.
            </p>
          </div>
        ) : (
          <div className="px-4 flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">
              {matches.length} {matches.length === 1 ? 'match' : 'matches'}
            </p>

            {matches.map((match, i) => {
              const other = getOtherUser(match)
              if (!other) return null

              return (
                <motion.button
                  key={match.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/chat/${match.id}`)}
                  className="flex items-center gap-3 bg-white rounded-3xl shadow-card p-4 w-full text-left hover:shadow-md transition-all duration-200"
                >
                  <div className="relative">
                    <Avatar
                      src={other.avatar_url}
                      name={other.username}
                      size="md"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">
                      {other.username}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {other.bio
                        ? other.bio.slice(0, 45) + '...'
                        : 'Tap to say hello.'}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className="text-[10px] text-gray-300">
                      {timeAgo(match.created_at)}
                    </span>
                    <Heart size={14} className="text-rose-300" fill="#fda4af" />
                  </div>
                </motion.button>
              )
            })}
          </div>
        )
      )}

      {/* Compliments Tab */}
      {tab === 1 && <ComplimentsInbox />}

      {/* Modal */}
      <AnimatePresence>
        {showCompliment && (
          <AnonymousCompliment onClose={() => setShowCompliment(false)} />
        )}
      </AnimatePresence>

    </PageWrapper>
  )
}