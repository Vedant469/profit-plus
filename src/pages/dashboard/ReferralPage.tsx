import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Gift, Users, TrendingUp, Share2, Mail, MessageCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [referralLink, setReferralLink] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const email = session?.user?.email ?? ''
      setUserEmail(email)
      const code = btoa(email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 10).toUpperCase()
      setReferralCode(code)
      setReferralLink(`https://profit-plus-beta.vercel.app/?ref=${code}`)
    })
  }, [])

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = () => {
    const message = encodeURIComponent(
      `Hey! I've been using ProfitPlus for my marketing and the results are incredible. Use my referral link to get started and we both get rewards! 🚀\n\n${referralLink}`
    )
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  const shareEmail = () => {
    const subject = encodeURIComponent('You should try ProfitPlus — Use my referral link!')
    const body = encodeURIComponent(
      `Hi,\n\nI wanted to share ProfitPlus with you — it's an amazing profit-driven marketing agency that's helped me grow my business significantly.\n\nUse my referral link to get started:\n${referralLink}\n\nBest,\n${userEmail}`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const howItWorks = [
    { step: '1', title: 'Share Your Link', desc: 'Share your unique referral link with friends and business contacts.', icon: Share2, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { step: '2', title: 'They Sign Up', desc: 'When they visit your link and book a strategy call with ProfitPlus.', icon: Users, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
    { step: '3', title: 'You Both Win', desc: 'You get ₹5,000 credit and they get 10% off their first month.', icon: Gift, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  ]

  const rewards = [
    { referrals: 1, reward: '₹5,000 credit', badge: '🥉 Bronze' },
    { referrals: 3, reward: '₹20,000 credit', badge: '🥈 Silver' },
    { referrals: 5, reward: '₹50,000 credit', badge: '🥇 Gold' },
    { referrals: 10, reward: '1 Month Free', badge: '💎 Diamond' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">Referral Program</h1>
        <p className="text-gray-400 mt-1 text-sm">Share ProfitPlus and earn rewards for every successful referral.</p>
      </div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-6 md:p-8 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-900 border border-amber-500/20 rounded-2xl"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Refer & Earn</h2>
              <p className="text-amber-400 text-sm">Earn ₹5,000 for every successful referral</p>
            </div>
          </div>

          {/* Referral Link */}
          <div className="bg-slate-950/50 border border-white/10 rounded-xl p-4 mb-4">
            <p className="text-gray-400 text-xs mb-2">Your unique referral link</p>
            <div className="flex items-center gap-3">
              <code className="flex-1 text-amber-400 text-sm font-mono truncate">{referralLink}</code>
              <button
                onClick={copyLink}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
                  copied
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Referral Code */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <span className="text-gray-400 text-sm">Your code:</span>
              <span className="text-white font-mono font-bold text-lg tracking-widest">{referralCode}</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={shareWhatsApp}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-400 text-white text-sm font-bold rounded-xl transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Share on WhatsApp
            </button>
            <button
              onClick={shareEmail}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-xl transition-all"
            >
              <Mail className="w-4 h-4" />
              Share via Email
            </button>
          </div>
        </div>
      </motion.div>

      {/* How it Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 bg-slate-900 border border-white/5 rounded-2xl"
      >
        <h2 className="text-white font-semibold text-lg mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howItWorks.map(({ step, title, desc, icon: Icon, color }) => (
            <div key={step} className="text-center">
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border mb-4 ${color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-950 text-xs font-bold">
                {step}
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Reward Tiers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-slate-900 border border-white/5 rounded-2xl"
      >
        <h2 className="text-white font-semibold text-lg mb-6">Reward Tiers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewards.map(({ referrals, reward, badge }) => (
            <div
              key={badge}
              className="p-4 bg-white/5 border border-white/5 rounded-xl text-center hover:border-amber-500/20 transition-all"
            >
              <p className="text-2xl mb-2">{badge.split(' ')[0]}</p>
              <p className="text-white font-semibold text-sm mb-1">{badge.split(' ')[1]}</p>
              <p className="text-amber-400 font-bold text-lg mb-1">{reward}</p>
              <p className="text-gray-500 text-xs">{referrals} referral{referrals > 1 ? 's' : ''}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { label: 'Total Referrals', value: '0', icon: Users, color: 'text-blue-400' },
          { label: 'Pending Rewards', value: '₹0', icon: Gift, color: 'text-amber-400' },
          { label: 'Total Earned', value: '₹0', icon: TrendingUp, color: 'text-emerald-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-5 bg-slate-900 border border-white/5 rounded-xl hover:border-amber-500/10 transition-all">
            <Icon className={`w-5 h-5 ${color} mb-3`} />
            <p className={`text-2xl font-bold ${color} mb-1`}>{value}</p>
            <p className="text-gray-400 text-sm">{label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}