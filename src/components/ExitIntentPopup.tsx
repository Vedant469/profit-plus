import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem('exit-popup-shown')) return

    let triggered = false

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !triggered) {
        triggered = true
        setVisible(true)
        sessionStorage.setItem('exit-popup-shown', 'true')
      }
    }

    // Also show on mobile after 30 seconds of inactivity
    const mobileTimer = setTimeout(() => {
      if (!triggered && window.innerWidth < 768) {
        triggered = true
        setVisible(true)
        sessionStorage.setItem('exit-popup-shown', 'true')
      }
    }, 30000)

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(mobileTimer)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9990]"
            onClick={() => setVisible(false)}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 z-[9991] max-w-lg w-full md:w-[520px]"
          >
            <div className="relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Top gradient bar */}
              <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500" />

              {/* Close button */}
              <button
                onClick={() => setVisible(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4"
                  >
                    <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">You're In! 🎉</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      We'll send your free profit audit to <span className="text-amber-400">{email}</span> within 24 hours.
                    </p>
                    <button
                      onClick={() => setVisible(false)}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all"
                    >
                      Continue Browsing
                    </button>
                  </motion.div>
                ) : (
                  <>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-medium mb-6">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                      Wait — Don't Leave Yet!
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                      Get a FREE Profit Audit Worth{' '}
                      <span className="gradient-text">₹25,000</span>
                    </h2>

                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      Before you go — let our experts analyse your current marketing and show you exactly where you're leaving money on the table. No strings attached.
                    </p>

                    {/* What you get */}
                    <div className="space-y-2.5 mb-6">
                      {[
                        'Full audit of your current ad campaigns',
                        'Identify profit leaks in your funnel',
                        'Custom growth roadmap for your business',
                        'Competitor analysis & benchmarking',
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2.5">
                          <div className="w-4 h-4 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                          </div>
                          <span className="text-gray-300 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                      />
                      <button
                        type="submit"
                        className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25"
                      >
                        Claim My Free Audit
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </form>

                    <div className="flex items-center justify-between mt-4">
                      <p className="text-gray-600 text-xs">🔒 No spam. Unsubscribe anytime.</p>
                      <Link
                        to="/contact"
                        onClick={() => setVisible(false)}
                        className="text-amber-400 hover:text-amber-300 text-xs transition-colors"
                      >
                        Book a call instead →
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}