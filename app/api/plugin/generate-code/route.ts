// POST /api/plugin/generate-code
// Generates a 6-char connection code for plugin auth
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

function randomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'XR-'
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { platform = 'roblox' } = await req.json().catch(() => ({}))
    const admin = createAdminClient()

    // Delete any existing unexpired codes for this user+platform
    await admin
      .from('plugin_connection_codes')
      .delete()
      .eq('user_id', user.id)
      .eq('platform', platform)

    // Generate unique code
    let code = randomCode()
    let attempts = 0
    while (attempts < 10) {
      const { data: existing } = await admin
        .from('plugin_connection_codes')
        .select('id')
        .eq('code', code)
        .maybeSingle()
      if (!existing) break
      code = randomCode()
      attempts++
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    const { data, error } = await admin
      .from('plugin_connection_codes')
      .insert({ user_id: user.id, code, platform, expires_at: expiresAt })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ code, expiresAt, platform })
  } catch (err) {
    console.error('[/api/plugin/generate-code]', err)
    return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 })
  }
}

// GET /api/plugin/generate-code?code=XR-XXXX — poll for connection status
export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code')
    if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 })

    const admin = createAdminClient()
    const { data } = await admin
      .from('plugin_connection_codes')
      .select('connected, platform, session_token, expires_at')
      .eq('code', code)
      .maybeSingle()

    if (!data) return NextResponse.json({ error: 'Code not found or expired' }, { status: 404 })
    if (new Date(data.expires_at) < new Date()) return NextResponse.json({ error: 'Code expired' }, { status: 410 })

    return NextResponse.json({ connected: data.connected, platform: data.platform, sessionToken: data.session_token })
  } catch (err) {
    console.error('[/api/plugin/generate-code GET]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
