'use client';

import { useCallback, useRef, useState } from 'react';

export default function ComparisonSlider() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50); // percent 0–100
  const dragging = useRef(false);

  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

  const updatePos = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct  = clamp(((clientX - rect.left) / rect.width) * 100, 2, 98);
    setPosition(pct);
  }, []);

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    updatePos(e.clientX);
  };
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    updatePos(e.clientX);
  }, [updatePos]);
  const onMouseUp = () => { dragging.current = false; };

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
    updatePos(e.touches[0].clientX);
  };
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging.current) return;
    updatePos(e.touches[0].clientX);
  }, [updatePos]);
  const onTouchEnd = () => { dragging.current = false; };

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        position: 'relative',
        width: '100%',
        height: '380px',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'ew-resize',
        userSelect: 'none',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
      }}
    >
      {/* ── RIGHT SIDE: With XERON (rich world) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #0a1628 0%, #0d2216 40%, #0a2010 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Sky glow */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,160,23,0.18) 0%, rgba(0,180,100,0.08) 50%, transparent 100%)',
        }} />
        {/* Ground */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '38%',
          background: 'linear-gradient(180deg, #0d3a1a 0%, #0a2a12 60%, #06180a 100%)',
        }} />
        {/* Grass texture strips */}
        {[0, 15, 30, 45, 60, 75, 90].map((x, i) => (
          <div key={i} style={{
            position: 'absolute', bottom: '38%', left: `${x}%`,
            width: '14%', height: '6px',
            background: 'rgba(0,200,80,0.25)',
            borderRadius: '0 0 4px 4px',
          }} />
        ))}
        {/* Trees */}
        {[8, 22, 72, 88].map((x, i) => (
          <div key={i} style={{ position: 'absolute', bottom: '37%', left: `${x}%` }}>
            {/* Trunk */}
            <div style={{
              width: '8px', height: `${30 + i * 8}px`, margin: '0 auto',
              background: '#4a2c0a', borderRadius: '2px',
            }} />
            {/* Foliage layers */}
            <div style={{
              width: 0, height: 0, margin: '-4px auto 0',
              borderLeft: '24px solid transparent',
              borderRight: '24px solid transparent',
              borderBottom: `40px solid #0d6b2a`,
              position: 'relative', top: `-${30 + i * 8}px`,
            }} />
            <div style={{
              width: 0, height: 0, margin: '0 auto',
              borderLeft: '18px solid transparent',
              borderRight: '18px solid transparent',
              borderBottom: '32px solid #15913a',
              position: 'relative', top: `-${30 + i * 8 + 20}px`,
            }} />
          </div>
        ))}
        {/* Buildings silhouette */}
        <div style={{
          position: 'absolute', bottom: '36%', left: '35%',
          width: '24px', height: '60px',
          background: 'linear-gradient(180deg, #1a3a5c, #0d2a44)',
          borderRadius: '4px 4px 0 0',
          boxShadow: '0 0 12px rgba(212,160,23,0.3)',
        }}>
          {/* Windows */}
          {[0,1,2,3].map(r => [0,1].map(c => (
            <div key={`${r}-${c}`} style={{
              position: 'absolute', width: '4px', height: '4px',
              background: 'rgba(212,160,23,0.8)',
              borderRadius: '1px',
              top: `${8 + r * 12}px`, left: `${4 + c * 10}px`,
              boxShadow: '0 0 4px rgba(212,160,23,0.6)',
            }} />
          )))}
        </div>
        <div style={{
          position: 'absolute', bottom: '36%', left: '50%',
          width: '18px', height: '80px',
          background: 'linear-gradient(180deg, #2a1a5c, #1a0d44)',
          borderRadius: '4px 4px 0 0',
          boxShadow: '0 0 16px rgba(100,60,255,0.3)',
        }} />
        {/* Gold accent river */}
        <div style={{
          position: 'absolute', bottom: '39%', left: '25%',
          width: '30%', height: '4px',
          background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.6), rgba(0,180,255,0.4), transparent)',
          borderRadius: '2px',
          boxShadow: '0 0 8px rgba(212,160,23,0.4)',
        }} />
        {/* Stars */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: i % 3 === 0 ? '2px' : '1px',
            height: i % 3 === 0 ? '2px' : '1px',
            background: 'white',
            borderRadius: '50%',
            top: `${Math.random() * 45}%`,
            left: `${5 + Math.random() * 90}%`,
            opacity: 0.4 + Math.random() * 0.6,
          }} />
        ))}
        {/* Label */}
        <div style={{
          position: 'absolute', top: '14px', right: '14px',
          padding: '4px 12px',
          background: 'linear-gradient(135deg, var(--gold-600), var(--gold-400))',
          borderRadius: '999px',
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: '#0a0a0a',
          boxShadow: '0 2px 12px rgba(212,160,23,0.5)',
        }}>
          With XERON
        </div>
      </div>

      {/* ── LEFT SIDE: Without XERON (grey baseplate) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: `inset(0 ${100 - position}% 0 0)`,
          transition: 'clip-path 0ms',
          overflow: 'hidden',
        }}
      >
        {/* Sky */}
        <div style={{ position: 'absolute', inset: 0, background: '#8a9aaa' }} />
        {/* Roblox grey grid floor */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          background: '#7a8a96',
          backgroundImage: `
            linear-gradient(rgba(100,110,120,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,110,120,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />
        {/* Horizon line */}
        <div style={{
          position: 'absolute', bottom: '50%', left: 0, right: 0, height: '2px',
          background: '#6a7a86',
        }} />
        {/* Empty sky gradient */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: '50%',
          background: 'linear-gradient(180deg, #9aaab8 0%, #8a9aaa 100%)',
        }} />
        {/* Label */}
        <div style={{
          position: 'absolute', top: '14px', left: '14px',
          padding: '4px 12px',
          background: 'rgba(80,90,100,0.85)',
          border: '1px solid rgba(120,130,140,0.5)',
          borderRadius: '999px',
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: '#c8d4dc',
        }}>
          Without XERON
        </div>
      </div>

      {/* ── DIVIDER HANDLE ── */}
      <div
        style={{
          position: 'absolute',
          top: 0, bottom: 0,
          left: `${position}%`,
          transform: 'translateX(-50%)',
          width: '3px',
          background: 'linear-gradient(180deg, transparent, var(--gold-400), var(--gold-500), var(--gold-400), transparent)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        {/* Handle knob */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '36px', height: '36px',
          background: 'linear-gradient(135deg, var(--gold-600), var(--gold-400))',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 0 3px rgba(0,0,0,0.5), 0 4px 16px rgba(212,160,23,0.6)',
          pointerEvents: 'all',
          cursor: 'ew-resize',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4 7H1M13 7h-3M7 1v3M7 10v3" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M2 5l-2 2 2 2M12 5l2 2-2 2" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
