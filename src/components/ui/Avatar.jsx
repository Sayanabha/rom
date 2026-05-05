import clsx from 'clsx'

const SIZES = {
  xs:  'w-7 h-7 text-xs',
  sm:  'w-9 h-9 text-sm',
  md:  'w-12 h-12 text-base',
  lg:  'w-16 h-16 text-xl',
  xl:  'w-24 h-24 text-3xl',
  '2xl': 'w-32 h-32 text-4xl',
}

const COLORS = [
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-violet-400 to-purple-500',
  'from-cyan-400 to-blue-500',
  'from-emerald-400 to-teal-500',
]

function getColor(name = '') {
  const index = name.charCodeAt(0) % COLORS.length
  return COLORS[index]
}

export default function Avatar({
  src,
  name = '',
  size = 'md',
  className = '',
  onClick,
  showRing = false,
}) {
  const initials = name
    ? name.slice(0, 2).toUpperCase()
    : '?'

  const colorClass = getColor(name)

  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative rounded-full flex-shrink-0 overflow-hidden',
        SIZES[size],
        showRing && 'ring-2 ring-rose-400 ring-offset-2',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className={clsx(
          'w-full h-full flex items-center justify-center',
          'bg-gradient-to-br font-bold text-white',
          colorClass
        )}>
          {initials}
        </div>
      )}
    </div>
  )
}