import { supabase } from './supabase'

// Test credentials (hardcoded for portfolio demo)
export const TEST_USER = {
  email: 'demo@rom.app',
  password: 'Rom@demo2025',
}

export const authService = {
  async signUp({ email, password, username }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    })
    if (error) throw error

    // Update the auto-created profile with the username
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', data.user.id)

      if (profileError) throw profileError
    }

    return data
  },

  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  },
}