import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  AlertCircle,
  DollarSign,
  RefreshCw,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { supabase } from '../../lib/supabase'

type Campaign = {
  id: string
  name: string
  status: string | null
  budget: number | string | null
  spent: number | string | null
  impressions: number | string | null
  clicks: number | string | null
  conversions: number | string | null
  roas: number | string | null
  channel: string | null
  start_date: string | null
  end_date: string | null
}

type Profile = {
  name: string | null
  company: string | null
  approved: boolean | null
}

type MonthlyPoint = {
  month: string
  spend: number
  revenue: number
}

type ChannelPoint = {
  channel: string
  spend: number
  revenue: number
  roas: number
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

function toNumber(value: number | string | null | undefined): number {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

function formatCompact(value: number): string {
  return compactNumberFormatter.format(value)
}

function parseDate(value: string | null): Date | null {
  if (!value) return null

  const parsed = new Date(`${value}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function getMonthKey(value: string | null): string | null {
  const parsed = parseDate(value)
  if (!parsed) return null

  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`
}

function getMonthLabel(value: string | null): string {
  const parsed = parseDate(value)
  if (!parsed) return 'Undated'

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  })
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) return error.message
  return 'Unable to load dashboard data. Please try again.'
}

function SkeletonCard() {
  return (
    <div className="p-5 bg-slate-900 border border-white/5 rounded-2xl animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-white/5 mb-4" />
      <div className="h-7 w-24 rounded bg-white/5 mb-2" />
      <div className="h-4 w-28 rounded bg-white/5" />
    </div>
  )
}

const chartTooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#f8fafc',
}

