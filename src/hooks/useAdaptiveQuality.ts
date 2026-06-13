import { useState, useEffect } from 'react'

type Quality = 'high' | 'medium' | 'low'

interface AdaptiveQuality {
  quality: Quality
  isHighEnd: boolean
  isMidRange: boolean
  isLowEnd: boolean
  shouldReduceMotion: boolean
  shouldReduceParticles: boolean
  shouldDisable3D: boolean
  particleCount: number
  animationDuration: number
}

export function useAdaptiveQuality(): AdaptiveQuality {
  const [quality, setQuality] = useState<Quality>('high')

  useEffect(() => {
    const detectQuality = () => {
      let score = 0

      // Check CPU cores
      const cores = navigator.hardwareConcurrency ?? 4
      if (cores >= 8) score += 3
      else if (cores >= 4) score += 2
      else score += 1

      // Check device memory (GB)
      const memory = (navigator as any).deviceMemory ?? 4
      if (memory >= 8) score += 3
      else if (memory >= 4) score += 2
      else score += 1

      // Check connection speed
      const connection = (navigator as any).connection
      if (connection) {
        if (connection.effectiveType === '4g') score += 2
        else if (connection.effectiveType === '3g') score += 1
        else score += 0
      } else {
        score += 2 // Assume good connection
      }

      // Check if mobile
      const isMobile = window.innerWidth < 768
      if (isMobile) score -= 2

      // Check battery (if available)
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          if (battery.level < 0.2 && !battery.charging) {
            setQuality('low')
          }
        }).catch(() => {})
      }

      // Check reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) {
        setQuality('low')
        return
      }

      // Set quality based on score
      if (score >= 7) setQuality('high')
      else if (score >= 4) setQuality('medium')
      else setQuality('low')
    }

    detectQuality()

    // Re-check on network change
    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', detectQuality)
      return () => connection.removeEventListener('change', detectQuality)
    }
  }, [])

  const configs = {
    high: {
      shouldReduceMotion: false,
      shouldReduceParticles: false,
      shouldDisable3D: false,
      particleCount: 80,
      animationDuration: 1,
    },
    medium: {
      shouldReduceMotion: false,
      shouldReduceParticles: true,
      shouldDisable3D: false,
      particleCount: 40,
      animationDuration: 0.8,
    },
    low: {
      shouldReduceMotion: true,
      shouldReduceParticles: true,
      shouldDisable3D: true,
      particleCount: 15,
      animationDuration: 0.3,
    },
  }

  return {
    quality,
    isHighEnd: quality === 'high',
    isMidRange: quality === 'medium',
    isLowEnd: quality === 'low',
    ...configs[quality],
  }
}