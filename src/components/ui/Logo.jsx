import { motion } from 'framer-motion'

export default function Logo({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  white = false,
  animate = false,
}) {
  const sizes = {
    sm: { icon: 32, iconRx: 9,  flame1: 14, flame2: 8,  text: 20, gap: 8  },
    md: { icon: 44, iconRx: 13, flame1: 18, flame2: 11, text: 28, gap: 10 },
    lg: { icon: 64, iconRx: 18, flame1: 26, flame2: 16, text: 40, gap: 14 },
    xl: { icon: 96, iconRx: 26, flame1: 40, flame2: 24, text: 56, gap: 18 },
  }

  const s = sizes[size]

  const IconEl = animate ? motion.div : 'div'
  const animProps = animate ? {
    initial: { scale: 0, rotate: -10 },
    animate: { scale: 1, rotate: 0 },
    transition: { type: 'spring', damping: 12, stiffness: 200 },
  } : {}

  return (
    <div className="flex items-center" style={{ gap: s.gap }}>
      <IconEl
        {...animProps}
        style={{
          width:        s.icon,
          height:       s.icon,
          borderRadius: s.iconRx,
          background:   'linear-gradient(135deg, #e11d48 0%, #fb923c 100%)',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          flexShrink:   0,
          boxShadow:    '0 4px 16px rgba(244,63,94,0.35)',
        }}
      >
        <svg
          width={s.icon * 0.7}
          height={s.icon * 0.7}
          viewBox="0 0 32 32"
          fill="none"
        >
          <path
            d="M16 3 C16 3 24 10 24 17 C24 21 21 24 19 25 C20 21 17 18 15 18 C13 18 10 21 11 25 C9 22 8 19 8 17 C8 10 16 3 16 3Z"
            fill="white"
            opacity="0.95"
          />
          <path
            d="M16 16 C16 16 20 20 20 24 C20 27 18 29 16 29 C14 29 12 27 12 24 C12 20 16 16 16 16Z"
            fill="white"
            opacity="0.55"
          />
        </svg>
      </IconEl>

      {showWordmark && (
        <div className="flex flex-col">
          <span
            style={{
              fontSize:      s.text,
              fontWeight:    800,
              letterSpacing: '-0.03em',
              lineHeight:    1,
              background:    white
                ? 'white'
                : 'linear-gradient(135deg, #e11d48 0%, #fb923c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}
          >
            rom
          </span>
          {showTagline && (
            <span
              style={{
                fontSize:      s.text * 0.28,
                fontWeight:    500,
                color:         white ? 'rgba(255,255,255,0.7)' : '#fb7185',
                letterSpacing: '0.04em',
                marginTop:     2,
              }}
            >
              where sparks actually fly
            </span>
          )}
        </div>
      )}
    </div>
  )
}