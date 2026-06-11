import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Zap, Activity, Target } from 'lucide-react'
import { kpiSummary, monthlyPerformance, channelBreakdown } from '../../data/mockData'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const kpiIcons = [DollarSign, TrendingUp, Zap, Activity]

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">Campaign Overview</h1>
        <p className="text-gray-400 mt-1 text-sm">Welcome back, Sarah. Here's how your campaigns are performing.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiSummary.map((kpi, i) => {
          const Icon = kpiIcons[i] ?? Activity
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-5 bg-slate-900 border border-white/5 rounded-2xl hover:border-amber-500/10 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium ${kpi.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {kpi.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-white mb-1">{kpi.value}</p>
              <p className="text-gray-400 text-sm">{kpi.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="p-5 md:p-6 bg-slate-900 border border-white/5 rounded-2xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-white font-semibold text-lg">Revenue vs Spend</h2>
            <p className="text-gray-400 text-sm">Last 6 months performance</p>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">+31% vs last period</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={monthlyPerformance}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
            <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f8fafc' }} />
            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#f59e0b" strokeWidth={2} fill="url(#colorRevenue)" />
            <Area type="monotone" dataKey="spend" name="Ad Spend" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorSpend)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Channel Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="p-5 md:p-6 bg-slate-900 border border-white/5 rounded-2xl"
      >
        <div className="mb-6">
          <h2 className="text-white font-semibold text-lg">Channel Performance</h2>
          <p className="text-gray-400 text-sm">ROAS by marketing channel</p>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={channelBreakdown}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
            <XAxis dataKey="channel" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 10 }} />
            <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f8fafc' }} />
            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
            <Bar dataKey="roas" name="ROAS" fill="#f59e0b" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="p-5 md:p-6 bg-slate-900 border border-white/5 rounded-2xl"
      >
        <h2 className="text-white font-semibold text-lg mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Impressions', value: '24.8M', icon: Target, color: 'text-amber-400' },
            { label: 'Total Clicks', value: '288K', icon: Activity, color: 'text-violet-400' },
            { label: 'Total Conversions', value: '8,100', icon: Zap, color: 'text-emerald-400' },
            { label: 'Avg. CPC', value: '$1.21', icon: DollarSign, color: 'text-blue-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="p-4 bg-white/5 rounded-xl">
              <Icon className={`w-5 h-5 ${color} mb-2`} />
              <p className="text-white font-bold text-lg md:text-xl">{value}</p>
              <p className="text-gray-400 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}