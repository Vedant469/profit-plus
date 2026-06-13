import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  stagger?: number
  once?: boolean
  type?: 'chars' | 'words'
}

export default function SplitText({
  text,
  className = '',
  delay = 0,
  duration = 0.5,
  stagger = 0.03,
  once = true,
  type = 'chars',
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [once])

  const items = type === 'words'
    ? text.split(' ')
    : text.split('')

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -30,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      aria-label={text}
      style={{ perspective: '1000px' }}
    >
      {items.map((item, i) => (
        <motion.span
          key={i}
          variants={itemVariants}
          className="inline-block split-char"
          style={{ display: 'inline-block' }}
        >
          {item === ' ' ? '\u00A0' : item}
          {type === 'words' && i < items.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </motion.span>
  )
}