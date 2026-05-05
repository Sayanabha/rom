import { NavLink } from 'react-router-dom'
import { Home, Compass, Heart, MessageCircle, User } from 'lucide-react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/feed',     icon: Home,          label: 'Home'     },
  { to: '/discover', icon: Compass,       label: 'Discover' },
  { to: '/matches',  icon: Heart,         label: 'Matches'  },
  { to: '/chat',     icon: MessageCircle, label: 'Chat'     },
  { to: '/profile',  icon: User,          label: 'Profile'  },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto">
      <div className="bg-white border-t border-gray-100 shadow-nav
                      px-2 py-2 safe-bottom">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center justify-center
                         gap-0.5 px-3 py-1 min-w-[56px] relative"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-rose-50 rounded-2xl"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <div className="relative z-10 p-1.5 rounded-xl">
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        color: isActive ? '#f43f5e' : '#9ca3af',
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon
                        size={22}
                        strokeWidth={isActive ? 2.5 : 1.8}
                        color={isActive ? '#f43f5e' : '#9ca3af'}
                      />
                    </motion.div>
                  </div>
                  <motion.span
                    animate={{
                      color: isActive ? '#f43f5e' : '#9ca3af',
                      fontWeight: isActive ? 600 : 400,
                    }}
                    className="text-[10px] relative z-10"
                  >
                    {label}
                  </motion.span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}