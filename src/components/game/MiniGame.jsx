import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap } from 'lucide-react'
import Avatar from '../ui/Avatar'
import clsx from 'clsx'

export default function MiniGame({ template, targets, onSubmit, onClose, creating }) {
  const [selectedTarget, setSelectedTarget] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [step, setStep] = useState(0)

  function handleNext() {
    if (step === 0 && !selectedTarget) return
    if (step === 1 && !selectedAnswer) return
    if (step === 1) {
      onSubmit({
        targetId: selectedTarget.id,
        gameType: template.type,
        answer:   selectedAnswer,
      })
      return
    }
    setStep(s => s + 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
                 flex items-end max-w-md mx-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 200, opacity: 0 }}
        className="w-full bg-white rounded-t-4xl p-6 pb-10"
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{template.emoji}</span>
              <h3 className="text-lg font-bold text-gray-900">
                {template.label}
              </h3>
            </div>
            <p className="text-sm text-gray-400">{template.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Points badge */}
        <div className="flex items-center gap-1.5 bg-amber-50 rounded-2xl
                        px-3 py-2 w-fit mb-6">
          <Zap size={14} className="text-amber-500" fill="#f59e0b" />
          <span className="text-sm font-bold text-amber-600">
            +{template.points * 2} pts if you're right
          </span>
        </div>

        {/* Step 0: Pick target */}
        {step === 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Who is this about?
            </p>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto mb-5">
              {targets.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  Match with someone first to play games.
                </p>
              ) : (
                targets.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTarget(t)}
                    className={clsx(
                      'flex items-center gap-3 p-3 rounded-2xl border-2',
                      'transition-all duration-200 text-left',
                      selectedTarget?.id === t.id
                        ? 'border-rose-400 bg-rose-50'
                        : 'border-gray-100 hover:border-rose-200'
                    )}
                  >
                    <Avatar
                      src={t.avatar_url}
                      name={t.username}
                      size="sm"
                    />
                    <span className="font-semibold text-sm text-gray-800">
                      {t.username}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 1: Pick answer */}
        {step === 1 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Your prediction:
            </p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {template.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedAnswer(opt)}
                  className={clsx(
                    'py-3 px-3 rounded-2xl text-sm font-semibold border-2',
                    'transition-all duration-200 text-left',
                    selectedAnswer === opt
                      ? 'border-rose-400 bg-rose-50 text-rose-600'
                      : 'border-gray-100 text-gray-600 hover:border-rose-200'
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleNext}
          disabled={
            creating ||
            (step === 0 && !selectedTarget) ||
            (step === 1 && !selectedAnswer) ||
            targets.length === 0
          }
          className="btn-primary w-full"
        >
          {creating
            ? 'Locking it in...'
            : step === 0
            ? 'Next'
            : 'Lock in my prediction'
          }
        </button>
      </motion.div>
    </motion.div>
  )
}