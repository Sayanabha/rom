import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Flame, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService, TEST_USER } from '../../services/auth.service'
import Logo from '../../components/ui/Logo'
export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.signIn({ email, password })
      toast.success('Welcome back!')
      navigate('/feed')
    } catch (err) {
      toast.error(err.message || 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function fillTestUser() {
    setEmail(TEST_USER.email)
    setPassword(TEST_USER.password)
  }

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col justify-between px-6 py-10 max-w-md mx-auto">

      {/* Logo */}
<div className="flex flex-col items-center gap-2 mt-8 animate-fade-in">
  <Logo size="lg" showWordmark showTagline animate />
</div>

      {/* Form */}
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 animate-slide-up"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Hey, you.
          </h2>
          <p className="text-gray-400 text-sm">
            Good to see you again. Let's pick up where you left off.
          </p>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input-base"
            required
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">
            Password
          </label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="your secret weapon"
              className="input-base pr-12"
              required
              autoComplete="current-password"
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

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
        >
          {loading
            ? <Loader2 size={18} className="animate-spin" />
            : 'Log in'
          }
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs font-medium">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Test user shortcut */}
        <button
          type="button"
          onClick={fillTestUser}
          className="btn-secondary w-full text-sm"
        >
          Use demo account
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-gray-400 animate-fade-in">
        New here?{' '}
        <Link
          to="/signup"
          className="text-rose-500 font-semibold hover:underline"
        >
          Create your profile
        </Link>
      </p>
    </div>
  )
}