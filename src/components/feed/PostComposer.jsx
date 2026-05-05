import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import Avatar from '../ui/Avatar'
import { useAuth } from '../../context/AuthContext'

export default function PostComposer({ onPost, posting }) {
  const { profile } = useAuth()
  const [content, setContent] = useState('')
  const [focused, setFocused] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim() || posting) return
    await onPost(content)
    setContent('')
    setFocused(false)
  }

  return (
    <div className="bg-white rounded-3xl shadow-card p-4 mx-4 mb-4">
      <div className="flex items-start gap-3">
        <Avatar
          src={profile?.avatar_url}
          name={profile?.username}
          size="md"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="what's happening in your world?"
            className="w-full bg-transparent text-gray-800 placeholder-gray-300
                       resize-none outline-none text-sm leading-relaxed
                       min-h-[40px] max-h-32"
            maxLength={500}
            rows={focused ? 3 : 1}
          />

          {focused && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-300">
                {content.length}/500
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setFocused(false); setContent('') }}
                  className="btn-ghost text-xs py-1.5 px-3"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!content.trim() || posting}
                  className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
                >
                  {posting
                    ? <Loader2 size={12} className="animate-spin" />
                    : <Send size={12} />
                  }
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}