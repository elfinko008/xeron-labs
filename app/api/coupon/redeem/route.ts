import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

// ============================================================
// COUPON DEFINITIONS (same as validate — keep in sync)
// ============================================================
interface CouponReward {
  type: 'credits' | 'discount_percent' | 'plan_free'
  value?: number
  credits?: number
  plan?: string
}

const COUPON_REWARDS: Record<string, CouponReward> = {
  COUPON_1: { type: 'credits',          credits: 50 },
  COUPON_2: { type: 'credits',          credits: 100 },
  COUPON_3: { type: 'discount_percent', value: 10 },
  COUPON_4: { type: 'discount_percent', value: 20 },
  COUPON_5: { type: 'plan_free',        plan: 'starter', credits: 100 },
  COUPON_6: { type: 'plan_free',        plan: 'pro',     credits: 500 },
  COUPON_7: { type: 'credits',          credits: 25 },
}

function resolveCouponKey(code: string): string | null {
  for (let i = 1; i <= 7; i++) {
    const envKey = `COUPON_${i}`
    const envValue = process.env[envKey]
    if (envValue && envValue === code) {
      return envKey
    }
  }
  return null
}

// ============================================================
// ROUTE HANDLER
// ============================================================
export async function POST(req: NextRequest) {
  try {
    // Auth required
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await req.json()
    const { code } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'code is required' }, { status: 400 })
    }

    const couponKey = resolveCouponKey(code.trim().toUpperCase())
    if (!couponKey) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 })
    }

    const reward = COUPON_REWARDS[couponKey]
    const admin = createAdminClient()

    // Check if user already redeemed this coupon
    const { count: usedCount } = await admin
      .from('credit_transactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('type', 'coupon')
      .eq('description', `Coupon redeemed: ${couponKey}`)

    if ((usedCount ?? 0) > 0) {
      return NextResponse.json({ error: 'You have already redeemed this coupon' }, { status: 400 })
    }

    // Fetch current profile
    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('credits, purchased_credits, plan')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    let newBalance: number | undefined
    let updateData: Record<string, unknown> = {}

    if (reward.type === 'credits') {
      // Add to purchased_credits
      const creditsToAdd = reward.credits ?? 0
      const newPurchased = (profile.purchased_credits ?? 0) + creditsToAdd
      updateData = { purchased_credits: newPurchased }
      newBalance = (profile.credits ?? 0) + newPurchased

      await admin.from('profiles').update(updateData).eq('id', user.id)

      await admin.from('credit_transactions').insert({
        user_id: user.id,
        type: 'coupon',
        amount: creditsToAdd,
        balance_after: newBalance,
        description: `Coupon redeemed: ${couponKey}`,
      })
    } else if (reward.type === 'plan_free') {
      // Upgrade plan + add credits
      const creditsToAdd = reward.credits ?? 0
      const newPurchased = (profile.purchased_credits ?? 0) + creditsToAdd
      updateData = { plan: reward.plan, purchased_credits: newPurchased }
      newBalance = (profile.credits ?? 0) + newPurchased

      await admin.from('profiles').update(updateData).eq('id', user.id)

      await admin.from('credit_transactions').insert({
        user_id: user.id,
        type: 'coupon',
        amount: creditsToAdd,
        balance_after: newBalance,
        description: `Coupon redeemed: ${couponKey}`,
      })
    } else if (reward.type === 'discount_percent') {
      // Discount is applied at checkout — just record that it was redeemed
      await admin.from('credit_transactions').insert({
        user_id: user.id,
        type: 'coupon',
        amount: 0,
        balance_after: (profile.credits ?? 0) + (profile.purchased_credits ?? 0),
        description: `Coupon redeemed: ${couponKey}`,
      })
    }

    return NextResponse.json({
      success: true,
      reward,
      ...(newBalance !== undefined ? { new_balance: newBalance } : {}),
    })
  } catch (err) {
    console.error('[/api/coupon/redeem]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
