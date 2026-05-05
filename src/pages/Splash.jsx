import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/ui/Logo'

export default function Splash() {
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    const timer = setTimeout(() => {
      navigate(isAuthenticated ? '/feed' : '/login', { replace: true })
    }, 2400)
    return () => clearTimeout(timer)
  }, [loading, isAuthenticated])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center
                    max-w-md mx-auto"
         style={{ background: 'linear-gradient(160deg, #e11d48 0%, #fb923c 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 16, stiffness: 180 }}
        className="flex flex-col items-center gap-5"
      >
        <Logo size="xl" showWordmark showTagline white animate />
      </motion.div>

      {/* Animated dots */}
      <div className="absolute bottom-14 flex gap-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
            style={{
              width: 7, height: 7,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.8)',
            }}
          />
        ))}
      </div>
    </div>
  )
}