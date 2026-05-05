import { supabase } from './supabase'

export const complimentService = {
  async sendCompliment({ senderId, receiverId, message }) {
    const { data, error } = await supabase
      .from('compliments')
      .insert({
        sender_id:   senderId,
        receiver_id: receiverId,
        message,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getMyCompliments(userId) {
    const { data, error } = await supabase
      .from('compliments')
      .select('*')
      .eq('receiver_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data ?? []
  },

  async guessComplimentSender(complimentId, guessId) {
    // Get the compliment to check the real sender
    const { data: compliment } = await supabase
      .from('compliments')
      .select('sender_id')
      .eq('id', complimentId)
      .single()

    const isCorrect = compliment?.sender_id === guessId

    const { error } = await supabase
      .from('compliments')
      .update({
        guess_id:    guessId,
        is_revealed: isCorrect,
      })
      .eq('id', complimentId)

    if (error) throw error
    return { isCorrect, senderId: isCorrect ? compliment.sender_id : null }
  },

  async getComplimentCount(userId) {
    const { count } = await supabase
      .from('compliments')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)

    return count ?? 0
  },
}