import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  User,
  ArrowLeft,
  Loader2,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

type Mode = 'login' | 'signup' | 'forgot'

function getAuthErrorMessage(error: unknown, mode: Mode) {
  const message = error instanceof Error ? error.message : String(error ?? '')
  const normalized = message.toLowerCase()

  if (
    normalized.includes('failed to fetch') ||
    normalized.includes('networkerror') ||
    normalized.includes('fetch failed') ||
    normalized.includes('load failed')
  ) {
    return 'We could not reach the authentication service. Check your Supabase URL, environment variables, and network connection.'
  }

  if (normalized.includes('invalid login credentials')) {
    return 'Wrong email or password. Please try again.'
  }

  if (normalized.includes('email not confirmed')) {
    return 'Please confirm your email address before signing in.'
  }

  if (normalized.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.'
  }

  if (normalized.includes('user already registered') || normalized.includes('already registered')) {
    return 'An account with this email already exists. Please sign in instead.'
  }

  if (normalized.includes('password should be at least')) {
    return 'Password must be at least 6 characters.'
  }

  if (mode === 'forgot') {
    return message || 'We could not send the reset link. Please try again.'
  }

  if (mode === 'signup') {
    return message || 'We could not create your account. Please try again.'
  }

  return message || 'Sign in failed. Please try again.'
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<Mode>('login')
  const [resetSent, setResetSent] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      setError('Enter your email and password to continue.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      })

      if (signInError) throw signInError

      navigate('/dashboard')
    } catch (err) {
      setError(getAuthErrorMessage(err, 'login'))
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault()

    const trimmedEmail = email.trim()
    const trimmedName = name.trim()
    const trimmedCompany = company.trim()

    setError('')

    if (!trimmedName) {
      setError('Enter your full name.')
      return
    }

    if (!trimmedEmail) {
      setError('Enter your email address.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            name: trimmedName,
            company: trimmedCompany,
          },
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').upsert(
          {
            id: data.user.id,
            email: data.user.email,
            name: trimmedName,
            company: trimmedCompany,
            approved: false,
          },
          { onConflict: 'id' },
        )

        if (profileError) {
          console.warn('Profile creation failed:', profileError.message)
        }
      }

      if (data.session) {
        navigate('/dashboard')
        return
      }

      setMode('login')
      setPassword('')
      setConfirmPassword('')
      setError('Account created. Check your email to confirm your account, then sign in.')
    } catch (err) {
      setError(getAuthErrorMessage(err, 'signup'))
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault()

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setError('Enter your email address first.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) throw resetError

      setResetSent(true)
    } catch (err) {
      setError(getAuthErrorMessage(err, 'forgot'))
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (newMode: Mode) => {
    setMode(newMode)
    setError('')
    setResetSent(false)
  }

  const title =
    mode === 'login' ? 'Welcome Back' :
    mode === 'signup' ? 'Create Your Account' :
    'Reset Password'

  const subtitle =
    mode === 'login' ? 'Access your growth dashboard' :
    mode === 'signup' ? 'Create an account to access your workspace' :
    'We will send a secure reset link to your inbox'

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-12 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: 'rgba(0,255,136,0.05)' }}
        />
        <div
          className="absolute bottom-0 right-0 h-96 w-96 rounded-full blur-3xl"
          style={{ background: 'rgba(139,92,246,0.05)' }}
        />
      </div>

      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-md flex-col justify-center"
      >
        <div className="mb-7 text-center">
          <a
            href="/"
            className="mx-auto mb-4 inline-flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="Back to ProfitPlus home"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
                boxShadow: '0 0 24px rgba(0,255,136,0.28)',
              }}
            >
              <TrendingUp className="h-5 w-5 text-slate-950" />
            </div>
            <span className="text-xl font-bold">
              Profit<span style={{ color: '#00ff88' }}>Plus</span>
            </span>
          </a>

          <a
            href="/"
            className="mx-auto inline-flex items-center gap-1.5 text-xs text-gray-500 transition-colors hover:text-gray-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </a>

          <div className="mt-5">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-gray-400">{subtitle}</p>
          </div>
        </div>

        <section className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-black/20 sm:p-8">
          {resetSent ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-6 text-center"
            >
              <div
                className="mb-5 flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  background: 'rgba(0,255,136,0.1)',
                  border: '1px solid rgba(0,255,136,0.28)',
                }}
              >
                <CheckCircle className="h-8 w-8" style={{ color: '#00ff88' }} />
              </div>

              <h2 className="text-xl font-bold">Check your email</h2>
              <p className="mt-2 max-w-xs text-sm leading-6 text-gray-400">
                We sent a password reset link to{' '}
                <span style={{ color: '#00ff88' }}>{email.trim()}</span>.
              </p>

              <button
                type="button"
                onClick={() => switchMode('login')}
                className="mt-6 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ color: '#00ff88' }}
              >
                Back to Sign In
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={
                mode === 'login'
                  ? handleLogin
                  : mode === 'signup'
                    ? handleSignup
                    : handleForgotPassword
              }
              className="space-y-4"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-4"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                  <p className="text-sm leading-5 text-red-300">{error}</p>
                </motion.div>
              )}

              {mode === 'signup' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-gray-400">
                      Full Name *
                    </span>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        autoComplete="name"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-emerald-400"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-gray-400">
                      Company
                    </span>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Company name"
                        autoComplete="organization"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-emerald-400"
                      />
                    </div>
                  </label>
                </div>
              )}

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-gray-400">
                  Email Address *
                </span>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-emerald-400"
                  />
                </div>
              </label>

              {mode !== 'forgot' && (
                <label className="block">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">Password *</span>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        className="text-xs font-medium transition-opacity hover:opacity-80"
                        style={{ color: '#00ff88' }}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-12 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-emerald-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </label>
              )}

              {mode === 'signup' && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-gray-400">
                    Confirm Password *
                  </span>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full rounded-xl border bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-emerald-400"
                      style={{
                        borderColor:
                          confirmPassword && confirmPassword !== password
                            ? 'rgba(239,68,68,0.55)'
                            : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="mt-1.5 text-xs text-red-400">Passwords do not match.</p>
                  )}
                </label>
              )}

              <button
                type="submit"
                disabled={
                  loading ||
                  (mode === 'signup' &&
                    !!confirmPassword &&
                    confirmPassword !== password)
                }
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
                  color: '#020617',
                  boxShadow: loading ? 'none' : '0 0 22px rgba(0,255,136,0.22)',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {mode === 'login'
                      ? 'Signing in...'
                      : mode === 'signup'
                        ? 'Creating account...'
                        : 'Sending link...'}
                  </>
                ) : mode === 'login' ? (
                  'Sign In to Dashboard'
                ) : mode === 'signup' ? (
                  'Create Account'
                ) : (
                  'Send Reset Link'
                )}
              </button>

              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="flex w-full items-center justify-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Sign In
                </button>
              )}
            </form>
          )}
        </section>

        {!resetSent && (
          <div className="mt-6 text-center">
            {mode !== 'forgot' && (
              <p className="text-sm text-gray-500">
                {mode === 'login' ? (
                  <>
                    Need an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className="font-semibold transition-opacity hover:opacity-80"
                      style={{ color: '#00ff88' }}
                    >
                      Create one
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="font-semibold transition-opacity hover:opacity-80"
                      style={{ color: '#00ff88' }}
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            )}

            <p className="mt-2 text-xs text-gray-600">
              Need client access?{' '}
              <a
                href="/contact"
                className="transition-opacity hover:opacity-80"
                style={{ color: '#00ff88' }}
              >
                Contact us
              </a>
            </p>
          </div>
        )}
      </motion.main>
    </div>
  )
}
