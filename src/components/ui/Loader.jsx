import { Flame } from 'lucide-react'
import clsx from 'clsx'

export default function Loader({ fullScreen = false, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6'

  const inner = (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className={clsx(
          'rounded-full border-2 border-rose-100 border-t-rose-500 animate-spin',
          size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'
        )} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Flame className={clsx('text-rose-400 animate-pulse', sizeClass)} />
        </div>
      </div>
      {fullScreen && (
        <p className="text-sm text-gray-400 font-medium animate-pulse">
          warming things up...
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-cream-50 flex items-center justify-center z-50">
        {inner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-8">
      {inner}
    </div>
  )
}