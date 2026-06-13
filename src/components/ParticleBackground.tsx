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

    const isMobile = window.innerWidth < 768
    const isLowEnd = navigator.hardwareConcurrency <= 4

    // Green color palette
    const colors = ['#10b981', '#34d399', '#059669', '#6ee7b7', '#a7f3d0']
    const particles: Particle[] = []
    let animationId: number
    let lastTime = 0
    const FPS = isMobile ? 30 : 60
    const FRAME_MS = 1000 / FPS

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.4),
      vy: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.4),
      size: Math.random() * (isMobile ? 1.5 : 2) + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)]!,
    })

    const init = () => {
      resize()
      particles.length = 0
      const area = canvas.width * canvas.height
      const density = isMobile ? 40000 : isLowEnd ? 20000 : 12000
      const count = Math.min(Math.floor(area / density), isMobile ? 20 : 60)
      for (let i = 0; i < count; i++) {
        particles.push(createParticle())
      }
    }

    const drawConnections = (p1: Particle, p2: Particle) => {
      if (isMobile) return // Skip connections on mobile for performance
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
      animationId = requestAnimationFrame(animate)

      // Cap FPS for performance
      if (timestamp - lastTime < FRAME_MS) return
      lastTime = timestamp

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()
        ctx.globalAlpha = 1

        if (!isMobile) {
          for (let j = i + 1; j < particles.length; j++) {
            drawConnections(p, particles[j]!)
          }
        }
      })
    }

    init()
    animationId = requestAnimationFrame(animate)

    const handleResize = () => { init() }
    window.addEventListener('resize', handleResize, { passive: true })

    // Pause when tab is hidden
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId)
      } else {
        animationId = requestAnimationFrame(animate)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  )
}