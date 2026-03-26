import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import { hasEnoughCredits, deductCredits, checkIpRateLimit, logRateLimitRequest } from '@/lib/credits'
import { routeAndGenerate } from '@/lib/ai-router'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await req.json()
    const { prompt, fixType = 'quick' } = body
    if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 })

    const creditCost = fixType === 'deep' ? 50 : 15
    const admin = createAdminClient()
    const { data: profile } = await admin.from('profiles').select('plan, credits, purchased_credits').eq('id', user.id).single()
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rateCheck = await checkIpRateLimit(ip, profile.plan)
    if (!rateCheck.allowed) return NextResponse.json({ error: rateCheck.reason }, { status: 429 })

    const enough = await hasEnoughCredits(user.id, creditCost)
    if (!enough) return NextResponse.json({ error: 'Not enough credits', required: creditCost }, { status: 402 })

    const { data: project } = await admin.from('projects').insert({
      user_id: user.id, name: `Fix ${new Date().toLocaleDateString()}`, prompt,
      mode: fixType === 'deep' ? 'fix' : 'fix', quality: fixType === 'deep' ? 'highend' : 'standard',
      status: 'generating',
    }).select().single()

    if (!project) return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })

    await deductCredits(user.id, creditCost, `Fix: ${fixType} (${creditCost} credits)`)
    await logRateLimitRequest(ip, user.id, 'fix')

    // Background fix
    ;(async () => {
      try {
        const result = await routeAndGenerate({ prompt: `Fix this game issue: ${prompt}`, gameType: 'fix', quality: fixType === 'deep' ? 'highend' : 'standard', plan: profile.plan as 'free'|'starter'|'pro'|'enterprise' })
        const luaOutput = result.tasks.map((t) => `-- === ${t.name} ===\n${t.lua}`).join('\n\n')
        await admin.from('projects').update({ status: 'done', lua_output: luaOutput, summary: result.summary }).eq('id', project.id)
      } catch {
        await admin.from('projects').update({ status: 'error' }).eq('id', project.id)
      }
    })()

    return NextResponse.json({ projectId: project.id, creditCost, message: 'Fix started' })
  } catch (err) {
    console.error('[/api/fix]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
