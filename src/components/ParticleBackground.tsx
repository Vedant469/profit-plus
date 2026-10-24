import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const mobileQuery = window.matchMedia('(max-width: 768px), (pointer: coarse)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const isLowEnd = (navigator.hardwareConcurrency || 4) <= 4
    const colors = ['#10b981', '#34d399', '#059669', '#6ee7b7', '#a7f3d0']
    const particles: Particle[] = []
    let animationId = 0
    let lastTime = 0
    let isVisible = !document.hidden
    let isInViewport = true
    let isRunning = false
    let width = 0
    let height = 0

    const isMobile = () => mobileQuery.matches
    const shouldAnimate = () => isVisible && isInViewport && !motionQuery.matches

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile() ? 1 : 1.5)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (isMobile() ? 0.16 : 0.4),
      vy: (Math.random() - 0.5) * (isMobile() ? 0.16 : 0.4),
      size: Math.random() * (isMobile() ? 1.2 : 2) + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)]!,
    })

    const init = () => {
      resize()
      particles.length = 0
      const mobile = isMobile()
      const density = mobile ? 65000 : isLowEnd ? 20000 : 12000
      const maxCount = mobile ? 14 : isLowEnd ? 35 : 60
      const count = Math.min(Math.floor((width * height) / density), maxCount)
      for (let i = 0; i < count; i++) particles.push(createParticle())
      ctx.clearRect(0, 0, width, height)
    }

    const drawConnections = (p1: Particle, p2: Particle) => {
      if (isMobile()) return
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 100) {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.06 * (1 - dist / 100)})`
        ctx.lineWidth = 0.5
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
      }
    }

    const animate = (timestamp: number) => {
      if (!shouldAnimate()) {
        isRunning = false
        return
      }
      animationId = requestAnimationFrame(animate)
      const frameMs = 1000 / (isMobile() || isLowEnd ? 30 : 60)
      if (timestamp - lastTime < frameMs) return
      lastTime = timestamp
      ctx.clearRect(0, 0, width, height)
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()
        ctx.globalAlpha = 1
        for (let j = i + 1; j < particles.length; j++) drawConnections(p, particles[j]!)
      })
    }

    const start = () => {
      if (isRunning || !shouldAnimate()) return
      isRunning = true
      lastTime = 0
      animationId = requestAnimationFrame(animate)
    }
    const stop = () => {
      if (animationId) cancelAnimationFrame(animationId)
      animationId = 0
      isRunning = false
    }
    const refresh = () => {
      stop()
      init()
      start()
    }
    const handleVisibility = () => {
      isVisible = !document.hidden
      isVisible ? start() : stop()
    }
    const handleMotionChange = () => shouldAnimate() ? start() : stop()
    const observer = new IntersectionObserver(([entry]) => {
      isInViewport = entry.isIntersecting
      isInViewport ? start() : stop()
    })
    observer.observe(canvas)

    init()
    start()
    window.addEventListener('resize', refresh, { passive: true })
    mobileQuery.addEventListener('change', refresh)
    motionQuery.addEventListener('change', handleMotionChange)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      stop()
      observer.disconnect()
      window.removeEventListener('resize', refresh)
      mobileQuery.removeEventListener('change', refresh)
      motionQuery.removeEventListener('change', handleMotionChange)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
      style={{ opacity: 0.5 }}
      aria-hidden="true"
    />
  )
}