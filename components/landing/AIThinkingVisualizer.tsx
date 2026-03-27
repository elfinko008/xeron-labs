'use client';

import { useEffect, useRef, useState } from 'react';

// ── Layout constants ─────────────────────────────────────────────────────────
const W  = 700;
const H  = 500;
const CX = W / 2;
const CY = H / 2;
const BRANCH_RADIUS = 155; // distance from center to branch root
const LEAF_RADIUS   = 90;  // distance from branch root to leaf

// Branch angles (0=right, 90=down, measured in degrees)
const BRANCHES = [
  { angle: -60,  label: 'Terrain',   leaves: ['Biome',      'Size',       'Elevation'] },
  { angle:  30,  label: 'Lighting',  leaves: ['Time',       'Atmosphere', 'Shadows']   },
  { angle: 135,  label: 'Assets',    leaves: ['Toolbox',    'Placement',  'Models']    },
  { angle: 220,  label: 'Scripts',   leaves: ['Logic',      'Events',     'Modules']   },
] as const;

function deg(d: number) { return (d * Math.PI) / 180; }
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  return {
    x: cx + r * Math.cos(deg(angleDeg)),
    y: cy + r * Math.sin(deg(angleDeg)),
  };
}

// Leaf angles spread around branch angle
const LEAF_OFFSETS = [-38, 0, 38];

export default function AIThinkingVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', maxWidth: `${W}px`, margin: '0 auto' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
        aria-label="AI planning mind-map"
      >
        <defs>
          {/* Gold gradient for lines */}
          <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--gold-600)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="var(--gold-400)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--gold-500)" stopOpacity="0.3" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Center glow */}
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="var(--gold-400)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--gold-600)" stopOpacity="0" />
          </radialGradient>

          {/* Clip paths for each animated branch line */}
          {BRANCHES.map((b, bi) => {
            const bp = polar(CX, CY, BRANCH_RADIUS, b.angle);
            return (
              <marker key={bi} id={`dot-${bi}`} markerWidth="4" markerHeight="4" refX="2" refY="2">
                <circle cx="2" cy="2" r="1.5" fill="var(--gold-400)" />
              </marker>
            );
          })}
        </defs>

        {/* ── Center halo ── */}
        <circle cx={CX} cy={CY} r="70" fill="url(#centerGlow)" />

        {/* ── Branch lines & leaf lines ── */}
        {BRANCHES.map((branch, bi) => {
          const bp        = polar(CX, CY, BRANCH_RADIUS, branch.angle);
          const lineLen   = Math.hypot(bp.x - CX, bp.y - CY);
          const branchDelay = bi * 0.35;

          return (
            <g key={bi}>
              {/* Branch root line */}
              <line
                x1={CX} y1={CY}
                x2={bp.x} y2={bp.y}
                stroke="url(#goldLine)"
                strokeWidth="1.5"
                strokeDasharray={lineLen}
                strokeDashoffset={visible ? 0 : lineLen}
                style={{
                  transition: `stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1) ${branchDelay}s`,
                }}
                strokeLinecap="round"
              />

              {/* Leaf lines */}
              {branch.leaves.map((leaf, li) => {
                const leafAngle = branch.angle + LEAF_OFFSETS[li];
                const lp        = polar(bp.x, bp.y, LEAF_RADIUS, leafAngle);
                const leafLen   = Math.hypot(lp.x - bp.x, lp.y - bp.y);
                const leafDelay = branchDelay + 0.55 + li * 0.12;

                return (
                  <g key={li}>
                    <line
                      x1={bp.x} y1={bp.y}
                      x2={lp.x} y2={lp.y}
                      stroke="var(--gold-400)"
                      strokeWidth="1"
                      strokeDasharray={`4 4`}
                      strokeDashoffset={visible ? 0 : leafLen * 2}
                      opacity="0.55"
                      style={{
                        transition: `stroke-dashoffset 0.5s linear ${leafDelay}s`,
                      }}
                      strokeLinecap="round"
                    />
                    {/* Leaf node */}
                    <g
                      style={{
                        opacity: visible ? 1 : 0,
                        transition: `opacity 0.3s ease ${leafDelay + 0.2}s`,
                      }}
                    >
                      <circle
                        cx={lp.x} cy={lp.y} r="22"
                        fill="rgba(10,10,15,0.85)"
                        stroke="var(--gold-400)"
                        strokeWidth="0.75"
                        strokeOpacity="0.45"
                        filter="url(#goldGlow)"
                      />
                      <text
                        x={lp.x} y={lp.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="9"
                        fontWeight="600"
                        fill="var(--t-2)"
                        fontFamily="'Outfit', sans-serif"
                        letterSpacing="0.03em"
                      >
                        {leaf}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Branch node */}
              <g
                style={{
                  opacity: visible ? 1 : 0,
                  transition: `opacity 0.3s ease ${branchDelay + 0.4}s`,
                }}
              >
                <circle
                  cx={bp.x} cy={bp.y} r="30"
                  fill="rgba(10,10,15,0.90)"
                  stroke="var(--gold-500)"
                  strokeWidth="1"
                  filter="url(#goldGlow)"
                />
                <text
                  x={bp.x} y={bp.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="11"
                  fontWeight="700"
                  fill="var(--gold-400)"
                  fontFamily="'Outfit', sans-serif"
                  letterSpacing="0.04em"
                >
                  {branch.label}
                </text>
              </g>
            </g>
          );
        })}

        {/* ── Central node ── */}
        <circle
          cx={CX} cy={CY} r="46"
          fill="rgba(10,10,15,0.95)"
          stroke="var(--gold-400)"
          strokeWidth="1.5"
          filter="url(#goldGlow)"
        />
        {/* Outer ring */}
        <circle
          cx={CX} cy={CY} r="52"
          fill="none"
          stroke="var(--gold-400)"
          strokeWidth="0.5"
          strokeOpacity="0.3"
          strokeDasharray="4 4"
        />
        {/* Spinning dashed ring */}
        <circle
          cx={CX} cy={CY} r="58"
          fill="none"
          stroke="var(--gold-400)"
          strokeWidth="0.75"
          strokeOpacity="0.18"
          strokeDasharray="6 10"
          style={{ transformOrigin: `${CX}px ${CY}px`, animation: 'vizSpin 12s linear infinite' }}
        />
        <text
          x={CX} y={CY - 6}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--t-2)"
          fontFamily="'Outfit', sans-serif"
          letterSpacing="0.05em"
        >
          YOUR
        </text>
        <text
          x={CX} y={CY + 7}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--t-2)"
          fontFamily="'Outfit', sans-serif"
          letterSpacing="0.05em"
        >
          PROMPT
        </text>

        {/* Gold dot in center */}
        <circle cx={CX} cy={CY} r="5" fill="var(--gold-400)" filter="url(#goldGlow)" />
      </svg>

      <style>{`
        @keyframes vizSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
