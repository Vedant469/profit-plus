import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    let active = true

    const verifySession = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (!active) return
      setAuthenticated(!error && !!user?.email_confirmed_at)
      setLoading(false)
      if (error || !user?.email_confirmed_at) {
        await supabase.auth.signOut()
      }
    }

    void verifySession()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      if (!session) {
        setAuthenticated(false)
        setLoading(false)
        return
      }
      // The initial getUser() performs the authoritative confirmation check.
      setAuthenticated(!!session.user.email_confirmed_at)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!authenticated) return <Navigate to="/login" replace />

  return <>{children}</>
}
