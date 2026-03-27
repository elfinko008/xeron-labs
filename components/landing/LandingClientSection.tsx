'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Sparkles, Play } from 'lucide-react'
import TypewriterText from './TypewriterText'

const XeronScene = dynamic(() => import('./XeronScene'), { ssr: false })

export function LandingClientSection() {
  return (
    <>
      {/* 3D Scene */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <XeronScene />
      </div>

      {/* Hero content */}
      <div className="container-luxury" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ animation: 'fadeUp 0.8s ease forwards' }}>
          <div className="lg-badge-pulse" style={{ marginBottom: 28, display: 'inline-flex' }}>
            <Sparkles size={12} /> The Most Advanced Roblox AI Platform
          </div>
        </div>

        <h1 className="t-display text-gold-gradient" style={{ fontSize: 'clamp(64px,10vw,108px)', marginBottom: 16, animation: 'fadeUp 0.8s 0.1s ease both' }}>
          XERON ENGINE
        </h1>

        <div style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontFamily: "'Outfit',sans-serif", fontWeight: 800, color: 'var(--t-1)', marginBottom: 24, minHeight: 48, animation: 'fadeUp 0.8s 0.2s ease both' }}>
          <TypewriterText />
        </div>

        <p className="t-body" style={{ fontSize: 18, maxWidth: 520, margin: '0 auto 40px', animation: 'fadeUp 0.8s 0.3s ease both' }}>
          Describe it. XERON builds it.<br />
          <strong style={{ color: 'var(--t-1)' }}>Professional games. Zero code needed.</strong>
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48, animation: 'fadeUp 0.8s 0.4s ease both' }}>
          <Link href="/register" className="btn-luxury btn-luxury-pulse" style={{ fontSize: 16, padding: '16px 40px' }}>
            <Sparkles size={18} /> Start Free
          </Link>
          <Link href="#demo" className="btn-glass" style={{ fontSize: 16, padding: '16px 32px' }}>
            <Play size={16} /> Watch Demo
          </Link>
        </div>

        {/* Social proof */}
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeUp 0.8s 0.5s ease both' }}>
          {[
            { icon: '✓', text: '10,000+ Games Generated' },
            { icon: '★', text: '4.9/5 from 500+ Creators' },
            { icon: '⚡', text: 'Avg. 2 Min Generation' },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--t-3)', fontSize: 14 }}>
              <span style={{ color: 'var(--gold-400)' }}>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Floating badges */}
        <div className="float-1" style={{ position: 'absolute', top: -20, left: '5%', pointerEvents: 'none' }}>
          <div className="lg-card-holo" style={{ padding: '12px 18px', borderRadius: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gold-400)' }}>3D Terrain</div>
          </div>
        </div>
        <div className="float-2" style={{ position: 'absolute', top: 20, right: '5%', pointerEvents: 'none' }}>
          <div className="lg-card" style={{ padding: '12px 18px', borderRadius: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t-1)' }}>Live Plugin</div>
          </div>
        </div>
        <div className="float-3" style={{ position: 'absolute', bottom: '15%', left: '3%', pointerEvents: 'none' }}>
          <div className="lg-card" style={{ padding: '12px 18px', borderRadius: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t-1)' }}>6 AI Modes</div>
          </div>
        </div>
        <div className="float-4" style={{ position: 'absolute', bottom: '10%', right: '3%', pointerEvents: 'none' }}>
          <div className="lg-card-holo" style={{ padding: '12px 18px', borderRadius: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gold-400)' }}>High-End Graphics</div>
          </div>
        </div>
      </div>
    </>
  )
}
