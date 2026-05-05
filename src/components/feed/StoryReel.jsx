import { useState } from 'react'
import { Plus, X, Flame } from 'lucide-react'
import Avatar from '../ui/Avatar'
import { useAuth } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

function StoryViewer({ story, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center max-w-md mx-auto"
        onClick={onClose}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-10">
          <motion.div
            className="h-full bg-white"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
            onAnimationComplete={onClose}
          />
        </div>

        {/* Header */}
        <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4 z-10">
          <div className="flex items-center gap-2">
            <Avatar
              src={story.profiles?.avatar_url}
              name={story.profiles?.username}
              size="sm"
              showRing
            />
            <div>
              <p className="text-white font-semibold text-sm">
                {story.profiles?.username}
              </p>
              <p className="text-white/60 text-xs">
                {new Date(story.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 text-center">
          <p className="text-white text-2xl font-bold leading-relaxed">
            {story.content}
          </p>
        </div>

        {/* Flame watermark */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-1.5 text-white/40">
            <Flame size={14} />
            <span className="text-xs font-medium">rom</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function StoryReel({ stories, onAddStory }) {
  const { profile } = useAuth()
  const [viewing, setViewing] = useState(null)
  const [showComposer, setShowComposer] = useState(false)
  const [storyText, setStoryText] = useState('')

  async function handleAddStory() {
    if (!storyText.trim()) return
    await onAddStory(storyText)
    setStoryText('')
    setShowComposer(false)
  }

  return (
    <>
      <div className="flex items-center gap-3 overflow-x-auto px-4 py-3 scrollbar-hide">
        {/* Add story button */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setShowComposer(true)}
            className="w-16 h-16 rounded-full border-2 border-dashed border-rose-300
                       flex items-center justify-center bg-rose-50
                       hover:bg-rose-100 active:scale-95 transition-all duration-200"
          >
            <Plus size={22} className="text-rose-400" />
          </button>
          <span className="text-[10px] text-gray-400 font-medium">
            Your story
          </span>
        </div>

        {/* Stories */}
        {stories.map(story => (
          <div
            key={story.id}
            className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
            onClick={() => setViewing(story)}
          >
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400">
              <div className="p-0.5 rounded-full bg-white">
                <Avatar
                  src={story.profiles?.avatar_url}
                  name={story.profiles?.username}
                  size="md"
                />
              </div>
            </div>
            <span className="text-[10px] text-gray-500 font-medium max-w-[56px] truncate text-center">
              {story.profiles?.username}
            </span>
          </div>
        ))}

        {stories.length === 0 && (
          <p className="text-xs text-gray-300 font-medium pl-2 italic">
            No stories yet. Be the first.
          </p>
        )}
      </div>

      {/* Story composer modal */}
      <AnimatePresence>
        {showComposer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end max-w-md mx-auto"
            onClick={e => e.target === e.currentTarget && setShowComposer(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full bg-white rounded-t-3xl p-6 pb-10"
            >
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Add a story
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Gone in 24 hours. No pressure.
              </p>
              <textarea
                value={storyText}
                onChange={e => setStoryText(e.target.value)}
                placeholder="what's on your mind right now?"
                className="input-base resize-none h-28 mb-4"
                maxLength={200}
                autoFocus
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">
                  {storyText.length}/200
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowComposer(false)}
                    className="btn-ghost text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddStory}
                    disabled={!storyText.trim()}
                    className="btn-primary text-sm py-2 px-5"
                  >
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story viewer */}
      {viewing && (
        <StoryViewer
          story={viewing}
          onClose={() => setViewing(null)}
        />
      )}
    </>
  )
}