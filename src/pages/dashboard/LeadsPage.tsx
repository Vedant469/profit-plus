import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Download, Mail, Building2, DollarSign, MessageSquare, Calendar, Eye, X } from 'lucide-react'
import { useLeads } from '../../hooks/useSupabase'

const budgetColors: Record<string, string> = {
  '50k-1L': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  '1L-2.5L': 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  '2.5L-5L': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  '5L+': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
}

export default function LeadsPage() {
  const { data: leads, loading } = useLeads()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any>(null)

  const filtered = leads.filter((l) =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.email?.toLowerCase().includes(search.toLowerCase()) ||
    l.company?.toLowerCase().includes(search.toLowerCase())
  )

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Company', 'Budget', 'Message', 'Date']
    const rows = leads.map((l) => [
      l.name,
      l.email,
      l.company ?? '',
      l.budget ?? '',
      `"${l.message?.replace(/"/g, '""')}"`,
      new Date(l.created_at).toLocaleDateString(),
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'profitplus-leads.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Leads</h1>
          <p className="text-gray-400 mt-1 text-sm">All contact form submissions from your website.</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold rounded-xl transition-all"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: leads.length, color: 'text-emerald-400' },
          { label: 'This Week', value: leads.filter(l => new Date(l.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, color: 'text-blue-400' },
          { label: 'High Budget', value: leads.filter(l => l.budget === '5L+').length, color: 'text-emerald-400' },
          { label: 'Today', value: leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length, color: 'text-violet-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 bg-slate-900 border border-white/5 rounded-xl hover:border-emerald-500/10 transition-all">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-gray-400 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search leads by name, email or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
        />
      </div>

      {/* Leads List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-500 bg-slate-900 border border-white/5 rounded-2xl">
            No leads found.
          </div>
        ) : (
          filtered.map((lead, i) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-white/5 rounded-2xl hover:border-emerald-500/10 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{lead.name?.[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{lead.name}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-gray-400 text-xs">
                      <Mail className="w-3 h-3" />{lead.email}
                    </span>
                    {lead.company && (
                      <span className="flex items-center gap-1 text-gray-400 text-xs">
                        <Building2 className="w-3 h-3" />{lead.company}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Calendar className="w-3 h-3" />
                      {new Date(lead.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-14 sm:ml-0">
                {lead.budget && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${budgetColors[lead.budget] ?? 'text-gray-400 bg-gray-500/10 border-gray-500/20'}`}>
                    {lead.budget}
                  </span>
                )}
                <button
                  onClick={() => setSelected(lead)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 text-gray-400 hover:text-emerald-400 text-xs font-medium rounded-xl transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Reply
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Lead Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg">Lead Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { icon: Mail, label: 'Name', value: selected.name },
                { icon: Mail, label: 'Email', value: selected.email },
                { icon: Building2, label: 'Company', value: selected.company || 'Not provided' },
                { icon: DollarSign, label: 'Budget', value: selected.budget || 'Not specified' },
                { icon: Calendar, label: 'Submitted', value: new Date(selected.created_at).toLocaleString('en-IN') },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                  <Icon className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs">{label}</p>
                    <p className="text-white text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}

              <div className="p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <p className="text-gray-400 text-xs">Message</p>
                </div>
                <p className="text-white text-sm leading-relaxed">{selected.message}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelected(null)}
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 text-gray-400 text-sm font-medium rounded-xl hover:bg-white/10 transition-all"
              >
                Close
              </button>
              <a
                href={`mailto:${selected.email}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold rounded-xl transition-all"
              >
                <Mail className="w-4 h-4" />
                Reply Now
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}