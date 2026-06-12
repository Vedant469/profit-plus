import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, TrendingUp, Users, Rocket, Award, Target, Search, BarChart2, Share2, Mail, Check, ChevronDown } from 'lucide-react'
import { stats, services, caseStudies, testimonials } from '../data/mockData'
import ParticleBackground from '../components/ParticleBackground'

const phrases = [
  'We Build Profit Machines',
  'We Engineer Growth Systems',
  'We Maximize Your ROI',
  'We Transform Ad Spend',
]

function TypewriterText() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const phrase = phrases[phraseIndex]!
    let timeout: ReturnType<typeof setTimeout>
    if (!deleting && text.length < phrase.length) {
      timeout = setTimeout(() => setText(phrase.slice(0, text.length + 1)), 55 + Math.random() * 45)
    } else if (!deleting && text.length === phrase.length) {
      setIsPaused(true)
      timeout = setTimeout(() => { setIsPaused(false); setDeleting(true) }, 2500)
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(phrase.slice(0, text.length - 1)), 25)
    } else if (deleting && text.length === 0) {
      setDeleting(false)
      setPhraseIndex((prev) => (prev + 1) % phrases.length)
    }
    return () => clearTimeout(timeout)
  }, [text, deleting, phraseIndex, isPaused])

  return (
    <span className="animated-gradient-text">
      {text}
      <span className="typewriter-cursor">|</span>
    </span>
  )
}

function AnimatedCounter({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / (2000 / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])
  return <>{count.toLocaleString()}{suffix}</>
}

const serviceIcons: Record<string, React.ReactNode> = {
  'Performance Marketing': <Target className="w-6 h-6" />,
  'SEO & Content Strategy': <Search className="w-6 h-6" />,
  'Brand Identity': <Star className="w-6 h-6" />,
  'Analytics & Insights': <BarChart2 className="w-6 h-6" />,
  'Social Media Management': <Share2 className="w-6 h-6" />,
  'Email Marketing': <Mail className="w-6 h-6" />,
}

const serviceColors: Record<string, string> = {
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
}

const serviceBackColors: Record<string, string> = {
  blue: 'from-blue-600/20 to-blue-800/20 border-blue-500/30',
  violet: 'from-violet-600/20 to-violet-800/20 border-violet-500/30',
  emerald: 'from-emerald-600/20 to-emerald-800/20 border-emerald-500/30',
  amber: 'from-amber-600/20 to-amber-800/20 border-amber-500/30',
  pink: 'from-pink-600/20 to-pink-800/20 border-pink-500/30',
  cyan: 'from-cyan-600/20 to-cyan-800/20 border-cyan-500/30',
}

const statIcons = [Users, Rocket, TrendingUp, Award]

const clients = [
  'TechFlow', 'Meridian', 'Vanguard', 'HealthPath',
  'Nexora', 'Stratum', 'Elevate', 'CoreBridge',
  'TechFlow', 'Meridian', 'Vanguard', 'HealthPath',
  'Nexora', 'Stratum', 'Elevate', 'CoreBridge',
]

const liveStats = [
  { label: 'Total Profit Generated', value: 1600, prefix: '$', suffix: 'M+' },
  { label: 'Campaigns Running', value: 1800, prefix: '', suffix: '+' },
  { label: 'Average ROAS', value: 472, prefix: '', suffix: '%' },
  { label: 'Happy Clients', value: 240, prefix: '', suffix: '+' },
]

