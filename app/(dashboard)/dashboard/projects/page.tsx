import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import Link from 'next/link'

type Project = {
  id: string; name: string; mode: string; status: string; prompt: string;
  summary: string | null; quality: string | null; game_type: string | null; created_at: string;
}

export default async function ProjectsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: projects } = await admin
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: Project[] | null }

  const MODE_ICONS: Record<string, string> = {
    game: '🎮', script: '📝', ui: '🖼️', fix: '🔧', clean: '🧹', diagnose: '🔍',
  }
  const STATUS_COLORS: Record<string, string> = {
    done: '#4ade80', generating: '#a78bfa', error: '#f87171', pending: '#94a3b8',
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14 }}>← Dashboard</Link>
          <h1 className="font-display" style={{ fontSize: 20 }}>My Projects</h1>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{projects?.length || 0} projects</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {!projects || projects.length === 0 ? (
          <div className="glass-card" style={{ padding: 64, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>No projects yet. Generate your first game!</p>
            <Link href="/dashboard" className="glass-button-primary" style={{ padding: '10px 24px', fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>
              Generate a game
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {projects.map((p) => (
              <div key={p.id} className="glass-card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{MODE_ICONS[p.mode] || '⚡'}</span>
                    <h3 style={{ fontWeight: 600, fontSize: 15 }}>{p.name}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className="glass-badge" style={{ fontSize: 11, textTransform: 'capitalize' }}>{p.mode}</span>
                    <span style={{ background: `${STATUS_COLORS[p.status]}22`, border: `1px solid ${STATUS_COLORS[p.status]}55`, color: STATUS_COLORS[p.status], borderRadius: 999, fontSize: 11, padding: '2px 8px' }}>
                      {p.status}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: 12 }}>
                  {p.prompt}
                </p>
                {p.summary && (
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {p.summary}
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(p.created_at).toLocaleDateString()}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {p.quality === 'highend' && <span className="glass-badge" style={{ fontSize: 11 }}>✨ High-End</span>}
                    {p.game_type && p.game_type !== 'custom' && <span className="glass-badge" style={{ fontSize: 11, textTransform: 'capitalize' }}>{p.game_type}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
