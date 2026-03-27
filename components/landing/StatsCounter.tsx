'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface StatsCounterProps {
  value: string;    // e.g. "12500" or "99.7"
  label: string;
  prefix?: string;  // e.g. "+"
  suffix?: string;  // e.g. "%" or "k"
}

function parseNumeric(val: string): number {
  return parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
}

export default function StatsCounter({ value, label, prefix = '', suffix = '' }: StatsCounterProps) {
  const ref         = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const motionVal   = useMotionValue(0);
  const target      = parseNumeric(value);
  const isFloat     = value.includes('.');
  const decimals    = isFloat ? (value.split('.')[1]?.length ?? 1) : 0;

  const display = useTransform(motionVal, (v: number) =>
    isFloat ? v.toFixed(decimals) : Math.round(v).toLocaleString()
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          animate(motionVal, target, {
            duration: 1.8,
            ease: [0.16, 1, 0.3, 1],
          });
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [motionVal, target, triggered]);

  return (
    <div
      ref={ref}
      className="lg-card-holo"
      style={{
        padding: '32px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <div
        className="text-gold-gradient"
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        {prefix}
        <motion.span>{display}</motion.span>
        {suffix}
      </div>
      <p
        className="t-label"
        style={{
          color: 'var(--t-2)',
          marginTop: '4px',
          fontSize: '0.85rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </p>
    </div>
  );
}
