import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'

interface PullToRefreshProps {
  onRefresh?: () => Promise<void>
  threshold?: number
}

export default function PullToRefresh({
  onRefresh,
  threshold = 80,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isPulling, setIsPulling] = useState(false)
  const startYRef = useRef(0)
  const isDraggingRef = useRef(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      startYRef.current = e.touches[0]?.clientY ?? 0
      isDraggingRef.current = true
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDraggingRef.current || isRefreshing) return
    const currentY = e.touches[0]?.clientY ?? 0
    const diff = currentY - startYRef.current

    if (diff > 0 && window.scrollY === 0) {
      e.preventDefault()
      const distance = Math.min(diff * 0.5, threshold * 1.5)
      setPullDistance(distance)
      setIsPulling(true)
    }
  }, [isRefreshing, threshold])

  const handleTouchEnd = useCallback(async () => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false

    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      setPullDistance(threshold)

      try {
        if (onRefresh) {
          await onRefresh()
        } else {
          await new Promise(resolve => setTimeout(resolve, 1500))
          window.location.reload()
        }
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
        setIsPulling(false)
      }
    } else {
      setPullDistance(0)
      setIsPulling(false)
    }
  }, [pullDistance, threshold, onRefresh])

  useEffect(() => {
    // Only enable on mobile
    if (window.innerWidth >= 768) return

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  const progress = Math.min(pullDistance / threshold, 1)
  const isReady = pullDistance >= threshold

  return (
    <AnimatePresence>
      {(isPulling || isRefreshing) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[9999] flex justify-center pointer-events-none"
          style={{ paddingTop: Math.max(pullDistance - 20, 0) }}
        >
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full border"
            style={{
              background: 'rgba(2, 6, 23, 0.95)',
              borderColor: isReady
                ? 'rgba(0,255,136,0.5)'
                : 'rgba(255,255,255,0.1)',
              boxShadow: isReady
                ? '0 0 20px rgba(0,255,136,0.3)'
                : 'none',
            }}
          >
            <motion.div
              animate={{
                rotate: isRefreshing ? 360 : progress * 180,
              }}
              transition={
                isRefreshing
                  ? { duration: 0.8, repeat: Infinity, ease: 'linear' }
                  : { duration: 0 }
              }
            >
              <RefreshCw
                className="w-4 h-4"
                style={{
                  color: isReady ? '#00ff88' : '#6b7280',
                }}
              />
            </motion.div>
            <span
              className="text-xs font-medium"
              style={{ color: isReady ? '#00ff88' : '#6b7280' }}
            >
              {isRefreshing
                ? 'Refreshing...'
                : isReady
                ? 'Release to refresh'
                : 'Pull to refresh'}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}