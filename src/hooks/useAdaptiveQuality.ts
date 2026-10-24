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
    let active = true
    let battery: any = null

    const connection = (navigator as any).connection
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')

    const detectQuality = () => {
      if (motionPreference.matches) {
        setQuality('low')
        return
      }

      let score = 0
      const cores = navigator.hardwareConcurrency ?? 4
      if (cores >= 8) score += 3
      else if (cores >= 4) score += 2
      else score += 1

      const memory = (navigator as any).deviceMemory ?? 4
      if (memory >= 8) score += 3
      else if (memory >= 4) score += 2
      else score += 1

      if (connection) {
        if (connection.effectiveType === '4g') score += 2
        else if (connection.effectiveType === '3g') score += 1
      } else {
        score += 2
      }

      if (window.innerWidth < 768) score -= 2

      if (battery && battery.level < 0.2 && !battery.charging) {
        setQuality('low')
      } else if (score >= 7) {
        setQuality('high')
      } else if (score >= 4) {
        setQuality('medium')
      } else {
        setQuality('low')
      }
    }

    const handleBatteryChange = () => detectQuality()
    const handleMotionPreferenceChange = () => detectQuality()
    const handleResize = () => detectQuality()

    detectQuality()
    if (connection) connection.addEventListener('change', detectQuality)
    motionPreference.addEventListener('change', handleMotionPreferenceChange)
    window.addEventListener('resize', handleResize, { passive: true })

    if ('getBattery' in navigator) {
      ;(navigator as any).getBattery().then((result: any) => {
        if (!active) return
        battery = result
        battery.addEventListener('levelchange', handleBatteryChange)
        battery.addEventListener('chargingchange', handleBatteryChange)
        detectQuality()
      }).catch(() => {
        // Battery status is optional; keep the device-based quality estimate.
      })
    }

    return () => {
      active = false
      if (connection) connection.removeEventListener('change', detectQuality)
      motionPreference.removeEventListener('change', handleMotionPreferenceChange)
      window.removeEventListener('resize', handleResize)
      if (battery) {
        battery.removeEventListener('levelchange', handleBatteryChange)
        battery.removeEventListener('chargingchange', handleBatteryChange)
      }
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
