import SEOHead from '../components/SEOHead'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, Heart, Zap, Shield } from 'lucide-react'
import { team } from '../data/mockData'

const values = [
  { icon: Zap, title: 'Profit First', description: 'Every decision we make is tied to one metric — your profit. Not impressions, not clicks, not vanity. Profit.', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { icon: Heart, title: 'Client Obsessed', description: 'We treat your business like our own. Your profit growth is our growth. Your wins are our wins.', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { icon: Shield, title: 'Radical Transparency', description: 'No vanity metrics, no fluff. Honest reporting, real numbers, and clear communication at every step.', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { icon: Award, title: 'Relentless Optimisation', description: 'We test, learn, and optimise constantly. What drove profit yesterday might not be enough tomorrow.', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
]

export default function AboutPage() {
  return (
    <div className="bg-slate-950 pt-24">
      <SEOHead
        title="About ProfitPlus | Performance Marketing Agency Pune India"
        description="Meet the team behind ProfitPlus — India's fastest-growing performance marketing agency based in Pune. 240+ clients, $1.6B+ profit generated, 12+ years experience."
        keywords="about marketing agency pune, profitplus team, digital marketing company india, performance marketing experts pune"
        url="https://profit-plus-beta.vercel.app/about"
      />
      {/* Hero */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-amber-400 font-medium mb-3">About Us</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              The Profit Growth Team{' '}
              <span className="gradient-text">You Always Needed</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
              Founded in 2012, ProfitPlus was built on a simple belief — every ambitious business deserves marketing that pays for itself many times over.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Today we're a team of 60+ specialists across paid media, SEO, creative, and analytics — working with 240+ clients globally to build profit-compounding marketing systems.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-amber-400 font-medium mb-3">Our Values</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What We Stand For</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              These aren't words on a wall — they guide every campaign, every report, every client relationship.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 bg-slate-900 border border-white/5 rounded-2xl hover:border-amber-500/10 transition-all"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border mb-4 ${value.color}`}>
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '$1.6B+', label: 'Profit Generated for Clients' },
              { value: '240+', label: 'Active Client Partners' },
              { value: '12+', label: 'Years of Experience' },
              { value: '60+', label: 'Marketing Specialists' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-slate-900 border border-white/5 rounded-2xl"
              >
                <p className="text-2xl md:text-3xl font-bold text-amber-400 mb-2">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-amber-400 font-medium mb-3">Our Team</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The People Behind Your Profit</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Seasoned specialists who have been in the trenches and know what it takes to win.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 bg-slate-900 border border-white/5 rounded-2xl text-center group hover:border-amber-500/20 transition-all"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4 ring-2 ring-white/10 group-hover:ring-amber-500/30 transition-all"
                />
                <h3 className="text-white font-semibold mb-1">{member.name}</h3>
                <p className="text-amber-400 text-sm mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Want to Work With Us?
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              We are selective about who we work with — because we only take on clients we know we can make more profitable.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25"
            >
              Let's Talk Profit
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}