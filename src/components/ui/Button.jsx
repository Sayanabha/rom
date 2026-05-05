import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const VARIANTS = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  danger:    'bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl px-6 py-3 transition-all duration-200',
}

const SIZES = {
  sm: 'text-sm px-4 py-2',
  md: '',
  lg: 'text-lg px-8 py-4',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  full = false,
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      className={clsx(
        VARIANTS[variant],
        SIZES[size],
        full && 'w-full',
        'flex items-center justify-center gap-2',
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading
        ? <Loader2 size={16} className="animate-spin" />
        : children
      }
    </motion.button>
  )
}