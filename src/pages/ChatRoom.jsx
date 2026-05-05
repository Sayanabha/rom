import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import ChatBubble from '../components/chat/ChatBubble'
import ChatInput from '../components/chat/ChatInput'
import SmartReplySuggestions from '../components/chat/SmartReplySuggestions'
import IcebreakerSuggestions from '../components/chat/IcebreakerSuggestions'
import SparkMeter from '../components/match/SparkMeter'

import Loader from '../components/ui/Loader'
import Avatar from '../components/ui/Avatar'

import { useChat } from '../hooks/useChat'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabase'

export default function ChatRoom() {
  const { matchId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const {
    messages,
    loading,
    sending,
    smartReplies,
    loadingReplies,
    sendMessage,
  } = useChat(matchId)

  const [otherUser, setOtherUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [matchAge, setMatchAge] = useState(null)
  const [prefill, setPrefill] = useState('')

  const bottomRef = useRef(null)

  /**
   * Fetch match + both users
   */
  useEffect(() => {
    if (!matchId || !user?.id) return

    async function fetchMatch() {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          user1:user1_id ( id, username, avatar_url, bio, looking_for ),
          user2:user2_id ( id, username, avatar_url, bio, looking_for )
        `)
        .eq('id', matchId)
        .single()

      if (error) {
        console.error('Match fetch error:', error)
        return
      }

      const isUser1 = data.user1_id === user.id
      const other = isUser1 ? data.user2 : data.user1
      const me = isUser1 ? data.user1 : data.user2

      setOtherUser(other)
      setProfile(me)

      const ageMs = Date.now() - new Date(data.created_at).getTime()
      setMatchAge(ageMs)
    }

    fetchMatch()
  }, [matchId, user?.id])

  /**
   * Auto scroll to bottom
   */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /**
   * Clear prefill after it's used
   */
  useEffect(() => {
    if (prefill) {
      setPrefill('')
    }
  }, [prefill])

  return (
    <div className="min-h-screen bg-cream-50 max-w-md mx-auto flex flex-col">

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 max-w-md mx-auto
                      bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100
                       text-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          {otherUser && (
            <div className="flex items-center gap-2.5 flex-1">
              <Avatar
                src={otherUser.avatar_url}
                name={otherUser.username}
                size="sm"
              />
              <div>
                <p className="font-semibold text-gray-900 text-sm leading-tight">
                  {otherUser.username}
                </p>
                <p className="text-xs text-emerald-400 font-medium">
                  online
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 Spark meter */}
      {matchId && (
        <div className="fixed top-14 left-0 right-0 z-30 max-w-md mx-auto">
          <SparkMeter matchId={matchId} />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 pt-24 pb-36 px-4 overflow-y-auto">
        {loading ? (
          <Loader />
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center
                          py-16 text-center">
            <span className="text-5xl mb-4 animate-float">👋</span>
            <p className="text-sm text-gray-400 font-medium">
              No messages yet. Don't leave them hanging.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => {
              const isMe = msg.sender_id === user?.id
              const prevMsg = messages[i - 1]

              const showAvatar =
                !isMe &&
                (!prevMsg || prevMsg.sender_id !== msg.sender_id)

              return (
                <ChatBubble
                  key={msg.id}
                  message={msg}
                  isMe={isMe}
                  showAvatar={showAvatar}
                />
              )
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Bottom section */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto
                      bg-white border-t border-gray-100 shadow-nav">

        {/* Icebreakers */}
        {messages.length === 0 && otherUser && profile && matchAge !== null && (
          <IcebreakerSuggestions
            myProfile={profile}
            theirProfile={otherUser}
            matchAge={matchAge}
            onSelect={(reply) => setPrefill(reply)}
          />
        )}

        <SmartReplySuggestions
          replies={smartReplies}
          loading={loadingReplies}
          onSelect={(reply) => setPrefill(reply)}
        />

        <ChatInput
          onSend={sendMessage}
          sending={sending}
          prefill={prefill}
          onClearPrefill={() => setPrefill('')}
        />
      </div>
    </div>
  )
}