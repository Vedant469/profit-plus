import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

// ── Logo Typewriter ───────────────────────────────────────────
function LogoTypewriter({ active }: { active: boolean }) {
  const [text, setText] = useState('')
  const fullText = 'ProfitPlus'

  useEffect(() => {
    if (!active) return
    let i = 0
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
      }
    }, 85)
    return () => clearInterval(timer)
  }, [active])

  const profitPart = text.slice(0, Math.min(text.length, 6))
  const plusPart = text.length > 6 ? text.slice(6) : ''

  return (
    <span
      className="font-black tracking-tight"
      style={{
        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
        color: '#ffffff',
        textShadow: '0 0 40px rgba(255,255,255,0.1)',
        minWidth: '320px',
        display: 'inline-block',
      }}
    >
      {profitPart}
      <span
        style={{
          background: 'linear-gradient(135deg, #34d399, #059669)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.6))',
        }}
      >
        {plusPart}
      </span>
      {text.length < fullText.length && (
        <span className="typewriter-cursor">|</span>
      )}
    </span>
  )
}

// ── Tagline Typewriter ────────────────────────────────────────
function TaglineTypewriter({ active }: { active: boolean }) {
  const [text, setText] = useState('')
  const fullText = 'Profit-Driven Marketing Agency'

  useEffect(() => {
    if (!active) return
    let i = 0
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
      }
    }, 40)
    return () => clearInterval(timer)
  }, [active])

  return (
    <span>
      {text}
      {text.length < fullText.length && (
        <span
          className="typewriter-cursor"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          |
        </span>
      )}
    </span>
  )
}

// ── Main Component ────────────────────────────────────────────
interface Props {
  onComplete: () => void
}

