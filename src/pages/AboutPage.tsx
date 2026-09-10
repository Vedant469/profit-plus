import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, Heart, Lightbulb, ShieldCheck, Target } from 'lucide-react'
import { team } from '../data/mockData'
import SEOHead from '../components/SEOHead'

const values = [
  {
    icon: Target,
    title: 'Start With the Constraint',
    description:
      'We begin with the bottleneck: acquisition, conversion, positioning, tracking, or economics. The goal is to solve the highest-impact problem first.',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    icon: Heart,
    title: 'Founder-Friendly',
    description:
      'Startup teams have limited time and limited budget. We keep communication practical, explain trade-offs clearly, and avoid unnecessary complexity.',
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent by Default',
    description:
      'No invented case studies or guaranteed outcomes. We separate hypotheses, experiments, and verified results so decisions stay grounded in evidence.',
    color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  },
  {
    icon: Lightbulb,
    title: 'Learn Before We Scale',
    description:
      'The objective is not to spend more. It is to learn enough from focused tests that the next rupee or dollar has a better reason to exist.',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
]

const operatingPrinciples = [
  {
    number: '01',
    title: 'Diagnose',
    description: 'Map the funnel, audience, offer, tracking, and unit economics before pushing more traffic.',
  },
  {
    number: '02',
    title: 'Prioritize',
    description: 'Choose the smallest set of experiments that can answer the most important growth question.',
  },
  {
    number: '03',
    title: 'Measure',
    description: 'Track the metrics that connect activity to business outcomes, not numbers that only look impressive.',
  },
  {
    number: '04',
    title: 'Iterate',
    description: 'Keep what shows evidence, change what does not, and scale only when the economics justify it.',
  },
]

export default function AboutPage() {
  return (
    <div className="pt-24">
      <SEOHead
        title="About ProfitPlus | Startup Growth & Performance Marketing"
        description="Learn how ProfitPlus approaches startup growth: focused acquisition experiments, transparent measurement, and practical growth systems."
        keywords="startup growth agency, performance marketing for startups, startup acquisition strategy, ProfitPlus"
        url="https://profit-plus-beta.vercel.app/about"
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div
          className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full blur-3xl"
          style={{ background: 'rgba(139,92,246,0.08)' }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium"
              style={{
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.2)',
                color: '#6ee7b7',
              }}
            >
              <Target className="h-4 w-4" />
              Built for early-stage growth
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Growth work should make the{' '}
              <span className="gradient-text">next decision clearer.</span>
            </h1>

            <p className="mx-auto max-w-3xl text-lg leading-8 text-gray-300 md:text-xl">
              ProfitPlus is a startup-focused growth practice built around acquisition
              experiments, measurement, and practical systems — not oversized retainers or
              impressive-looking vanity metrics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-y border-white/5 bg-slate-900/30 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Our approach
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              Small teams need clarity more than complexity.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="space-y-5 text-gray-400"
          >
            <p className="text-lg leading-8">
              Early-stage startups rarely have the luxury of testing everything. Every
              experiment competes for budget, founder attention, and runway.
            </p>
            <p className="leading-7">
              So the operating model is simple: understand the constraint, pick a focused
              hypothesis, measure the result, document the learning, and make the next decision
              with better information.
            </p>
            <p className="leading-7">
              The numbers shown across this site are intentionally illustrative unless explicitly
              identified as verified client work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Principles
            </p>
            <h2 className="text-3xl font-bold text-white md:text-4xl">How we work</h2>
            <p className="mt-4 text-lg leading-7 text-gray-400">
              Four principles keep the work useful when budget, data, and time are limited.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {values.map((value, index) => {
              const Icon = value.icon

              return (
                <motion.article
                  key={value.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="rounded-3xl border border-white/5 bg-slate-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20 md:p-7"
                >
                  <div
                    className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${value.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-semibold text-white">{value.title}</h3>
                  <p className="mt-3 leading-7 text-gray-400">{value.description}</p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Operating model */}
      <section className="border-y border-white/5 bg-slate-900/30 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Operating model
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              A simple loop for better growth decisions.
            </h2>
            <p className="mt-4 text-gray-400">
              The process is designed to create evidence before scale, while keeping the team
              focused on the highest-value question at each stage.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {operatingPrinciples.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="rounded-3xl border border-white/5 bg-slate-950/70 p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.2em] text-emerald-400">
                    {step.number}
                  </span>
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                </div>

                <h3 className="mt-6 text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capability team */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Capabilities
            </p>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              The work is organized around capabilities, not inflated job titles.
            </h2>
            <p className="mt-4 text-gray-400">
              Each area exists to answer a specific part of the acquisition problem.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <motion.article
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group rounded-3xl border border-white/5 bg-slate-900/70 p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20"
              >
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 p-3 ring-1 ring-emerald-400/10">
                  <img
                    src={member.avatar}
                    alt=""
                    loading="lazy"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>

                <h3 className="font-semibold text-white">{member.name}</h3>
                <p className="mt-1 text-sm text-emerald-300">{member.role}</p>
                <p className="mt-3 text-sm leading-6 text-gray-400">{member.bio}</p>
              </motion.article>
            ))}
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
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Have a growth problem worth testing?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-7 text-gray-400">
              Bring the funnel, the numbers, and the question you cannot answer. We will start
              with the constraint before recommending more spend.
            </p>

            <Link
              to="/contact"
              className="btn-green-pill mt-9 inline-flex items-center gap-2 px-8 py-4 text-base"
            >
              Talk Through Your Growth Problem
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
