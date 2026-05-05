import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion'
import { MapPin, Briefcase } from 'lucide-react'
import Avatar from '../ui/Avatar'

const SWIPE_THRESHOLD = 100

export default function SwipeCard({ profile, onSwipe, isTop }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  // Stamp overlays
  const likeOpacity  = useTransform(x, [20, 100], [0, 1])
  const nopeOpacity  = useTransform(x, [-100, -20], [1, 0])

  const controls = useAnimation()

  async function handleDragEnd(_, info) {
    const offset = info.offset.x

    if (offset > SWIPE_THRESHOLD) {
      await controls.start({ x: 600, opacity: 0, transition: { duration: 0.3 } })
      onSwipe(profile.id, 'right')
    } else if (offset < -SWIPE_THRESHOLD) {
      await controls.start({ x: -600, opacity: 0, transition: { duration: 0.3 } })
      onSwipe(profile.id, 'left')
    } else {
      controls.start({ x: 0, rotate: 0, transition: { type: 'spring', stiffness: 300 } })
    }
  }

  async function swipeRight() {
    await controls.start({ x: 600, opacity: 0, transition: { duration: 0.3 } })
    onSwipe(profile.id, 'right')
  }

  async function swipeLeft() {
    await controls.start({ x: -600, opacity: 0, transition: { duration: 0.3 } })
    onSwipe(profile.id, 'left')
  }

  return (
    <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{ x, rotate, opacity }}
      animate={controls}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      whileTap={{ scale: 1.02 }}
    >
      {/* Card */}
      <div className="w-full h-full bg-white rounded-4xl overflow-hidden shadow-card
                      select-none relative">

        {/* Avatar / Photo area */}
        <div className="h-3/5 bg-gradient-to-br from-rose-100 to-amber-50
                        flex items-center justify-center relative">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <Avatar
              src={null}
              name={profile.username}
              size="2xl"
            />
          )}

          {/* Like stamp */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-8 left-6 border-4 border-emerald-400
                       rounded-2xl px-4 py-2 rotate-[-20deg]"
          >
            <span className="text-emerald-400 font-extrabold text-2xl tracking-wider">
              LIKE
            </span>
          </motion.div>

          {/* Nope stamp */}
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-8 right-6 border-4 border-rose-500
                       rounded-2xl px-4 py-2 rotate-[20deg]"
          >
            <span className="text-rose-500 font-extrabold text-2xl tracking-wider">
              NOPE
            </span>
          </motion.div>
        </div>

        {/* Info area */}
        <div className="p-5 h-2/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-extrabold text-gray-900">
                {profile.username}
                {profile.age && (
                  <span className="font-normal text-gray-400 ml-2">
                    {profile.age}
                  </span>
                )}
              </h2>
            </div>

            {profile.bio && (
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                {profile.bio}
              </p>
            )}

            {!profile.bio && (
              <p className="text-sm text-gray-300 italic">
                Still writing their bio. Mysterious.
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-6 pb-1">
            <button
              onClick={swipeLeft}
              className="w-14 h-14 rounded-full bg-white border-2 border-gray-200
                         flex items-center justify-center text-2xl shadow-sm
                         hover:border-rose-300 hover:bg-rose-50
                         active:scale-90 transition-all duration-200"
            >
              👎
            </button>
            <button
              onClick={swipeRight}
              className="w-16 h-16 rounded-full gradient-rose
                         flex items-center justify-center text-2xl shadow-card
                         active:scale-90 transition-all duration-200"
            >
              ❤️
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}