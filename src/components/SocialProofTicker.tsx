import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

const notifications = [
  { name: 'Rahul S.', location: 'Mumbai', action: 'just booked a strategy call' },
  { name: 'Priya M.', location: 'Delhi', action: 'requested a free profit audit' },
  { name: 'Amit K.', location: 'Bangalore', action: 'signed up for Growth plan' },
  { name: 'Sneha R.', location: 'Pune', action: 'just booked a strategy call' },
  { name: 'Vikram T.', location: 'Hyderabad', action: 'requested a free profit audit' },
  { name: 'Neha P.', location: 'Chennai', action: 'signed up for Starter plan' },
  { name: 'Arjun D.', location: 'Ahmedabad', action: 'just booked a strategy call' },
  { name: 'Kavya L.', location: 'Kolkata', action: 'requested a free profit audit' },
  { name: 'Rohan B.', location: 'Jaipur', action: 'signed up for Enterprise plan' },
  { name: 'Ananya S.', location: 'Surat', action: 'just booked a strategy call' },
  { name: 'Dev M.', location: 'London', action: 'signed up for Growth plan' },
  { name: 'Sarah K.', location: 'New York', action: 'just booked a strategy call' },
  { name: 'James R.', location: 'Singapore', action: 'requested a free profit audit' },
  { name: 'Meera N.', location: 'Dubai', action: 'signed up for Enterprise plan' },
]

function getRandomTime() {
  const times = ['Just now', '2 min ago', '5 min ago', '8 min ago', '12 min ago', '15 min ago']
  return times[Math.floor(Math.random() * times.length)]
}

export default function SocialProofTicker() {
  const [current, setCurrent] = useState<{ name: string; location: string; action: string; time: string } | null>(null)
  const [visible, setVisible] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    // Show first notification after 5 seconds
    const initialDelay = setTimeout(() => {
      showNotification(0)
    }, 5000)

    return () => clearTimeout(initialDelay)
  }, [])

  const showNotification = (i: number) => {
    const notif = notifications[i % notifications.length]!
    setCurrent({ ...notif, time: getRandomTime() })
    setVisible(true)

    // Hide after 4 seconds
    setTimeout(() => {
      setVisible(false)

      // Show next after 8 seconds
      setTimeout(() => {
        const nextIndex = (i + 1) % notifications.length
        setIndex(nextIndex)
        showNotification(nextIndex)
      }, 8000)
    }, 4000)
  }

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 max-w-xs w-full pointer-events-none">
      <AnimatePresence>
        {visible && current && (
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-slate-900 border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/50 pointer-events-auto"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
                <span className="text-white text-sm font-bold">
                  {current.name[0]}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">
                  {current.name}
                  <span className="text-gray-400 font-normal"> from </span>
                  <span className="text-amber-400">{current.location}</span>
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{current.action}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-gray-500 text-xs">{current.time}</p>
                </div>
              </div>

              {/* Icon */}
              <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}