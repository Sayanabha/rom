import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Flame, Loader2, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '../../services/auth.service'
import Logo from '../../components/ui/Logo'

const STEPS = ['account', 'identity']

export default function Signup() {
  const navigate = useNavigate()
  const [step, setStep]         = useState(0)
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [form, setForm]         = useState({
    email: '',
    password: '',
    username: '',
    age: '',
    gender: '',
    lookingFor: '',
  })

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function nextStep(e) {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Fill in all fields first.')
      return
    }
    if (form.password.length < 8) {
      toast.error('Password needs at least 8 characters.')
      return
    }
    setStep(1)
  }

  async function handleSignup(e) {
    e.preventDefault()
    if (!form.username || !form.age || !form.gender) {
      toast.error('Tell us a little about yourself first.')
      return
    }
    setLoading(true)
    try {
      await authService.signUp({
        email: form.email,
        password: form.password,
        username: form.username,
      })
      toast.success("You're in. Let the chaos begin.")
      navigate('/feed')
    } catch (err) {
      toast.error(err.message || 'Signup failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col justify-between px-6 py-10 max-w-md mx-auto">

      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mt-4 animate-fade-in">
  <Logo size="md" showWordmark />
</div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 justify-center">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step
                ? 'w-8 bg-rose-500'
                : i < step
                ? 'w-4 bg-rose-300'
                : 'w-4 bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Step 0: Account */}
      {step === 0 && (
        <form
          onSubmit={nextStep}
          className="flex flex-col gap-4 animate-slide-up"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              First things first.
            </h2>
            <p className="text-gray-400 text-sm">
              Your email stays private. Your vibe does not.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="you@example.com"
              className="input-base"
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => update('password', e.target.value)}
                placeholder="make it spicy (8+ chars)"
                className="input-base pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400
                           hover:text-rose-500 transition-colors"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full mt-2">
            Continue
          </button>
        </form>
      )}

      {/* Step 1: Identity */}
      {step === 1 && (
        <form
          onSubmit={handleSignup}
          className="flex flex-col gap-4 animate-slide-up"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Now the fun part.
            </h2>
            <p className="text-gray-400 text-sm">
              Who are you, really? (No wrong answers.)
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={e => update('username', e.target.value)}
              placeholder="something cool, not 'xX_user123_Xx'"
              className="input-base"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Age</label>
            <input
              type="number"
              value={form.age}
              onChange={e => update('age', e.target.value)}
              placeholder="18+"
              min="18"
              max="100"
              className="input-base"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">
              I am a...
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Man', 'Woman', 'Other'].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => update('gender', g.toLowerCase())}
                  className={`py-3 rounded-2xl text-sm font-semibold border transition-all duration-200 ${
                    form.gender === g.toLowerCase()
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">
              Looking for...
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Something real', value: 'relationship' },
                { label: 'Keep it casual', value: 'casual' },
                { label: 'Just friends', value: 'friends' },
                { label: 'Still figuring out', value: 'exploring' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('lookingFor', opt.value)}
                  className={`py-3 px-2 rounded-2xl text-xs font-semibold border transition-all duration-200 ${
                    form.lookingFor === opt.value
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
          >
            {loading
              ? <Loader2 size={18} className="animate-spin" />
              : (<><Sparkles size={16} /> Create my profile</>)
            }
          </button>

          <button
            type="button"
            onClick={() => setStep(0)}
            className="btn-ghost w-full text-sm"
          >
            Go back
          </button>
        </form>
      )}

      {/* Footer */}
      <p className="text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-rose-500 font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}