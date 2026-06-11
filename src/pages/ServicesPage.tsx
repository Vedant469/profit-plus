import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Target, Search, Star, BarChart2, Share2, Mail, Check } from 'lucide-react'
import { services } from '../data/mockData'

const serviceIcons: Record<string, React.ReactNode> = {
  'Performance Marketing': <Target className="w-8 h-8" />,
  'SEO & Content Strategy': <Search className="w-8 h-8" />,
  'Brand Identity': <Star className="w-8 h-8" />,
  'Analytics & Insights': <BarChart2 className="w-8 h-8" />,
  'Social Media Management': <Share2 className="w-8 h-8" />,
  'Email Marketing': <Mail className="w-8 h-8" />,
}

const serviceColors: Record<string, string> = {
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
}

export default function ServicesPage() {
  return (
    <div className="bg-slate-950 pt-24">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-blue-400 font-medium mb-3">What We Offer</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Services Built for <span className="gradient-text">Serious Growth</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              We don't offer cookie-cutter solutions. Every service is tailored to your business, your market, and your growth goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 pb-24">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          {services.map((service, i) => {
            const colorClass = serviceColors[service.color] ?? serviceColors['blue']!
            const isEven = i % 2 === 0
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 p-8 bg-slate-900 border border-white/5 rounded-2xl hover:border-white/10 transition-all`}
              >
                <div className="flex-shrink-0 flex items-start">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl border ${colorClass}`}>
                    {serviceIcons[service.title]}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-3">{service.title}</h2>
                  <p className="text-gray-400 leading-relaxed mb-6">{service.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center">
                  <Link
                    to="/contact"
                    className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 text-gray-300 hover:text-white text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
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
              Not Sure Which Service You Need?
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Book a free discovery call and we'll map out the right growth strategy for your business.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Book Free Strategy Call
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}