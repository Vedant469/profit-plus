import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Globe, Share2, ExternalLink, Mail, Phone, MapPin, Send } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="bg-slate-950 border-t border-white/5">
      {/* Newsletter */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Get Profit-Growing Tips Weekly</h3>
              <p className="text-gray-400 text-sm">Join 12,000+ marketers getting our best strategies every Thursday.</p>
            </div>
            {subscribed ? (
              <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-medium">
                ✓ You're subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 md:w-64 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm transition-colors"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Subscribe</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">Profit<span className="text-emerald-400">Plus</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              We engineer profit-driven marketing systems that turn every dollar of ad spend into measurable, compounding returns.
            </p>
            <div className="flex gap-3">
              {[Globe, Share2, ExternalLink].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-emerald-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
            <ul className="space-y-3">
              {['Performance Marketing', 'SEO & Content', 'Brand Identity', 'Analytics', 'Social Media', 'Email Marketing'].map((s) => (
                <li key={s}>
                  <Link to="/services" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-3">
              {[['About Us', '/about'], ['Our Work', '/portfolio'], ['Contact', '/contact'], ['Client Login', '/dashboard']].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-2.5 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <a href="mailto:profitplus025@gmail.com" className="hover:text-emerald-400 transition-colors break-all">
                  profitplus025@gmail.com
                </a>
              </li>
              <li className="space-y-2">
                <div className="flex items-center gap-2.5 text-gray-400 text-sm">
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-gray-500 text-xs">Direct Contacts</span>
                </div>
                <div className="pl-6 space-y-1.5">
                  {[
                    { name: 'Atharva', phone: '+91 70280 62213' },
                    { name: 'Rushikesh', phone: '+91 84462 07529' },
                    { name: 'Vedant', phone: '+91 77965 97171' },
                  ].map(({ name, phone }) => (
                    <div key={name} className="flex items-center justify-between gap-2">
                      <span className="text-gray-400 text-xs">{name}</span>
                      <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-emerald-400 hover:text-emerald-300 text-xs font-mono transition-colors">
                        {phone}
                      </a>
                    </div>
                  ))}
                </div>
              </li>
              <li className="flex items-start gap-2.5 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">
                  PARSVNATH PRATISHTHA,<br />
                  Nakshtra Commercial St,<br />
                  Chinchwad, Pimpri-Chinchwad,<br />
                  Maharashtra 411019
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2024 ProfitPlus. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
              <a key={l} href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}