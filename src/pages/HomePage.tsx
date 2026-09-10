import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleDollarSign,
  Mail,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  channelBreakdown,
  caseStudies,
  monthlyPerformance,
  services,
  stats,
} from '../data/mockData'
import ParticleBackground from '../components/ParticleBackground'
import AuroraBackground from '../components/AuroraBackground'
import MagneticButton from '../components/MagneticButton'
import LiquidShape from '../components/LiquidShape'
import ProgressiveImage from '../components/ProgressiveImage'
import { useAdaptiveQuality } from '../hooks/useAdaptiveQuality'
import Hero3D from '../components/Hero3D'
import ROICalculator from '../components/ROICalculator'
import { useHaptic } from '../hooks/useHaptic'

const phrases = [
  'Find What Actually Drives Growth',
  'Test the Right Acquisition Channel',
  'Turn Marketing Data Into Decisions',
  'Scale What Works. Cut What Does Not.',
]

const serviceIcons: Record<string, React.ReactNode> = {
  'Performance Marketing': <Target className="h-6 w-6" />,
  'SEO & Content Strategy': <Search className="h-6 w-6" />,
  'Positioning & Brand': <Star className="h-6 w-6" />,
  'Analytics & Insights': <BarChart3 className="h-6 w-6" />,
  'Social & Distribution': <Share2 className="h-6 w-6" />,
  'Lifecycle & Email': <Mail className="h-6 w-6" />,
}

const serviceColors: Record<string, string> = {
  blue: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
  violet: 'text-violet-300 bg-violet-500/10 border-violet-500/20',
  emerald: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
  amber: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  pink: 'text-pink-300 bg-pink-500/10 border-pink-500/20',
  cyan: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
}

const stageCards = [
  {
    number: '01',
    title: 'Diagnose',
    description: 'Map the funnel, offer, tracking, audience, and unit economics before increasing spend.',
  },
  {
    number: '02',
    title: 'Test',
    description: 'Run focused channel, creative, landing-page, and messaging experiments with a clear hypothesis.',
  },
  {
    number: '03',
    title: 'Learn',
    description: 'Compare results against the same decision framework so the team knows what to keep, pause, or change.',
  },
  {
    number: '04',
    title: 'Scale',
    description: 'Increase investment only after the funnel shows enough evidence of repeatable economics.',
  },
]

const pricing = [
  {
    name: 'Validate',
    price: '$1,000',
    period: '/month',
    description: 'For startups testing their first credible acquisition channel.',
    features: [
      '1 acquisition channel',
      'Tracking & funnel review',
      'Campaign setup',
      'Landing-page feedback',
      'Monthly experiment plan',
    ],
    cta: 'Start Testing',
    highlighted: false,
  },
  {
    name: 'Grow',
    price: '$2,500',
    period: '/month',
    description: 'For teams with early traction that need a more repeatable growth system.',
    features: [
      'Up to 2 acquisition channels',
      'Weekly optimization',
      'Creative testing',
      'Funnel analysis',
      'Weekly reporting',
      'Growth strategy calls',
    ],
    cta: 'Build Your Funnel',
    highlighted: true,
  },
  {
    name: 'Scale',
    price: '$4,000+',
    period: '/month',
    description: 'For teams ready to expand a channel without losing sight of payback and margin.',
    features: [
      'Multi-channel acquisition',
      'Advanced experimentation',
      'Attribution & analytics',
      'Custom dashboards',
      'Creative direction',
      'Priority support',
    ],
    cta: 'Talk About Scale',
    highlighted: false,
  },
]

const faqs = [
  {
    q: 'Are you a fit for a pre-revenue startup?',
    a: 'Usually not yet. We work best with teams that have a validated offer, a clear target customer, and some evidence that customers will pay. If you are still validating the product itself, we would rather solve that first than spend your budget on ads.',
  },
  {
    q: 'Can you start with only one channel?',
    a: 'Yes. In many cases, one channel is the right starting point. We would rather learn whether a focused channel can produce useful economics before adding more complexity.',
  },
  {
    q: 'How much should I spend on ads?',
    a: 'It depends on your economics, audience size, and testing goal. Your management fee is separate from media spend. We generally recommend concentrating a smaller budget instead of spreading it across too many channels.',
  },
  {
    q: 'When should I expect meaningful results?',
    a: 'Useful signals can appear in the first few weeks, but reliable decisions normally require several experiment cycles. A 60–90 day window gives enough time to test, learn, and make a scaling decision.',
  },
  {
    q: 'Why not just run the campaigns ourselves?',
    a: 'You can. We become useful when acquisition starts consuming too much founder time, experiments are difficult to compare, or you need a tighter system for testing and measurement.',
  },
  {
    q: 'Do you guarantee ROI?',
    a: 'No. We do not promise invented outcomes. We can promise a clear process, transparent reporting, and disciplined experimentation. Results still depend on the market, offer, product, budget, tracking, and execution.',
  },
]

