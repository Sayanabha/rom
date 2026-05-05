import { useState, useEffect } from 'react'
import { profileService } from '../services/profile.service'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export function useProfile(userId = null) {
  const { user, profile: authProfile, refreshProfile } = useAuth()
  const targetId = userId || user?.id

  const [profile, setProfile] = useState(null)
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!targetId) return
    loadProfile()
  }, [targetId])

  async function loadProfile() {
    try {
      setLoading(true)
      const [profileData, postsData] = await Promise.all([
        profileService.getProfile(targetId),
        profileService.getUserPosts(targetId),
      ])
      setProfile(profileData)
      setPosts(postsData)
    } catch (err) {
      toast.error('Could not load profile.')
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile(updates) {
    setSaving(true)
    try {
      const updated = await profileService.updateProfile(targetId, updates)
      setProfile(updated)
      await refreshProfile()
      toast.success('Profile updated.')
      return updated
    } catch (err) {
      toast.error('Could not update profile.')
    } finally {
      setSaving(false)
    }
  }

  async function uploadAvatar(file) {
  setUploading(true)
  try {
    const url = await profileService.uploadAvatar(targetId, file)
    // Force new object reference so React re-renders the image
    setProfile(prev => ({ ...prev, avatar_url: url }))
    await refreshProfile()
    toast.success('Looking good!')
    return url
  } catch (err) {
    toast.error('Could not upload avatar.')
  } finally {
    setUploading(false)
  }
}

  return {
    profile,
    posts,
    loading,
    saving,
    uploading,
    updateProfile,
    uploadAvatar,
    reload: loadProfile,
  }
}