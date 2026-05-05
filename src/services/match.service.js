import { supabase } from './supabase'
import { getSmartReplies } from './ai'

// AI generates fake profiles on the fly when real ones run out
const AI_PROFILE_POOL = [
  {
    id: 'ai-001',
    username: 'sara_reads',
    age: 24,
    gender: 'woman',
    bio: 'Bookworm with a caffeine dependency and strong opinions about fictional characters.',
    looking_for: 'relationship',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara&backgroundColor=ffd5dc',
    reputation_points: 88,
    isAI: true,
  },
  {
    id: 'ai-002',
    username: 'amir_runs',
    age: 27,
    gender: 'man',
    bio: 'Marathon runner. I wake up at 5am and I am weirdly okay with that.',
    looking_for: 'casual',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amir&backgroundColor=b6e3f4',
    reputation_points: 120,
    isAI: true,
  },
  {
    id: 'ai-003',
    username: 'leila_chef',
    age: 25,
    gender: 'woman',
    bio: 'I cook elaborate meals for one and I am fine with it. Mostly.',
    looking_for: 'relationship',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=leila&backgroundColor=c0aede',
    reputation_points: 95,
    isAI: true,
  },
  {
    id: 'ai-004',
    username: 'karan_films',
    age: 26,
    gender: 'man',
    bio: 'Cinematography student. I see every conversation as a potential short film.',
    looking_for: 'exploring',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=karan&backgroundColor=ffdfbf',
    reputation_points: 140,
    isAI: true,
  },
  {
    id: 'ai-005',
    username: 'rhea_yoga',
    age: 23,
    gender: 'woman',
    bio: 'Yoga instructor by day. Chaotic overthinker by night. Balance is a work in progress.',
    looking_for: 'friends',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rhea&backgroundColor=d1d4f9',
    reputation_points: 75,
    isAI: true,
  },
  {
    id: 'ai-006',
    username: 'neil_startups',
    age: 28,
    gender: 'man',
    bio: 'Building things that may or may not change the world. Emphasis on may not.',
    looking_for: 'casual',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neil&backgroundColor=b6e3f4',
    reputation_points: 200,
    isAI: true,
  },
  {
    id: 'ai-007',
    username: 'anika_paints',
    age: 22,
    gender: 'woman',
    bio: 'Art student. My apartment looks like a gallery exploded. I love it.',
    looking_for: 'relationship',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anika&backgroundColor=ffd5dc',
    reputation_points: 60,
    isAI: true,
  },
  {
    id: 'ai-008',
    username: 'vikram_words',
    age: 29,
    gender: 'man',
    bio: 'Journalist. I ask too many questions on dates. Occupational hazard.',
    looking_for: 'relationship',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram&backgroundColor=ffdfbf',
    reputation_points: 180,
    isAI: true,
  },
  {
    id: 'ai-009',
    username: 'tara_climbs',
    age: 25,
    gender: 'woman',
    bio: 'Rock climber. I will absolutely drag you up a mountain on the second date.',
    looking_for: 'casual',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tara&backgroundColor=c0aede',
    reputation_points: 155,
    isAI: true,
  },
  {
    id: 'ai-010',
    username: 'sid_comedy',
    age: 27,
    gender: 'man',
    bio: 'Stand-up comic. I will make you laugh. Whether you want to or not.',
    looking_for: 'exploring',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sid&backgroundColor=d1d4f9',
    reputation_points: 220,
    isAI: true,
  },
]

export const matchService = {
  async getDiscoverProfiles(currentUserId) {
  const { data: swiped } = await supabase
    .from('swipes')
    .select('swiped_id')
    .eq('swiper_id', currentUserId)

  const swipedIds = swiped?.map(s => s.swiped_id) ?? []
  swipedIds.push(currentUserId)

  // Supabase needs at least 2 items for not.in -- pad if needed
  if (swipedIds.length === 1) swipedIds.push('00000000-0000-0000-0000-000000000000')

  const { data: realProfiles, error } = await supabase
    .from('profiles')
    .select('*')
    .not('id', 'in', `(${swipedIds.join(',')})`)
    .limit(20)

  if (error) {
    console.error('Discover profiles error:', error)
    // Fall back to just AI profiles if DB query fails
    const swipedSet = new Set(swipedIds)
    return AI_PROFILE_POOL.filter(p => !swipedSet.has(p.id))
      .sort(() => Math.random() - 0.5)
  }

  const real = realProfiles ?? []
  const swipedSet = new Set(swipedIds)
  const aiProfiles = AI_PROFILE_POOL.filter(p => !swipedSet.has(p.id))
  const combined = [...real, ...aiProfiles]

  return combined.sort(() => Math.random() - 0.5)
},

  async swipe({ swiperId, swipedId, direction }) {
    const isAIProfile = swipedId.startsWith('ai-')

    // REAL PROFILE FLOW
    if (!isAIProfile) {
      const { error } = await supabase
        .from('swipes')
        .insert({ swiper_id: swiperId, swiped_id: swipedId, direction })

      if (error) throw error

      if (direction === 'right') {
        const { data: mutual } = await supabase
          .from('swipes')
          .select('id')
          .eq('swiper_id', swipedId)
          .eq('swiped_id', swiperId)
          .eq('direction', 'right')
          .maybeSingle()

        if (mutual) {
          const [user1, user2] = [swiperId, swipedId].sort()

          const { error: matchError } = await supabase
            .from('matches')
            .insert({ user1_id: user1, user2_id: user2 })

          if (matchError && !matchError.message.includes('duplicate')) {
            throw matchError
          }

          return { isMatch: true }
        }
      }

      return { isMatch: false }
    }

    // AI PROFILE FLOW
    if (direction === 'right' && Math.random() < 0.4) {
      return {
        isMatch: true,
        aiProfile: AI_PROFILE_POOL.find(p => p.id === swipedId),
      }
    }

    return { isMatch: false }
  },

  async getMatches(userId) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        id,
        user1_id,
        user2_id,
        created_at,
        user1:user1_id ( id, username, avatar_url, bio ),
        user2:user2_id ( id, username, avatar_url, bio )
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data ?? []
  },

  // -------------------------
  // 🔥 Spark Service
  // -------------------------

  async addSparkPoints(matchId, points) {
    const { error } = await supabase.rpc('update_spark_points', {
      match_uuid: matchId,
      points,
    })

    if (error) {
      console.error('Spark points error:', error)
    }
  },

  async getSparkLevel(matchId) {
    const { data, error } = await supabase
      .from('matches')
      .select('spark_points, last_activity')
      .eq('id', matchId)
      .single()

    if (error) {
      console.error('Get spark level error:', error)
      return null
    }

    return data
  },
}

export { AI_PROFILE_POOL }