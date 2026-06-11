import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { caseStudies } from '../data/mockData'

export default function PortfolioPage() {
  return (
    <div className="bg-slate-950 pt-24">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-blue-400 font-medium mb-3">Our Work</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Proof Is in the <span className="gradient-text">Numbers</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Real campaigns, real clients, real results. Here's a look at what we've built together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((cs, i) => (
              <motion.div
                key={cs.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={cs.image}
                    alt={cs.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cs.gradient} opacity-60`} />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-2.5 py-1 bg-black/40 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                      {cs.industry}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-400 text-sm mb-1">{cs.client}</p>
                  <h3 className="text-white font-bold text-xl mb-3">{cs.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{cs.description}</p>

                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-xl">
                    {cs.metrics.map((m) => (
                      <div key={m.label} className="text-center">
                        <p className="text-white font-bold text-lg">{m.value}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cs.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-gray-400 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Want Results Like These?
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Let's talk about your business and build a strategy to get you there.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Start Your Growth Journey
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}