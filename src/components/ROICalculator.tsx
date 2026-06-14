import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, DollarSign, Zap, Target } from 'lucide-react'

const industries = [
  { label: 'E-Commerce', multiplier: 5.5 },
  { label: 'SaaS', multiplier: 4.8 },
  { label: 'Healthcare', multiplier: 4.2 },
  { label: 'Finance', multiplier: 3.8 },
  { label: 'Retail', multiplier: 5.0 },
  { label: 'Real Estate', multiplier: 4.5 },
  { label: 'Education', multiplier: 3.5 },
  { label: 'Other', multiplier: 4.0 },
]

const channels = [
  { label: 'Google Ads', multiplier: 1.0, icon: '🎯' },
  { label: 'Meta Ads', multiplier: 1.15, icon: '📱' },
  { label: 'LinkedIn', multiplier: 0.9, icon: '💼' },
  { label: 'SEO', multiplier: 1.4, icon: '🔍' },
  { label: 'Email', multiplier: 1.6, icon: '📧' },
  { label: 'All Channels', multiplier: 1.8, icon: '🚀' },
]

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number>()
  const startRef = useRef(0)
  const startTimeRef = useRef(0)
  const targetRef = useRef(value)

  useEffect(() => {
    startRef.current = display
    startTimeRef.current = 0
    targetRef.current = value

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / 1200, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setDisplay(Math.floor(startRef.current + (targetRef.current - startRef.current) * eased))
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
      else setDisplay(targetRef.current)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [value])

  return (
    <span>
      {prefix}{display.toLocaleString('en-IN')}{suffix}
    </span>
  )
}

