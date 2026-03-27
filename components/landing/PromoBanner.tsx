'use client';

import { useEffect, useState } from 'react';

const DURATION_HOURS = 72;
const SESSION_KEY_END  = 'xeron_promo_end';
const SESSION_KEY_HIDE = 'xeron_promo_hidden';

function getEndTime(): number {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY_END);
    if (stored) return parseInt(stored);
    const end = Date.now() + DURATION_HOURS * 60 * 60 * 1000;
    sessionStorage.setItem(SESSION_KEY_END, String(end));
    return end;
  } catch {
    return Date.now() + DURATION_HOURS * 60 * 60 * 1000;
  }
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

export default function PromoBanner() {
  const [visible,   setVisible]   = useState(false);
  const [countdown, setCountdown] = useState('--:--:--');

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY_HIDE) === '1') return;
    } catch { /* ignore */ }
    setVisible(true);

    const endTime = getEndTime();

    const tick = () => {
      const remaining = endTime - Date.now();
      setCountdown(formatCountdown(remaining));
      if (remaining <= 0) clearInterval(id);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleClose = () => {
    setVisible(false);
    try { sessionStorage.setItem(SESSION_KEY_HIDE, '1'); } catch { /* ignore */ }
  };

  if (!visible) return null;

  return (
    <>
      <div
        className="promo-banner"
        style={{
          position: 'relative',
          width: '100%',
          background: 'linear-gradient(90deg, var(--gold-600) 0%, var(--gold-400) 35%, #f5d87a 50%, var(--gold-400) 65%, var(--gold-600) 100%)',
          backgroundSize: '200% auto',
          animation: 'promoBannerShimmer 4s linear infinite',
          padding: '10px 48px 10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          zIndex: 100,
        }}
        role="banner"
        aria-label="Promotional offer"
      >
        {/* Text */}
        <p style={{
          margin: 0,
          color: '#0a0a0a',
          fontSize: '0.875rem',
          fontWeight: 700,
          letterSpacing: '0.03em',
          textAlign: 'center',
          lineHeight: 1.4,
        }}>
          ✦&nbsp; LIMITED OFFER: 3 Months Pro for the price of 1 — Ends in{' '}
          <span style={{
            fontFamily: "'Outfit', monospace",
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 800,
          }}>
            {countdown}
          </span>
          &nbsp; ✦
        </p>

        {/* CTA */}
        <a
          href="/shop"
          style={{
            flexShrink: 0,
            padding: '5px 14px',
            background: '#0a0a0a',
            color: 'var(--gold-400)',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,0,0,0.85)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = '#0a0a0a';
          }}
        >
          Claim Now
        </a>

        {/* Close */}
        <button
          onClick={handleClose}
          aria-label="Close promo banner"
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.15)',
            border: 'none',
            borderRadius: '50%',
            width: '26px',
            height: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#0a0a0a',
            fontSize: '14px',
            lineHeight: 1,
            transition: 'background 0.2s',
            padding: 0,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.3)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.15)';
          }}
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes promoBannerShimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </>
  );
}
