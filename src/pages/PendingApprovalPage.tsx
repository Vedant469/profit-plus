import { motion } from 'framer-motion'
import { Clock, Mail, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function PendingApprovalPage() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md text-center"
      >
        <div className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-orange-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-xl">
            Profit<span className="text-emerald-400">Plus</span>
          </span>
        </div>

        <div className="p-8 bg-slate-900 border border-white/5 rounded-2xl">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-emerald-400" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">
            Account Pending Approval
          </h1>

          <p className="text-gray-400 leading-relaxed mb-6">
            Your account has been created! Our team is reviewing your details and will approve your app access shortly.
          </p>

          <div className="space-y-3 mb-8">
            {[
              { label: 'Account created successfully', done: true },
              { label: 'Under review by ProfitPlus team', done: false },
              { label: 'You will be notified via email', done: false },
            ].map(({ label, done }, i) => (
              <div key={label} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  done
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                    : i === 1
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                    : 'bg-white/5 border border-white/10 text-gray-500'
                }`}>
                  {done ? '✓' : i + 1}
                </div>
                <span className={`text-sm ${done ? 'text-emerald-400' : i === 1 ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <a
            href="mailto:profitplus025@gmail.com"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium rounded-xl hover:bg-emerald-500/20 transition-all mb-3"
          >
            <Mail className="w-4 h-4" />
            Contact Us to Speed Up Approval
          </a>

          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 bg-white/5 border border-white/10 text-gray-400 font-medium rounded-xl hover:bg-white/10 transition-all text-sm"
          >
            Sign Out
          </button>
        </div>

        <p className="text-gray-600 text-xs mt-4">
          Usually approved within 24 hours on business days
        </p>
      </motion.div>
    </div>
  )
}