'use client'
import { useEffect, useRef, useState } from 'react'

export function LuxuryCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    let ringX = 0, ringY = 0
    let dotX = 0, dotY = 0
    let targetX = 0, targetY = 0
    let hovering = false
    let clicking = false
    let animId: number

    setVisible(true)

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const onEnter = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (el.closest('a,button,[role="button"],input,textarea,select,label')) {
        hovering = true
      }
    }

    const onLeave = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (!el.closest('a,button,[role="button"],input,textarea,select,label')) {
        hovering = false
      }
    }

    const onDown = () => { clicking = true }
    const onUp = () => { clicking = false }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onEnter, { passive: true })
    window.addEventListener('mouseout', onLeave, { passive: true })
    window.addEventListener('mousedown', onDown, { passive: true })
    window.addEventListener('mouseup', onUp, { passive: true })

    const RING_LAG = 0.14
    const DOT_LAG = 0.95

    const tick = () => {
      animId = requestAnimationFrame(tick)

      // Dot follows exactly (with tiny smoothing)
      dotX += (targetX - dotX) * DOT_LAG
      dotY += (targetY - dotY) * DOT_LAG

      // Ring follows with lag
      ringX += (targetX - ringX) * RING_LAG
      ringY += (targetY - ringY) * RING_LAG

      const ring = ringRef.current
      const dot = dotRef.current
      if (!ring || !dot) return

      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) ${clicking ? 'scale(0.75)' : hovering ? 'scale(1.6)' : 'scale(1)'}`
      ring.style.opacity = hovering ? '0.7' : clicking ? '0.9' : '0.5'
      ring.style.borderColor = hovering ? 'var(--gold-bright)' : 'var(--gold-main)'
      ring.style.background = hovering ? 'rgba(212,146,15,0.06)' : 'transparent'

      dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%) ${clicking ? 'scale(1.8)' : 'scale(1)'}`
    }

    animId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onEnter)
      window.removeEventListener('mouseout', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  if (!visible) return null

  return (
    <>
      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 40, height: 40,
          borderRadius: '50%',
          border: '1px solid var(--gold-main)',
          pointerEvents: 'none',
          zIndex: 99997,
          willChange: 'transform',
          transition: 'width 0.3s, height 0.3s, border-color 0.3s, background 0.3s, opacity 0.3s, border-radius 0.3s',
          mixBlendMode: 'normal',
        }}
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 5, height: 5,
          borderRadius: '50%',
          background: 'var(--gold-bright)',
          pointerEvents: 'none',
          zIndex: 99998,
          willChange: 'transform',
          boxShadow: '0 0 8px rgba(232,168,32,0.8)',
          transition: 'transform 0.1s',
        }}
      />
      <style>{`
        @media (pointer: coarse) { .luxury-cursor { display: none !important; } }
        body { cursor: none; }
        a, button, [role="button"], input, textarea, select, label { cursor: none; }
      `}</style>
    </>
  )
}
