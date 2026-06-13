import { useEffect, useRef, useCallback } from 'react'

interface SwipeConfig {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  velocity?: number
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  velocity = 0.3,
}: SwipeConfig) {
  const touchStart = useRef({ x: 0, y: 0, time: 0 })
  const touchEnd = useRef({ x: 0, y: 0 })

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStart.current = {
      x: e.touches[0]?.clientX ?? 0,
      y: e.touches[0]?.clientY ?? 0,
      time: Date.now(),
    }
    touchEnd.current = {
      x: e.touches[0]?.clientX ?? 0,
      y: e.touches[0]?.clientY ?? 0,
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    touchEnd.current = {
      x: e.touches[0]?.clientX ?? 0,
      y: e.touches[0]?.clientY ?? 0,
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    const dx = touchEnd.current.x - touchStart.current.x
    const dy = touchEnd.current.y - touchStart.current.y
    const elapsed = Date.now() - touchStart.current.time
    const vx = Math.abs(dx) / elapsed
    const vy = Math.abs(dy) / elapsed

    const isHorizontal = Math.abs(dx) > Math.abs(dy)
    const isVertical = Math.abs(dy) > Math.abs(dx)

    if (isHorizontal && Math.abs(dx) >= threshold && vx >= velocity) {
      if (dx < 0) onSwipeLeft?.()
      else onSwipeRight?.()
    }

    if (isVertical && Math.abs(dy) >= threshold && vy >= velocity) {
      if (dy < 0) onSwipeUp?.()
      else onSwipeDown?.()
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, velocity])

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])
}