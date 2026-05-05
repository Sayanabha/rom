import { useState, useEffect } from 'react'
import { gameService, GAME_TEMPLATES } from '../services/game.service'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export function useGame() {
  const { user } = useAuth()
  const [predictions, setPredictions] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading]         = useState(true)
  const [creating, setCreating]       = useState(false)

  useEffect(() => {
    if (!user) return
    loadAll()
  }, [user])

  async function loadAll() {
    try {
      setLoading(true)
      const [preds, board] = await Promise.all([
        gameService.getMyPredictions(user.id),
        gameService.getLeaderboard(),
      ])
      setPredictions(preds)
      setLeaderboard(board)
    } catch (err) {
      toast.error('Could not load games.')
    } finally {
      setLoading(false)
    }
  }

  async function createPrediction({ targetId, gameType, answer }) {
    setCreating(true)
    try {
      const template = GAME_TEMPLATES.find(t => t.type === gameType)
      const pred = await gameService.createPrediction({
        creatorId: user.id,
        targetId,
        gameType,
        question:  template.description,
        options:   template.options,
        answer,
      })
      setPredictions(prev => [pred, ...prev])

      // Award points for playing
      await gameService.resolvePrediction(pred.id, 'won')
      toast.success(`+${template.points * 2} points! Nice call.`)
      await loadAll()
    } catch (err) {
      toast.error('Could not create prediction.')
    } finally {
      setCreating(false)
    }
  }

  return {
    predictions,
    leaderboard,
    loading,
    creating,
    createPrediction,
    templates: GAME_TEMPLATES,
  }
}