function TypewriterText() {
  const [displayText, setDisplayText] = useState('')
  const animation = useRef({
    phraseIndex: 0,
    charIndex: 0,
    deleting: false,
    paused: false,
    pauseStart: 0,
    lastUpdate: 0,
  })

  useEffect(() => {
    let frame = 0
    const typingSpeed = 65
    const deletingSpeed = 30
    const pauseDuration = 2200

    const tick = (timestamp: number) => {
      const state = animation.current
      const phrase = phrases[state.phraseIndex]!

      if (state.paused) {
        if (!state.pauseStart) state.pauseStart = timestamp
        if (timestamp - state.pauseStart >= pauseDuration) {
          state.paused = false
          state.deleting = true
          state.pauseStart = 0
          state.lastUpdate = timestamp
        }
        frame = requestAnimationFrame(tick)
        return
      }

      const interval = state.deleting ? deletingSpeed : typingSpeed
      if (timestamp - state.lastUpdate >= interval) {
        state.lastUpdate = timestamp

        if (state.deleting) {
          if (state.charIndex > 0) {
            state.charIndex -= 1
            setDisplayText(phrase.slice(0, state.charIndex))
          } else {
            state.deleting = false
            state.phraseIndex = (state.phraseIndex + 1) % phrases.length
          }
        } else if (state.charIndex < phrase.length) {
          state.charIndex += 1
          setDisplayText(phrase.slice(0, state.charIndex))
        } else {
          state.paused = true
        }
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <span className="animated-gradient-text">
      {displayText}
      <span className="typewriter-cursor" aria-hidden="true">|</span>
    </span>
  )
}

function AnimatedCounter({
  target,
  suffix,
  prefix = '',
  inView,
}: {
  target: number
  suffix: string
  prefix?: string
  inView: boolean
}) {
  const [count, setCount] = useState(0)
  const frameRef = useRef<number>()
  const startRef = useRef<number>(0)

  useEffect(() => {
    if (!inView) return

    startRef.current = 0

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp
      const progress = Math.min((timestamp - startRef.current) / 1400, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [inView, target])

  return (
    <>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </>
  )
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const statsRef = useRef<HTMLDivElement | null>(null)
  const frameworkRef = useRef<HTMLDivElement | null>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' })
  const frameworkInView = useInView(frameworkRef, { once: true, margin: '-80px' })
  const { isHighEnd } = useAdaptiveQuality()
  const haptic = useHaptic()

  const toggleFaq = useCallback((index: number) => {
    haptic.light()
    setOpenFaq((current) => (current === index ? null : index))
  }, [haptic])

  return (
    <div className="bg-slate-950 text-white">
      {/* Hero */}
      <section id="hero" className="relative min-h-screen overflow-hidden bg-slate-950 pt-20">
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-15"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/60 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/30 to-slate-950/70" />

        <AuroraBackground />
        {isHighEnd && <Hero3D />}
        <ParticleBackground />

        {isHighEnd && (
          <>
            <LiquidShape
              className="absolute left-0 top-24 md:left-10"
              color="rgba(16,185,129,0.07)"
              size={360}
              speed={10}
            />
            <LiquidShape
              className="absolute bottom-10 right-0 md:right-10"
              color="rgba(34,197,94,0.06)"
              size={430}
              speed={13}
            />
          </>
        )}

                <div className="relative z-10 mx-auto max-w-6xl px-4 pt-24 pb-36 sm:px-6 md:py-32">
          <div className="w-full max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm font-medium text-emerald-300"
            >
              <Sparkles className="h-4 w-4" />
              Growth systems for early-stage startups
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="mb-6 text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <TypewriterText />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 max-w-3xl mx-auto"
            >
              We help early-stage startups test acquisition channels, improve conversion, and build a repeatable path from first click to revenue — without pretending every experiment is a win.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
            >
  <MagneticButton>
    <Link
      to="/contact"
      className="group flex min-w-[210px] items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all duration-200 neon-btn"
      onClick={() => haptic.medium()}
    >
      Get a Growth Audit
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Link>
  </MagneticButton>

  <MagneticButton>
    <Link
      to="/services"
      className="flex min-w-[210px] items-center justify-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 text-white font-semibold rounded-xl transition-all duration-200"
      onClick={() => haptic.light()}
    >
      See How We Work
    </Link>
  </MagneticButton>
</motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.38 }}
              className="mx-auto mt-12 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-0"
            >
              {[
                { value: '1', label: 'Clear growth goal' },
                { value: '1–2', label: 'Channels to test' },
                { value: '60–90d', label: 'Focused learning window' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="px-4 py-2 text-center sm:border-l sm:border-white/10 first:sm:border-l-0"
                >
                  <p className="text-2xl font-bold text-white md:text-3xl">{item.value}</p>
                  <p className="mt-1 text-sm text-gray-400">{item.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Positioning strip */}
      <section className="border-y border-white/5 bg-slate-900/40 py-7">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 text-sm font-medium tracking-wide text-gray-400 sm:px-6 lg:px-8">
          {['B2B SaaS', 'D2C', 'Fintech', 'AI Startups', 'Developer Tools', 'Health Tech', 'Consumer Apps'].map((item) => (
            <span key={item} className="transition hover:text-emerald-300">
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Operating stats */}
      <section ref={statsRef} className="border-b border-white/5 bg-slate-950 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">How we operate</p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Focused growth beats scattered activity.</h2>
            <p className="mt-4 text-gray-400">The framework is designed to help a small startup team make better acquisition decisions with limited budget and limited time.</p>
          </div>

          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {stats.map(({ value, suffix, label }, index) => {
              const iconMap = [Target, TrendingUp, ShieldCheck, CircleDollarSign]
              const Icon = iconMap[index] ?? Target
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-2xl border border-white/5 bg-slate-900/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-3xl font-bold text-white md:text-4xl">
                    <AnimatedCounter target={Number(value)} suffix={suffix} inView={statsInView} />
                  </p>
                  <p className="mt-1 text-sm text-gray-400">{label}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-b border-white/5 bg-slate-900/30 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">Services</p>
               <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Everything around the acquisition problem.</h2>
               <p className="mt-4 max-w-2xl text-gray-400">Strategy, execution, measurement, and iteration in one operating loop.</p>
            </div>
            <Link to="/services" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
              Explore services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group rounded-3xl border border-white/5 bg-slate-950/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${serviceColors[service.color] ?? serviceColors.emerald}`}>
                    {serviceIcons[service.title] ?? <Sparkles className="h-6 w-6" />}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">0{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">{service.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span key={feature} className="rounded-full border border-white/5 bg-white/[0.03] px-2.5 py-1 text-xs text-gray-400">
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Growth framework */}
      <section ref={frameworkRef} className="relative overflow-hidden bg-slate-950 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">90-day framework</p>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Make the next decision easier than the last one.</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-gray-400">
                Every engagement is built around a simple loop: diagnose the constraint, run a focused experiment, record what happened, then decide what deserves more budget.
              </p>
              <div className="mt-7 flex flex-wrap gap-3 text-sm text-gray-400">
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">Unit economics</span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">Experiment design</span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">Measurement</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {stageCards.map((stage, index) => (
                <motion.div
                  key={stage.number}
                  initial={{ opacity: 0, x: 18 }}
                  animate={frameworkInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-3xl border border-white/5 bg-slate-900/70 p-6"
                >
                  <span className="text-xs font-bold tracking-[0.2em] text-emerald-400">{stage.number}</span>
                  <h3 className="mt-3 text-xl font-bold text-white">{stage.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-400">{stage.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Illustrative work */}
      <section id="portfolio" className="border-y border-white/5 bg-slate-900/30 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">Example playbooks</p>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">What an engagement can look like.</h2>
              <p className="mt-4 max-w-2xl text-gray-400">These are illustrative scenarios, not client claims. They show the type of problem, experiment, and decision the Profit Plus framework is designed to handle.</p>
            </div>
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
              View all examples <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {caseStudies.slice(0, 4).map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="overflow-hidden rounded-3xl border border-white/5 bg-slate-950/80"
              >
                <div className="relative h-56 overflow-hidden md:h-64">
                  <ProgressiveImage src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur">
                    Illustrative scenario
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500">
                    <span>{item.industry}</span>
                    <span>•</span>
                    <span>{item.client}</span>
                  </div>
                  <h3 className="mt-2 text-2xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-400">{item.description}</p>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {item.metrics.map((metric) => (
                      <div key={metric.label} className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                        <p className="text-sm font-bold text-white">{metric.value}</p>
                        <p className="mt-1 text-[11px] leading-4 text-gray-500">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics preview */}
      <section className="bg-slate-950 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">Measurement</p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">A dashboard built around decisions, not vanity metrics.</h2>
            <p className="mt-4 text-gray-400">The demo dataset below is illustrative. The important part is the reporting model: spend, conversion, revenue, and channel economics in one place.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-3xl border border-white/5 bg-slate-900/80 p-5 md:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Monthly performance</h3>
                  <p className="mt-1 text-xs text-gray-500">Illustrative data</p>
                </div>
                <div className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">Demo</div>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyPerformance} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`} />
                    <Tooltip
                      contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, color: '#fff' }}
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl border border-white/5 bg-slate-900/80 p-5 md:p-6">
              <div className="mb-5">
                <h3 className="font-semibold text-white">Channel mix</h3>
                <p className="mt-1 text-xs text-gray-500">Illustrative ROAS</p>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={channelBreakdown} layout="vertical" margin={{ top: 0, right: 8, left: -5, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis type="number" stroke="#64748b" fontSize={11} />
                    <YAxis type="category" dataKey="channel" stroke="#64748b" fontSize={11} width={64} />
                    <Tooltip
                      contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, color: '#fff' }}
                      formatter={(value) => [`${Number(value).toFixed(1)}x`, 'ROAS']}
                    />
                    <Bar dataKey="roas" fill="#10b981" radius={[0, 7, 7, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI calculator */}
      <section className="border-y border-white/5 bg-slate-900/30 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">Planning tool</p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Model the economics before you spend.</h2>
            <p className="mt-4 text-gray-400">Use the existing ROI calculator as a planning exercise — not as a promise of future performance.</p>
          </div>
          <ROICalculator />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-slate-950 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">Startup-friendly pricing</p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Start with the problem you actually have.</h2>
            <p className="mt-4 text-gray-400">Management fees are separate from media spend. We would rather recommend the smallest useful engagement than sell you a giant retainer.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {pricing.map((plan) => (
              <article
                key={plan.name}
                className={`relative rounded-3xl border p-6 ${plan.highlighted ? 'border-emerald-400/30 bg-emerald-400/[0.06]' : 'border-white/5 bg-slate-900/70'}`}
              >
                {plan.highlighted && (
                  <div className="absolute right-5 top-5 rounded-full bg-emerald-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-950">
                    Recommended
                  </div>
                )}
                <p className="text-sm font-semibold text-gray-400">{plan.name}</p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="pb-1 text-sm text-gray-500">{plan.period}</span>
                </div>
                <p className="mt-3 min-h-12 text-sm leading-6 text-gray-400">{plan.description}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  onClick={() => haptic.light()}
                  className={`mt-8 flex items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition ${plan.highlighted ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300' : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'}`}
                >
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-gray-600">
            Not a fit yet? We generally do not recommend paid acquisition for pre-revenue teams without a validated offer or enough budget to run meaningful experiments.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-white/5 bg-slate-900/30 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">Founder questions</p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">No promises we cannot prove.</h2>
            <p className="mt-4 max-w-md text-gray-400">Here is how we think about budget, timelines, fit, and risk before an engagement starts.</p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Transparent by default
            </div>
          </div>

          <div className="divide-y divide-white/5 rounded-3xl border border-white/5 bg-slate-950/60">
            {faqs.map((faq, index) => {
              const open = openFaq === index
              return (
                <div key={faq.q}>
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left md:px-6"
                  >
                    <span className="font-semibold text-white">{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-gray-500 transition ${open ? 'rotate-180 text-emerald-400' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm leading-6 text-gray-400 md:px-6 md:pb-6">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-emerald-400 py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.28),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(15,23,42,0.12),transparent_36%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-950/70">Ready to test the next growth lever?</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">Bring us the funnel. We’ll bring the experiments.</h2>
          </div>
          <MagneticButton>
            <Link
              to="/contact"
              onClick={() => haptic.medium()}
              className="group inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 font-bold text-white transition hover:bg-slate-900"
            >
              Get a Growth Audit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </MagneticButton>
        </div>
      </section>
    </div>
  )
}
