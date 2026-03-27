'use client';

import { useRef, useState } from 'react';

const PRESETS = [
  'Dark Forest',
  'Neon City',
  'Medieval Castle',
  'Space Station',
  'Underwater',
  'Desert Ruins',
  'Horror',
  'Tropical',
  'Arctic',
  'Volcano',
] as const;

export default function StylePresetsShowcase() {
  const [active, setActive] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drag-to-scroll
  const isDragging  = useRef(false);
  const startX      = useRef(0);
  const scrollLeft  = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current  = true;
    startX.current      = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current  = scrollRef.current?.scrollLeft ?? 0;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grabbing';
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x    = e.pageX - (scrollRef.current.offsetLeft ?? 0);
    const walk = x - startX.current;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDrag = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };

  return (
    <div style={{ width: '100%' }}>
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '10px',
          overflowX: 'auto',
          overflowY: 'hidden',
          paddingBottom: '4px',
          paddingTop: '4px',
          paddingLeft: '2px',
          cursor: 'grab',
          // Hide scrollbar
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}
      >
        {PRESETS.map(preset => {
          const isActive = active === preset;
          return (
            <button
              key={preset}
              onClick={() => setActive(isActive ? null : preset)}
              style={{
                flexShrink: 0,
                padding: '7px 18px',
                borderRadius: '999px',
                border: `1px solid ${isActive ? 'var(--gold-400)' : 'rgba(212,160,23,0.35)'}`,
                background: isActive
                  ? 'linear-gradient(135deg, var(--gold-600), var(--gold-400))'
                  : 'rgba(212,160,23,0.05)',
                color: isActive ? '#0a0a0a' : 'var(--gold-400)',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.03em',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap',
                outline: 'none',
                boxShadow: isActive
                  ? '0 2px 14px rgba(212,160,23,0.45)'
                  : '0 0 0 rgba(0,0,0,0)',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  const btn = e.currentTarget;
                  btn.style.background = 'rgba(212,160,23,0.15)';
                  btn.style.borderColor = 'var(--gold-400)';
                  btn.style.boxShadow   = '0 0 12px rgba(212,160,23,0.25)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  const btn = e.currentTarget;
                  btn.style.background  = 'rgba(212,160,23,0.05)';
                  btn.style.borderColor = 'rgba(212,160,23,0.35)';
                  btn.style.boxShadow   = '0 0 0 rgba(0,0,0,0)';
                }
              }}
            >
              {preset}
            </button>
          );
        })}
      </div>

      {/* Hide webkit scrollbar */}
      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
