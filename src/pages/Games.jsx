import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Trophy, Zap, Play } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import PredictionCard from '../components/game/PredictionCard'
import MiniGame from '../components/game/MiniGame'
import PointsBadge from '../components/game/PointsBadge'
import Avatar from '../components/ui/Avatar'
import Loader from '../components/ui/Loader'
import { useGame } from '../hooks/useGame'
import { useMatches } from '../hooks/useMatches'
import { useAuth } from '../context/AuthContext'
import clsx from 'clsx'

const TABS = ['Play', 'My Predictions', 'Leaderboard']

export default function Games() {
  const { user, profile } = useAuth()
  const { templates, predictions, leaderboard, loading, creating, createPrediction } = useGame()
  const { matches } = useMatches()
  const [activeTab, setActiveTab]       = useState(0)
  const [activeGame, setActiveGame]     = useState(null)

  // Get matched users as targets
  const targets = matches.map(m =>
    m.user1_id === user?.id ? m.user2 : m.user1
  ).filter(Boolean)

  async function handleSubmit(payload) {
    await createPrediction(payload)
    setActiveGame(null)
  }

  return (
    <PageWrapper title="Games">

      {/* Points header */}
      <div className="mx-4 mt-4 mb-5 bg-white rounded-3xl shadow-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">
              Your reputation
            </p>
            <PointsBadge points={profile?.reputation_points} size="md" />
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium mb-1">
              Predictions made
            </p>
            <p className="text-2xl font-extrabold text-gray-900">
              {predictions.length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 mb-5 bg-gray-100
                      rounded-2xl mx-4 p-1">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={clsx(
              'flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-200',
              activeTab === i
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="px-4">

          {/* Tab 0: Play */}
          {activeTab === 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide px-1">
                Pick a game
              </p>
              {templates.map(template => (
                <motion.button
                  key={template.type}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveGame(template)}
                  className="bg-white rounded-3xl shadow-card p-4 w-full text-left
                             flex items-center gap-4"
                >
                  <div className={clsx(
                    'w-14 h-14 rounded-2xl flex items-center justify-center',
                    'bg-gradient-to-br text-2xl flex-shrink-0',
                    template.color
                  )}>
                    {template.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm mb-0.5">
                      {template.label}
                    </p>
                    <p className="text-xs text-gray-400 leading-snug">
                      {template.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Zap size={12} fill="#f59e0b" />
                      <span className="text-xs font-bold">
                        {template.points * 2}
                      </span>
                    </div>
                    <Play size={16} className="text-gray-300" />
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Tab 1: My Predictions */}
          {activeTab === 1 && (
            <div className="flex flex-col gap-3">
              {predictions.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-5xl mb-4 block animate-float">🎯</span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    No predictions yet
                  </h3>
                  <p className="text-sm text-gray-400">
                    Play a game and make your first call.
                  </p>
                </div>
              ) : (
                predictions.map(pred => (
                  <PredictionCard key={pred.id} prediction={pred} />
                ))
              )}
            </div>
          )}

          {/* Tab 2: Leaderboard */}
          {activeTab === 2 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gray-400 font-semibold uppercase
                            tracking-wide px-1 mb-2">
                Top players
              </p>
              {leaderboard.map((player, i) => (
                <div
                  key={player.id}
                  className={clsx(
                    'flex items-center gap-3 bg-white rounded-3xl shadow-card p-4',
                    player.id === user?.id && 'ring-2 ring-rose-200'
                  )}
                >
                  <span className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center',
                    'text-sm font-extrabold flex-shrink-0',
                    i === 0 ? 'bg-amber-400 text-white' :
                    i === 1 ? 'bg-gray-300 text-white' :
                    i === 2 ? 'bg-orange-400 text-white' :
                    'bg-gray-100 text-gray-500'
                  )}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </span>

                  <Avatar
                    src={player.avatar_url}
                    name={player.username}
                    size="sm"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900">
                      {player.username}
                      {player.id === user?.id && (
                        <span className="text-rose-400 text-xs ml-1">(you)</span>
                      )}
                    </p>
                  </div>

                  <PointsBadge points={player.reputation_points} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mini game modal */}
      <AnimatePresence>
        {activeGame && (
          <MiniGame
            template={activeGame}
            targets={targets}
            onSubmit={handleSubmit}
            onClose={() => setActiveGame(null)}
            creating={creating}
          />
        )}
      </AnimatePresence>

    </PageWrapper>
  )
}