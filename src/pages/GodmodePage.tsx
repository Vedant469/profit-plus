import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Mail,
  Shield,
  Check,
  X,
  RefreshCw,
  Eye,
  MessageSquare,
  Building2,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Link, useNavigate } from 'react-router-dom'

interface Lead {
  id: string
  name: string
  email: string
  company: string | null
  budget: string | null
  message: string | null
  created_at: string
  client_id: string | null
}

interface Profile {
  id: string
  email: string
  name: string | null
  company: string | null
  approved: boolean
  role: 'client' | 'admin' | 'super_admin'
  created_at: string
}

export default function GodmodePage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'leads' | 'users'>('leads')
  const [selected, setSelected] = useState<Lead | null>(null)

  const [authorized, setAuthorized] = useState(false)
  const [checking, setChecking] = useState(true)

  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  const navigate = useNavigate()

  const checkAdminAccess = useCallback(async () => {
    try {
      setChecking(true)
      setError('')

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        throw userError
      }

      if (!user) {
        navigate('/login')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) {
        throw profileError
      }

      const isAdmin =
        profile?.role === 'admin' || profile?.role === 'super_admin'

      if (!isAdmin) {
        navigate('/dashboard')
        return
      }

      setAuthorized(true)
    } catch (err) {
      console.error('Admin access check failed:', err)

      setAuthorized(false)
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to verify administrator access.'
      )
    } finally {
      setChecking(false)
    }
  }, [navigate])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setActionError('')

      const [
        { data: leadsData, error: leadsError },
        { data: profilesData, error: profilesError },
      ] = await Promise.all([
        supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false }),

        supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false }),
      ])

      if (leadsError) {
        throw leadsError
      }

      if (profilesError) {
        throw profilesError
      }

      setLeads((leadsData ?? []) as Lead[])
      setProfiles((profilesData ?? []) as Profile[])
    } catch (err) {
      console.error('GodMode data fetch failed:', err)

      setActionError(
        err instanceof Error
          ? err.message
          : 'Unable to load administrator data.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAdminAccess()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAdminAccess()
    })

    return () => subscription.unsubscribe()
  }, [checkAdminAccess])

  useEffect(() => {
    if (authorized) {
      fetchData()
    }
  }, [authorized, fetchData])

  const toggleApproval = async (
    id: string,
    current: boolean
  ) => {
    try {
      setActionError('')

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ approved: !current })
        .eq('id', id)

      if (updateError) {
        throw updateError
      }

      await fetchData()
    } catch (err) {
      console.error('Approval update failed:', err)

      setActionError(
        err instanceof Error
          ? err.message
          : 'Unable to update approval status.'
      )
    }
  }

  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            'linear-gradient(135deg, #0d0520, #1a0a35, #020617)',
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{
              borderColor: 'rgba(139,92,246,0.3)',
              borderTopColor: '#8b5cf6',
            }}
          />

          <p className="text-gray-500 text-sm animate-pulse">
            Verifying administrator access...
          </p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          background:
            'linear-gradient(135deg, #0d0520, #1a0a35, #020617)',
        }}
      >
        <div className="max-w-md text-center">
          <Shield className="mx-auto h-10 w-10 text-red-400" />

          <h1 className="mt-4 text-xl font-bold text-white">
            Administrator access required
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Your account does not have administrator privileges.
          </p>

          <Link
            to="/dashboard"
            className="mt-5 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/20"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'linear-gradient(135deg, #0d0520, #1a0a35, #020617)',
      }}
    >
      {/* Header */}
      <div
        className="border-b sticky top-0 z-50"
        style={{
          borderColor: 'rgba(139,92,246,0.2)',
          background: 'rgba(13,5,32,0.95)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                boxShadow:
                  '0 0 20px rgba(139,92,246,0.4)',
              }}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>

            <div>
              <span className="font-black text-white text-lg">
                God
              </span>

              <span
                className="font-black text-lg"
                style={{ color: '#8b5cf6' }}
              >
                Mode
              </span>

              <span className="text-xs text-gray-500 ml-2 hidden sm:inline">
                Administrator Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all disabled:opacity-50"
              style={{
                background: 'rgba(139,92,246,0.1)',
                border:
                  '1px solid rgba(139,92,246,0.2)',
                color: '#a78bfa',
              }}
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  loading ? 'animate-spin' : ''
                }`}
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>

            <Link
              to="/"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Error */}
        {(error || actionError) && (
          <div
            className="flex items-start gap-3 rounded-2xl p-4"
            style={{
              background: 'rgba(239,68,68,0.06)',
              border:
                '1px solid rgba(239,68,68,0.16)',
            }}
          >
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />

            <p className="text-sm text-red-300">
              {error || actionError}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Leads',
              value: leads.length,
              icon: Mail,
              color: '#00ff88',
            },
            {
              label: 'Total Users',
              value: profiles.length,
              icon: Users,
              color: '#8b5cf6',
            },
            {
              label: 'Approved',
              value: profiles.filter(
                (profile) => profile.approved
              ).length,
              icon: Check,
              color: '#06b6d4',
            },
            {
              label: 'Pending',
              value: profiles.filter(
                (profile) => !profile.approved
              ).length,
              icon: Eye,
              color: '#f59e0b',
            },
          ].map(
            ({ label, value, icon: Icon, color }, index) => (
              <motion.div
                key={label}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.1,
                }}
                className="p-5 rounded-2xl"
                style={{
                  background:
                    'rgba(255,255,255,0.03)',
                  border:
                    '1px solid rgba(139,92,246,0.1)',
                }}
              >
                <Icon
                  className="w-5 h-5 mb-3"
                  style={{ color }}
                />

                <p className="text-2xl font-black text-white mb-1">
                  {value}
                </p>

                <p className="text-gray-500 text-sm">
                  {label}
                </p>
              </motion.div>
            )
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['leads', 'users'] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  setSelected(null)
                }}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all capitalize"
                style={{
                  background:
                    activeTab === tab
                      ? 'rgba(139,92,246,0.2)'
                      : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${
                    activeTab === tab
                      ? 'rgba(139,92,246,0.5)'
                      : 'rgba(255,255,255,0.08)'
                  }`,
                  color:
                    activeTab === tab
                      ? '#a78bfa'
                      : '#6b7280',
                }}
              >
                {tab} (
                {tab === 'leads'
                  ? leads.length
                  : profiles.length}
                )
              </button>
            )
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{
                borderColor:
                  'rgba(139,92,246,0.3)',
                borderTopColor: '#8b5cf6',
              }}
            />
          </div>
        ) : activeTab === 'leads' ? (
          <div className="space-y-3">
            {leads.length === 0 ? (
              <div
                className="text-center py-16 text-gray-500 rounded-2xl"
                style={{
                  background:
                    'rgba(255,255,255,0.02)',
                  border:
                    '1px solid rgba(255,255,255,0.05)',
                }}
              >
                No leads yet.
              </div>
            ) : (
              leads.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.03,
                  }}
                  className="p-5 rounded-2xl"
                  style={{
                    background:
                      'rgba(255,255,255,0.03)',
                    border:
                      '1px solid rgba(139,92,246,0.08)',
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                        style={{
                          background:
                            'linear-gradient(135deg, #00ff88, #00cc6a)',
                          color: '#020617',
                        }}
                      >
                        {lead.name
                          ?.slice(0, 1)
                          .toUpperCase() || '?'}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-white font-semibold">
                            {lead.name}
                          </p>

                          {lead.budget && (
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                background:
                                  'rgba(0,255,136,0.1)',
                                color: '#00ff88',
                                border:
                                  '1px solid rgba(0,255,136,0.2)',
                              }}
                            >
                              {lead.budget}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1 text-gray-400 text-xs">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </span>

                          {lead.company && (
                            <span className="flex items-center gap-1 text-gray-400 text-xs">
                              <Building2 className="w-3 h-3" />
                              {lead.company}
                            </span>
                          )}

                          <span className="flex items-center gap-1 text-gray-500 text-xs">
                            <Calendar className="w-3 h-3" />
                            {new Date(
                              lead.created_at
                            ).toLocaleDateString(
                              'en-IN'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-14 md:ml-0">
                      <button
                        onClick={() =>
                          setSelected(
                            selected?.id === lead.id
                              ? null
                              : lead
                          )
                        }
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                        style={{
                          background:
                            'rgba(139,92,246,0.1)',
                          color: '#a78bfa',
                          border:
                            '1px solid rgba(139,92,246,0.2)',
                        }}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Message
                      </button>

                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                        style={{
                          background:
                            'rgba(0,255,136,0.1)',
                          color: '#00ff88',
                          border:
                            '1px solid rgba(0,255,136,0.2)',
                        }}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Reply
                      </a>
                    </div>
                  </div>

                  {selected?.id === lead.id &&
                    lead.message && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          height: 0,
                        }}
                        animate={{
                          opacity: 1,
                          height: 'auto',
                        }}
                        className="mt-4 p-4 rounded-xl"
                        style={{
                          background:
                            'rgba(139,92,246,0.05)',
                          border:
                            '1px solid rgba(139,92,246,0.1)',
                        }}
                      >
                        <p className="text-gray-300 text-sm leading-relaxed">
                          "{lead.message}"
                        </p>
                      </motion.div>
                    )}
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {profiles.length === 0 ? (
              <div
                className="text-center py-16 text-gray-500 rounded-2xl"
                style={{
                  background:
                    'rgba(255,255,255,0.02)',
                  border:
                    '1px solid rgba(255,255,255,0.05)',
                }}
              >
                No users yet.
              </div>
            ) : (
              profiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.03,
                  }}
                  className="flex items-center justify-between p-5 rounded-2xl"
                  style={{
                    background:
                      'rgba(255,255,255,0.03)',
                    border:
                      '1px solid rgba(139,92,246,0.08)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{
                        background:
                          'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                        color: 'white',
                      }}
                    >
                      {profile.email
                        ?.slice(0, 1)
                        .toUpperCase() || '?'}
                    </div>

                    <div>
                      <p className="text-white font-medium text-sm">
                        {profile.name || 'No name'}
                      </p>

                      <p className="text-gray-400 text-xs">
                        {profile.email}
                      </p>

                      {profile.company && (
                        <p className="text-gray-500 text-xs">
                          {profile.company}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-600 text-xs">
                          {new Date(
                            profile.created_at
                          ).toLocaleDateString(
                            'en-IN'
                          )}
                        </p>

                        <span className="text-gray-700">
                          •
                        </span>

                        <span className="text-xs font-medium capitalize text-violet-400">
                          {profile.role.replace(
                            '_',
                            ' '
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: profile.approved
                          ? 'rgba(0,255,136,0.1)'
                          : 'rgba(245,158,11,0.1)',
                        color: profile.approved
                          ? '#00ff88'
                          : '#f59e0b',
                        border: `1px solid ${
                          profile.approved
                            ? 'rgba(0,255,136,0.2)'
                            : 'rgba(245,158,11,0.2)'
                        }`,
                      }}
                    >
                      {profile.approved
                        ? 'Approved'
                        : 'Pending'}
                    </span>

                    <button
                      onClick={() =>
                        toggleApproval(
                          profile.id,
                          profile.approved
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                      style={{
                        background:
                          profile.approved
                            ? 'rgba(239,68,68,0.1)'
                            : 'rgba(0,255,136,0.1)',
                        color: profile.approved
                          ? '#f87171'
                          : '#00ff88',
                        border: `1px solid ${
                          profile.approved
                            ? 'rgba(239,68,68,0.2)'
                            : 'rgba(0,255,136,0.2)'
                        }`,
                      }}
                    >
                      {profile.approved ? (
                        <>
                          <X className="w-3.5 h-3.5" />
                          Revoke
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}