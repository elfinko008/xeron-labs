import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { referralCode } = await req.json()
    if (!referralCode) return NextResponse.json({ error: 'Referral code required' }, { status: 400 })

    const admin = createAdminClient()

    // Find referrer
    const { data: referrer } = await admin.from('profiles').select('id, referral_credits_earned').eq('referral_code', referralCode).single()
    if (!referrer) return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
    if (referrer.id === user.id) return NextResponse.json({ error: 'Cannot use your own referral code' }, { status: 400 })

    // Check if already used referral
    const { data: profile } = await admin.from('profiles').select('referred_by, purchased_credits').eq('id', user.id).single()
    if (profile?.referred_by) return NextResponse.json({ error: 'Already used a referral code' }, { status: 400 })

    // Give both +5 credits
    await admin.from('profiles').update({ referred_by: referrer.id, purchased_credits: (profile?.purchased_credits || 0) + 5 }).eq('id', user.id)
    await admin.from('profiles').update({ referral_credits_earned: (referrer.referral_credits_earned || 0) + 5, credits: admin.rpc('increment', { row_id: referrer.id, amount: 5 }) }).eq('id', referrer.id)

    // Log transactions
    await admin.from('credit_transactions').insert([
      { user_id: user.id, type: 'referral', amount: 5, balance_after: (profile?.purchased_credits || 0) + 5, description: 'Referral bonus — new user signup' },
      { user_id: referrer.id, type: 'referral', amount: 5, balance_after: 0, description: 'Referral reward — friend signed up' },
    ])

    return NextResponse.json({ message: 'Referral claimed! +5 credits added' })
  } catch (err) {
    console.error('[/api/referral/claim]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
