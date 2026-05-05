import { supabase } from './supabase'

export const feedService = {
  async getPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          avatar_url
        ),
        reactions (
          id,
          user_id,
          type
        )
      `)
      .eq('is_story', false)
      .order('created_at', { ascending: false })
      .limit(30)

    if (error) throw error
    return data
  },

  async getStories() {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          avatar_url
        )
      `)
      .eq('is_story', true)
      .gte('created_at', cutoff)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createPost({ userId, content, imageUrl = null }) {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        content,
        image_url: imageUrl,
        is_story: false,
      })
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          avatar_url
        ),
        reactions (
          id,
          user_id,
          type
        )
      `)
      .single()

    if (error) throw error
    return data
  },

  async createStory({ userId, content }) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        content,
        is_story: true,
        expires_at: expiresAt,
      })
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          avatar_url
        )
      `)
      .single()

    if (error) throw error
    return data
  },

  async toggleReaction({ userId, postId, type }) {
    // Check if reaction exists
    const { data: existing } = await supabase
      .from('reactions')
      .select('id, type')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single()

    if (existing) {
      if (existing.type === type) {
        // Same reaction -- remove it
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('id', existing.id)
        if (error) throw error
        return null
      } else {
        // Different reaction -- update it
        const { data, error } = await supabase
          .from('reactions')
          .update({ type })
          .eq('id', existing.id)
          .select()
          .single()
        if (error) throw error
        return data
      }
    } else {
      // New reaction
      const { data, error } = await supabase
        .from('reactions')
        .insert({ user_id: userId, post_id: postId, type })
        .select()
        .single()
      if (error) throw error
      return data
    }
  },

  async deletePost(postId) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
    if (error) throw error
  },
}