export default function ROICalculator() {
  const [budget, setBudget] = useState(200000)
  const [industry, setIndustry] = useState(industries[0]!)
  const [channel, setChannel] = useState(channels[5]!)
  const [calculating, setCalculating] = useState(false)
  const [shown, setShown] = useState(false)

  const industryMult = industry.multiplier
  const channelMult = channel.multiplier
  const roas = industryMult * channelMult
  const monthlyRevenue = Math.floor(budget * roas)
  const monthlyProfit = monthlyRevenue - budget
  const roi = Math.floor(((monthlyRevenue - budget) / budget) * 100)
  const yearlyProfit = monthlyProfit * 12

  const handleCalculate = () => {
    setCalculating(true)
    setTimeout(() => {
      setCalculating(false)
      setShown(true)
    }, 1200)
  }

  const formatINR = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
    return `₹${(n / 1000).toFixed(0)}K`
  }

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    profit: Math.floor(monthlyProfit * (1 + i * 0.08)),
  }))

  const maxProfit = Math.max(...months.map(m => m.profit))

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #020617 0%, #0d0520 50%, #020617 100%)' }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl" style={{ background: 'rgba(139,92,246,0.06)' }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-4" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#a78bfa' }}>
            <Zap className="w-3.5 h-3.5" />
            Live ROI Calculator
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            How Much Profit Could{' '}
            <span className="gradient-text">You Be Making?</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Enter your monthly marketing budget and see your projected returns — based on real data from 240+ campaigns.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 p-8 rounded-3xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* Budget slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-white font-semibold">Monthly Ad Budget</label>
                <span className="text-2xl font-black" style={{ color: '#00ff88' }}>
                  {formatINR(budget)}
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={50000}
                  max={5000000}
                  step={50000}
                  value={budget}
                  onChange={(e) => { setBudget(Number(e.target.value)); setShown(false) }}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #00ff88 0%, #00ff88 ${((budget - 50000) / (5000000 - 50000)) * 100}%, rgba(255,255,255,0.1) ${((budget - 50000) / (5000000 - 50000)) * 100}%, rgba(255,255,255,0.1) 100%)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹50K</span>
                <span>₹50L</span>
              </div>
            </div>

            {/* Industry */}
            <div>
              <label className="text-white font-semibold block mb-3">Your Industry</label>
              <div className="grid grid-cols-2 gap-2">
                {industries.map((ind) => (
                  <button
                    key={ind.label}
                    onClick={() => { setIndustry(ind); setShown(false) }}
                    className="px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                    style={{
                      background: industry.label === ind.label ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${industry.label === ind.label ? 'rgba(0,255,136,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      color: industry.label === ind.label ? '#00ff88' : '#9ca3af',
                    }}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Channel */}
            <div>
              <label className="text-white font-semibold block mb-3">Primary Channel</label>
              <div className="grid grid-cols-2 gap-2">
                {channels.map((ch) => (
                  <button
                    key={ch.label}
                    onClick={() => { setChannel(ch); setShown(false) }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: channel.label === ch.label ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${channel.label === ch.label ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      color: channel.label === ch.label ? '#a78bfa' : '#9ca3af',
                    }}
                  >
                    <span>{ch.icon}</span>
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculate button */}
            <motion.button
              onClick={handleCalculate}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl font-black text-lg transition-all"
              style={{
                background: calculating ? 'rgba(0,255,136,0.3)' : 'linear-gradient(135deg, #00ff88, #00cc6a)',
                color: '#020617',
                boxShadow: '0 0 30px rgba(0,255,136,0.4)',
              }}
            >
              {calculating ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="inline-block"
                  >
                    ⚡
                  </motion.span>
                  Calculating Your Profit...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Calculate My ROI
                </span>
              )}
            </motion.button>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <AnimatePresence mode="wait">
              {!shown ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 rounded-3xl"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', minHeight: 400 }}
                >
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-white font-bold text-xl mb-2">Your Profit Projection</h3>
                  <p className="text-gray-500 text-sm">Fill in your details and hit Calculate to see your projected ROI</p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Big numbers */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Monthly Revenue', value: monthlyRevenue, prefix: '₹', color: '#00ff88', icon: DollarSign },
                      { label: 'Monthly Profit', value: monthlyProfit, prefix: '₹', color: '#a78bfa', icon: TrendingUp },
                      { label: 'ROI', value: roi, suffix: '%', color: '#06b6d4', icon: Zap },
                      { label: 'Yearly Profit', value: yearlyProfit, prefix: '₹', color: '#f59e0b', icon: Target },
                    ].map(({ label, value, prefix = '', suffix = '', color, icon: Icon }) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl"
                        style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}22` }}
                      >
                        <Icon className="w-4 h-4 mb-2" style={{ color }} />
                        <p className="text-xl font-black" style={{ color }}>
                          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">{label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* 12 month growth chart */}
                  <div
                    className="p-5 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <p className="text-white font-semibold text-sm mb-4">12-Month Profit Trajectory</p>
                    <div className="flex items-end gap-1 h-28">
                      {months.map(({ month, profit }, i) => (
                        <motion.div
                          key={month}
                          initial={{ height: 0 }}
                          animate={{ height: `${(profit / maxProfit) * 100}%` }}
                          transition={{ delay: i * 0.05, duration: 0.6, ease: 'easeOut' }}
                          className="flex-1 rounded-t-sm relative group cursor-default"
                          style={{
                            background: `linear-gradient(to top, rgba(0,255,136,0.3), rgba(0,255,136,0.8))`,
                            minHeight: 4,
                          }}
                        >
                          <div
                            className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: 'rgba(0,0,0,0.8)', color: '#00ff88' }}
                          >
                            {formatINR(profit)}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>Month 1</span>
                      <span>Month 12</span>
                    </div>
                  </div>

                  {/* ROAS badge */}
                  <div
                    className="flex items-center justify-between p-4 rounded-2xl"
                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
                  >
                    <div>
                      <p className="text-white font-semibold text-sm">Projected ROAS</p>
                      <p className="text-gray-400 text-xs">Based on {industry.label} + {channel.label}</p>
                    </div>
                    <span className="text-3xl font-black" style={{ color: '#a78bfa' }}>
                      {roas.toFixed(1)}x
                    </span>
                  </div>

                  {/* CTA */}
                  <Link
                    to="/contact"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-white transition-all group"
                    style={{
                      background: 'rgba(10,5,20,0.9)',
                      border: '1px solid rgba(139,92,246,0.6)',
                      boxShadow: '0 0 20px rgba(139,92,246,0.3)',
                    }}
                  >
                    Get This ROI For My Business
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}