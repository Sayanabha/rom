import { useState } from 'react'
import { Sparkles, Loader2, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateIcebreakers } from '../../services/ai'

export default function IcebreakerSuggestions({ myProfile, theirProfile, onSelect, matchAge }) {
  const [lines, setLines]       = useState([])
  const [loading, setLoading]   = useState(false)
  const [generated, setGenerated] = useState(false)

  // Only show for new matches (less than 24h old)
  const isNewMatch = matchAge < 24 * 60 * 60 * 1000

  if (!isNewMatch && generated) return null

  async function generate() {
    setLoading(true)
    try {
      const result = await generateIcebreakers(myProfile, theirProfile)
      setLines(result)
      setGenerated(true)
    } catch {
      setLines([])
    } finally {
      setLoading(false)
    }
  }

  if (!generated) {
    return (
      <div className="px-4 py-3 border-t border-gray-100 bg-gradient-to-r
                      from-rose-50 to-amber-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-rose-400" />
            <span className="text-xs font-semibold text-rose-500 uppercase tracking-wide">
              New match
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Not sure what to say? Let AI write you a custom opener.
        </p>
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-2 btn-primary text-xs py-2 px-4"
        >
          {loading
            ? <Loader2 size={12} className="animate-spin" />
            : <Sparkles size={12} />
          }
          {loading ? 'Writing something good...' : 'Generate icebreakers'}
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 py-3 border-t border-gray-100 bg-gradient-to-r
                    from-rose-50 to-amber-50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-rose-400" />
          <span className="text-xs font-semibold text-rose-500 uppercase tracking-wide">
            AI icebreakers
          </span>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="p-1 rounded-lg hover:bg-rose-100 transition-colors"
        >
          {loading
            ? <Loader2 size={12} className="animate-spin text-rose-400" />
            : <RefreshCw size={12} className="text-rose-400" />
          }
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence mode="wait">
          {lines.map((line, i) => (
            <motion.button
              key={`${line}-${i}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelect(line)}
              className="text-left text-xs text-gray-700 bg-white rounded-2xl
                         px-3 py-2.5 border border-rose-100 hover:border-rose-300
                         hover:bg-rose-50 transition-all duration-200 active:scale-98
                         leading-relaxed font-medium"
            >
              "{line}"
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}