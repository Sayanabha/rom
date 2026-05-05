import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Settings, Flame } from 'lucide-react'
import clsx from 'clsx'
import Logo from '../ui/Logo'
export default function TopBar({
  title,
  showBack = false,
  showLogo = false,
  showSettings = false,
  right = null,
  transparent = false,
}) {
  const navigate = useNavigate()

  return (
    <header className={clsx(
      'fixed top-0 left-0 right-0 z-40 max-w-md mx-auto',
      !transparent && 'bg-cream-50/90 backdrop-blur-md border-b border-gray-100'
    )}>
      <div className="flex items-center justify-between px-4 py-3 h-14">

        {/* Left */}
        <div className="w-10">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-xl hover:bg-gray-100 active:bg-gray-200
                         transition-colors text-gray-700"
            >
              <ArrowLeft size={20} />
            </button>
          )}
         {showLogo && (
  <Logo size="sm" showWordmark={false} />
)}
        </div>

        {/* Center */}
        <div className="flex-1 flex items-center justify-center">
          {showLogo ? (
  <Logo size="sm" showWordmark />
) : (
            <h1 className="text-base font-bold text-gray-900 truncate px-2">
              {title}
            </h1>
          )}
        </div>

        {/* Right */}
        <div className="w-10 flex justify-end">
          {showSettings && (
            <button
              onClick={() => navigate('/settings')}
              className="p-2 -mr-2 rounded-xl hover:bg-gray-100 active:bg-gray-200
                         transition-colors text-gray-700"
            >
              <Settings size={20} />
            </button>
          )}
          {right}
        </div>

      </div>
    </header>
  )
}