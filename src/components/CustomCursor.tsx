import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)')

    if (!mediaQuery.matches) {
      return
    }

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2

    let ringX = mouseX
    let ringY = mouseY

    let glowX = mouseX
    let glowY = mouseY

    let visible = false
    let hoveringInteractive = false
    let draggingScrollbar = false

    let animationFrame = 0

    const setVisibility = (value: boolean) => {
      visible = value

      if (dotRef.current) {
        dotRef.current.style.opacity = value ? '1' : '0'
      }

      if (ringRef.current) {
        ringRef.current.style.opacity = value ? '1' : '0'
      }

      if (glowRef.current) {
        glowRef.current.style.opacity = value
          ? hoveringInteractive
            ? '0.4'
            : '0.15'
          : '0'
      }
    }

    const hideCustomCursor = () => {
      if (dotRef.current) {
        dotRef.current.style.opacity = '0'
      }

      if (ringRef.current) {
        ringRef.current.style.opacity = '0'
      }

      if (glowRef.current) {
        glowRef.current.style.opacity = '0'
      }
    }

    const isOnBrowserScrollbar = (event: MouseEvent) => {
      const documentWidth = document.documentElement.clientWidth
      const documentHeight = document.documentElement.clientHeight

      const onVerticalScrollbar = event.clientX >= documentWidth
      const onHorizontalScrollbar = event.clientY >= documentHeight

      return onVerticalScrollbar || onHorizontalScrollbar
    }

    const onMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY

      if (!draggingScrollbar && !visible) {
        setVisibility(true)
      }
    }

    const onPointerOver = (event: PointerEvent) => {
      if (draggingScrollbar) {
        return
      }

      const target = event.target

      if (!(target instanceof Element)) {
        return
      }

      hoveringInteractive = Boolean(
        target.closest(
          [
            'a',
            'button',
            'input',
            'textarea',
            'select',
            '[role="button"]',
            '[data-cursor-hover]',
          ].join(',')
        )
      )

      if (visible) {
        setVisibility(true)
      }
    }

    const onMouseDown = (event: MouseEvent) => {
      /*
       * Browser scrollbar interaction:
       * hide our fake cursor completely.
       * The native browser cursor remains untouched.
       */
      if (isOnBrowserScrollbar(event)) {
        draggingScrollbar = true
        hideCustomCursor()
        return
      }

      draggingScrollbar = false

      if (dotRef.current) {
        dotRef.current.style.transform = `
          translate(${mouseX - 4}px, ${mouseY - 4}px)
          scale(0.65)
        `
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `
          translate(${ringX - 20}px, ${ringY - 20}px)
          scale(0.8)
        `
      }
    }

    const onMouseUp = () => {
      draggingScrollbar = false

      if (dotRef.current) {
        dotRef.current.style.transform = `
          translate(${mouseX - 4}px, ${mouseY - 4}px)
          scale(1)
        `
      }

      if (visible) {
        setVisibility(true)
      }
    }

    const onMouseLeave = () => {
      visible = false

      if (!draggingScrollbar) {
        setVisibility(false)
      }
    }

    const onMouseEnter = () => {
      if (!draggingScrollbar) {
        setVisibility(true)
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
      if (!draggingScrollbar) {
        if (dotRef.current) {
          dotRef.current.style.transform = `
            translate(${mouseX - 4}px, ${mouseY - 4}px)
            scale(1)
          `
        }

        const ringLerp = 0.18

        ringX += (mouseX - ringX) * ringLerp
        ringY += (mouseY - ringY) * ringLerp

        if (ringRef.current) {
          const scale = hoveringInteractive ? 1.7 : 1

          ringRef.current.style.transform = `
            translate(${ringX - 20}px, ${ringY - 20}px)
            scale(${scale})
          `

          ringRef.current.style.borderColor = hoveringInteractive
            ? 'rgba(0,255,136,0.85)'
            : 'rgba(0,255,136,0.4)'

          ringRef.current.style.boxShadow = hoveringInteractive
            ? '0 0 18px rgba(0,255,136,0.35)'
            : 'none'
        }

        const glowLerp = 0.07

        glowX += (mouseX - glowX) * glowLerp
        glowY += (mouseY - glowY) * glowLerp

        if (glowRef.current) {
          glowRef.current.style.transform = `
            translate(${glowX - 60}px, ${glowY - 60}px)
          `

          glowRef.current.style.opacity = visible
            ? hoveringInteractive
              ? '0.4'
              : '0.15'
            : '0'
        }
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)

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
          transition: 'opacity 0.15s ease',
        }}
      />

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
            'opacity 0.15s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        }}
      />

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
          transition: 'opacity 0.25s ease',
          filter: 'blur(8px)',
        }}
      />
    </>
  )
}