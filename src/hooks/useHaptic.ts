type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' | 'selection'

const patterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 30,
  heavy: 60,
  success: [10, 50, 10],
  error: [50, 30, 50, 30, 50],
  warning: [30, 20, 30],
  selection: 5,
}

export function useHaptic() {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator

  const trigger = (type: HapticPattern = 'light') => {
    if (!isSupported) return
    const pattern = patterns[type]
    try {
      navigator.vibrate(pattern)
    } catch (_e) {
      // Silently fail if vibration not allowed
    }
  }

  const light = () => trigger('light')
  const medium = () => trigger('medium')
  const heavy = () => trigger('heavy')
  const success = () => trigger('success')
  const error = () => trigger('error')
  const warning = () => trigger('warning')
  const selection = () => trigger('selection')

  return {
    trigger,
    light,
    medium,
    heavy,
    success,
    error,
    warning,
    selection,
    isSupported,
  }
}