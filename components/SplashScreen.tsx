'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export function SplashScreen() {
  const [gone, setGone] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [logoErr, setLogoErr] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const shown = sessionStorage.getItem('xeron_splash')
      if (shown) { setGone(true); return }
      sessionStorage.setItem('xeron_splash', '1')
    } catch { setGone(true); return }
    const t = setTimeout(() => setGone(true), 2600)
    return () => clearTimeout(t)
  }, [])

  if (!mounted || gone) return null

  return (
    <div className="splash" style={{ gap: 16 }}>
      <div className="splash-ring" />
      {!logoErr ? (
        <Image
          src="/logo.png"
          alt="XERON"
          width={80}
          height={80}
          onError={() => setLogoErr(true)}
          style={{ animation: 'fadeUp 0.8s 0.1s ease both', objectFit: 'contain' }}
          priority
        />
      ) : (
        <div className="splash-logo">XERON</div>
      )}
      <div className="splash-tagline">AI Roblox Game Engine</div>
    </div>
  )
}
