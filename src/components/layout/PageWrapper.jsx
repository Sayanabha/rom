import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import BottomNav from './BottomNav'
import TopBar from './TopBar'
import clsx from 'clsx'

export default function PageWrapper({
  children,
  title,
  showBack = false,
  showLogo = false,
  showSettings = false,
  topBarRight = null,
  hideNav = false,
  className = '',
  onRefresh = null,
}) {
  const [pullDistance, setPullDistance]   = useState(0)
  const [refreshing, setRefreshing]       = useState(false)
  const [released, setReleased]           = useState(false)
  const touchStartY = useRef(null)
  const scrollRef   = useRef(null)
  const THRESHOLD   = 72

  const handleTouchStart = useCallback((e) => {
    if (!onRefresh) return
    const el = scrollRef.current
    if (el && el.scrollTop > 0) return
    touchStartY.current = e.touches[0].clientY
  }, [onRefresh])

  const handleTouchMove = useCallback((e) => {
    if (!onRefresh || touchStartY.current === null) return
    const el = scrollRef.current
    if (el && el.scrollTop > 0) {
      touchStartY.current = null
      return
    }
    const delta = e.touches[0].clientY - touchStartY.current
    if (delta < 0) return
    // Resistance curve
    const distance = Math.min(delta * 0.45, 100)
    setPullDistance(distance)
  }, [onRefresh])

  const handleTouchEnd = useCallback(async () => {
    if (!onRefresh || touchStartY.current === null) return
    touchStartY.current = null

    if (pullDistance >= THRESHOLD) {
      setReleased(true)
      setRefreshing(true)
      setPullDistance(THRESHOLD)
      try {
        await onRefresh()
      } finally {
        setRefreshing(false)
        setReleased(false)
        setPullDistance(0)
      }
    } else {
      setPullDistance(0)
    }
  }, [onRefresh, pullDistance])

  const progress = Math.min(pullDistance / THRESHOLD, 1)
  const isReady  = pullDistance >= THRESHOLD

  return (
    <div className="min-h-screen bg-cream-50 max-w-md mx-auto relative overflow-hidden">
      <TopBar
        title={title}
        showBack={showBack}
        showLogo={showLogo}
        showSettings={showSettings}
        right={topBarRight}
      />

      {/* Pull to refresh indicator */}
      <AnimatePresence>
        {(pullDistance > 0 || refreshing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ top: 56 + pullDistance * 0.3 }}
            className="absolute left-0 right-0 flex justify-center z-30
                       pointer-events-none"
          >
            <motion.div
              animate={{
                scale: 0.7 + progress * 0.3,
                backgroundColor: isReady || refreshing ? '#f43f5e' : '#fda4af',
              }}
              className="w-9 h-9 rounded-full flex items-center
                         justify-center shadow-card"
            >
              <motion.div
                animate={{
                  rotate: refreshing ? 360 : progress * 280,
                }}
                transition={
                  refreshing
                    ? { duration: 0.7, repeat: Infinity, ease: 'linear' }
                    : { duration: 0 }
                }
              >
                <RefreshCw size={16} className="text-white" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: pullDistance > 0
            ? `translateY(${pullDistance * 0.4}px)`
            : 'none',
          transition: released || pullDistance === 0
            ? 'transform 0.3s cubic-bezier(0.16,1,0.3,1)'
            : 'none',
        }}
        className={clsx(
          'pt-14 overflow-y-auto page-enter',
          !hideNav && 'pb-24',
          className
        )}
        style={{
          minHeight: '100vh',
          transform: pullDistance > 0
            ? `translateY(${pullDistance * 0.4}px)`
            : 'none',
          transition: released || pullDistance === 0
            ? 'transform 0.3s cubic-bezier(0.16,1,0.3,1)'
            : 'none',
        }}
      >
        {children}
      </main>

      {!hideNav && <BottomNav />}
    </div>
  )
}