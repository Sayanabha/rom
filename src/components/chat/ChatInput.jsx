import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import clsx from 'clsx'

export default function ChatInput({ onSend, sending, prefill, onClearPrefill }) {
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  // When smart reply is selected, fill the input
  useEffect(() => {
    if (prefill) {
      setText(prefill)
      onClearPrefill?.()
      inputRef.current?.focus()
    }
  }, [prefill])

  async function handleSend() {
    if (!text.trim() || sending) return
    await onSend(text)
    setText('')
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-end gap-2 px-4 py-3">
      <textarea
        ref={inputRef}
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKey}
        placeholder="say something..."
        rows={1}
        className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl
                   px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300
                   resize-none outline-none focus:ring-2 focus:ring-rose-300
                   focus:border-rose-400 transition-all duration-200
                   max-h-28 leading-relaxed"
        style={{ minHeight: '42px' }}
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || sending}
        className={clsx(
          'w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0',
          'transition-all duration-200 active:scale-90',
          text.trim() && !sending
            ? 'gradient-rose text-white shadow-card'
            : 'bg-gray-100 text-gray-300'
        )}
      >
        {sending
          ? <Loader2 size={16} className="animate-spin" />
          : <Send size={16} />
        }
      </button>
    </div>
  )
}