import { supabase } from './supabase'

export const profileService = {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async uploadAvatar(userId, file) {
  const ext  = file.name.split('.').pop().toLowerCase()
  const path = `${userId}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, {
      upsert:      true,
      contentType: file.type,
    })

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(path)

  // Bust cache with timestamp so browser fetches fresh image
  const urlWithBust = `${data.publicUrl}?t=${Date.now()}`

  await profileService.updateProfile(userId, {
    avatar_url: urlWithBust,
  })

  return urlWithBust
},

  async getUserPosts(userId) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        reactions ( id, user_id, type )
      `)
      .eq('user_id', userId)
      .eq('is_story', false)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data ?? []
  },
}