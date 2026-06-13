import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle } from 'lucide-react'

const teamContacts = [
  { name: 'Atharva Ratnoji', role: 'Performance Marketing', phone: '917028062213' },
  { name: 'Rushikesh Phule', role: 'SEO & Content', phone: '918446207529' },
  { name: 'Vedant', role: 'Analytics & Strategy', phone: '917796597171' },
]

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false)

  const openWhatsApp = (phone: string, name: string) => {
    const message = encodeURIComponent(
      `Hi ${name}, I found ProfitPlus and I'm interested in growing my business. Can we talk?`
    )
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  return (
    <div className="fixed bottom-24 left-4 md:bottom-6 md:left-6 z-50 flex flex-col items-start gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-slate-900 border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/50 w-72"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Chat with us</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-green-400 text-xs">Online now</p>
                </div>
              </div>
            </div>

            {/* Team */}
            <p className="text-gray-400 text-xs mb-3">Choose who to chat with:</p>
            <div className="space-y-2">
              {teamContacts.map(({ name, role, phone }) => (
                <button
                  key={name}
                  onClick={() => openWhatsApp(phone, name)}
                  className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-green-500/10 border border-white/5 hover:border-green-500/20 rounded-xl transition-all group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{name[0]}</span>
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-white text-sm font-medium group-hover:text-green-400 transition-colors">{name}</p>
                    <p className="text-gray-500 text-xs">{role}</p>
                  </div>
                  <MessageCircle className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>

            <p className="text-gray-600 text-xs text-center mt-3">
              Typically replies within minutes
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all"
        aria-label="Chat on WhatsApp"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}