import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #0d0520 0%, #1a0a35 25%, #0a0d20 60%, #020617 100%)' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl" style={{ background: 'rgba(139,92,246,0.08)' }} />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(0,255,136,0.04)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-lg"
      >
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 mb-10 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00ff88, #00cc6a)', boxShadow: '0 0 20px rgba(0,255,136,0.3)' }}>
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-xl">Profit<span style={{ color: '#00ff88' }}>Plus</span></span>
        </Link>

        {/* 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-8xl md:text-9xl font-black text-white mb-2">
            4<span style={{ color: '#8b5cf6' }}>0</span>4
          </h1>
        </motion.div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-4" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#a78bfa' }}>
          Page Not Found
        </div>

        <p className="text-gray-400 mb-10 leading-relaxed">
          Looks like this page took a wrong turn. Let's get you back on track to maximizing your profits.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-green-pill px-8 py-3 text-base">
            Back to Home <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/contact" className="btn-ghost-pill px-8 py-3 text-base">
            Contact Us
          </Link>
        </div>
      </motion.div>
    </div>
  )
}