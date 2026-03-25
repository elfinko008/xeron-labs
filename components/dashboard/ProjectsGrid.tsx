'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Project } from '@/lib/supabase'

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  done:       { label: 'Generiert',  class: 'glass-badge-green' },
  generating: { label: 'In Arbeit',  class: 'glass-badge' },
  pending:    { label: 'Wartend',    class: 'glass-badge' },
  error:      { label: 'Fehler',     class: 'glass-badge-red' },
}

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const [list, setList] = useState(projects)

  async function handleDelete(id: string) {
    if (!confirm('Projekt wirklich löschen?')) return
    setDeleting(id)
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    setList((p) => p.filter((x) => x.id !== id))
    setDeleting(null)
  }

  function downloadLua(project: Project) {
    if (!project.lua_output) return
    const blob = new Blob([project.lua_output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name.replace(/\s+/g, '-')}.lua`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (list.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="text-4xl mb-4">🎮</div>
        <h3 className="font-display text-xl mb-2">Noch keine Projekte</h3>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Generiere dein erstes Roblox-Spiel!
        </p>
        <Link href="/dashboard" className="glass-button-primary px-6 py-3 rounded-xl text-sm font-semibold inline-block">
          Spiel generieren
        </Link>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {list.map((project) => {
        const s = STATUS_LABELS[project.status] ?? STATUS_LABELS.pending
        return (
          <div key={project.id} className="glass-card p-5 flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-medium text-sm leading-snug line-clamp-2">{project.name}</h3>
              <span className={`${s.class} flex-shrink-0`}>{s.label}</span>
            </div>

            <p className="text-xs mb-4 line-clamp-3 flex-1" style={{ color: 'var(--text-muted)' }}>
              {project.prompt}
            </p>

            <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              <span className="capitalize">{project.game_type}</span>
              <span>·</span>
              <span className="capitalize">{project.quality}</span>
              <span>·</span>
              <span>{new Date(project.created_at).toLocaleDateString('de-DE')}</span>
            </div>

            <div className="flex gap-2 flex-wrap">
              {project.status === 'done' && (
                <button
                  onClick={() => downloadLua(project)}
                  className="glass-button px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Lua
                </button>
              )}
              <button
                onClick={() => handleDelete(project.id)}
                disabled={deleting === project.id}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{ background: 'rgba(233,69,96,0.08)', border: '1px solid rgba(233,69,96,0.2)', color: '#e94560' }}
              >
                {deleting === project.id ? '...' : 'Löschen'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
