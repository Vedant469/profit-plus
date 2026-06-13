import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgressBar() {
  const [visible, setVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => setVisible(v > 0.01))
    return () => unsub()
  }, [scrollYProgress])

  if (!visible) return null

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-orange-500 origin-left z-[100] shadow-lg shadow-emerald-500/50"
    />
  )
}