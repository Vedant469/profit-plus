import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Clock, CheckCircle, Search } from 'lucide-react'
import { useReports } from '../../hooks/useSupabase'

const typeColors: Record<string, string> = {
  'Quarterly Report': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'Monthly Report': 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  'Campaign Report': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'Audit Report': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Strategy Report': 'text-pink-400 bg-pink-500/10 border-pink-500/20',
}

export default function ReportsPage() {
  const { data: reports, loading } = useReports()
  const [search, setSearch] = useState('')

  const filtered = reports.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.client.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">Reports</h1>
        <p className="text-gray-400 mt-1 text-sm">Download and review your campaign reports.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Reports', value: reports.length, color: 'text-amber-400' },
          { label: 'Ready to Download', value: reports.filter(r => r.status === 'ready').length, color: 'text-emerald-400' },
          { label: 'Generating', value: reports.filter(r => r.status === 'generating').length, color: 'text-violet-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-between hover:border-amber-500/10 transition-all">
            <span className="text-gray-400 text-sm">{label}</span>
            <span className={`text-2xl font-bold ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search reports by title or client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
        />
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filtered.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-white/5 rounded-2xl hover:border-amber-500/10 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">{report.title}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-gray-500 text-xs">{report.client}</span>
                  <span className="text-gray-600 text-xs hidden sm:inline">·</span>
                  <span className="text-gray-500 text-xs hidden sm:inline">{report.date}</span>
                  <span className="text-gray-600 text-xs hidden sm:inline">·</span>
                  <span className="text-gray-500 text-xs hidden sm:inline">{report.size}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-14 sm:ml-0">
              <span className={`hidden md:inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${typeColors[report.type] ?? 'text-gray-400 bg-gray-500/10 border-gray-500/20'}`}>
                {report.type}
              </span>
              {report.status === 'ready' ? (
                <>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-xl transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                </>
              ) : (
                <div className="flex items-center gap-1.5 px-4 py-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium rounded-xl">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Generating</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-500 text-sm">No reports found.</div>
        )}
      </div>
    </div>
  )
}