'use client'

import { useState, useEffect } from 'react'

const vscDarkPlus: Record<string, React.CSSProperties> = {
  'code[class*="language-"]': { color: '#d4d4d4', background: 'none', fontFamily: "'Fira Code', Consolas, monospace", fontSize: '13px', lineHeight: '1.5' },
  'pre[class*="language-"]': { color: '#d4d4d4', background: '#1e1e2e', padding: '1em', borderRadius: '0.3em', overflow: 'auto' },
  keyword: { color: '#c792ea' },
  'class-name': { color: '#ffcb6b' },
  function: { color: '#82aaff' },
  string: { color: '#c3e88d' },
  number: { color: '#f78c6c' },
  comment: { color: '#676e95', fontStyle: 'italic' },
  operator: { color: '#89ddff' },
  punctuation: { color: '#89ddff' },
  boolean: { color: '#ff5874' },
}

interface ScriptEditorProps {
  code: string
  language?: string
  filename?: string
  onInsert?: () => void
  onRegenerate?: () => void
  description?: string
}

export default function ScriptEditor({
  code,
  language = 'lua',
  filename = 'script.lua',
  onInsert,
  onRegenerate,
  description,
}: ScriptEditorProps) {
  const [copied, setCopied] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [HighlighterComponent, setHighlighterComponent] = useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    import('react-syntax-highlighter').then((mod) => {
      setHighlighterComponent(() => mod.Prism || mod.default)
    }).catch(() => {})
  }, [])

  function copyCode() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadCode() {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 8 }}>{filename}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={copyCode} className="glass-button" style={{ padding: '6px 12px', fontSize: 12 }}>
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
          <button onClick={downloadCode} className="glass-button" style={{ padding: '6px 12px', fontSize: 12 }}>
            Download .lua
          </button>
        </div>
      </div>

      {/* Description preview */}
      {description && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(124,58,237,0.05)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>What this script does:</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{description}</p>
        </div>
      )}

      {/* Code */}
      <div style={{ maxHeight: 400, overflow: 'auto' }} className="scrollbar-thin">
        {HighlighterComponent ? (
          <HighlighterComponent
            language={language}
            style={vscDarkPlus}
            showLineNumbers
            customStyle={{
              margin: 0,
              background: 'transparent',
              padding: '16px',
              fontSize: '13px',
              fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            }}
          >
            {code}
          </HighlighterComponent>
        ) : (
          <pre style={{
            padding: 16,
            fontSize: 13,
            fontFamily: "'Fira Code', Consolas, monospace",
            color: '#d4d4d4',
            overflow: 'auto',
            margin: 0,
          }}>
            {code}
          </pre>
        )}
      </div>

      {/* Actions */}
      {(onInsert || onRegenerate) && (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          gap: 8,
        }}>
          {onInsert && (
            <button onClick={onInsert} className="glass-button-primary" style={{ padding: '8px 20px', fontSize: 13, flex: 1 }}>
              Insert into Studio
            </button>
          )}
          {onRegenerate && (
            <button onClick={onRegenerate} className="glass-button" style={{ padding: '8px 20px', fontSize: 13 }}>
              Regenerate
            </button>
          )}
        </div>
      )}
    </div>
  )
}
