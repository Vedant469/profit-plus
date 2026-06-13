import { motion } from 'framer-motion'

interface LiquidShapeProps {
  className?: string
  color?: string
  size?: number
  speed?: number
}

export default function LiquidShape({
  className = '',
  color = 'rgba(0,255,136,0.08)',
  size = 400,
  speed = 8,
}: LiquidShapeProps) {
  const variants = {
    animate: {
      borderRadius: [
        '60% 40% 30% 70% / 60% 30% 70% 40%',
        '30% 60% 70% 40% / 50% 60% 30% 60%',
        '50% 60% 40% 60% / 40% 50% 60% 50%',
        '70% 30% 60% 40% / 30% 70% 40% 60%',
        '60% 40% 30% 70% / 60% 30% 70% 40%',
      ],
      rotate: [0, 90, 180, 270, 360],
      scale: [1, 1.05, 0.95, 1.02, 1],
      transition: {
        duration: speed,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  }

  return (
    <motion.div
      variants={variants}
      animate="animate"
      className={`pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
        filter: 'blur(40px)',
        willChange: 'transform, border-radius',
      }}
    />
  )
}