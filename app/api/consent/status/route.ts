import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const admin = createAdminClient()

    // Fetch the most recent consent record per type
    const { data: consents, error: consentsError } = await admin
      .from('user_consents')
      .select('consent_type, granted, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (consentsError) {
      console.error('[/api/consent/status] consents error:', consentsError)
      return NextResponse.json({ error: 'Failed to fetch consents' }, { status: 500 })
    }

    // Deduplicate — keep the latest per type
    const latestByType: Record<string, boolean> = {}
    for (const row of (consents ?? [])) {
      if (!(row.consent_type in latestByType)) {
        latestByType[row.consent_type] = row.granted
      }
    }

    // Count withdrawal waivers
    const { count: waiverCount, error: waiverError } = await admin
      .from('purchase_consents')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (waiverError) {
      console.error('[/api/consent/status] waiver count error:', waiverError)
    }

    return NextResponse.json({
      cookie_essential: latestByType['cookie_essential'] ?? false,
      cookie_analytics: latestByType['cookie_analytics'] ?? false,
      cookie_marketing: latestByType['cookie_marketing'] ?? false,
      withdrawal_waivers: waiverCount ?? 0,
    })
  } catch (err) {
    console.error('[/api/consent/status]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
