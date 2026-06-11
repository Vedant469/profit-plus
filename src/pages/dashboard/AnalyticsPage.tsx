import { motion } from 'framer-motion'
import { TrendingUp, Eye, MousePointer, ShoppingCart } from 'lucide-react'
import { monthlyPerformance, channelBreakdown } from '../../data/mockData'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const COLORS = ['#f59e0b', '#8b5cf6', '#10b981', '#3b82f6', '#ef4444', '#06b6d4']

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 mt-1 text-sm">Deep dive into your campaign performance data.</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Impressions', value: '109.8M', change: '+22%', icon: Eye, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
          { label: 'Total Clicks', value: '1.29M', change: '+18%', icon: MousePointer, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
          { label: 'Total Conversions', value: '36.3K', change: '+31%', icon: ShoppingCart, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Avg. ROAS', value: '4.72x', change: '+0.8x', icon: TrendingUp, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
        ].map(({ label, value, change, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 md:p-5 bg-slate-900 border border-white/5 rounded-2xl hover:border-amber-500/10 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-white mb-1">{value}</p>
            <p className="text-gray-400 text-xs mb-1">{label}</p>
            <span className="text-emerald-400 text-xs font-medium">{change} vs last period</span>
          </motion.div>
        ))}
      </div>

      {/* Clicks & Conversions Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-5 md:p-6 bg-slate-900 border border-white/5 rounded-2xl"
      >
        <div className="mb-6">
          <h2 className="text-white font-semibold text-lg">Clicks & Conversions Trend</h2>
          <p className="text-gray-400 text-sm">Monthly performance over the last 6 months</p>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
            <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f8fafc' }} />
            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
            <Line type="monotone" dataKey="clicks" name="Clicks" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="conversions" name="Conversions" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Channel Spend vs Revenue + Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-5 md:p-6 bg-slate-900 border border-white/5 rounded-2xl"
        >
          <div className="mb-6">
            <h2 className="text-white font-semibold text-lg">Spend vs Revenue by Channel</h2>
            <p className="text-gray-400 text-sm">Grouped comparison across channels</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={channelBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis type="number" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 10 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="channel" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 10 }} width={75} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f8fafc' }} />
              <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
              <Bar dataKey="spend" name="Spend" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="revenue" name="Revenue" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-5 md:p-6 bg-slate-900 border border-white/5 rounded-2xl"
        >
          <div className="mb-6">
            <h2 className="text-white font-semibold text-lg">Spend Distribution</h2>
            <p className="text-gray-400 text-sm">Budget allocation by channel</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={channelBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="spend"
                nameKey="channel"
              >
                {channelBreakdown.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f8fafc' }} />
              <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}