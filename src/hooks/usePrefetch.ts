import { useCallback, useRef } from 'react'

const prefetched = new Set<string>()

export function usePrefetch() {
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const prefetch = useCallback((href: string) => {
    if (prefetched.has(href)) return

    // Cancel any pending prefetch
    if (timerRef.current) clearTimeout(timerRef.current)

    // Delay slightly to avoid prefetching on quick mouse passes
    timerRef.current = setTimeout(() => {
      prefetched.add(href)

      // Create a link prefetch element
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = href
      link.as = 'document'
      document.head.appendChild(link)

      // Also preload the JS chunk for this route
      const scriptLink = document.createElement('link')
      scriptLink.rel = 'modulepreload'
      scriptLink.href = href
      document.head.appendChild(scriptLink)
    }, 100)
  }, [])

  const cancelPrefetch = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  // Hook to attach to any link element
  const prefetchProps = useCallback((href: string) => ({
    onMouseEnter: () => prefetch(href),
    onMouseLeave: cancelPrefetch,
    onFocus: () => prefetch(href),
    onBlur: cancelPrefetch,
    onTouchStart: () => prefetch(href),
  }), [prefetch, cancelPrefetch])

  return { prefetch, cancelPrefetch, prefetchProps }
}