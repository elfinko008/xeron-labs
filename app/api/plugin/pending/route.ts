// GET /api/plugin/pending?token=xxx — plugin polls for pending code insertions
// POST /api/plugin/confirm — plugin confirms insertion completed
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')
    if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 })

    const admin = createAdminClient()

    // Validate session
    const { data: session } = await admin
      .from('plugin_sessions')
      .select('user_id, expires_at')
      .eq('session_token', token)
      .maybeSingle()

    if (!session) return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    if (new Date(session.expires_at) < new Date()) return NextResponse.json({ error: 'Session expired' }, { status: 401 })

    // Update last ping
    await admin
      .from('plugin_sessions')
      .update({ last_ping: new Date().toISOString() })
      .eq('session_token', token)

    // Get pending insertions for this session
    const { data: insertions } = await admin
      .from('pending_insertions')
      .select('*')
      .eq('session_token', token)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())

    return NextResponse.json({ insertions: insertions ?? [] })
  } catch (err) {
    console.error('[/api/plugin/pending GET]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { insertionId, token } = await req.json()
    if (!insertionId || !token) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const admin = createAdminClient()

    // Validate session
    const { data: session } = await admin
      .from('plugin_sessions')
      .select('user_id')
      .eq('session_token', token)
      .maybeSingle()
    if (!session) return NextResponse.json({ error: 'Invalid session' }, { status: 401 })

    await admin
      .from('pending_insertions')
      .update({ status: 'inserted' })
      .eq('id', insertionId)

    return NextResponse.json({ confirmed: true })
  } catch (err) {
    console.error('[/api/plugin/pending POST]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
