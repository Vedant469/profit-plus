type MetricName = 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP'

interface Metric {
  name: MetricName
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
}

const thresholds: Record<MetricName, [number, number]> = {
  CLS: [0.1, 0.25],
  FID: [100, 300],
  FCP: [1800, 3000],
  LCP: [2500, 4000],
  TTFB: [800, 1800],
  INP: [200, 500],
}

function getRating(name: MetricName, value: number): 'good' | 'needs-improvement' | 'poor' {
  const [good, poor] = thresholds[name]!
  if (value <= good) return 'good'
  if (value <= poor) return 'needs-improvement'
  return 'poor'
}

function report(metric: Metric) {
  const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌'
  console.log(`${emoji} ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`)

  // Send to Google Analytics if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.rating,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    })
  }
}

export function initWebVitals() {
  if (typeof window === 'undefined') return

  // LCP — Largest Contentful Paint
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number }
      if (lastEntry) {
        report({
          name: 'LCP',
          value: lastEntry.startTime,
          rating: getRating('LCP', lastEntry.startTime),
        })
      }
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
  } catch (_e) {}

  // CLS — Cumulative Layout Shift
  try {
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number }
        if (!layoutShift.hadRecentInput) {
          clsValue += layoutShift.value
          report({
            name: 'CLS',
            value: clsValue,
            rating: getRating('CLS', clsValue),
          })
        }
      }
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })
  } catch (_e) {}

  // FCP — First Contentful Paint
  try {
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const paintEntry = entry as PerformanceEntry & { startTime: number }
        if (entry.name === 'first-contentful-paint') {
          report({
            name: 'FCP',
            value: paintEntry.startTime,
            rating: getRating('FCP', paintEntry.startTime),
          })
          fcpObserver.disconnect()
        }
      }
    })
    fcpObserver.observe({ type: 'paint', buffered: true })
  } catch (_e) {}

  // TTFB — Time to First Byte
  try {
    const navEntry = performance.getEntriesByType('navigation')[0] as
      PerformanceNavigationTiming | undefined
    if (navEntry) {
      const ttfb = navEntry.responseStart - navEntry.requestStart
      report({
        name: 'TTFB',
        value: ttfb,
        rating: getRating('TTFB', ttfb),
      })
    }
  } catch (_e) {}

  // FID — First Input Delay
  try {
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as PerformanceEntry & {
          processingStart: number
          startTime: number
        }
        const fid = fidEntry.processingStart - fidEntry.startTime
        report({
          name: 'FID',
          value: fid,
          rating: getRating('FID', fid),
        })
        fidObserver.disconnect()
      }
    })
    fidObserver.observe({ type: 'first-input', buffered: true })
  } catch (_e) {}
}