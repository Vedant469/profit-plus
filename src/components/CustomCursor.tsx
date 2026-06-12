import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      setIsHovering(
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('a') !== null ||
        target.closest('button') !== null
      )
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', updatePosition)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none hidden md:block"
        animate={{
          x: position.x - 20,
          y: position.y - 20,
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 0.8 : isHovering ? 1.6 : 1,
        }}
        transition={{
          x: { type: 'spring', stiffness: 120, damping: 18, mass: 0.6 },
          y: { type: 'spring', stiffness: 120, damping: 18, mass: 0.6 },
          scale: { type: 'spring', stiffness: 300, damping: 20 },
          opacity: { duration: 0.2 },
        }}
      >
        <div className={`w-10 h-10 rounded-full border-2 transition-colors duration-200 ${
          isHovering
            ? 'border-amber-400 bg-amber-400/10'
            : 'border-white/40 bg-transparent'
        }`} />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 0.5 : isHovering ? 0 : 1,
        }}
        transition={{
          x: { type: 'spring', stiffness: 500, damping: 28, mass: 0.1 },
          y: { type: 'spring', stiffness: 500, damping: 28, mass: 0.1 },
          scale: { type: 'spring', stiffness: 400, damping: 20 },
          opacity: { duration: 0.15 },
        }}
      >
        <div className="w-2 h-2 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
      </motion.div>

      {/* Glow trail */}
      <motion.div
        className="fixed top-0 left-0 z-[9997] pointer-events-none hidden md:block"
        animate={{
          x: position.x - 30,
          y: position.y - 30,
          opacity: isVisible ? (isHovering ? 0.3 : 0.1) : 0,
        }}
        transition={{
          x: { type: 'spring', stiffness: 60, damping: 15, mass: 1 },
          y: { type: 'spring', stiffness: 60, damping: 15, mass: 1 },
          opacity: { duration: 0.3 },
        }}
      >
        <div className="w-16 h-16 rounded-full bg-amber-400 blur-xl" />
      </motion.div>
    </>
  )
}