export default function IntroAnimation({ onComplete }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const dotGlowRef = useRef<SVGCircleElement>(null)
  const arrowRef = useRef<SVGGElement>(null)
  const pulseRingRef = useRef<SVGCircleElement>(null)
  const logoBoxRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const scanLineRef = useRef<SVGLineElement>(null)

  const [typingLogoActive, setTypingLogoActive] = useState(false)
  const [typingTaglineActive, setTypingTaglineActive] = useState(false)

  useEffect(() => {
    const overlay = overlayRef.current
    const wrapper = wrapperRef.current
    const path = pathRef.current
    const dot = dotRef.current
    const dotGlow = dotGlowRef.current
    const arrow = arrowRef.current
    const pulse = pulseRingRef.current
    const logoBox = logoBoxRef.current
    const tagline = taglineRef.current
    const scanLine = scanLineRef.current

    if (!overlay || !wrapper || !path || !dot) return

    const pathLength = path.getTotalLength()

    // ── Initial states ──────────────────────────────────────
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    })
    gsap.set(arrow, { opacity: 0, scale: 0, transformOrigin: '460px 50px' })
    gsap.set(pulse, { opacity: 0, scale: 0, transformOrigin: '460px 50px' })
    gsap.set(logoBox, { opacity: 0 })
    gsap.set(tagline, { opacity: 0 })
    gsap.set(scanLine, { opacity: 0 })

    const startPt = path.getPointAtLength(0)
    gsap.set([dot, dotGlow], { attr: { cx: startPt.x, cy: startPt.y } })

    // ── Master timeline ─────────────────────────────────────
    const tl = gsap.timeline({
      onComplete: () => setTimeout(onComplete, 150),
    })

    // Phase 1 — Draw line + move dot
    const dotProgress = { value: 0 }
    tl.to(path, {
      strokeDashoffset: 0,
      duration: 2.8,
      ease: 'power3.inOut',
    })
    tl.to(dotProgress, {
      value: pathLength,
      duration: 2.8,
      ease: 'power3.inOut',
      onUpdate() {
        const pt = path.getPointAtLength(dotProgress.value)
        gsap.set([dot, dotGlow], {
          attr: { cx: pt.x, cy: pt.y },
          immediateRender: true,
        })
      },
    }, 0)

    // Phase 2 — Arrow tip
    tl.to(arrow, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(2.5)',
    }, '-=0.08')

    tl.to([dot, dotGlow], { opacity: 0, duration: 0.25 }, '-=0.15')

    // Phase 3 — Scan line
    tl.to(scanLine, { opacity: 0.6, duration: 0.1 })
    tl.to(scanLine, {
      attr: { x1: 480, x2: 480 },
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
    })

    // Phase 4 — Pulse
    tl.to(pulse, { opacity: 1, scale: 1, duration: 0.1 }, '-=0.2')
    tl.to(pulse, {
      scale: 8,
      opacity: 0,
      duration: 1.1,
      ease: 'power2.out',
    })

    // Phase 5 — Reveal logo + trigger typewriter exactly on reveal
    tl.to(logoBox, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
      onStart: () => setTypingLogoActive(true),
    }, '-=0.7')

    tl.to(tagline, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
      onStart: () => setTypingTaglineActive(true),
    }, '+=0.7')

    // Phase 6 — Breathe
    tl.to(wrapper, { scale: 1.03, duration: 0.6, ease: 'power2.inOut' }, '+=0.5')
    tl.to(wrapper, { scale: 1, duration: 0.5, ease: 'power2.inOut' })

    // Phase 7 — Hold
    tl.to({}, { duration: 1.0 })

    // Phase 8 — Shrink and dock to navbar
    tl.to(wrapper, {
      scale: 0.055,
      x: () => -window.innerWidth * 0.43,
      y: () => -window.innerHeight * 0.45,
      duration: 1.1,
      ease: 'power4.inOut',
    })

    // Phase 9 — Fade overlay
    tl.to(overlay, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
    }, '-=0.4')

    return () => { tl.kill() }
  }, [onComplete])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at center, #0a0f1e 0%, #020617 70%)' }}
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      <div ref={wrapperRef} className="flex flex-col items-center gap-10">
        {/* ── SVG Chart ──────────────────────────────────────── */}
        <svg
          viewBox="0 0 500 280"
          className="overflow-visible"
          style={{ width: 'min(500px, 90vw)', height: 'auto' }}
        >
          <defs>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="dotGlow" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="lineGlow" x="-30%" y="-100%" width="160%" height="300%">
              <feGaussianBlur stdDeviation="2 4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="	#6ee7b7" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="scanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {[65, 115, 165, 215].map((y) => (
            <line key={y} x1="20" y1={y} x2="480" y2={y}
              stroke="rgba(255,255,255,0.035)" strokeWidth="1" strokeDasharray="3 6"
            />
          ))}

          {/* Area fill */}
          <path
            d="M 30 250 L 80 228 L 118 244 L 162 203 L 202 218 L 248 173 L 288 186 L 328 146 L 368 157 L 412 107 L 442 80 L 460 50 L 460 262 L 30 262 Z"
            fill="url(#areaGrad)"
          />

          {/* Main line */}
          <path
            ref={pathRef}
            d="M 30 250 L 80 228 L 118 244 L 162 203 L 202 218 L 248 173 L 288 186 L 328 146 L 368 157 L 412 107 L 442 80 L 460 50"
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#lineGlow)"
          />

          {/* Scan line */}
          <line
            ref={scanLineRef}
            x1="30" y1="20" x2="30" y2="265"
            stroke="url(#scanGrad)"
            strokeWidth="1.5"
          />

          {/* Arrow */}
          <g ref={arrowRef} filter="url(#softGlow)">
            <line x1="460" y1="50" x2="444" y2="64" stroke="	#6ee7b7" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="460" y1="50" x2="460" y2="68" stroke="	#6ee7b7" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Pulse */}
          <circle ref={pulseRingRef} cx="460" cy="50" r="5"
            fill="none" stroke="#10b981" strokeWidth="1.5"
          />

          {/* Dot glow */}
          <circle ref={dotGlowRef} cx="30" cy="250" r="16"
            fill="#10b981" opacity="0.2" filter="url(#dotGlow)"
          />

          {/* Dot */}
          <circle ref={dotRef} cx="30" cy="250" r="5"
            fill="	#6ee7b7" filter="url(#softGlow)"
          />
        </svg>

        {/* ── Logo ───────────────────────────────────────────── */}
        <div ref={logoBoxRef} className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #34d399, #059669)',
                boxShadow: '0 0 40px rgba(16,185,129,0.5), 0 0 80px rgba(16,185,129,0.2)',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className="w-8 h-8"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <LogoTypewriter active={typingLogoActive} />
          </div>
        </div>

        {/* ── Tagline ─────────────────────────────────────────── */}
        <p
          ref={taglineRef}
          className="text-xs tracking-[0.3em] uppercase"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          <TaglineTypewriter active={typingTaglineActive} />
        </p>
      </div>
    </div>
  )
}