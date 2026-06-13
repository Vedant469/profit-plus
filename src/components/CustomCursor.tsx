import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const spotlightRef = useRef<HTMLDivElement>(null)

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

      // Update spotlight position directly via DOM for performance
      if (spotlightRef.current) {
        spotlightRef.current.style.left = `${e.clientX}px`
        spotlightRef.current.style.top = `${e.clientY}px`
      }
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

    window.addEventListener('mousemove', updatePosition, { passive: true })
    window.addEventListener('mouseover', handleMouseOver, { passive: true })
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
      {/* Spotlight effect */}
      <div
        ref={spotlightRef}
        className="fixed pointer-events-none hidden md:block"
        style={{
          zIndex: 9990,
          width: '400px',
          height: '400px',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%)',
          borderRadius: '50%',
          transition: 'opacity 0.3s ease',
          opacity: isVisible ? 1 : 0,
        }}
      />

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
        <div
          className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
            isHovering
              ? 'border-[#00ff88] bg-[#00ff88]/10'
              : 'border-white/30 bg-transparent'
          }`}
          style={{
            boxShadow: isHovering
              ? '0 0 15px rgba(0,255,136,0.4), inset 0 0 15px rgba(0,255,136,0.1)'
              : 'none',
          }}
        />
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
        <div
          className="w-2 h-2 rounded-full bg-[#00ff88]"
          style={{
            boxShadow: '0 0 10px rgba(0,255,136,0.8), 0 0 20px rgba(0,255,136,0.4)',
          }}
        />
      </motion.div>

      {/* Glow trail */}
      <motion.div
        className="fixed top-0 left-0 z-[9997] pointer-events-none hidden md:block"
        animate={{
          x: position.x - 30,
          y: position.y - 30,
          opacity: isVisible ? (isHovering ? 0.4 : 0.15) : 0,
        }}
        transition={{
          x: { type: 'spring', stiffness: 60, damping: 15, mass: 1 },
          y: { type: 'spring', stiffness: 60, damping: 15, mass: 1 },
          opacity: { duration: 0.3 },
        }}
      >
        <div
          className="w-16 h-16 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,136,0.6) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />
      </motion.div>
    </>
  )
}