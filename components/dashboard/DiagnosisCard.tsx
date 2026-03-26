'use client'

import { useState } from 'react'

interface DiagnosisIssue {
  severity: 'critical' | 'warning' | 'info'
  description: string
  suggestedFix: string
}

interface DiagnosisResult {
  issues: DiagnosisIssue[]
  summary: string
}

interface DiagnosisCardProps {
  result: DiagnosisResult
  onFixAll?: () => void
  onFixSelected?: (issues: DiagnosisIssue[]) => void
}

const SEVERITY_CONFIG = {
  critical: { label: 'CRITICAL', bgColor: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.35)', color: '#f87171', icon: '🔴' },
  warning: { label: 'WARNING', bgColor: 'rgba(234,179,8,0.15)', borderColor: 'rgba(234,179,8,0.35)', color: '#facc15', icon: '🟡' },
  info: { label: 'INFO', bgColor: 'rgba(124,58,237,0.15)', borderColor: 'rgba(124,58,237,0.35)', color: '#a78bfa', icon: '🔵' },
}

export default function DiagnosisCard({ result, onFixAll, onFixSelected }: DiagnosisCardProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set())

  function toggleSelect(i: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const selectedIssues = result.issues.filter((_, i) => selected.has(i))
  const criticalCount = result.issues.filter((i) => i.severity === 'critical').length
  const warningCount = result.issues.filter((i) => i.severity === 'warning').length

  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h3 className="font-display" style={{ fontSize: 20, marginBottom: 8 }}>Diagnosis Result</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{result.summary}</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <span style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171', borderRadius: 999, fontSize: 12, padding: '3px 12px' }}>{criticalCount} Critical</span>
          <span style={{ background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.35)', color: '#facc15', borderRadius: 999, fontSize: 12, padding: '3px 12px' }}>{warningCount} Warning</span>
          <span className="glass-badge">{result.issues.length - criticalCount - warningCount} Info</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {result.issues.map((issue, i) => {
          const cfg = SEVERITY_CONFIG[issue.severity]
          return (
            <div
              key={i}
              onClick={() => toggleSelect(i)}
              style={{
                padding: 14, borderRadius: 14,
                border: `1px solid ${selected.has(i) ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.08)'}`,
                background: selected.has(i) ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <input type="checkbox" checked={selected.has(i)} onChange={() => toggleSelect(i)} onClick={(e) => e.stopPropagation()} style={{ accentColor: '#7c3aed' }} />
                <span style={{ background: cfg.bgColor, border: `1px solid ${cfg.borderColor}`, color: cfg.color, borderRadius: 999, fontSize: 11, padding: '2px 8px', fontWeight: 600 }}>
                  {cfg.icon} {cfg.label}
                </span>
              </div>
              <p style={{ fontSize: 13, margin: '0 0 6px 0' }}>{issue.description}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>💡 {issue.suggestedFix}</p>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {onFixAll && (
          <button onClick={onFixAll} className="glass-button-primary" style={{ padding: '10px 20px', fontSize: 13, flex: 1 }}>
            Fix All Issues →
          </button>
        )}
        {onFixSelected && selected.size > 0 && (
          <button onClick={() => onFixSelected(selectedIssues)} className="glass-button" style={{ padding: '10px 20px', fontSize: 13 }}>
            Fix Selected ({selected.size})
          </button>
        )}
      </div>
    </div>
  )
}
