import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cookie_essential, cookie_analytics, cookie_marketing } = body

    if (
      typeof cookie_essential !== 'boolean' ||
      typeof cookie_analytics !== 'boolean' ||
      typeof cookie_marketing !== 'boolean'
    ) {
      return NextResponse.json({ error: 'Invalid consent fields' }, { status: 400 })
    }

    // Optional auth — guests are also accepted
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown'
    const userAgent = req.headers.get('user-agent') ?? null

    const admin = createAdminClient()

    const consents = [
      { type: 'cookie_essential', granted: cookie_essential },
      { type: 'cookie_analytics', granted: cookie_analytics },
      { type: 'cookie_marketing', granted: cookie_marketing },
    ]

    const records = consents.map((c) => ({
      user_id: user?.id ?? null,
      consent_type: c.type,
      granted: c.granted,
      ip_address: ip,
      user_agent: userAgent,
    }))

    const { error } = await admin.from('user_consents').insert(records)

    if (error) {
      console.error('[/api/consent/cookie] insert error:', error)
      return NextResponse.json({ error: 'Failed to save consents' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/consent/cookie]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
