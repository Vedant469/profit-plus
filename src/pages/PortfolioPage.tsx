import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { caseStudies } from '../data/mockData'

export default function PortfolioPage() {
  return (
    <div className="bg-slate-950 pt-24">
      {/* Hero */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-amber-400 font-medium mb-3">Our Work</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Proof Is in the <span className="gradient-text">Profit</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Real campaigns, real clients, real profit. Here is a look at what we have built together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '$1.6B+', label: 'Total Profit Generated' },
              { value: '1,800+', label: 'Campaigns Delivered' },
              { value: '320%', label: 'Average ROI' },
              { value: '240+', label: 'Happy Clients' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-2xl md:text-3xl font-bold text-amber-400">{stat.value}</p>
                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {caseStudies.map((cs, i) => (
              <motion.div
                key={cs.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 hover:border-amber-500/20 transition-all duration-300"
              >
                <div className="relative h-48 md:h-56 overflow-hidden">
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

                <div className="p-5 md:p-6">
                  <p className="text-gray-400 text-sm mb-1">{cs.client}</p>
                  <h3 className="text-white font-bold text-lg md:text-xl mb-3">{cs.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{cs.description}</p>

                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-xl">
                    {cs.metrics.map((m) => (
                      <div key={m.label} className="text-center">
                        <p className="text-amber-400 font-bold text-base md:text-lg">{m.value}</p>
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
      <section className="py-16 md:py-24 bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Want Results Like These?
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Let's talk about your business and build a strategy to maximise your profit.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25"
            >
              Start Your Profit Journey
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}