'use client';

import { ReactNode, useRef, useState } from 'react';

interface FeatureCard3DProps {
  icon:   ReactNode | string;
  title:  string;
  desc:   string;
  badge?: string;
}

const MAX_TILT = 12; // degrees

export default function FeatureCard3D({ icon, title, desc, badge }: FeatureCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt]       = useState({ rx: 0, ry: 0 });
  const [glare, setGlare]     = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el   = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2); // -1 to 1
    const dy   = (e.clientY - cy) / (rect.height / 2); // -1 to 1
    setTilt({ rx: -dy * MAX_TILT, ry: dx * MAX_TILT });
    // Glare position (percentage)
    const gx = ((e.clientX - rect.left) / rect.width)  * 100;
    const gy = ((e.clientY - rect.top)  / rect.height) * 100;
    setGlare({ x: gx, y: gy, opacity: 0.15 });
  };

  const onMouseEnter = () => setIsHovered(true);

  const onMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setGlare(g => ({ ...g, opacity: 0 }));
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="lg-card-holo"
      style={{
        position: 'relative',
        padding: '28px 24px',
        overflow: 'hidden',
        transform: `perspective(700px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) ${isHovered ? 'scale(1.03)' : 'scale(1)'}`,
        transition: isHovered
          ? 'transform 0.08s linear'
          : 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)',
        willChange: 'transform',
        cursor: 'default',
      }}
    >
      {/* Glare layer */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.25), transparent 60%)`,
          opacity: glare.opacity,
          transition: isHovered ? 'opacity 0.1s' : 'opacity 0.4s',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Badge */}
      {badge && (
        <div
          className="lg-badge"
          style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 2 }}
        >
          {badge}
        </div>
      )}

      {/* Icon */}
      <div
        style={{
          width: '52px', height: '52px',
          background: 'linear-gradient(135deg, var(--gold-600) 0%, var(--gold-400) 100%)',
          borderRadius: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '18px',
          boxShadow: '0 4px 16px rgba(212,160,23,0.45)',
          color: '#0a0a0a',
          position: 'relative', zIndex: 2,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Text */}
      <h3
        className="t-headline"
        style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          marginBottom: '8px',
          color: 'var(--t-1)',
          position: 'relative', zIndex: 2,
        }}
      >
        {title}
      </h3>
      <p
        className="t-body"
        style={{
          fontSize: '0.875rem',
          color: 'var(--t-2)',
          lineHeight: 1.65,
          position: 'relative', zIndex: 2,
        }}
      >
        {desc}
      </p>
    </div>
  );
}
