import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

async function getSessionUser(req: NextRequest) {
  const token = req.headers.get('x-session-token')
  if (!token) return null

  const admin = createAdminClient()
  const { data: session } = await admin
    .from('plugin_sessions')
    .select('user_id, expires_at')
    .eq('session_token', token)
    .single()

  if (!session) return null
  if (new Date(session.expires_at) < new Date()) return null

  // last_ping aktualisieren
  await admin
    .from('plugin_sessions')
    .update({ last_ping: new Date().toISOString() })
    .eq('session_token', token)

  return session.user_id
}

export async function GET(req: NextRequest) {
  const userId = await getSessionUser(req)
  if (!userId) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })

  const admin = createAdminClient()

  const [{ data: projects }, { data: profile }] = await Promise.all([
    admin
      .from('projects')
      .select('id, name, status, game_type, quality, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20),
    admin
      .from('profiles')
      .select('credits, plan')
      .eq('id', userId)
      .single(),
  ])

  return NextResponse.json({
    projects: projects ?? [],
    credits: profile?.credits ?? 0,
    plan: profile?.plan ?? 'free',
  })
}
