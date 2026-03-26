import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import { hasEnoughCredits, deductCredits } from '@/lib/credits'
import { routeAndGenerate } from '@/lib/ai-router'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const creditCost = 10
    const admin = createAdminClient()
    const { data: profile } = await admin.from('profiles').select('plan').eq('id', user.id).single()
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const enough = await hasEnoughCredits(user.id, creditCost)
    if (!enough) return NextResponse.json({ error: 'Not enough credits' }, { status: 402 })

    const { data: project } = await admin.from('projects').insert({
      user_id: user.id, name: `Clean ${new Date().toLocaleDateString()}`,
      prompt: 'Clean and organize the Explorer hierarchy', mode: 'clean', quality: 'standard', status: 'generating',
    }).select().single()

    if (!project) return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })

    await deductCredits(user.id, creditCost, `Clean Explorer (${creditCost} credits)`)

    ;(async () => {
      try {
        const result = await routeAndGenerate({ prompt: 'Generate Lua code to clean and organize the Roblox game Explorer: sort Workspace, ServerScriptService, StarterGui, remove duplicate parts, rename unnamed objects, group related objects.', gameType: 'clean', quality: 'standard', plan: profile.plan as 'free'|'starter'|'pro'|'enterprise' })
        const luaOutput = result.tasks.map((t) => `-- === ${t.name} ===\n${t.lua}`).join('\n\n')
        await admin.from('projects').update({ status: 'done', lua_output: luaOutput, summary: result.summary }).eq('id', project.id)
      } catch {
        await admin.from('projects').update({ status: 'error' }).eq('id', project.id)
      }
    })()

    return NextResponse.json({ projectId: project.id, creditCost, message: 'Clean started' })
  } catch (err) {
    console.error('[/api/clean]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
