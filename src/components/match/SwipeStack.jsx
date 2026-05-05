import SwipeCard from './SwipeCard'
import { motion } from 'framer-motion'

export default function SwipeStack({ profiles, onSwipe }) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 pb-16">
        <span className="text-6xl animate-float">🌊</span>
        <h3 className="text-xl font-bold text-gray-900">
          You've seen everyone
        </h3>
        <p className="text-sm text-gray-400 text-center px-8">
          Come back later -- new people join every day.
          Or tell your friends. No pressure.
        </p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {profiles
        .slice(0, 3)
        .reverse()
        .map((profile, reversedIndex) => {
          const index = Math.min(profiles.slice(0, 3).length - 1 - reversedIndex, 2)
          const isTop = index === profiles.slice(0, 3).length - 1

          return (
            <motion.div
              key={profile.id}
              className="absolute inset-0"
              style={{
                zIndex: index,
                scale: 1 - (profiles.slice(0, 3).length - 1 - index) * 0.04,
                y: (profiles.slice(0, 3).length - 1 - index) * -10,
              }}
              animate={{
                scale: 1 - (profiles.slice(0, 3).length - 1 - index) * 0.04,
                y: (profiles.slice(0, 3).length - 1 - index) * -10,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <SwipeCard
                profile={profile}
                onSwipe={onSwipe}
                isTop={isTop}
              />
            </motion.div>
          )
        })}
    </div>
  )
}