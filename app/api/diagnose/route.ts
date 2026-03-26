import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import { hasEnoughCredits, deductCredits } from '@/lib/credits'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const creditCost = 5
    const admin = createAdminClient()
    const { data: profile } = await admin.from('profiles').select('plan').eq('id', user.id).single()
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const enough = await hasEnoughCredits(user.id, creditCost)
    if (!enough) return NextResponse.json({ error: 'Not enough credits' }, { status: 402 })

    await deductCredits(user.id, creditCost, `Diagnose game (${creditCost} credits)`)

    // Return a simulated diagnosis result (in production, this would analyze actual game data from plugin)
    const diagnosisResult = {
      issues: [
        { severity: 'critical' as const, description: 'Connect the Studio Plugin to analyze your actual game', suggestedFix: 'Install the XERON Plugin in Roblox Studio and connect it' },
        { severity: 'info' as const, description: 'Plugin required for real game analysis', suggestedFix: 'Go to Dashboard → Account to download the Studio Plugin' },
      ],
      summary: 'Connect the Studio Plugin to run a real diagnosis of your Roblox game.',
    }

    return NextResponse.json({ result: diagnosisResult, creditCost })
  } catch (err) {
    console.error('[/api/diagnose]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
