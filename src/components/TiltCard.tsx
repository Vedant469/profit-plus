import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  glare?: boolean
}

export default function TiltCard({
  children,
  className = '',
  intensity = 10,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = ref.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = -((y - centerY) / centerY) * intensity
    const rotateY = ((x - centerX) / centerX) * intensity
    setTilt({ x: rotateX, y: rotateY })
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    })
  }

  const handleMouseEnter = () => setIsHovered(true)

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
    setGlarePos({ x: 50, y: 50 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        mass: 0.5,
      }}
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      className={`relative ${className}`}
    >
      {/* Holographic glare */}
      {glare && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: `radial-gradient(
              circle at ${glarePos.x}% ${glarePos.y}%,
              rgba(0,255,136,0.08) 0%,
              rgba(0,255,136,0.04) 30%,
              transparent 70%
            )`,
          }}
        />
      )}

      {/* Neon border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: isHovered
            ? `
              0 0 0 1px rgba(0,255,136,0.3),
              0 0 20px rgba(0,255,136,0.1),
              inset 0 0 20px rgba(0,255,136,0.03)
            `
            : '0 0 0 1px rgba(255,255,255,0.05)',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </motion.div>
  )
}