import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

// ============================================================
// COUPON DEFINITIONS
// All reward metadata is defined here — actual secret codes live in .env
// ============================================================
interface CouponReward {
  type: 'credits' | 'discount_percent' | 'plan_free'
  value?: number      // for discount_percent
  credits?: number    // for credits / plan_free bonus
  plan?: string       // for plan_free
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

// Returns the env-key matching the submitted code, or null
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
// RATE LIMIT HELPER
// ============================================================
async function checkRateLimit(
  admin: ReturnType<typeof createAdminClient>,
  ip: string,
  action: string,
  maxCount: number,
  windowMs: number
): Promise<boolean> {
  const since = new Date(Date.now() - windowMs).toISOString()
  const { count } = await admin
    .from('rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .eq('action', action)
    .gte('created_at', since)
  if ((count || 0) >= maxCount) return false
  await admin.from('rate_limits').insert({ ip_address: ip, action })
  return true
}

// ============================================================
// ROUTE HANDLER
// ============================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { code, plan } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'code is required' }, { status: 400 })
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown'

    const admin = createAdminClient()

    // Rate limit: max 10 attempts per IP per hour
    const allowed = await checkRateLimit(admin, ip, 'coupon_validate', 10, 60 * 60 * 1000)
    if (!allowed) {
      return NextResponse.json(
        { valid: false, error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const couponKey = resolveCouponKey(code.trim().toUpperCase())
    if (!couponKey) {
      return NextResponse.json({ valid: false, message: 'Invalid coupon code', reward: null })
    }

    const reward = COUPON_REWARDS[couponKey]

    // Check plan restriction if provided
    if (plan && reward.type === 'plan_free' && reward.plan && reward.plan !== plan) {
      return NextResponse.json({
        valid: false,
        message: `This coupon is for the ${reward.plan} plan`,
        reward: null,
      })
    }

    // Optional: check if the authenticated user already used this coupon
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { count: usedCount } = await admin
        .from('credit_transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('type', 'coupon')
        .eq('description', `Coupon redeemed: ${couponKey}`)

      if ((usedCount ?? 0) > 0) {
        return NextResponse.json({
          valid: false,
          message: 'You have already used this coupon',
          reward: null,
        })
      }
    }

    // NEVER return the actual code — only the reward metadata
    return NextResponse.json({ valid: true, reward })
  } catch (err) {
    console.error('[/api/coupon/validate]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
