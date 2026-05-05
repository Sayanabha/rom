import { supabase } from './supabase'

export const chatService = {
  async getMessages(matchId) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles:sender_id (
          id,
          username,
          avatar_url
        )
      `)
      .eq('match_id', matchId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data ?? []
  },

  async sendMessage({ matchId, senderId, content }) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        match_id: matchId,
        sender_id: senderId,
        content: content.trim(),
      })
      .select(`
        *,
        profiles:sender_id (
          id,
          username,
          avatar_url
        )
      `)
      .single()

    if (error) throw error
    return data
  },

  async markSeen(matchId, userId) {
    const { error } = await supabase
      .from('messages')
      .update({ seen: true })
      .eq('match_id', matchId)
      .neq('sender_id', userId)
      .eq('seen', false)

    if (error) console.error('Mark seen failed:', error.message)
  },

  subscribeToMessages(matchId, callback) {
    return supabase
      .channel(`messages:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        payload => callback(payload.new)
      )
      .subscribe()
  },

  unsubscribe(channel) {
    supabase.removeChannel(channel)
  },
}