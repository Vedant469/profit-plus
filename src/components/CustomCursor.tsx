import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.innerWidth < 768) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let glowX = mouseX
    let glowY = mouseY
    let isHovering = false
    let isVisible = false
    let rafId: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!isVisible) {
        isVisible = true
        if (dotRef.current) dotRef.current.style.opacity = '1'
        if (ringRef.current) ringRef.current.style.opacity = '1'
        if (glowRef.current) glowRef.current.style.opacity = '1'
      }
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      isHovering = !!(
        target.closest('a') ||
        target.closest('button') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      )
    }

    const onMouseLeave = () => {
      isVisible = false
      if (dotRef.current) dotRef.current.style.opacity = '0'
      if (ringRef.current) ringRef.current.style.opacity = '0'
      if (glowRef.current) glowRef.current.style.opacity = '0'
    }

    const onMouseEnter = () => {
      isVisible = true
      if (dotRef.current) dotRef.current.style.opacity = '1'
      if (ringRef.current) ringRef.current.style.opacity = '1'
      if (glowRef.current) glowRef.current.style.opacity = '1'
    }

    const onMouseDown = () => {
      if (dotRef.current) dotRef.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) scale(0.6)`
      if (ringRef.current) ringRef.current.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px) scale(0.8)`
    }

    const onMouseUp = () => {
      if (dotRef.current) dotRef.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) scale(1)`
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseover', onMouseOver, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    const animate = () => {
      // Dot follows cursor exactly — zero lag
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) scale(1)`
      }

      // Ring lerps smoothly — slight follow
      const RING_LERP = 0.18
      ringX += (mouseX - ringX) * RING_LERP
      ringY += (mouseY - ringY) * RING_LERP

      if (ringRef.current) {
        const scale = isHovering ? 1.8 : 1
        ringRef.current.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px) scale(${scale})`
        ringRef.current.style.borderColor = isHovering
          ? 'rgba(0,255,136,0.8)'
          : 'rgba(0,255,136,0.4)'
        ringRef.current.style.boxShadow = isHovering
          ? '0 0 15px rgba(0,255,136,0.3)'
          : 'none'
      }

      // Glow lerps very slowly — dreamy trail
      const GLOW_LERP = 0.07
      glowX += (mouseX - glowX) * GLOW_LERP
      glowY += (mouseY - glowY) * GLOW_LERP

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glowX - 60}px, ${glowY - 60}px)`
        glowRef.current.style.opacity = isHovering ? '0.4' : '0.15'
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [])

  return (
    <>
      {/* Dot — follows exactly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none hidden md:block"
        style={{
          zIndex: 99999,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#00ff88',
          boxShadow: '0 0 8px rgba(0,255,136,0.9), 0 0 16px rgba(0,255,136,0.4)',
          opacity: 0,
          willChange: 'transform',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Ring — smooth lerp */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none hidden md:block"
        style={{
          zIndex: 99998,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1.5px solid rgba(0,255,136,0.4)',
          opacity: 0,
          willChange: 'transform',
          transition: 'opacity 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.05s linear',
        }}
      />

      {/* Glow — dreamy trail */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none hidden md:block"
        style={{
          zIndex: 99997,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,136,0.15) 0%, transparent 70%)',
          opacity: 0,
          willChange: 'transform',
          transition: 'opacity 0.3s ease',
          filter: 'blur(8px)',
        }}
      />
    </>
  )
}