const pricing = [
  {
    name: 'Starter', price: '$2,500', period: '/month',
    description: 'Perfect for growing businesses ready to scale.',
    features: ['Up to 2 ad channels', 'Monthly reporting', 'Campaign management', 'Email support', 'Basic analytics'],
    cta: 'Get Started', highlighted: false,
  },
  {
    name: 'Growth', price: '$5,500', period: '/month',
    description: 'For ambitious brands serious about dominating their market.',
    features: ['Up to 4 ad channels', 'Weekly reporting', 'Full funnel strategy', 'SEO & content included', 'Advanced analytics', 'Dedicated account manager'],
    cta: 'Most Popular', highlighted: true,
  },
  {
    name: 'Enterprise', price: 'Custom', period: '',
    description: 'Full-service growth partnership for high-growth companies.',
    features: ['Unlimited channels', 'Daily reporting', 'Custom strategy', 'Creative production', 'Attribution modelling', 'C-suite reporting', 'Priority support'],
    cta: 'Contact Us', highlighted: false,
  },
]

const faqs = [
  { q: 'How quickly will I see results?', a: 'Most clients see measurable improvements within the first 30 days. Significant ROI gains typically compound over 60–90 days as we optimise campaigns.' },
  { q: 'Do you work with businesses in any industry?', a: 'We have deep expertise in SaaS, e-commerce, healthcare, fintech, and professional services. We only take on clients we are confident we can deliver strong results for.' },
  { q: 'What makes ProfitPlus different?', a: 'We are obsessed with profit, not vanity metrics. Every campaign decision is tied to revenue impact. We also give clients full transparency via real-time dashboards.' },
  { q: 'Is there a minimum contract length?', a: 'We have a 3-month minimum engagement to allow sufficient time to build, test, and optimise campaigns for peak performance.' },
  { q: 'What budget do I need to get started?', a: 'Our Starter plan begins at $2,500/month in management fees. We recommend a minimum ad spend of $5,000/month on top of that for best results.' },
]

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const statsRef = useRef(null)
  const liveRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' })
  const liveInView = useInView(liveRef, { once: true, margin: '-100px' })

  return (
    <div>
      {/* Hero */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-slate-950 pt-20">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-20">
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/40" />
        <ParticleBackground />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 md:left-20 w-48 md:w-72 h-48 md:h-72 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-orange-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-36 md:py-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-6"
            >
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              Profit-Driven Marketing Agency
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
              style={{ minHeight: '1.3em' }}
            >
              <TypewriterText />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl"
            >
              Data-engineered campaigns that turn every dollar of marketing spend into measurable, compounding profit. No vanity metrics — just real returns.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/contact" className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25">
                Start Maximizing Profit
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/portfolio" className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all duration-200">
                See Our Results
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 md:mt-16 flex flex-wrap gap-8 md:gap-10"
            >
              {[
                { value: '240+', label: 'Active Clients' },
                { value: '320%', label: 'Avg. Profit ROI' },
                { value: '$1.6B+', label: 'Profit Generated' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl md:text-3xl font-bold text-white">{s.value}</p>
                  <p className="text-gray-400 text-sm mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-12 bg-slate-900/30 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
          <p className="text-center text-gray-500 text-sm tracking-widest">TRUSTED BY FAST-GROWING COMPANIES</p>
        </div>
        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-950 to-transparent z-10" />
          <div className="animate-marquee">
            {clients.map((client, i) => (
              <span key={i} className="mx-10 text-gray-500 hover:text-amber-400 font-bold text-xl tracking-wide transition-colors cursor-default select-none">
                {client}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-20 bg-slate-900/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map(({ value, suffix, label }, i) => {
              const Icon = statIcons[i]!
              const numericValue = parseInt(String(value).replace(/[^0-9]/g, ''))
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center glow-card p-6 bg-slate-900 border border-white/5 rounded-2xl"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4 text-amber-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                    <AnimatedCounter target={numericValue} suffix={suffix} inView={statsInView} />
                  </p>
                  <p className="text-gray-400 text-sm">{label}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Live Results Ticker */}
      <section ref={liveRef} className="py-16 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-amber-500/5 border-b border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-3">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-amber-400 text-sm font-medium">Live Results Tracker</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Numbers That Speak for Themselves</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {liveStats.map(({ label, value, prefix, suffix }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={liveInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6 bg-slate-900/80 border border-amber-500/10 rounded-2xl glow-card"
              >
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {prefix}<AnimatedCounter target={value} suffix={suffix} inView={liveInView} />
                </p>
                <p className="text-gray-400 text-sm">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flip Service Cards */}
      <section id="services" className="py-20 md:py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-amber-400 font-medium mb-3">What We Do</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Services That Drive Profit</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Hover over each card to see what's included.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const colorClass = serviceColors[service.color] ?? serviceColors['blue']!
              const backColor = serviceBackColors[service.color] ?? serviceBackColors['blue']!
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flip-card h-64"
                >
                  <div className="flip-card-inner">
                    <div className="flip-card-front p-6 bg-slate-900 border border-white/5 flex flex-col justify-between">
                      <div>
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border mb-4 ${colorClass}`}>
                          {serviceIcons[service.title]}
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">{service.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{service.description}</p>
                      </div>
                      <p className="text-amber-400 text-xs mt-3">Hover to see what's included →</p>
                    </div>
                    <div className={`flip-card-back p-6 bg-gradient-to-br ${backColor} border flex flex-col justify-center`}>
                      <h3 className="text-white font-bold text-lg mb-4">{service.title}</h3>
                      <ul className="space-y-2.5 mb-6">
                        {service.features.map((f) => (
                          <li key={f} className="flex items-center gap-2.5">
                            <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            <span className="text-gray-200 text-sm">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Link to="/contact" className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-xl transition-all">
                        Get Started <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="portfolio" className="py-20 md:py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-amber-400 font-medium mb-3">Our Work</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Real Profit for Real Clients</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Numbers don't lie. Here's what we've achieved.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudies.map((cs, i) => (
              <motion.div
                key={cs.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 hover:border-amber-500/20 transition-all duration-300 glow-card"
              >
                <div className="relative h-44 md:h-48 overflow-hidden">
                  <img loading="lazy" src={cs.image} alt={cs.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cs.gradient} opacity-60`} />
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 bg-black/40 backdrop-blur-sm rounded-full text-white text-xs font-medium">{cs.industry}</span>
                  </div>
                </div>
                <div className="p-5 md:p-6">
                  <p className="text-gray-400 text-sm mb-1">{cs.client}</p>
                  <h3 className="text-white font-bold text-lg md:text-xl mb-3">{cs.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{cs.description}</p>
                  <div className="grid grid-cols-3 gap-4">
                    {cs.metrics.map((m) => (
                      <div key={m.label}>
                        <p className="text-amber-400 font-bold text-base md:text-lg">{m.value}</p>
                        <p className="text-gray-500 text-xs">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-amber-400 font-medium mb-3">Testimonials</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">What Our Clients Say</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 bg-slate-900 border border-white/5 rounded-2xl hover:border-amber-500/20 transition-all glow-card"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img loading="lazy" src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-white font-medium text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role} · {t.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-amber-400 font-medium mb-3">Pricing</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">No hidden fees. No long-term lock-ins. Just results.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative p-6 md:p-8 rounded-2xl border transition-all ${plan.highlighted ? 'bg-gradient-to-b from-amber-500/10 to-slate-900 border-amber-500/30 glow-card' : 'bg-slate-900 border-white/5 hover:border-white/10'}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-white font-bold text-xl mb-2">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-3xl md:text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm mb-1">{plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className={`block text-center px-6 py-3 rounded-xl font-semibold text-sm transition-all ${plan.highlighted ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'}`}>
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-24 bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-amber-400 font-medium mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-900 border border-white/5 rounded-xl overflow-hidden hover:border-amber-500/10 transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-white font-medium text-sm md:text-base">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-amber-400' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-white/5 pt-3">
                        <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to <span className="gradient-text">Maximize Your Profit?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Book a free strategy call and we'll show you exactly how we'd grow your profits in the next 90 days.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact" className="group flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25">
                Book Free Strategy Call
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/portfolio" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all duration-200">
                View Case Studies
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}