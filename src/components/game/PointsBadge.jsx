import { Zap } from 'lucide-react'
import clsx from 'clsx'

export default function PointsBadge({ points, size = 'md', className = '' }) {
  const sizeClass = size === 'sm'
    ? 'text-xs px-2 py-0.5 gap-1'
    : 'text-sm px-3 py-1 gap-1.5'

  return (
    <div className={clsx(
      'flex items-center rounded-full font-bold',
      'bg-gradient-to-r from-amber-400 to-orange-500 text-white',
      sizeClass,
      className
    )}>
      <Zap size={size === 'sm' ? 10 : 14} fill="white" />
      <span>{points?.toLocaleString() ?? 0}</span>
    </div>
  )
}