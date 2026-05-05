import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Edit3, LogOut, Grid3x3 } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Avatar from '../components/ui/Avatar'
import PointsBadge from '../components/game/PointsBadge'
import Loader from '../components/ui/Loader'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/auth.service'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const LOOKING_FOR_LABELS = {
  relationship: 'Something real',
  casual:       'Keeping it casual',
  friends:      'Just friends',
  exploring:    'Still figuring it out',
}

export default function Profile() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const fileRef   = useRef(null)
  const { profile, posts, loading, uploading, uploadAvatar } = useProfile()

  async function handleLogout() {
    try {
      await authService.signOut()
      toast.success('Logged out. See you soon.')
    } catch {
      toast.error('Logout failed.')
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB.')
      return
    }
    await uploadAvatar(file)
  }

  const topBarRight = (
    <button
      onClick={() => navigate('/profile/edit')}
      className="p-2 -mr-2 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors"
    >
      <Edit3 size={18} />
    </button>
  )

  if (loading) return (
    <PageWrapper title="Profile" topBarRight={topBarRight}>
      <Loader />
    </PageWrapper>
  )

  return (
    <PageWrapper title="Profile" topBarRight={topBarRight}>
      <div className="px-4 pt-4">

        {/* Avatar + info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-6"
        >
          {/* Avatar with upload */}
          <div className="relative mb-4">
            <Avatar
              src={profile?.avatar_url}
              name={profile?.username}
              size="2xl"
              showRing
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-1 right-1 w-8 h-8 bg-rose-500 rounded-full
                         flex items-center justify-center shadow-md
                         hover:bg-rose-600 transition-colors active:scale-90"
            >
              <Camera size={14} className="text-white" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {uploading && (
            <p className="text-xs text-rose-400 font-medium mb-2 animate-pulse">
              Uploading...
            </p>
          )}

          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
            {profile?.username}
          </h2>

          {profile?.age && (
            <p className="text-gray-400 text-sm mb-2">{profile.age} years old</p>
          )}

          <PointsBadge points={profile?.reputation_points} className="mb-3" />

          {profile?.looking_for && (
            <span className="text-xs bg-rose-50 text-rose-500 font-semibold
                             px-3 py-1.5 rounded-full border border-rose-100">
              {LOOKING_FOR_LABELS[profile.looking_for] ?? profile.looking_for}
            </span>
          )}
        </motion.div>

        {/* Bio */}
        {profile?.bio ? (
          <div className="bg-white rounded-3xl shadow-card p-4 mb-4 text-center">
            <p className="text-sm text-gray-600 leading-relaxed italic">
              "{profile.bio}"
            </p>
          </div>
        ) : (
          <button
            onClick={() => navigate('/profile/edit')}
            className="w-full bg-rose-50 border-2 border-dashed border-rose-200
                       rounded-3xl p-4 mb-4 text-center text-sm text-rose-400
                       font-medium hover:bg-rose-100 transition-colors"
          >
            Add a bio. Tell people why they should swipe right.
          </button>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Posts',   value: posts.length },
            { label: 'Points',  value: profile?.reputation_points ?? 0 },
            { label: 'Matches', value: '...' },
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-card p-3 text-center"
            >
              <p className="text-xl font-extrabold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Posts grid */}
        {posts.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 px-1">
              <Grid3x3 size={14} className="text-gray-400" />
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                Posts
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {posts.map(post => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl shadow-card p-4"
                >
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-300">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {post.reactions?.length ?? 0} reactions
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3
                     text-sm font-semibold text-gray-400 hover:text-rose-500
                     transition-colors mb-4"
        >
          <LogOut size={16} />
          Log out
        </button>

      </div>
    </PageWrapper>
  )
}