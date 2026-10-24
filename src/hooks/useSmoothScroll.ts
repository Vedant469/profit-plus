import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useLocation } from 'react-router-dom'

export default function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null)
  const location = useLocation()

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let rafId: number | null = null

    const stopSmoothScroll = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      lenisRef.current?.destroy()
      lenisRef.current = null
    }

    const startSmoothScroll = () => {
      if (motionPreference.matches || lenisRef.current) return

      const lenis = new Lenis({
        duration: 1.0,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
      })

      lenisRef.current = lenis

      const raf = (time: number) => {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }

      rafId = requestAnimationFrame(raf)
    }

    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        stopSmoothScroll()
      } else {
        startSmoothScroll()
      }
    }

    startSmoothScroll()
    motionPreference.addEventListener('change', handleMotionPreferenceChange)

    return () => {
      motionPreference.removeEventListener('change', handleMotionPreferenceChange)
      stopSmoothScroll()
    }
  }, [])

  // Reset scroll position on every route change.
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [location.pathname])
}
