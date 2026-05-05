import { useNavigate } from 'react-router-dom'
import { MessageCircle, Compass } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Avatar from '../components/ui/Avatar'
import Loader from '../components/ui/Loader'
import { useMatches } from '../hooks/useMatches'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

export default function Chat() {
  const { user } = useAuth()
  const { matches, loading } = useMatches()
  const navigate = useNavigate()

  function getOtherUser(match) {
    return match.user1_id === user?.id ? match.user2 : match.user1
  }

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h`
    return `${Math.floor(hrs / 24)}d`
  }

  return (
    <PageWrapper title="Messages">
      {loading ? (
        <Loader />
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <span className="text-6xl mb-4 animate-float">💬</span>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No conversations yet
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            Match with someone first. Then come back and be charming.
          </p>
          <button
            onClick={() => navigate('/discover')}
            className="btn-primary flex items-center gap-2"
          >
            <Compass size={16} />
            Go find someone
          </button>
        </div>
      ) : (
        <div className="px-4 pt-4 flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-400 uppercase
                        tracking-wide px-1 mb-2">
            {matches.length} {matches.length === 1 ? 'conversation' : 'conversations'}
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
                className="flex items-center gap-3 bg-white rounded-3xl
                           shadow-card p-4 w-full text-left
                           hover:shadow-md active:scale-98 transition-all duration-200"
              >
                <div className="relative flex-shrink-0">
                  <Avatar
                    src={other?.avatar_url}
                    name={other?.username}
                    size="md"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5
                                  bg-emerald-400 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">
                    {other?.username}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {other?.bio
                      ? other.bio.slice(0, 40) + '...'
                      : 'Tap to start chatting'
                    }
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[10px] text-gray-300 font-medium">
                    {timeAgo(match.created_at)}
                  </span>
                  <MessageCircle size={14} className="text-rose-200" />
                </div>
              </motion.button>
            )
          })}
        </div>
      )}
    </PageWrapper>
  )
}