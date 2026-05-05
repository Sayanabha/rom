import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Heart } from 'lucide-react'
import Avatar from '../ui/Avatar'
import { useAuth } from '../../context/AuthContext'

export default function MatchModal({ matchedProfile, onClose }) {
  const { profile } = useAuth()
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {matchedProfile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-black/70 backdrop-blur-sm max-w-md mx-auto px-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="bg-white rounded-4xl p-8 w-full text-center shadow-2xl"
          >
            {/* Emoji burst */}
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
              className="text-5xl mb-4"
            >
              🔥
            </motion.div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
              It's a match!
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              You and{' '}
              <span className="text-rose-500 font-semibold">
                {matchedProfile.username}
              </span>{' '}
              both said yes. Don't leave them waiting.
            </p>

            {/* Avatars */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Avatar
                  src={profile?.avatar_url}
                  name={profile?.username}
                  size="xl"
                  showRing
                />
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Heart className="text-rose-500 fill-rose-500" size={28} />
              </motion.div>

              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Avatar
                  src={matchedProfile.avatar_url}
                  name={matchedProfile.username}
                  size="xl"
                  showRing
                />
              </motion.div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { onClose(); navigate('/chat') }}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Send a message
              </button>
              <button
                onClick={onClose}
                className="btn-ghost w-full text-gray-400"
              >
                Keep swiping
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}