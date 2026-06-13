import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
    as?: 'button' | 'div' // reserved for future use

}

export default function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  onClick,
  as: _Tag = 'div',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPosition({ x: x * strength, y: y * strength })
  }

  const handleMouseEnter = () => setIsHovered(true)

  const handleMouseLeave = () => {
    setIsHovered(false)
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        x: position.x,
        y: position.y,
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
        mass: 0.1,
      }}
      className={`relative cursor-none ${className}`}
    >
      {/* Neon glow ring on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: isHovered
            ? '0 0 20px rgba(0,255,136,0.4), 0 0 40px rgba(0,255,136,0.2)'
            : '0 0 0px rgba(0,255,136,0)',
        }}
        transition={{ duration: 0.3 }}
      />
      {children}
    </motion.div>
  )
}