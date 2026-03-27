'use client'

import { useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MinimapData {
  width: number
  height: number
  biome: string
  features: string[]
}

interface GameMinimapProps {
  data?: MinimapData
}

// ─── Pseudo-random helper ─────────────────────────────────────────────────────

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

// ─── Biome base colors ────────────────────────────────────────────────────────

const BIOME_BG: Record<string, string> = {
  forest:   '#0f1f0f',
  desert:   '#1f1a0a',
  snow:     '#10141f',
  city:     '#0d0d14',
  ocean:    '#07121f',
  swamp:    '#0a170f',
  volcanic: '#1a0a07',
}

const BIOME_GROUND: Record<string, string> = {
  forest:   '#1a3320',
  desert:   '#3d2e10',
  snow:     '#1c2535',
  city:     '#1a1a24',
  ocean:    '#0a2030',
  swamp:    '#162b1a',
  volcanic: '#2a1008',
}

// ─── Cell palette by type ─────────────────────────────────────────────────────

const CELL_COLORS: Record<string, string[]> = {
  vegetation: ['#1e5c28', '#2e7a38', '#3da046', '#27693a', '#185220'],
  water:      ['#1040a0', '#1855b8', '#1060c8', '#0d45a0', '#1650a8'],
  building:   ['#484858', '#3c3c4e', '#545468', '#424250', '#3a3a48'],
  path:       ['#b85a00', '#d06800', '#c46010', '#a84e00', '#c86800'],
  empty:      [],
}

// ─── Feature → cell-type mapping ─────────────────────────────────────────────

function featuresToWeights(biome: string, features: string[]): Record<string, number> {
  const base: Record<string, number> = {
    vegetation: 0,
    water:      0,
    building:   0,
    path:       0,
    empty:      70,
  }

  // Biome defaults
  switch (biome.toLowerCase()) {
    case 'forest':   base.vegetation = 55; base.water = 12; base.empty = 33; break
    case 'desert':   base.path = 10; base.empty = 90; break
    case 'city':     base.building = 45; base.path = 20; base.empty = 35; break
    case 'ocean':    base.water = 65; base.vegetation = 8; base.empty = 27; break
    case 'swamp':    base.water = 30; base.vegetation = 40; base.empty = 30; break
    case 'volcanic': base.path = 8; base.empty = 92; break
    case 'snow':     base.water = 8; base.empty = 92; break
    default:         base.vegetation = 20; base.water = 10; base.empty = 70; break
  }

  // Feature adjustments
  features.forEach(f => {
    const fl = f.toLowerCase()
    if (fl.includes('water') || fl.includes('lake') || fl.includes('river')) base.water += 12
    if (fl.includes('tree') || fl.includes('forest') || fl.includes('jungle')) base.vegetation += 12
    if (fl.includes('build') || fl.includes('town') || fl.includes('city')) base.building += 14
    if (fl.includes('road') || fl.includes('path') || fl.includes('trail')) base.path += 10
  })

  return base
}

function pickFromWeights(rand: () => number, weights: Record<string, number>): string {
  const total = Object.values(weights).reduce((a, b) => a + b, 0)
  let r = rand() * total
  for (const [key, w] of Object.entries(weights)) {
    r -= w
    if (r <= 0) return key
  }
  return 'empty'
}

// ─── Grid generator ───────────────────────────────────────────────────────────

const COLS = 30
const ROWS = 22

interface Cell {
  type: string
  color: string
  isSpawn: boolean
}

function generateGrid(data: MinimapData): Cell[][] {
  const rand    = seededRandom(data.biome.charCodeAt(0) * 1337 + data.features.length * 42)
  const weights = featuresToWeights(data.biome, data.features)

  const grid: Cell[][] = []

  for (let r = 0; r < ROWS; r++) {
    const row: Cell[] = []
    for (let c = 0; c < COLS; c++) {
      const type  = pickFromWeights(rand, weights)
      const cols  = CELL_COLORS[type] ?? CELL_COLORS.empty
      const color = cols.length > 0
        ? cols[Math.floor(rand() * cols.length)]
        : (BIOME_GROUND[data.biome.toLowerCase()] ?? '#1a1a24')

      // Spawn points: red dot on ~2% of empty/path cells
      const isSpawn = (type === 'empty' || type === 'path') && rand() < 0.02

      row.push({ type, color, isSpawn })
    }
    grid.push(row)
  }

  return grid
}

// ─── Legend items ─────────────────────────────────────────────────────────────

const LEGEND = [
  { color: '#2e7a38', label: 'Vegetation' },
  { color: '#1855b8', label: 'Water' },
  { color: '#484858', label: 'Buildings' },
  { color: '#d06800', label: 'Paths' },
  { color: '#EF4444', label: 'Spawns' },
]

// ─── GameMinimap ──────────────────────────────────────────────────────────────

const DEFAULT_DATA: MinimapData = {
  width:    512,
  height:   512,
  biome:    'forest',
  features: ['trees', 'lake', 'village'],
}

export default function GameMinimap({ data = DEFAULT_DATA }: GameMinimapProps) {
  const grid = useMemo(() => generateGrid(data), [data])

  const cellW = 100 / COLS
  const cellH = 100 / ROWS
  const bg    = BIOME_BG[data.biome.toLowerCase()] ?? '#0d0d14'

  // Build SVG rects
  const rects: React.ReactNode[] = []

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = grid[r][c]
      const x = c * cellW
      const y = r * cellH

      if (cell.type !== 'empty') {
        rects.push(
          <rect
            key={`${r}-${c}`}
            x={`${x}%`}
            y={`${y}%`}
            width={`${cellW + 0.05}%`}
            height={`${cellH + 0.05}%`}
            fill={cell.color}
            opacity={0.92}
          />,
        )
      }

      if (cell.isSpawn) {
        rects.push(
          <circle
            key={`spawn-${r}-${c}`}
            cx={`${x + cellW / 2}%`}
            cy={`${y + cellH / 2}%`}
            r="0.8%"
            fill="#EF4444"
            opacity={0.95}
          />,
        )
      }
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        width: '100%',
      }}
    >
      {/* Map header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span className="t-label" style={{ fontSize: 11 }}>
          Minimap Preview
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span
            className="lg-badge"
            style={{ fontSize: 10, padding: '2px 8px', textTransform: 'capitalize' }}
          >
            {data.biome}
          </span>
          <span style={{ fontSize: 11, color: 'var(--t-3)' }}>
            {data.width} × {data.height}
          </span>
        </div>
      </div>

      {/* SVG map */}
      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          position: 'relative',
          aspectRatio: `${COLS} / ${ROWS}`,
          background: bg,
        }}
      >
        <svg
          viewBox={`0 0 ${COLS} ${ROWS}`}
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          aria-label={`${data.biome} game minimap`}
        >
          {/* Background */}
          <rect width={COLS} height={ROWS} fill={bg} />
          {/* Cells */}
          {grid.map((row, r) =>
            row.map((cell, c) => {
              if (cell.type === 'empty') return null
              return (
                <rect
                  key={`${r}-${c}`}
                  x={c}
                  y={r}
                  width={1.05}
                  height={1.05}
                  fill={cell.color}
                  opacity={0.92}
                />
              )
            }),
          )}
          {/* Spawn dots */}
          {grid.map((row, r) =>
            row.map((cell, c) => {
              if (!cell.isSpawn) return null
              return (
                <circle
                  key={`s-${r}-${c}`}
                  cx={c + 0.5}
                  cy={r + 0.5}
                  r={0.35}
                  fill="#EF4444"
                  opacity={0.95}
                />
              )
            }),
          )}
          {/* Scanline overlay for retro feel */}
          <rect
            width={COLS}
            height={ROWS}
            fill="url(#scanlines)"
            opacity={0.04}
            pointerEvents="none"
          />
          <defs>
            <pattern id="scanlines" x="0" y="0" width="1" height="2" patternUnits="userSpaceOnUse">
              <line x1="0" y1="1" x2={COLS} y2="1" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
        </svg>

        {/* Compass indicator */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            color: 'var(--gold-400)',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
          }}
        >
          N
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px 14px',
          paddingTop: 4,
        }}
      >
        {LEGEND.map(({ color, label }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 11,
              color: 'var(--t-3)',
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: label === 'Spawns' ? '50%' : 3,
                background: color,
                flexShrink: 0,
              }}
            />
            {label}
          </div>
        ))}

        {/* Feature tags */}
        {data.features.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 5,
              alignItems: 'center',
              marginLeft: 'auto',
              flexWrap: 'wrap',
            }}
          >
            {data.features.slice(0, 4).map(f => (
              <span
                key={f}
                style={{
                  fontSize: 10,
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: 'var(--glass-1)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--t-3)',
                  textTransform: 'capitalize',
                }}
              >
                {f}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
