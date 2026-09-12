import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)')

    if (!finePointer.matches) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2

    let ringX = mouseX
    let ringY = mouseY

    let glowX = mouseX
    let glowY = mouseY

    let isHovering = false
    let isVisible = false

    let rafId = 0

    const setVisibility = (visible: boolean) => {
      isVisible = visible

      const opacity = visible ? '1' : '0'

      if (dotRef.current) {
        dotRef.current.style.opacity = opacity
      }

      if (ringRef.current) {
        ringRef.current.style.opacity = opacity
      }

      if (glowRef.current) {
        glowRef.current.style.opacity = visible
          ? isHovering
            ? '0.4'
            : '0.15'
          : '0'
      }
    }

    const onMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY

      if (!isVisible) {
        setVisibility(true)
      }
    }

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target

      if (!(target instanceof Element)) return

      isHovering = Boolean(
        target.closest(
          'a, button, input, textarea, select, [role="button"], [data-cursor-hover]'
        )
      )
    }

    const onMouseLeave = () => {
      setVisibility(false)
    }

    const onMouseEnter = () => {
      setVisibility(true)
    }

    const onMouseDown = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `
          translate(${mouseX - 4}px, ${mouseY - 4}px)
          scale(0.65)
        `
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `
          translate(${ringX - 20}px, ${ringY - 20}px)
          scale(0.82)
        `
      }
    }

    const onMouseUp = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `
          translate(${mouseX - 4}px, ${mouseY - 4}px)
          scale(1)
        `
      }
    }

    window.addEventListener('mousemove', onMouseMove, {
      passive: true,
    })

    window.addEventListener('pointerover', onPointerOver, {
      passive: true,
    })

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    const animate = () => {
      /* Dot follows the real cursor */
      if (dotRef.current) {
        dotRef.current.style.transform = `
          translate(${mouseX - 4}px, ${mouseY - 4}px)
          scale(1)
        `
      }

      /* Ring */
      const RING_LERP = 0.18

      ringX += (mouseX - ringX) * RING_LERP
      ringY += (mouseY - ringY) * RING_LERP

      if (ringRef.current) {
        const scale = isHovering ? 1.7 : 1

        ringRef.current.style.transform = `
          translate(${ringX - 20}px, ${ringY - 20}px)
          scale(${scale})
        `

        ringRef.current.style.borderColor = isHovering
          ? 'rgba(0,255,136,0.85)'
          : 'rgba(0,255,136,0.4)'

        ringRef.current.style.boxShadow = isHovering
          ? '0 0 18px rgba(0,255,136,0.35)'
          : 'none'
      }

      /* Glow */
      const GLOW_LERP = 0.07

      glowX += (mouseX - glowX) * GLOW_LERP
      glowY += (mouseY - glowY) * GLOW_LERP

      if (glowRef.current) {
        glowRef.current.style.transform = `
          translate(${glowX - 60}px, ${glowY - 60}px)
        `

        glowRef.current.style.opacity = isVisible
          ? isHovering
            ? '0.4'
            : '0.15'
          : '0'
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)

      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('pointerover', onPointerOver)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)

      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [])

  return (
    <>
      {/* Cursor dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none hidden md:block"
        style={{
          zIndex: 99990,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#00ff88',
          boxShadow:
            '0 0 8px rgba(0,255,136,0.9), 0 0 16px rgba(0,255,136,0.4)',
          opacity: 0,
          willChange: 'transform',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Cursor ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none hidden md:block"
        style={{
          zIndex: 99989,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1.5px solid rgba(0,255,136,0.4)',
          opacity: 0,
          willChange: 'transform',
          transition:
            'opacity 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        }}
      />

      {/* Cursor glow */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none hidden md:block"
        style={{
          zIndex: 99988,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0,255,136,0.15) 0%, transparent 70%)',
          opacity: 0,
          willChange: 'transform',
          transition: 'opacity 0.3s ease',
          filter: 'blur(8px)',
        }}
      />
    </>
  )
}