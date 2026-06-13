import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

type Mode = 'login' | 'signup' | 'forgot'

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials'
        ? 'Wrong email or password. Please try again.'
        : err.message ?? 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      // Sign up
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, company } },
      })
      if (signUpError) throw signUpError

      // Create profile
      if (data.user) {
        await supabase.from('profiles').insert([{
          id: data.user.id,
          email: data.user.email,
          name,
          company,
          approved: false,
        }]).select()
      }

      // Auto sign in immediately after signup
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        // Email might need confirmation - show message
        setError('Account created! Please check your email to confirm, then sign in.')
        setMode('login')
      } else {
        // Successfully signed in — go to dashboard
        navigate('/dashboard')
      }
    } catch (err: any) {
      if (err.message?.includes('already registered')) {
        setError('An account with this email already exists. Please sign in.')
        setMode('login')
      } else {
        setError(err.message ?? 'Failed to create account')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setResetSent(true)
    } catch (err: any) {
      setError(err.message ?? 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (newMode: Mode) => {
    setMode(newMode)
    setError('')
    setResetSent(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl" style={{ background: 'rgba(0,255,136,0.06)' }} />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(0,200,100,0.04)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00ff88, #00cc6a)', boxShadow: '0 0 20px rgba(0,255,136,0.4)' }}
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-xl">
              Profit<span style={{ color: '#00ff88' }}>Plus</span>
            </span>
          </a>
          <a href="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-xs mb-4 transition-colors">
            ← Back to Home
          </a>
          <h1 className="text-2xl font-bold text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
          </h1>
          <p className="text-gray-400 text-sm">
            {mode === 'login' ? 'Sign in to your client dashboard'
              : mode === 'signup' ? 'Join ProfitPlus — takes 30 seconds'
              : 'We\'ll send you a reset link'}
          </p>
        </div>

        <div className="p-8 bg-slate-900 border border-white/5 rounded-2xl">
          {/* Reset sent */}
          {resetSent ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center gap-4 py-4"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)' }}>
                <CheckCircle className="w-8 h-8" style={{ color: '#00ff88' }} />
              </div>
              <h3 className="text-white font-bold text-lg">Check Your Email!</h3>
              <p className="text-gray-400 text-sm max-w-xs">
                We sent a reset link to <span style={{ color: '#00ff88' }}>{email}</span>. Check your inbox!
              </p>
              <button
                onClick={() => switchMode('login')}
                className="mt-2 text-sm font-medium transition-colors"
                style={{ color: '#00ff88' }}
              >
                ← Back to Sign In
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handleForgotPassword}
              className="space-y-4"
            >
              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Signup fields */}
              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Smith"
                        className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none text-sm transition-colors"
                        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                        onFocus={e => e.target.style.borderColor = '#00ff88'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1.5">Company</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Acme Inc."
                        className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none text-sm transition-colors"
                        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                        onFocus={e => e.target.style.borderColor = '#00ff88'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none text-sm transition-colors"
                    style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                    onFocus={e => e.target.style.borderColor = '#00ff88'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              {/* Password */}
              {mode !== 'forgot' && (
                <div>
                  <label className="block text-gray-400 text-xs mb-1.5">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none text-sm transition-colors"
                      style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                      onFocus={e => e.target.style.borderColor = '#00ff88'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {mode === 'login' && (
                    <div className="text-right mt-1.5">
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        className="text-xs transition-colors hover:opacity-80"
                        style={{ color: '#00ff88' }}
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Confirm password */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-gray-400 text-xs mb-1.5">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none text-sm transition-colors"
                      style={{ borderColor: confirmPassword && confirmPassword !== password ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)' }}
                      onFocus={e => e.target.style.borderColor = '#00ff88'}
                      onBlur={e => e.target.style.borderColor = confirmPassword && confirmPassword !== password ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-red-400 text-xs mt-1">Passwords don't match</p>
                  )}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || (mode === 'signup' && !!confirmPassword && confirmPassword !== password)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 font-bold rounded-xl transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
                  color: '#020617',
                  boxShadow: loading ? 'none' : '0 0 20px rgba(0,255,136,0.3)',
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    {mode === 'login' ? 'Signing in...' : mode === 'signup' ? 'Creating account...' : 'Sending...'}
                  </>
                ) : (
                  mode === 'login' ? 'Sign In to Dashboard'
                    : mode === 'signup' ? 'Create Account & Sign In'
                    : 'Send Reset Link'
                )}
              </button>

              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="w-full text-center text-gray-400 hover:text-white text-sm transition-colors"
                >
                  ← Back to Sign In
                </button>
              )}
            </form>
          )}
        </div>

        {/* Toggle */}
        {mode !== 'forgot' && !resetSent && (
          <p className="text-center text-gray-500 text-sm mt-6">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => switchMode('signup')}
                  className="font-medium transition-colors hover:opacity-80"
                  style={{ color: '#00ff88' }}
                >
                  Create one free
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="font-medium transition-colors hover:opacity-80"
                  style={{ color: '#00ff88' }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        )}

        <p className="text-center text-gray-600 text-xs mt-3">
          Need access?{' '}
          <a href="/contact" style={{ color: '#00ff88' }} className="hover:opacity-80 transition-opacity">
            Contact us
          </a>
        </p>
      </motion.div>
    </div>
  )
}