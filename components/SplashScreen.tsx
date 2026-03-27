'use client'
import { useEffect, useState } from 'react'

export function SplashScreen() {
  const [gone, setGone] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const shown = sessionStorage.getItem('xeron_splash')
      if (shown) { setGone(true); return }
      sessionStorage.setItem('xeron_splash', '1')
    } catch { setGone(true); return }
    const t = setTimeout(() => setGone(true), 2400)
    return () => clearTimeout(t)
  }, [])

  if (!mounted || gone) return null

  return (
    <div className="splash">
      <div className="splash-ring" />
      <div className="splash-logo">XERON</div>
      <div className="splash-tagline">AI Roblox Game Engine</div>
    </div>
  )
}
