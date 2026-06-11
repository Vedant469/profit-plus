import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react'

const teamContacts = [
  { name: 'Atharva Ratnoji', phone: '+91 70280 62213' },
  { name: 'Rushikesh Phule', phone: '+91 84462 07529' },
  { name: 'Vedant', phone: '+91 77965 97171' },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="bg-slate-950 pt-24">
      {/* Hero */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-amber-400 font-medium mb-3">Get In Touch</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Let's Build Your{' '}
              <span className="gradient-text">Profit Engine</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Tell us about your business and goals. We'll put together a custom profit strategy — no fluff, no hard sell.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12">

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Contact Info</h2>
                <p className="text-gray-400 text-sm">Reach out directly or fill in the form and we'll get back to you within 24 hours.</p>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-4 bg-slate-900 border border-white/5 rounded-xl hover:border-amber-500/20 transition-all">
                <div className="w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 text-amber-400 bg-amber-500/10 border-amber-500/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Email</p>
                  <p className="text-white font-medium text-sm">profitplus025@gmail.com</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4 p-4 bg-slate-900 border border-white/5 rounded-xl hover:border-amber-500/20 transition-all">
                <div className="w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 text-amber-400 bg-amber-500/10 border-amber-500/20 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Office Address</p>
                  <p className="text-white font-medium text-sm leading-relaxed">
                    PARSVNATH PRATISHTHA,<br />
                    Nakshtra Commercial St,<br />
                    Vitthal Nagar, Shivatej Nagar,<br />
                    Chinchwad, Pimpri-Chinchwad,<br />
                    Maharashtra 411019
                  </p>
                </div>
              </div>

              {/* Team Contacts */}
              <div className="p-4 bg-slate-900 border border-white/5 rounded-xl hover:border-amber-500/20 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <p className="text-gray-400 text-xs">Direct Contacts</p>
                </div>
                <div className="space-y-3">
                  {teamContacts.map(({ name, phone }) => (
                    <div key={name} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm font-medium">{name}</span>
                      <a
                        href={`tel:${phone.replace(/\s/g, '')}`}
                        className="text-amber-400 hover:text-amber-300 text-sm font-mono transition-colors"
                      >
                        {phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Office Hours */}
              <div className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl">
                <h3 className="text-white font-semibold mb-2 text-sm">Office Hours (IST)</h3>
                <p className="text-gray-400 text-sm">Monday – Friday: 9:00 AM – 6:00 PM IST</p>
                <p className="text-gray-400 text-sm">Saturday: 10:00 AM – 2:00 PM IST</p>
                <p className="text-gray-400 text-sm">Sunday: Closed</p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 md:p-12 bg-slate-900 border border-white/5 rounded-2xl">
                  <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-8 h-8 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
                  <p className="text-gray-400 max-w-sm">
                    Thanks for reaching out. Our team will review your details and get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium rounded-xl hover:bg-amber-500/20 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-slate-900 border border-white/5 rounded-2xl space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Smith"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Company Name</label>
                      <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Acme Inc."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Monthly Budget</label>
                      <select
                        name="budget"
                        value={form.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors text-sm"
                      >
                        <option value="" className="bg-slate-900">Select budget</option>
                        <option value="5k-10k" className="bg-slate-900">₹50K – ₹1L / month</option>
                        <option value="10k-25k" className="bg-slate-900">₹1L – ₹2.5L / month</option>
                        <option value="25k-50k" className="bg-slate-900">₹2.5L – ₹5L / month</option>
                        <option value="50k+" className="bg-slate-900">₹5L+ / month</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Tell Us About Your Goals *</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="What are you looking to achieve? What channels are you currently using? What's your biggest marketing challenge?"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors resize-none text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group w-full flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25"
                  >
                    Send Message
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}