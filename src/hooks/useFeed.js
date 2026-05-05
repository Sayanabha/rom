import { useState, useEffect, useCallback } from 'react'
import { feedService } from '../services/feed.service'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const AI_POST_POOL = [
  {
    id: 'ai-feed-001',
    user_id: 'a1b2c3d4-0002-0002-0002-000000000002',
    content: 'Unpopular opinion: the best conversations happen at the exact moment you decide you should probably sleep.',
    is_story: false,
    profiles: { id: 'a1b2c3d4-0002-0002-0002-000000000002', username: 'arjun_k', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun&backgroundColor=ffdfbf' },
    reactions: [
      { id: 'r1', user_id: 'a1b2c3d4-0003-0003-0003-000000000003', type: 'fire' },
      { id: 'r2', user_id: 'a1b2c3d4-0001-0001-0001-000000000001', type: 'heart' },
    ],
  },
  {
    id: 'ai-feed-002',
    user_id: 'a1b2c3d4-0005-0005-0005-000000000005',
    content: 'My cat knocked over my sketchbook and somehow the accidental smear looks better than anything I did intentionally today.',
    is_story: false,
    profiles: { id: 'a1b2c3d4-0005-0005-0005-000000000005', username: 'priya_draws', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=ffd5dc' },
    reactions: [
      { id: 'r3', user_id: 'a1b2c3d4-0006-0006-0006-000000000006', type: 'laugh' },
      { id: 'r4', user_id: 'a1b2c3d4-0004-0004-0004-000000000004', type: 'heart' },
      { id: 'r5', user_id: 'a1b2c3d4-0002-0002-0002-000000000002', type: 'wow' },
    ],
  },
  {
    id: 'ai-feed-003',
    user_id: 'a1b2c3d4-0008-0008-0008-000000000008',
    content: 'Missed my train in a random city, found a tiny jazz bar, stayed for 4 hours. Sometimes the delay is the destination.',
    is_story: false,
    profiles: { id: 'a1b2c3d4-0008-0008-0008-000000000008', username: 'dev_travels', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev&backgroundColor=ffdfbf' },
    reactions: [
      { id: 'r6', user_id: 'a1b2c3d4-0001-0001-0001-000000000001', type: 'fire' },
      { id: 'r7', user_id: 'a1b2c3d4-0007-0007-0007-000000000007', type: 'heart' },
    ],
  },
  {
    id: 'ai-feed-004',
    user_id: 'a1b2c3d4-0007-0007-0007-000000000007',
    content: 'Three interviews today. In all three I was asked where do you see yourself in 5 years. I said alive and hydrated. Two callbacks so far.',
    is_story: false,
    profiles: { id: 'a1b2c3d4-0007-0007-0007-000000000007', username: 'nisha_codes', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nisha&backgroundColor=c0aede' },
    reactions: [
      { id: 'r8', user_id: 'a1b2c3d4-0003-0003-0003-000000000003', type: 'laugh' },
      { id: 'r9', user_id: 'a1b2c3d4-0005-0005-0005-000000000005', type: 'fire' },
      { id: 'r10', user_id: 'a1b2c3d4-0002-0002-0002-000000000002', type: 'laugh' },
      { id: 'r11', user_id: 'a1b2c3d4-0008-0008-0008-000000000008', type: 'wow' },
    ],
  },
  {
    id: 'ai-feed-005',
    user_id: 'a1b2c3d4-0006-0006-0006-000000000006',
    content: 'The track I thought was mid at 2am sounds incredible at noon. Either my standards dropped overnight or something clicked. Releasing it Friday.',
    is_story: false,
    profiles: { id: 'a1b2c3d4-0006-0006-0006-000000000006', username: 'kabir_beats', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kabir&backgroundColor=b6e3f4' },
    reactions: [
      { id: 'r12', user_id: 'a1b2c3d4-0001-0001-0001-000000000001', type: 'fire' },
      { id: 'r13', user_id: 'a1b2c3d4-0004-0004-0004-000000000004', type: 'fire' },
    ],
  },
  {
    id: 'ai-feed-006',
    user_id: 'a1b2c3d4-0004-0004-0004-000000000004',
    content: 'Shot 400 photos today. Kept 3. This is not a failure. This is the job.',
    is_story: false,
    profiles: { id: 'a1b2c3d4-0004-0004-0004-000000000004', username: 'rohan_lens', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rohan&backgroundColor=d1d4f9' },
    reactions: [
      { id: 'r14', user_id: 'a1b2c3d4-0005-0005-0005-000000000005', type: 'heart' },
      { id: 'r15', user_id: 'a1b2c3d4-0003-0003-0003-000000000003', type: 'heart' },
      { id: 'r16', user_id: 'a1b2c3d4-0007-0007-0007-000000000007', type: 'wow' },
    ],
  },
  {
    id: 'ai-feed-007',
    user_id: 'a1b2c3d4-0003-0003-0003-000000000003',
    content: 'Reading a book where the protagonist makes every wrong decision and I am rooting for her harder than anything in my own life.',
    is_story: false,
    profiles: { id: 'a1b2c3d4-0003-0003-0003-000000000003', username: 'zara_writes', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zara&backgroundColor=c0aede' },
    reactions: [
      { id: 'r17', user_id: 'a1b2c3d4-0002-0002-0002-000000000002', type: 'laugh' },
      { id: 'r18', user_id: 'a1b2c3d4-0001-0001-0001-000000000001', type: 'heart' },
      { id: 'r19', user_id: 'a1b2c3d4-0006-0006-0006-000000000006', type: 'laugh' },
    ],
  },
  {
    id: 'ai-feed-008',
    user_id: 'a1b2c3d4-0001-0001-0001-000000000001',
    content: 'Just spent 45 minutes picking a show to watch and then fell asleep in 10 minutes. Peak adulting.',
    is_story: false,
    profiles: { id: 'a1b2c3d4-0001-0001-0001-000000000001', username: 'maya_v', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya&backgroundColor=b6e3f4' },
    reactions: [
      { id: 'r20', user_id: 'a1b2c3d4-0006-0006-0006-000000000006', type: 'laugh' },
      { id: 'r21', user_id: 'a1b2c3d4-0007-0007-0007-000000000007', type: 'heart' },
    ],
  },
  {
    id: 'ai-feed-009',
    user_id: 'a1b2c3d4-0002-0002-0002-000000000002',
    content: 'Reminder that the Metamorphosis is technically a story about burnout and family disappointment and not just a bug thing.',
    is_story: false,
    profiles: { id: 'a1b2c3d4-0002-0002-0002-000000000002', username: 'arjun_k', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun&backgroundColor=ffdfbf' },
    reactions: [
      { id: 'r22', user_id: 'a1b2c3d4-0004-0004-0004-000000000004', type: 'wow' },
      { id: 'r23', user_id: 'a1b2c3d4-0005-0005-0005-000000000005', type: 'fire' },
    ],
  },
  {
    id: 'ai-feed-010',
    user_id: 'a1b2c3d4-0008-0008-0008-000000000008',
    content: 'Been to 14 countries, still cannot decide what to eat for dinner. Some things never change.',
    is_story: false,
    profiles: { id: 'a1b2c3d4-0008-0008-0008-000000000008', username: 'dev_travels', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev&backgroundColor=ffdfbf' },
    reactions: [
      { id: 'r24', user_id: 'a1b2c3d4-0003-0003-0003-000000000003', type: 'laugh' },
      { id: 'r25', user_id: 'a1b2c3d4-0005-0005-0005-000000000005', type: 'laugh' },
    ],
  },
  {
    id: 'ai-feed-011',
    user_id: 'a1b2c3d4-0007-0007-0007-000000000007',
    content: 'Dark mode is not a preference. It is a personality trait and a moral stance.',
    is_story: false,
    profiles: { id: 'a1b2c3d4-0007-0007-0007-000000000007', username: 'nisha_codes', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nisha&backgroundColor=c0aede' },
    reactions: [
      { id: 'r26', user_id: 'a1b2c3d4-0002-0002-0002-000000000002', type: 'fire' },
      { id: 'r27', user_id: 'a1b2c3d4-0006-0006-0006-000000000006', type: 'heart' },
      { id: 'r28', user_id: 'a1b2c3d4-0008-0008-0008-000000000008', type: 'fire' },
    ],
  },
  {
    id: 'ai-feed-012',
    user_id: 'a1b2c3d4-0005-0005-0005-000000000005',
    content: 'Painted for 3 hours and realized I was just avoiding one specific email. Art is a coping mechanism and I am okay with that.',
    is_story: false,
    profiles: { id: 'a1b2c3d4-0005-0005-0005-000000000005', username: 'priya_draws', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=ffd5dc' },
    reactions: [
      { id: 'r29', user_id: 'a1b2c3d4-0001-0001-0001-000000000001', type: 'laugh' },
      { id: 'r30', user_id: 'a1b2c3d4-0004-0004-0004-000000000004', type: 'heart' },
    ],
  },
  {
    id: 'ai-feed-013',
    user_id: 'a1b2c3d4-0006-0006-0006-000000000006',
    content: 'A song is never really finished. At some point you just stop and release it into the world and hope it finds the right person.',
    is_story: false,
    profiles: { id: 'a1b2c3d4-0006-0006-0006-000000000006', username: 'kabir_beats', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kabir&backgroundColor=b6e3f4' },
    reactions: [
      { id: 'r31', user_id: 'a1b2c3d4-0003-0003-0003-000000000003', type: 'heart' },
      { id: 'r32', user_id: 'a1b2c3d4-0007-0007-0007-000000000007', type: 'heart' },
    ],
  },
  {
    id: 'ai-feed-014',
    user_id: 'a1b2c3d4-0004-0004-0004-000000000004',
    content: 'Golden hour is not a time of day. It is a feeling. And right now it is hitting the side of a random building and I cannot stop staring.',
    is_story: false,
    profiles: { id: 'a1b2c3d4-0004-0004-0004-000000000004', username: 'rohan_lens', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rohan&backgroundColor=d1d4f9' },
    reactions: [
      { id: 'r33', user_id: 'a1b2c3d4-0005-0005-0005-000000000005', type: 'wow' },
      { id: 'r34', user_id: 'a1b2c3d4-0008-0008-0008-000000000008', type: 'fire' },
    ],
  },
  {
    id: 'ai-feed-015',
    user_id: 'a1b2c3d4-0003-0003-0003-000000000003',
    content: 'Hot take: journaling is just arguing with yourself in writing and sometimes you lose.',
    is_story: false,
    profiles: { id: 'a1b2c3d4-0003-0003-0003-000000000003', username: 'zara_writes', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zara&backgroundColor=c0aede' },
    reactions: [
      { id: 'r35', user_id: 'a1b2c3d4-0001-0001-0001-000000000001', type: 'laugh' },
      { id: 'r36', user_id: 'a1b2c3d4-0002-0002-0002-000000000002', type: 'fire' },
      { id: 'r37', user_id: 'a1b2c3d4-0006-0006-0006-000000000006', type: 'laugh' },
    ],
  },
  {
  id: 'ai-feed-016',
  user_id: 'a1b2c3d4-0009-0009-0009-000000000009',
  content: 'The most underrated relationship skill is knowing when to ask a question and when to just sit with someone in silence.',
  is_story: false,
  profiles: { id: 'a1b2c3d4-0009-0009-0009-000000000009', username: 'charu_hope', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charu&backgroundColor=ffd5dc' },
  reactions: [
    { id: 'r-ch1', user_id: 'a1b2c3d4-0003-0003-0003-000000000003', type: 'heart' },
    { id: 'r-ch2', user_id: 'a1b2c3d4-0001-0001-0001-000000000001', type: 'wow' },
  ],
},
{
  id: 'ai-feed-017',
  user_id: 'a1b2c3d4-0009-0009-0009-000000000009',
  content: 'People will tell you everything about themselves in the first ten minutes if you actually listen. Most people are not listening.',
  is_story: false,
  profiles: { id: 'a1b2c3d4-0009-0009-0009-000000000009', username: 'charu_hope', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charu&backgroundColor=ffd5dc' },
  reactions: [
    { id: 'r-ch3', user_id: 'a1b2c3d4-0002-0002-0002-000000000002', type: 'fire' },
    { id: 'r-ch4', user_id: 'a1b2c3d4-0006-0006-0006-000000000006', type: 'heart' },
    { id: 'r-ch5', user_id: 'a1b2c3d4-0007-0007-0007-000000000007', type: 'wow' },
  ],
},
]

let shownIds   = new Set()
let refreshCount = 0

function getNextAIPosts(count = 5) {
  if (shownIds.size >= AI_POST_POOL.length) {
    shownIds = new Set()
    refreshCount++
  }
  const available = AI_POST_POOL.filter(p => !shownIds.has(p.id))
  const selected  = [...available].sort(() => Math.random() - 0.5).slice(0, count)
  selected.forEach(p => shownIds.add(p.id))
  return selected.map((p, i) => ({
    ...p,
    id: `${p.id}-r${refreshCount}-${i}`,
    reactions: p.reactions.map(r => ({ ...r, id: `${r.id}-r${refreshCount}-${i}` })),
    created_at: new Date(Date.now() - i * 1000 * 60 * 4).toISOString(),
  }))
}

export function useFeed() {
  const { user } = useAuth()
  const [posts, setPosts]     = useState([])
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)

  const loadFeed = useCallback(async () => {
    try {
      setLoading(true)
      const [postsData, storiesData] = await Promise.all([
        feedService.getPosts(),
        feedService.getStories(),
      ])
      const aiPosts  = getNextAIPosts(5)
      const allPosts = [...postsData, ...aiPosts]
      const unique   = Array.from(new Map(allPosts.map(p => [p.id, p])).values())
      const sorted   = unique.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setPosts(sorted)
      setStories(storiesData)
    } catch {
      toast.error('Could not load feed.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadFeed() }, [loadFeed])

  async function createPost(content) {
    if (!content.trim()) return
    setPosting(true)
    try {
      const newPost = await feedService.createPost({ userId: user.id, content })
      setPosts(prev => [newPost, ...prev])
      toast.success('Posted!')
    } catch {
      toast.error('Could not post. Try again.')
    } finally {
      setPosting(false)
    }
  }

  async function createStory(content) {
    if (!content.trim()) return
    try {
      const newStory = await feedService.createStory({ userId: user.id, content })
      setStories(prev => [newStory, ...prev])
      toast.success('Story posted! Gone in 24h.')
    } catch {
      toast.error('Could not post story.')
    }
  }

  async function toggleReaction(postId, type) {
    const isAI = !postId.match(/^[0-9a-f-]{36}$/)
    if (isAI) {
      setPosts(prev => prev.map(post => {
        if (post.id !== postId) return post
        const existingIndex = post.reactions.findIndex(r => r.user_id === user.id)
        const newReactions  = [...post.reactions]
        if (existingIndex !== -1) {
          if (post.reactions[existingIndex].type === type) {
            newReactions.splice(existingIndex, 1)
          } else {
            newReactions[existingIndex] = { ...newReactions[existingIndex], type }
          }
        } else {
          newReactions.push({ id: `temp-${Date.now()}`, user_id: user.id, type })
        }
        return { ...post, reactions: newReactions }
      }))
      return
    }

    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post
      const existingIndex = post.reactions.findIndex(r => r.user_id === user.id)
      const newReactions  = [...post.reactions]
      if (existingIndex !== -1) {
        if (post.reactions[existingIndex].type === type) {
          newReactions.splice(existingIndex, 1)
        } else {
          newReactions[existingIndex] = { ...newReactions[existingIndex], type }
        }
      } else {
        newReactions.push({ id: 'temp', user_id: user.id, type })
      }
      return { ...post, reactions: newReactions }
    }))

    try {
      await feedService.toggleReaction({ userId: user.id, postId, type })
    } catch {
      toast.error('Reaction failed.')
      loadFeed()
    }
  }

  async function deletePost(postId) {
    const isAI = !postId.match(/^[0-9a-f-]{36}$/)
    if (isAI) return
    setPosts(prev => prev.filter(p => p.id !== postId))
    try {
      await feedService.deletePost(postId)
      toast.success('Post deleted.')
    } catch {
      toast.error('Could not delete post.')
      loadFeed()
    }
  }

  return {
    posts,
    stories,
    loading,
    posting,
    createPost,
    createStory,
    toggleReaction,
    deletePost,
    refresh: loadFeed,
  }
}