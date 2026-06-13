import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import { useCampaigns } from '../../hooks/useSupabase'

const statusColors: Record<string, string> = {
  active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  paused: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  completed: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
}

export default function CampaignsPage() {
  const { data: campaignData, loading } = useCampaigns()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = campaignData.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.client.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">Campaigns</h1>
        <p className="text-gray-400 mt-1 text-sm">Track and manage all your active campaigns.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Active', count: campaignData.filter(c => c.status === 'active').length, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Paused', count: campaignData.filter(c => c.status === 'paused').length, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Completed', count: campaignData.filter(c => c.status === 'completed').length, color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' },
        ].map(({ label, count, color }) => (
          <div key={label} className="p-4 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-between hover:border-emerald-500/10 transition-all">
            <span className="text-gray-400 text-sm">{label} Campaigns</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold border ${color}`}>{count}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by campaign or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-sm text-gray-300 outline-none"
          >
            <option value="all" className="bg-slate-900">All Status</option>
            <option value="active" className="bg-slate-900">Active</option>
            <option value="paused" className="bg-slate-900">Paused</option>
            <option value="completed" className="bg-slate-900">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 md:px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wide">Campaign</th>
                <th className="text-left px-4 md:px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wide hidden md:table-cell">Channel</th>
                <th className="text-left px-4 md:px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wide">Status</th>
                <th className="text-right px-4 md:px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wide hidden sm:table-cell">Budget</th>
                <th className="text-right px-4 md:px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wide hidden lg:table-cell">Spent</th>
                <th className="text-right px-4 md:px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wide hidden lg:table-cell">Conversions</th>
                <th className="text-right px-4 md:px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wide">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((campaign, i) => (
                <motion.tr
                  key={campaign.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 md:px-6 py-4">
                    <p className="text-white font-medium text-sm">{campaign.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{campaign.client}</p>
                  </td>
                  <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                    <span className="text-gray-300 text-sm">{campaign.channel}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${statusColors[campaign.status] ?? statusColors['completed']}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right hidden sm:table-cell">
                    <span className="text-gray-300 text-sm">${campaign.budget.toLocaleString()}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right hidden lg:table-cell">
                    <div>
                      <span className="text-gray-300 text-sm">${campaign.spent.toLocaleString()}</span>
                      <div className="w-16 h-1 bg-white/10 rounded-full mt-1 ml-auto">
                        <div
                          className="h-1 bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right hidden lg:table-cell">
                    <span className="text-gray-300 text-sm">{campaign.conversions.toLocaleString()}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    <span className={`text-sm font-bold ${campaign.roas >= 5 ? 'text-emerald-400' : campaign.roas >= 3 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {campaign.roas}x
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-500 text-sm">No campaigns found.</div>
          )}
        </div>
      </motion.div>
    </div>
  )
}