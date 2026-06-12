import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'forgot'>('login')
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
      setError(err.message ?? 'Invalid email or password')
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

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-xl">
              Profit<span className="text-amber-400">Plus</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {mode === 'login' ? 'Client Portal' : 'Reset Password'}
          </h1>
          <p className="text-gray-400 text-sm">
            {mode === 'login'
              ? 'Sign in to access your campaign dashboard'
              : 'Enter your email to receive a reset link'}
          </p>
        </div>

        {/* Card */}
        <div className="p-8 bg-slate-900 border border-white/5 rounded-2xl">

          {/* Reset sent success */}
          {resetSent ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-white font-bold text-lg">Check Your Email!</h3>
              <p className="text-gray-400 text-sm max-w-xs">
                We sent a password reset link to <span className="text-amber-400">{email}</span>. Check your inbox and follow the instructions.
              </p>
              <button
                onClick={() => { setMode('login'); setResetSent(false) }}
                className="mt-2 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={mode === 'login' ? handleLogin : handleForgotPassword} className="space-y-5">
              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Password (login only) */}
              {mode === 'login' && (
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-right mt-2">
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError('') }}
                      className="text-amber-400 hover:text-amber-300 text-xs transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-70 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    {mode === 'login' ? 'Signing in...' : 'Sending...'}
                  </>
                ) : (
                  mode === 'login' ? 'Sign In to Dashboard' : 'Send Reset Link'
                )}
              </button>

              {/* Toggle mode */}
              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError('') }}
                  className="w-full text-center text-gray-400 hover:text-white text-sm transition-colors"
                >
                  ← Back to Sign In
                </button>
              )}
            </form>
          )}
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have access?{' '}
          <a href="/contact" className="text-amber-400 hover:text-amber-300 transition-colors">
            Contact us
          </a>
        </p>
      </motion.div>
    </div>
  )
}