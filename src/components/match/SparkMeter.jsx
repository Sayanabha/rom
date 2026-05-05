import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { matchService } from '../../services/match.service'
import clsx from 'clsx'

function getSparkLabel(points) {
  if (points >= 90) return { label: 'Scorching',  emoji: '🔥', color: 'from-red-500 to-orange-500'   }
  if (points >= 70) return { label: 'Heating up', emoji: '☀️', color: 'from-orange-400 to-amber-400'  }
  if (points >= 50) return { label: 'Warm',       emoji: '✨', color: 'from-amber-400 to-yellow-300'  }
  if (points >= 30) return { label: 'Lukewarm',   emoji: '🌤️', color: 'from-rose-300 to-pink-300'    }
  return                    { label: 'Just a spark', emoji: '💫', color: 'from-gray-300 to-rose-200'  }
}

export default function SparkMeter({ matchId, onUpdate }) {
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!matchId) return
    matchService.getSparkLevel(matchId).then(data => {
      if (data) setPoints(data.spark_points ?? 0)
      setLoading(false)
    })
  }, [matchId])

  const { label, emoji, color } = getSparkLabel(points)

  if (loading) return null

  return (
    <div className="px-4 py-2 bg-white border-b border-gray-50">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{emoji}</span>
          <span className="text-xs font-semibold text-gray-600">{label}</span>
        </div>
        <span className="text-xs text-gray-400 font-medium">{points}/100</span>
      </div>

      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${points}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={clsx('h-full rounded-full bg-gradient-to-r', color)}
        />
      </div>
    </div>
  )
}