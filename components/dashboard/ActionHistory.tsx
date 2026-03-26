'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

interface Action {
  id: string
  action_type: string
  project_id: string | null
  lua_snapshot: string | null
  created_at: string
}

const ACTION_ICONS: Record<string, string> = {
  generate: '🎮',
  script: '📝',
  ui: '🖼️',
  fix: '🔧',
  clean: '🧹',
  diagnose: '🔍',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function ActionHistory({ userId, onUndo }: { userId: string; onUndo?: (snapshot: string) => void }) {
  const [actions, setActions] = useState<Action[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('action_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => { if (data) setActions(data) })
  }, [userId])

  if (actions.length === 0) return null

  return (
    <div className="glass-card" style={{ padding: 16, borderRadius: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>
        Recent Actions
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {actions.map((a) => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14 }}>{ACTION_ICONS[a.action_type] || '⚡'}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'capitalize' }}>
                {a.action_type} created
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{timeAgo(a.created_at)}</div>
            </div>
          </div>
        ))}
      </div>
      {actions[0]?.lua_snapshot && onUndo && (
        <button
          onClick={() => onUndo(actions[0].lua_snapshot!)}
          className="glass-button"
          style={{ width: '100%', marginTop: 12, padding: '8px', fontSize: 12 }}
        >
          ↩ Undo last action
        </button>
      )}
      <a href="/dashboard/projects" style={{ display: 'block', textAlign: 'center', marginTop: 8, fontSize: 12, color: '#a78bfa' }}>
        View all history →
      </a>
    </div>
  )
}
