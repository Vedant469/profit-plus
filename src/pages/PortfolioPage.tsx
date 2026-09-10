import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Eye, FlaskConical, LineChart, ShieldCheck, Target } from 'lucide-react'
import { caseStudies } from '../data/mockData'
import SEOHead from '../components/SEOHead'
import ProgressiveImage from '../components/ProgressiveImage'

const decisionSteps = [
  {
    number: '01',
    title: 'Start with the constraint',
    description: 'Clarify the acquisition goal, funnel bottleneck, target customer, and unit economics before choosing a channel.',
    icon: Target,
  },
  {
    number: '02',
    title: 'Run a focused test',
    description: 'Put a clear hypothesis behind the next experiment so the result teaches the team something useful.',
    icon: FlaskConical,
  },
  {
    number: '03',
    title: 'Measure the right signal',
    description: 'Look beyond clicks and impressions. Track conversion quality, economics, and the next decision.',
    icon: LineChart,
  },
]

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 text-white">
      <SEOHead
        title="Growth Examples & Playbooks | ProfitPlus"
        description="Explore illustrative startup growth scenarios and see how ProfitPlus approaches acquisition strategy, experimentation, measurement, and scaling."
        keywords="startup growth strategy, acquisition experiments, performance marketing startup, marketing playbooks"
        url="https://profit-plus-beta.vercel.app/portfolio"
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-sm font-medium text-violet-300">
              <Eye className="h-4 w-4" />
              Example playbooks
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              See how we think about
              <span className="gradient-text"> growth.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl">
              These are illustrative scenarios, not client claims. They show how we approach
              acquisition problems, structure experiments, and decide what deserves more attention.
            </p>

            <div className="mx-auto mt-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-4 py-2 text-xs text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              No invented client results or testimonials
            </div>
          </motion.div>
        </div>
      </section>

      {/* How we think */}
      <section className="border-y border-white/5 bg-slate-900/30 py-14 md:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Growth operating loop
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Every example follows the same logic.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {decisionSteps.map((step, index) => {
              const Icon = step.icon

              return (
                <motion.article
                  key={step.number}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-3xl border border-white/5 bg-slate-950/70 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold tracking-[0.2em] text-gray-600">{step.number}</span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-400">{step.description}</p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Example playbooks */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
                Illustrative scenarios
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                What an engagement can look like.
              </h2>
              <p className="mt-4 max-w-2xl text-gray-400">
                Each example pairs a startup problem with a focused experiment, the signal we would
                measure, and the next decision we would make.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
            >
              Talk through your problem
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {caseStudies.map((cs, index) => (
              <motion.article
                key={cs.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className="group overflow-hidden rounded-3xl border border-white/5 bg-slate-900/60"
              >
                <div className="relative h-56 overflow-hidden md:h-64">
                  <ProgressiveImage
                    src={cs.image}
                    alt={cs.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className={`absolute inset-0 bg-gradient-to-t ${cs.gradient} opacity-55`} />

                  <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur">
                      Illustrative scenario
                    </span>
                    <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-gray-200 backdrop-blur">
                      {cs.industry}
                    </span>
                  </div>
                </div>

                <div className="p-6 md:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    {cs.client}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">
                    {cs.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    {cs.description}
                  </p>

                  <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                    {cs.metrics.map((metric) => (
                      <div key={metric.label} className="text-center">
                        <p className="text-sm font-bold text-emerald-300 md:text-base">
                          {metric.value}
                        </p>
                        <p className="mt-1 text-[11px] leading-4 text-gray-500">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {cs.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/5 bg-white/[0.03] px-2.5 py-1 text-xs text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-amber-400/10 bg-amber-400/[0.04] p-5 text-sm leading-6 text-gray-400">
            <span className="font-semibold text-amber-300">Important:</span> the examples above are
            intentionally illustrative. Any verified client result should replace a scenario only
            when you have permission and evidence to publish it.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 bg-slate-900/30 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Ready to test your next idea?
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Bring the growth problem. We’ll build the experiment.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
              Start with the bottleneck, the numbers you already have, and the decision you need to make.
            </p>

            <Link
              to="/contact"
              className="btn-green-pill mt-9 inline-flex items-center gap-2 px-8 py-4 text-base"
            >
              Get a Growth Audit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
