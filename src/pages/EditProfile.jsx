import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Sparkles } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import { useProfile } from '../hooks/useProfile'
import { getSmartReplies } from '../services/ai'
import toast from 'react-hot-toast'

const GENDER_OPTIONS    = ['man', 'woman', 'other']
const LOOKING_FOR_OPTIONS = [
  { value: 'relationship', label: 'Something real' },
  { value: 'casual',       label: 'Keep it casual' },
  { value: 'friends',      label: 'Just friends' },
  { value: 'exploring',    label: 'Still figuring out' },
]

export default function EditProfile() {
  const navigate = useNavigate()
  const { profile, loading, saving, updateProfile } = useProfile()
  const [form, setForm]           = useState({
    username: '', bio: '', age: '', gender: '', looking_for: '',
  })
  const [improvingBio, setImprovingBio] = useState(false)

  useEffect(() => {
    if (profile) {
      setForm({
        username:   profile.username   ?? '',
        bio:        profile.bio        ?? '',
        age:        profile.age        ?? '',
        gender:     profile.gender     ?? '',
        looking_for: profile.looking_for ?? '',
      })
    }
  }, [profile])

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    if (!form.username.trim()) {
      toast.error('Username cannot be empty.')
      return
    }
    await updateProfile({
      username:    form.username,
      bio:         form.bio,
      age:         form.age ? parseInt(form.age) : null,
      gender:      form.gender,
      looking_for: form.looking_for,
    })
    navigate('/profile')
  }

  async function improveBio() {
    if (!form.bio.trim()) {
      toast.error('Write something first, then let AI make it shine.')
      return
    }
    setImprovingBio(true)
    try {
      const suggestions = await getSmartReplies(
        `Improve this dating profile bio to make it wittier and more attractive: "${form.bio}"`,
        'You are a dating profile expert. Make it punchy, human, and interesting.'
      )
      if (suggestions?.[0]) {
        update('bio', suggestions[0])
        toast.success('Bio upgraded.')
      }
    } catch {
      toast.error('AI improvement failed. Your original is probably fine.')
    } finally {
      setImprovingBio(false)
    }
  }

  if (loading) return <PageWrapper title="Edit Profile" showBack><div /></PageWrapper>

  return (
    <PageWrapper title="Edit Profile" showBack>
      <div className="px-4 pt-4 flex flex-col gap-4">

        {/* Username */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Username</label>
          <input
            type="text"
            value={form.username}
            onChange={e => update('username', e.target.value)}
            className="input-base"
            placeholder="your handle"
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-600">Bio</label>
            <button
              onClick={improveBio}
              disabled={improvingBio}
              className="flex items-center gap-1 text-xs text-rose-500
                         font-semibold hover:text-rose-600 transition-colors"
            >
              {improvingBio
                ? <Loader2 size={12} className="animate-spin" />
                : <Sparkles size={12} />
              }
              AI improve
            </button>
          </div>
          <textarea
            value={form.bio}
            onChange={e => update('bio', e.target.value)}
            placeholder="tell people something real about you..."
            className="input-base resize-none h-28"
            maxLength={300}
          />
          <span className="text-xs text-gray-300 text-right">
            {form.bio.length}/300
          </span>
        </div>

        {/* Age */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Age</label>
          <input
            type="number"
            value={form.age}
            onChange={e => update('age', e.target.value)}
            className="input-base"
            placeholder="18+"
            min="18"
            max="100"
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">I am a...</label>
          <div className="grid grid-cols-3 gap-2">
            {GENDER_OPTIONS.map(g => (
              <button
                key={g}
                type="button"
                onClick={() => update('gender', g)}
                className={`py-3 rounded-2xl text-sm font-semibold border
                            transition-all duration-200 capitalize
                            ${form.gender === g
                              ? 'bg-rose-500 text-white border-rose-500'
                              : 'bg-white text-gray-600 border-gray-200'
                            }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Looking for */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">
            Looking for...
          </label>
          <div className="grid grid-cols-2 gap-2">
            {LOOKING_FOR_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update('looking_for', opt.value)}
                className={`py-3 px-2 rounded-2xl text-xs font-semibold border
                            transition-all duration-200
                            ${form.looking_for === opt.value
                              ? 'bg-rose-500 text-white border-rose-500'
                              : 'bg-white text-gray-600 border-gray-200'
                            }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-2 mb-6"
        >
          {saving
            ? <Loader2 size={16} className="animate-spin" />
            : 'Save changes'
          }
        </button>

      </div>
    </PageWrapper>
  )
}