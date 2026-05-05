import { supabase } from './supabase'

export const GAME_TYPES = {
  REPLY_SPEED:   'reply_speed',
  GENRE_GUESS:   'genre_guess',
  HOT_TAKE:      'hot_take',
  COMPATIBILITY: 'compatibility',
  DARE:          'dare',
}

export const GAME_TEMPLATES = [
  {
    type: GAME_TYPES.REPLY_SPEED,
    label: 'Reply Race',
    emoji: '⚡',
    description: 'Will they reply within 1 hour?',
    options: ['Yes, instantly', 'Within the hour', 'Takes their time', 'Good luck waiting'],
    points: 15,
    color: 'from-amber-400 to-orange-500',
  },
  {
    type: GAME_TYPES.GENRE_GUESS,
    label: 'Music Mind Reader',
    emoji: '🎵',
    description: 'Guess their most played genre',
    options: ['Sad indie', 'Rap/Hip-hop', 'Pop bops', 'Lo-fi vibes'],
    points: 20,
    color: 'from-violet-400 to-purple-500',
  },
  {
    type: GAME_TYPES.HOT_TAKE,
    label: 'Hot Take',
    emoji: '🌶️',
    description: 'Do they prefer texts or calls?',
    options: ['Texter always', 'Call me maybe', 'Voice notes only', 'Carrier pigeon'],
    points: 10,
    color: 'from-rose-400 to-pink-500',
  },
  {
    type: GAME_TYPES.COMPATIBILITY,
    label: 'Vibe Check',
    emoji: '✨',
    description: 'Rate your compatibility',
    options: ['Soulmates', 'Pretty solid', 'Could work', 'Chaos duo'],
    points: 25,
    color: 'from-cyan-400 to-blue-500',
  },
  {
    type: GAME_TYPES.DARE,
    label: 'Soft Dare',
    emoji: '🎯',
    description: 'Send them a voice note in the next hour?',
    options: ['Absolutely', 'Maybe later', 'Too scary', 'Already sent it'],
    points: 30,
    color: 'from-emerald-400 to-teal-500',
  },
]

export const gameService = {
  async getMyPredictions(userId) {
    const { data, error } = await supabase
      .from('predictions')
      .select(`
        *,
        target:target_id ( id, username, avatar_url )
      `)
      .eq('creator_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data ?? []
  },

  async createPrediction({ creatorId, targetId, gameType, question, options, answer }) {
    const template = GAME_TEMPLATES.find(t => t.type === gameType)
    const { data, error } = await supabase
      .from('predictions')
      .insert({
        creator_id:    creatorId,
        target_id:     targetId,
        game_type:     gameType,
        question,
        options:       JSON.stringify(options),
        answer,
        outcome:       'pending',
        points_wagered: template?.points ?? 10,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async resolvePrediction(predictionId, outcome) {
    const { data, error } = await supabase
      .from('predictions')
      .update({ outcome })
      .eq('id', predictionId)
      .select()
      .single()

    if (error) throw error

    // Award points if won
    if (outcome === 'won') {
      const points = data.points_wagered * 2
      await supabase.rpc('increment_points', {
        user_id: data.creator_id,
        amount:  points,
      })
    }

    return data
  },

  async getLeaderboard() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, reputation_points')
      .order('reputation_points', { ascending: false })
      .limit(10)

    if (error) throw error
    return data ?? []
  },
}