// POST /api/plugin/connect
// Plugin calls this with a 6-char code to authenticate
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()
    if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 })

    const admin = createAdminClient()

    // Find the connection code
    const { data: codeRow } = await admin
      .from('plugin_connection_codes')
      .select('*, profiles(email, plan, credits, username)')
      .eq('code', code.toUpperCase())
      .eq('connected', false)
      .maybeSingle()

    if (!codeRow) return NextResponse.json({ error: 'Invalid or expired code' }, { status: 404 })
    if (new Date(codeRow.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Code expired — generate a new one' }, { status: 410 })
    }

    // Generate session token
    const sessionToken = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days

    // Save plugin session
    await admin.from('plugin_sessions').insert({
      user_id: codeRow.user_id,
      session_token: sessionToken,
      last_ping: new Date().toISOString(),
      expires_at: expiresAt,
    })

    // Mark code as connected
    await admin
      .from('plugin_connection_codes')
      .update({ connected: true, session_token: sessionToken })
      .eq('code', code.toUpperCase())

    const profile = codeRow.profiles as { email: string; plan: string; credits: number; username: string | null } | null

    return NextResponse.json({
      token: sessionToken,
      platform: codeRow.platform,
      user: {
        email: profile?.email ?? '',
        plan: profile?.plan ?? 'free',
        credits: profile?.credits ?? 0,
        username: profile?.username ?? null,
      },
    })
  } catch (err) {
    console.error('[/api/plugin/connect]', err)
    return NextResponse.json({ error: 'Connection failed' }, { status: 500 })
  }
}
