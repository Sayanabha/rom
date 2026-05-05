import { useState, useEffect, useRef, useCallback } from 'react'
import { chatService } from '../services/chat.service'
import { getSmartReplies, getPersonaReply } from '../services/ai'
import { matchService } from '../services/match.service'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const AI_PERSONAS = {
  'a1b2c3d4-0001-0001-0001-000000000001': {
    name: 'maya_v',
    style: 'witty, slightly flirty, uses short sentences, loves music references',
  },
  'a1b2c3d4-0003-0003-0003-000000000003': {
    name: 'zara_writes',
    style: 'poetic, thoughtful, asks deep questions, uses literary references',
  },
  'a1b2c3d4-0006-0006-0006-000000000006': {
    name: 'kabir_beats',
    style: 'chill, music obsessed, drops song titles casually, warm and funny',
  },
  'a1b2c3d4-0007-0007-0007-000000000007': {
    name: 'nisha_codes',
    style: 'sarcastic but sweet, makes tech jokes, direct, dry humor',
  },
  'a1b2c3d4-0008-0008-0008-000000000008': {
    name: 'dev_travels',
    style: 'adventurous, funny travel stories, spontaneous, warm and charming',
  },
  'a1b2c3d4-0002-0002-0002-000000000002': {
    name: 'arjun_k',
    style: 'intellectual, dry wit, literary references, thoughtful and curious',
  },
  'a1b2c3d4-0004-0004-0004-000000000004': {
    name: 'rohan_lens',
    style: 'artistic, observant, talks about light and beauty, calm and deep',
  },
  'a1b2c3d4-0005-0005-0005-000000000005': {
    name: 'priya_draws',
    style: 'creative, warm, cat references, self-deprecating humor',
  },
  'a1b2c3d4-0009-0009-0009-000000000009': {
    name: 'charu_hope',
    style: 'warm and perceptive, asks thoughtful follow-up questions, therapist energy without being clinical, gently witty, makes you feel genuinely heard, occasionally vulnerable',
  },
}

export function useChat(matchId) {
  const { user } = useAuth()

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [smartReplies, setSmartReplies] = useState([])
  const [loadingReplies, setLoadingReplies] = useState(false)

  const otherUserIdRef = useRef(null)
  const channelRef = useRef(null)
  const aiReplyTimer = useRef(null)
  const aiLock = useRef(false)
  const messagesRef = useRef([])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const loadSmartReplies = useCallback(async (lastMessage) => {
    setLoadingReplies(true)
    try {
      const replies = await getSmartReplies(lastMessage)
      setSmartReplies(replies)
    } catch {
      setSmartReplies([])
    } finally {
      setLoadingReplies(false)
    }
  }, [])

  const loadMessages = useCallback(async () => {
    if (!matchId || !user?.id) return

    try {
      setLoading(true)

      const { supabase } = await import('../services/supabase')

      const { data: match } = await supabase
        .from('matches')
        .select('user1_id, user2_id')
        .eq('id', matchId)
        .single()

      if (match) {
        const otherId =
          match.user1_id === user.id ? match.user2_id : match.user1_id

        otherUserIdRef.current = otherId
      }

      const data = await chatService.getMessages(matchId)

      setMessages(data)
      messagesRef.current = data

      await chatService.markSeen(matchId, user.id)

      const lastMsg = data[data.length - 1]
      if (lastMsg && lastMsg.sender_id !== user.id) {
        loadSmartReplies(lastMsg.content)
      }
    } catch (err) {
      console.error('Load messages error:', err)
      toast.error('Could not load messages.')
    } finally {
      setLoading(false)
    }
  }, [matchId, user?.id, loadSmartReplies])

  useEffect(() => {
    if (!matchId || !user?.id) return

    loadMessages()

    if (channelRef.current) {
      chatService.unsubscribe(channelRef.current)
    }

    channelRef.current = chatService.subscribeToMessages(
      matchId,
      async (newMessage) => {
        setMessages((prev) => {
          if (prev.find((m) => m.id === newMessage.id)) return prev
          return [...prev, newMessage]
        })

        if (newMessage.sender_id !== user.id) {
          await chatService.markSeen(matchId, user.id)
          loadSmartReplies(newMessage.content)
        } else {
          setSmartReplies([])
        }
      }
    )

    return () => {
      if (channelRef.current) {
        chatService.unsubscribe(channelRef.current)
        channelRef.current = null
      }
      if (aiReplyTimer.current) clearTimeout(aiReplyTimer.current)
      aiLock.current = false
    }
  }, [matchId, user?.id])

  async function triggerAIReply(userMessage) {
    const otherId = otherUserIdRef.current

    if (!otherId || aiLock.current) return

    const persona = AI_PERSONAS[otherId]
    if (!persona) return

    aiLock.current = true

    const delay = 2000 + Math.random() * 2000

    aiReplyTimer.current = setTimeout(async () => {
      try {
        const history = messagesRef.current
          .slice(-6)
          .map((m) =>
            `${m.sender_id === user.id ? 'user' : persona.name}: ${m.content}`
          )
          .join('\n')

        const prompt = `You are ${persona.name} on a dating app. Personality: ${persona.style}.

Recent conversation:
${history}

User just said: "${userMessage}"

Reply as ${persona.name} in 1-2 sentences only. Be natural and in character. No labels, no quotes.`

        const reply = await getPersonaReply(prompt, persona)

        const { supabase } = await import('../services/supabase')

        const { data: sent, error } = await supabase
          .from('messages')
          .insert({
            match_id: matchId,
            sender_id: otherId,
            content: reply,
          })
          .select(`*, profiles:sender_id ( id, username, avatar_url )`)
          .single()

        if (error) throw error

        setMessages((prev) => {
          if (prev.find((m) => m.id === sent.id)) return prev
          return [...prev, sent]
        })

        // 🔥 Award spark points for AI engagement
        matchService.addSparkPoints(matchId, 2).catch(() => {})

        loadSmartReplies(reply)
      } catch (err) {
        console.error('AI reply failed:', err)
      } finally {
        aiLock.current = false
      }
    }, delay)
  }

  async function sendMessage(content) {
    if (!content.trim() || sending) return

    setSending(true)
    setSmartReplies([])

    const optimistic = {
      id: `temp-${Date.now()}`,
      match_id: matchId,
      sender_id: user.id,
      content: content.trim(),
      created_at: new Date().toISOString(),
      seen: false,
      profiles: null,
    }

    setMessages((prev) => [...prev, optimistic])
    messagesRef.current = [...messagesRef.current, optimistic]

    try {
      const sent = await chatService.sendMessage({
        matchId,
        senderId: user.id,
        content,
      })

      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? sent : m))
      )

      messagesRef.current = messagesRef.current.map((m) =>
        m.id === optimistic.id ? sent : m
      )

      // 🔥 Award spark points for sending a message
      matchService.addSparkPoints(matchId, 5).catch(() => {})

      // Trigger AI reply
      triggerAIReply(content)
    } catch (err) {
      toast.error('Message failed to send.')
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id))
    } finally {
      setSending(false)
    }
  }

  return {
    messages,
    loading,
    sending,
    smartReplies,
    loadingReplies,
    sendMessage,
  }
}