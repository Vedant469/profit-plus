import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Eye,
  MousePointer,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { supabase } from '../../lib/supabase'

interface Campaign {
  id: string
  name: string
  client: string
  status: string
  budget: number | null
  spent: number | null
  impressions: number | null
  clicks: number | null
  conversions: number | null
  roas: number | null
  channel: string | null
  start_date: string | null
  end_date: string | null
  created_at: string
  client_id: string
}

interface ChannelAnalytics {
  channel: string
  spend: number
  revenue: number
  impressions: number
  clicks: number
  conversions: number
  roas: number
}

interface MetricCard {
  label: string
  value: string
  helper: string
  icon: typeof Eye
  color: string
}

const COLORS = [
  '#10b981',
  '#8b5cf6',
  '#3b82f6',
  '#06b6d4',
  '#ef4444',
  '#f59e0b',
]

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value)

const formatDecimal = (value: number, digits = 2) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const formatCompactNumber = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }

  return formatNumber(value)
}

export default function AnalyticsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async (showRefreshState = false) => {
    try {
      if (showRefreshState) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError(null)

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        throw userError
      }

      if (!user) {
        throw new Error('You must be signed in to view analytics.')
      }

      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle()

      if (clientError) {
        throw clientError
      }

      if (!client) {
        setCampaigns([])
        return
      }

      const { data, error: campaignsError } = await supabase
        .from('campaigns')
        .select(
          `
            id,
            name,
            client,
            status,
            budget,
            spent,
            impressions,
            clicks,
            conversions,
            roas,
            channel,
            start_date,
            end_date,
            created_at,
            client_id
          `
        )
        .eq('client_id', client.id)
        .order('created_at', { ascending: false })

      if (campaignsError) {
        throw campaignsError
      }

      setCampaigns((data ?? []) as Campaign[])
    } catch (err) {
      console.error('Analytics fetch error:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load analytics right now.'
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const metrics = useMemo(() => {
    const totalSpend = campaigns.reduce(
      (sum, campaign) => sum + Number(campaign.spent ?? 0),
      0
    )

    const attributedRevenue = campaigns.reduce((sum, campaign) => {
      const spend = Number(campaign.spent ?? 0)
      const roas = Number(campaign.roas ?? 0)

      return sum + spend * roas
    }, 0)

    const impressions = campaigns.reduce(
      (sum, campaign) => sum + Number(campaign.impressions ?? 0),
      0
    )

    const clicks = campaigns.reduce(
      (sum, campaign) => sum + Number(campaign.clicks ?? 0),
      0
    )

    const conversions = campaigns.reduce(
      (sum, campaign) => sum + Number(campaign.conversions ?? 0),
      0
    )

    const blendedRoas =
      totalSpend > 0 ? attributedRevenue / totalSpend : 0

    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0

    const conversionRate =
      clicks > 0 ? (conversions / clicks) * 100 : 0

    const cpa = conversions > 0 ? totalSpend / conversions : 0

    return {
      totalSpend,
      attributedRevenue,
      impressions,
      clicks,
      conversions,
      blendedRoas,
      ctr,
      conversionRate,
      cpa,
    }
  }, [campaigns])

  const channelData = useMemo<ChannelAnalytics[]>(() => {
    const grouped = new Map<string, ChannelAnalytics>()

    campaigns.forEach((campaign) => {
      const channel = campaign.channel?.trim() || 'Unspecified'

      const existing = grouped.get(channel) ?? {
        channel,
        spend: 0,
        revenue: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        roas: 0,
      }

      const spend = Number(campaign.spent ?? 0)
      const roas = Number(campaign.roas ?? 0)
      const revenue = spend * roas

      existing.spend += spend
      existing.revenue += revenue
      existing.impressions += Number(campaign.impressions ?? 0)
      existing.clicks += Number(campaign.clicks ?? 0)
      existing.conversions += Number(campaign.conversions ?? 0)

      grouped.set(channel, existing)
    })

    return Array.from(grouped.values())
      .map((item) => ({
        ...item,
        roas: item.spend > 0 ? item.revenue / item.spend : 0,
      }))
      .sort((a, b) => b.spend - a.spend)
  }, [campaigns])

  const metricsCards = useMemo<MetricCard[]>(
    () => [
      {
        label: 'Total Spend',
        value: formatCurrency(metrics.totalSpend),
        helper: `${campaigns.length} campaign${campaigns.length === 1 ? '' : 's'}`,
        icon: Wallet,
        color:
          'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      },
      {
        label: 'Attributed Revenue',
        value: formatCurrency(metrics.attributedRevenue),
        helper: `${formatDecimal(metrics.blendedRoas)}x blended ROAS`,
        icon: TrendingUp,
        color:
          'text-violet-400 bg-violet-500/10 border-violet-500/20',
      },
      {
        label: 'Total Clicks',
        value: formatCompactNumber(metrics.clicks),
        helper: `${formatDecimal(metrics.ctr, 2)}% CTR`,
        icon: MousePointer,
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      },
      {
        label: 'Conversions',
        value: formatCompactNumber(metrics.conversions),
        helper:
          metrics.conversions > 0
            ? `${formatCurrency(metrics.cpa)} CPA`
            : 'No conversions yet',
        icon: ShoppingCart,
        color:
          'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      },
    ],
    [campaigns.length, metrics]
  )

  const isEmpty = !loading && !error && campaigns.length === 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Analytics
          </h1>

          <p className="text-gray-400 mt-1 text-sm">
            Performance analytics calculated from your live campaign data.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchAnalytics(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-medium text-gray-200 transition hover:border-emerald-500/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
          />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl border border-white/5 bg-slate-900"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <h2 className="font-semibold text-red-300">
            Unable to load analytics
          </h2>

          <p className="mt-1 text-sm text-gray-400">{error}</p>

          <button
            type="button"
            onClick={() => fetchAnalytics()}
            className="mt-4 rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:border-emerald-500/30"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="rounded-2xl border border-white/5 bg-slate-900 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <BarChart3 className="h-6 w-6 text-emerald-400" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-white">
            No campaign data yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
            Create a campaign first. Once campaign performance data exists,
            this page will calculate spend, revenue, ROAS, CTR, conversions,
            and channel performance automatically.
          </p>
        </div>
      )}

      {/* Analytics */}
      {!loading && !error && campaigns.length > 0 && (
        <>
          {/* Top Metrics */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {metricsCards.map(
              ({ label, value, helper, icon: Icon, color }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-2xl border border-white/5 bg-slate-900 p-4 transition-all hover:border-emerald-500/10 md:p-5"
                >
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl border ${color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <p className="mb-1 text-xl font-bold text-white md:text-2xl">
                    {value}
                  </p>

                  <p className="mb-1 text-xs text-gray-400">{label}</p>

                  <span className="text-xs font-medium text-gray-500">
                    {helper}
                  </span>
                </motion.div>
              )
            )}
          </div>

          {/* Secondary metrics */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              {
                label: 'Impressions',
                value: formatCompactNumber(metrics.impressions),
              },
              {
                label: 'CTR',
                value: `${formatDecimal(metrics.ctr, 2)}%`,
              },
              {
                label: 'Conversion Rate',
                value: `${formatDecimal(metrics.conversionRate, 2)}%`,
              },
              {
                label: 'Blended ROAS',
                value: `${formatDecimal(metrics.blendedRoas)}x`,
              },
            ].map(({ label, value }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.06 }}
                className="rounded-2xl border border-white/5 bg-slate-900 p-4"
              >
                <p className="text-xs text-gray-500">{label}</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Channel Spend vs Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-2xl border border-white/5 bg-slate-900 p-5 md:p-6"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">
                Spend vs Revenue by Channel
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Revenue is calculated from campaign spend × ROAS.
              </p>
            </div>

            {channelData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={channelData}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 10,
                    left: 15,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff08"
                  />

                  <XAxis
                    type="number"
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                    tickFormatter={(value: number) =>
                      `$${formatCompactNumber(value)}`
                    }
                  />

                  <YAxis
                    type="category"
                    dataKey="channel"
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                    width={90}
                  />

                  <Tooltip
                    formatter={(value, name) => [
                      formatCurrency(Number(value)),
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#f8fafc',
                    }}
                  />

                  <Legend
                    wrapperStyle={{
                      color: '#9ca3af',
                      fontSize: '12px',
                    }}
                  />

                  <Bar
                    dataKey="spend"
                    name="Spend"
                    fill="#8b5cf6"
                    radius={[0, 4, 4, 0]}
                  />

                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#10b981"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-sm text-gray-500">
                No channel data available.
              </div>
            )}
          </motion.div>

          {/* Channel analytics + spend distribution */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Channel performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="rounded-2xl border border-white/5 bg-slate-900 p-5 md:p-6"
            >
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-white">
                  Channel Performance
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Actual performance aggregated from campaigns.
                </p>
              </div>

              <div className="space-y-3">
                {channelData.map((channel) => (
                  <div
                    key={channel.channel}
                    className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">
                          {channel.channel}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {formatNumber(channel.clicks)} clicks ·{' '}
                          {formatNumber(channel.conversions)} conversions
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-emerald-400">
                          {formatDecimal(channel.roas)}x
                        </p>

                        <p className="text-xs text-gray-500">ROAS</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-gray-500">
                          Spend
                        </p>

                        <p className="mt-1 text-sm text-gray-200">
                          {formatCurrency(channel.spend)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-gray-500">
                          Revenue
                        </p>

                        <p className="mt-1 text-sm text-gray-200">
                          {formatCurrency(channel.revenue)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Spend distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="rounded-2xl border border-white/5 bg-slate-900 p-5 md:p-6"
            >
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-white">
                  Spend Distribution
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Current campaign spend by acquisition channel.
                </p>
              </div>

              {channelData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={2}
                      dataKey="spend"
                      nameKey="channel"
                    >
                      {channelData.map((entry, index) => (
                        <Cell
                          key={`${entry.channel}-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value) =>
                        formatCurrency(Number(value))
                      }
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#f8fafc',
                      }}
                    />

                    <Legend
                      wrapperStyle={{
                        color: '#9ca3af',
                        fontSize: '11px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[280px] items-center justify-center text-sm text-gray-500">
                  No spend distribution available.
                </div>
              )}
            </motion.div>
          </div>

          {/* Campaign summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="rounded-2xl border border-white/5 bg-slate-900 p-5 md:p-6"
          >
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-white">
                Campaign Summary
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Campaign-level data currently used to calculate this report.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-3 font-medium">Campaign</th>
                    <th className="px-3 py-3 font-medium">Channel</th>
                    <th className="px-3 py-3 font-medium">Spend</th>
                    <th className="px-3 py-3 font-medium">Revenue</th>
                    <th className="px-3 py-3 font-medium">ROAS</th>
                    <th className="px-3 py-3 font-medium">Conversions</th>
                  </tr>
                </thead>

                <tbody>
                  {campaigns.map((campaign) => {
                    const spend = Number(campaign.spent ?? 0)
                    const roas = Number(campaign.roas ?? 0)
                    const revenue = spend * roas

                    return (
                      <tr
                        key={campaign.id}
                        className="border-b border-white/5 last:border-0"
                      >
                        <td className="px-3 py-4">
                          <div className="font-medium text-white">
                            {campaign.name}
                          </div>

                          <div className="mt-1 text-xs capitalize text-gray-500">
                            {campaign.status}
                          </div>
                        </td>

                        <td className="px-3 py-4 text-sm text-gray-300">
                          {campaign.channel || 'Unspecified'}
                        </td>

                        <td className="px-3 py-4 text-sm text-gray-300">
                          {formatCurrency(spend)}
                        </td>

                        <td className="px-3 py-4 text-sm text-gray-300">
                          {formatCurrency(revenue)}
                        </td>

                        <td className="px-3 py-4">
                          <span className="text-sm font-semibold text-emerald-400">
                            {formatDecimal(roas)}x
                          </span>
                        </td>

                        <td className="px-3 py-4 text-sm text-gray-300">
                          {formatNumber(
                            Number(campaign.conversions ?? 0)
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}