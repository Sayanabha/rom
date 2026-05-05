import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, Trash2, MessageCircle } from 'lucide-react'
import Avatar from '../ui/Avatar'
import ReactionBar from './ReactionBar'
import { useAuth } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function PostCard({ post, onReact, onDelete }) {
  const { user } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)
  const isOwner = user?.id === post.user_id

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    if (showMenu) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl shadow-card p-4 mx-4 mb-3 relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Avatar
            src={post.profiles?.avatar_url}
            name={post.profiles?.username}
            size="sm"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {post.profiles?.username}
            </p>
            <p className="text-xs text-gray-400">
              {timeAgo(post.created_at)}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="relative" ref={menuRef}>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setShowMenu(v => !v)}
              className="w-8 h-8 rounded-xl flex items-center justify-center
                         text-gray-300 hover:text-gray-500 hover:bg-gray-100
                         transition-all duration-200"
            >
              <MoreHorizontal size={16} />
            </motion.button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -4 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 top-9 z-30 bg-white rounded-2xl
                             shadow-lg border border-gray-100 overflow-hidden"
                  style={{ minWidth: '140px' }}
                >
                  <button
                    onClick={() => {
                      onDelete(post.id)
                      setShowMenu(false)
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-3
                               text-sm font-medium text-red-500
                               hover:bg-red-50 transition-colors duration-150"
                  >
                    <Trash2 size={14} />
                    Delete post
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-gray-800 text-sm leading-relaxed mb-4">
        {post.content}
      </p>

      {post.image_url && (
        <div className="rounded-2xl overflow-hidden mb-4">
          <img
            src={post.image_url}
            alt="post"
            className="w-full object-cover max-h-72"
          />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <ReactionBar
          reactions={post.reactions}
          postId={post.id}
          onReact={onReact}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-1.5 text-sm text-gray-400
                     hover:text-rose-400 transition-colors duration-200"
        >
          <MessageCircle size={15} />
          <span className="text-xs font-medium">Reply</span>
        </motion.button>
      </div>
    </motion.div>
  )
}