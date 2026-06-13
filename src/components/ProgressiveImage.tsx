import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ProgressiveImageProps {
  src: string
  alt: string
  className?: string
  placeholderColor?: string
}

export default function ProgressiveImage({
  src,
  alt,
  className = '',
  placeholderColor = 'rgba(0,255,136,0.05)',
}: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    if (imgRef.current) observer.observe(imgRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: loaded ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        style={{ background: placeholderColor }}
      >
        {/* Shimmer */}
        <div className="absolute inset-0 skeleton-shimmer" />

        {/* Neon pulse */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className="w-8 h-8 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0,255,136,0.4) 0%, transparent 70%)',
              boxShadow: '0 0 20px rgba(0,255,136,0.3)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Actual image */}
      {inView && !error && (
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          animate={loaded
            ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
            : { opacity: 0, scale: 1.05, filter: 'blur(10px)' }
          }
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full h-full object-cover"
        />
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <p className="text-gray-500 text-sm">Failed to load</p>
        </div>
      )}
    </div>
  )
}