import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'E-Mail und Passwort erforderlich' }, { status: 400 })
    }

    // Auth via Supabase
    const { createBrowserClient } = await import('@supabase/ssr')
    const authClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
      email, password,
    })

    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Ungültige Anmeldedaten' }, { status: 401 })
    }

    const userId = authData.user.id
    const token = randomBytes(32).toString('hex')

    const admin = createAdminClient()

    // Alte abgelaufene Sessions löschen
    await admin
      .from('plugin_sessions')
      .delete()
      .eq('user_id', userId)
      .lt('expires_at', new Date().toISOString())

    // Neue Session anlegen
    await admin.from('plugin_sessions').insert({
      user_id: userId,
      session_token: token,
      last_ping: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })

    return NextResponse.json({ session_token: token })
  } catch {
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
