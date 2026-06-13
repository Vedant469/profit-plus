import { useState, useCallback } from 'react'

interface GlitchTextProps {
  text: string
  className?: string
}

const CHARS = '!<>-_\\/[]{}—=+*^?#@$%&ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)
  const iterationRef = { current: 0 }

  const startGlitch = useCallback(() => {
    if (isGlitching) return
    setIsGlitching(true)
    iterationRef.current = 0

    const maxIterations = text.length * 3
    let frame = 0

    const animate = () => {
      frame++
      iterationRef.current++

      setDisplayText(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (i < iterationRef.current / 3) return char
            return CHARS[Math.floor(Math.random() * CHARS.length)] ?? char
          })
          .join('')
      )

      if (frame < maxIterations) {
        requestAnimationFrame(animate)
      } else {
        setDisplayText(text)
        setIsGlitching(false)
      }
    }

    requestAnimationFrame(animate)
  }, [text, isGlitching])

  return (
    <span
      className={`inline-block font-mono cursor-none ${className}`}
      onMouseEnter={startGlitch}
      style={{
        textShadow: isGlitching
          ? `
            2px 0 rgba(0,255,136,0.5),
            -2px 0 rgba(0,100,255,0.5),
            0 0 20px rgba(0,255,136,0.3)
          `
          : 'none',
        transition: 'text-shadow 0.1s ease',
      }}
    >
      {displayText}
    </span>
  )
}