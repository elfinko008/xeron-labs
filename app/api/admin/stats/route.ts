import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()

  try {
    // Recent signups (last 20)
    const { data: recentSignups } = await admin
      .from('profiles')
      .select('email, plan, active_platform, created_at')
      .order('created_at', { ascending: false })
      .limit(20)

    // Total users
    const { count: totalUsers } = await admin
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Total generations
    const { count: totalGenerations } = await admin
      .from('projects')
      .select('*', { count: 'exact', head: true })

    // Platform stats (today)
    const today = new Date().toISOString().slice(0, 10)
    const { data: platformStats } = await admin
      .from('platform_stats')
      .select('*')
      .eq('date', today)

    // Social requests (pending)
    const { data: socialRaw } = await admin
      .from('social_credit_requests')
      .select('id, user_id, status, platforms, usernames, profiles(email)')
      .eq('status', 'pending')
      .limit(20)

    const socialRequests = (socialRaw ?? []).map((r: any) => ({
      id: r.id,
      user_id: r.user_id,
      email: r.profiles?.email ?? '?',
      platforms: r.platforms ?? '',
      usernames: r.usernames ?? '',
      status: r.status,
    }))

    // Health checks
    let anthropicOk = false
    let geminiOk = false
    let stripeOk = false

    try {
      const { default: Anthropic } = await import('@anthropic-ai/sdk')
      const a = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
      await a.models.list()
      anthropicOk = true
    } catch { }

    try {
      if (process.env.GOOGLE_AI_API_KEY) geminiOk = true
    } catch { }

    try {
      if (process.env.STRIPE_SECRET_KEY?.startsWith('sk_')) stripeOk = true
    } catch { }

    // Estimate MRR from plan counts
    const { data: planCounts } = await admin
      .from('profiles')
      .select('plan')

    const planPrices: Record<string, number> = {
      free: 0,
      starter: 4.99,
      pro: 14.99,
      enterprise: 39.99,
    }
    const mrr = (planCounts ?? []).reduce((sum: number, row: { plan: string }) => {
      return sum + (planPrices[row.plan] ?? 0)
    }, 0)

    return NextResponse.json({
      totalMRR: mrr,
      totalUsers: totalUsers ?? 0,
      totalGenerations: totalGenerations ?? 0,
      platformStats: (platformStats ?? []).map((s: any) => ({
        platform: s.platform,
        users_today: s.active_users ?? 0,
        generations: s.generations_count ?? 0,
        credits_used: s.credits_consumed ?? 0,
        revenue_eur: parseFloat(s.revenue_eur ?? '0'),
      })),
      recentSignups: recentSignups ?? [],
      socialRequests,
      health: {
        supabase: true, // if we got here, Supabase works
        anthropic: anthropicOk,
        gemini: geminiOk,
        stripe: stripeOk,
      },
    })
  } catch (err) {
    console.error('[/api/admin/stats]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
