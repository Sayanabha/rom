import { useState, useEffect, useCallback } from 'react'
import { matchService } from '../services/match.service'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export function useDiscover() {
  const { user } = useAuth()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading]   = useState(true)
  const [match, setMatch]       = useState(null) // matched profile to celebrate

  const load = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const data = await matchService.getDiscoverProfiles(user.id)
      setProfiles(data)
    } catch (err) {
      toast.error('Could not load profiles.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { load() }, [load])

  async function swipe(swipedId, direction) {
    // Remove from stack immediately
    setProfiles(prev => prev.filter(p => p.id !== swipedId))

    try {
      const result = await matchService.swipe({
        swiperId: user.id,
        swipedId,
        direction,
      })
      if (result.matched) {
        const matchedProfile = profiles.find(p => p.id === swipedId)
        setMatch(matchedProfile)
      }
    } catch (err) {
      console.error('Swipe failed:', err)
    }
  }

  return {
    profiles,
    loading,
    match,
    swipe,
    clearMatch: () => setMatch(null),
    reload: load,
  }
}

export function useMatches() {
  const { user } = useAuth()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    matchService.getMatches(user.id)
      .then(setMatches)
      .catch(err => toast.error('Could not load matches.'))
      .finally(() => setLoading(false))
  }, [user])

  return { matches, loading }
}