import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const admin = createAdminClient()
    const { data: profile } = await admin.from('profiles').select('credits, purchased_credits, plan, credits_reset_at').eq('id', user.id).single()
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    return NextResponse.json({
      credits: profile.credits,
      purchasedCredits: profile.purchased_credits,
      total: (profile.credits || 0) + (profile.purchased_credits || 0),
      plan: profile.plan,
      creditsResetAt: profile.credits_reset_at,
    })
  } catch (err) {
    console.error('[/api/credits/check]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
