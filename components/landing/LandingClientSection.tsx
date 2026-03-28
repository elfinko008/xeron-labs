'use client'
import Link from 'next/link'
import { Sparkles, Play } from 'lucide-react'
import TypewriterText from './TypewriterText'

export function LandingClientSection() {
  return (
    <>
      {/* Hero content */}
      <div className="container-luxury" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ animation: 'fadeUp 0.8s ease forwards' }}>
          <div className="lg-badge-pulse" style={{ marginBottom: 28, display: 'inline-flex' }}>
            ◆ THE MOST ADVANCED ROBLOX AI PLATFORM
          </div>
        </div>

        <h1 className="t-display text-gold-gradient" style={{ fontSize: 'clamp(72px,10vw,120px)', marginBottom: 16, animation: 'fadeUp 0.8s 0.1s ease both', fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>
          XERON ENGINE
        </h1>

        <div style={{ fontSize: 'clamp(20px,3vw,32px)', fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, fontStyle: 'italic', color: 'var(--t-2)', marginBottom: 24, minHeight: 48, animation: 'fadeUp 0.8s 0.2s ease both' }}>
          <TypewriterText />
        </div>

        <p className="t-body" style={{ fontSize: 18, maxWidth: 520, margin: '0 auto 40px', animation: 'fadeUp 0.8s 0.3s ease both' }}>
          Describe it. XERON builds it.<br />
          <strong style={{ color: 'var(--t-1)', fontWeight: 500 }}>Professional games. Zero code needed.</strong>
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48, animation: 'fadeUp 0.8s 0.4s ease both' }}>
          <Link href="/register" className="btn-luxury btn-luxury-pulse" style={{ fontSize: 15, padding: '16px 40px' }}>
            <Sparkles size={16} /> Start Free
          </Link>
          <Link href="#demo" className="btn-glass" style={{ fontSize: 15, padding: '16px 32px' }}>
            <Play size={15} /> Watch Demo
          </Link>
        </div>

        {/* Social proof */}
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeUp 0.8s 0.5s ease both' }}>
          {[
            { text: '10,000+ Games Generated' },
            { text: '4.9/5 from 500+ Creators' },
            { text: 'Avg. 2 Min Generation' },
          ].map((item, i) => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--t-3)', fontSize: 12, fontFamily: "'Tenor Sans',sans-serif", letterSpacing: '0.06em' }}>
              {i > 0 && <span style={{ color: 'rgba(212,146,15,0.30)' }}>◆</span>}
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Floating cards */}
        <div className="float-1" style={{ position: 'absolute', top: -20, left: '5%', pointerEvents: 'none' }}>
          <div className="yacht-card" style={{ padding: '12px 18px', borderRadius: 20 }}>
            <div style={{ fontSize: 11, fontFamily: "'Tenor Sans',sans-serif", letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--gold-bright)' }}>3D Terrain</div>
          </div>
        </div>
        <div className="float-2" style={{ position: 'absolute', top: 20, right: '5%', pointerEvents: 'none' }}>
          <div className="yacht-card" style={{ padding: '12px 18px', borderRadius: 20 }}>
            <div style={{ fontSize: 11, fontFamily: "'Tenor Sans',sans-serif", letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--t-1)' }}>Live Plugin</div>
          </div>
        </div>
        <div className="float-3" style={{ position: 'absolute', bottom: '15%', left: '3%', pointerEvents: 'none' }}>
          <div className="yacht-card" style={{ padding: '12px 18px', borderRadius: 20 }}>
            <div style={{ fontSize: 11, fontFamily: "'Tenor Sans',sans-serif", letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--t-1)' }}>6 AI Modes</div>
          </div>
        </div>
        <div className="float-4" style={{ position: 'absolute', bottom: '10%', right: '3%', pointerEvents: 'none' }}>
          <div className="yacht-card" style={{ padding: '12px 18px', borderRadius: 20 }}>
            <div style={{ fontSize: 11, fontFamily: "'Tenor Sans',sans-serif", letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--gold-bright)' }}>High-End Graphics</div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative', width: 1, height: 40, background: 'rgba(212,146,15,0.15)', borderRadius: 1 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: '40%', background: 'var(--gold-bright)', borderRadius: 1, animation: 'scrollDot 2s ease-in-out infinite' }} />
          </div>
          <span style={{ fontFamily: "'Tenor Sans',sans-serif", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--t-3)' }}>SCROLL</span>
        </div>
      </div>

      <style>{`
        @keyframes scrollDot {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(24px); opacity: 0; }
        }
      `}</style>
    </>
  )
}