export default function DashboardOverview() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    setError('')

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw authError
      if (!user) {
        throw new Error('Your session has expired. Please sign in again.')
      }

      const [profileResult, campaignsResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('name, company, approved')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('campaigns')
          .select(
            'id, name, status, budget, spent, impressions, clicks, conversions, roas, channel, start_date, end_date'
          )
          .order('start_date', { ascending: true }),
      ])

      if (profileResult.error) throw profileResult.error
      if (campaignsResult.error) throw campaignsResult.error

      setProfile(profileResult.data)
      setCampaigns((campaignsResult.data ?? []) as Campaign[])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  const metrics = useMemo(() => {
    const totalSpend = campaigns.reduce((sum, campaign) => sum + toNumber(campaign.spent), 0)
    const totalRevenue = campaigns.reduce(
      (sum, campaign) =>
        sum + toNumber(campaign.spent) * toNumber(campaign.roas),
      0
    )
    const totalImpressions = campaigns.reduce(
      (sum, campaign) => sum + toNumber(campaign.impressions),
      0
    )
    const totalClicks = campaigns.reduce(
      (sum, campaign) => sum + toNumber(campaign.clicks),
      0
    )
    const totalConversions = campaigns.reduce(
      (sum, campaign) => sum + toNumber(campaign.conversions),
      0
    )
    const activeCampaigns = campaigns.filter((campaign) =>
      (campaign.status ?? '').trim().toLowerCase() === 'active'
    ).length
    const blendedRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0
    const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : 0

    return {
      totalSpend,
      totalRevenue,
      totalImpressions,
      totalClicks,
      totalConversions,
      activeCampaigns,
      blendedRoas,
      avgCpc,
    }
  }, [campaigns])

  const monthlyPerformance = useMemo<MonthlyPoint[]>(() => {
    const grouped = new Map<string, MonthlyPoint>()

    campaigns.forEach((campaign) => {
      const key = getMonthKey(campaign.start_date)
      if (!key) return

      const existing = grouped.get(key) ?? {
        month: getMonthLabel(campaign.start_date),
        spend: 0,
        revenue: 0,
      }

      const spend = toNumber(campaign.spent)
      existing.spend += spend
      existing.revenue += spend * toNumber(campaign.roas)
      grouped.set(key, existing)
    })

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([, point]) => ({
        month: point.month,
        spend: Math.round(point.spend),
        revenue: Math.round(point.revenue),
      }))
  }, [campaigns])

  const channelBreakdown = useMemo<ChannelPoint[]>(() => {
    const grouped = new Map<string, { spend: number; revenue: number }>()

    campaigns.forEach((campaign) => {
      const channel = campaign.channel?.trim() || 'Other'
      const existing = grouped.get(channel) ?? { spend: 0, revenue: 0 }
      const spend = toNumber(campaign.spent)

      existing.spend += spend
      existing.revenue += spend * toNumber(campaign.roas)
      grouped.set(channel, existing)
    })

    return Array.from(grouped.entries())
      .map(([channel, values]) => ({
        channel,
        spend: values.spend,
        revenue: values.revenue,
        roas: values.spend > 0 ? values.revenue / values.spend : 0,
      }))
      .sort((a, b) => b.roas - a.roas)
  }, [campaigns])

  const displayName =
    profile?.name?.trim() || profile?.company?.trim() || 'there'

  const kpis = [
    {
      label: 'Total Ad Spend',
      value: formatCurrency(metrics.totalSpend),
      detail: 'Across connected campaigns',
      icon: DollarSign,
    },
    {
      label: 'Attributed Revenue',
      value: formatCurrency(metrics.totalRevenue),
      detail: 'Spend × campaign ROAS',
      icon: TrendingUp,
    },
    {
      label: 'Blended ROAS',
      value: `${metrics.blendedRoas.toFixed(2)}x`,
      detail: 'Across connected campaigns',
      icon: Zap,
    },
    {
      label: 'Active Campaigns',
      value: numberFormatter.format(metrics.activeCampaigns),
      detail: `${campaigns.length} total campaigns`,
      icon: Activity,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-7 w-56 rounded bg-white/5 animate-pulse" />
          <div className="h-4 w-80 max-w-full rounded bg-white/5 mt-2 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>

        <div className="h-[330px] bg-slate-900 border border-white/5 rounded-2xl animate-pulse" />
        <div className="h-[330px] bg-slate-900 border border-white/5 rounded-2xl animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[420px] flex items-center justify-center">
        <div className="max-w-md text-center p-8 bg-slate-900 border border-red-500/10 rounded-2xl">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-white font-semibold text-lg">Dashboard unavailable</h2>
          <p className="text-gray-400 text-sm mt-2 leading-6">{error}</p>
          <button
            type="button"
            onClick={() => void loadDashboard(true)}
            disabled={refreshing}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-sm font-semibold hover:bg-emerald-400 transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Campaign Overview
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Welcome back, {displayName}. Here is what your connected campaigns are reporting.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadDashboard(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-gray-300 text-sm hover:bg-white/5 transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing' : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, detail, icon: Icon }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className="p-5 bg-slate-900 border border-white/5 rounded-2xl hover:border-emerald-500/10 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-gray-500">Live data</span>
            </div>

            <p className="text-xl md:text-2xl font-bold text-white mb-1">{value}</p>
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="text-gray-600 text-xs mt-1">{detail}</p>
          </motion.div>
        ))}
      </div>

      {campaigns.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 md:p-12 bg-slate-900 border border-white/5 rounded-2xl text-center"
        >
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Target className="w-7 h-7 text-emerald-400" />
          </div>
          <h2 className="text-white font-semibold text-xl">No campaigns yet</h2>
          <p className="text-gray-400 text-sm leading-6 max-w-md mx-auto mt-2">
            Once campaigns are connected to this workspace, spend, attributed revenue,
            ROAS, and channel performance will appear here.
          </p>
          <button
            type="button"
            onClick={() => void loadDashboard(true)}
            disabled={refreshing}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-gray-200 text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh data
          </button>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.28 }}
            className="p-5 md:p-6 bg-slate-900 border border-white/5 rounded-2xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-white font-semibold text-lg">Revenue vs Spend</h2>
                <p className="text-gray-400 text-sm">
                  Attributed revenue is calculated from campaign spend × ROAS.
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs">
                Connected data
              </span>
            </div>

            {monthlyPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={monthlyPerformance}>
                  <defs>
                    <linearGradient id="dashboardRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dashboardSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    tickFormatter={(value) => `$${(toNumber(value) / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => formatCurrency(toNumber(value))}
                  />
                  <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Attributed Revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#dashboardRevenue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    name="Ad Spend"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#dashboardSpend)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500 text-sm">
                No dated campaign data is available for the trend yet.
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.36 }}
            className="p-5 md:p-6 bg-slate-900 border border-white/5 rounded-2xl"
          >
            <div className="mb-6">
              <h2 className="text-white font-semibold text-lg">Channel Performance</h2>
              <p className="text-gray-400 text-sm">
                Blended ROAS grouped by connected campaign channel.
              </p>
            </div>

            {channelBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={channelBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis
                    dataKey="channel"
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    tickFormatter={(value) => `${toNumber(value).toFixed(1)}x`}
                  />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => `${toNumber(value).toFixed(2)}x`}
                  />
                  <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
                  <Bar dataKey="roas" name="ROAS" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500 text-sm">
                No channel data is available yet.
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.44 }}
            className="p-5 md:p-6 bg-slate-900 border border-white/5 rounded-2xl"
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-white font-semibold text-lg">Quick Stats</h2>
                <p className="text-gray-500 text-xs mt-1">Calculated from connected campaign data</p>
              </div>
              <span className="text-xs text-gray-500">Live</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: 'Total Impressions',
                  value: formatCompact(metrics.totalImpressions),
                  icon: Target,
                  iconClass: 'text-emerald-400',
                },
                {
                  label: 'Total Clicks',
                  value: formatCompact(metrics.totalClicks),
                  icon: Activity,
                  iconClass: 'text-violet-400',
                },
                {
                  label: 'Total Conversions',
                  value: numberFormatter.format(metrics.totalConversions),
                  icon: Zap,
                  iconClass: 'text-emerald-400',
                },
                {
                  label: 'Average CPC',
                  value: formatCurrency(metrics.avgCpc),
                  icon: DollarSign,
                  iconClass: 'text-blue-400',
                },
              ].map(({ label, value, icon: Icon, iconClass }) => (
                <div key={label} className="p-4 bg-white/5 rounded-xl">
                  <Icon className={`w-5 h-5 ${iconClass} mb-2`} />
                  <p className="text-white font-bold text-lg md:text-xl">{value}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      <p className="text-center text-xs text-gray-600">
        Dashboard metrics are calculated from campaigns available to your authenticated workspace.
      </p>
    </div>
  )
}
