import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import { routeAndGenerate, calculateCreditCost } from '@/lib/ai-router'
import { hasEnoughCredits, deductCredits, checkRateLimit } from '@/lib/credits'

const GAME_TYPE_WHITELIST = ['obby', 'roleplay', 'horror', 'racing', 'shooter', 'sandbox', 'custom', 'script', 'ui']

export async function POST(req: NextRequest) {
  try {
    // Auth prüfen
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    // Body parsen
    const body = await req.json()
    const { prompt, gameType, quality } = body

    // Validierung
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt fehlt' }, { status: 400 })
    }
    if (prompt.length > 3000) {
      return NextResponse.json({ error: 'Prompt zu lang (max 3000 Zeichen)' }, { status: 400 })
    }
    if (!GAME_TYPE_WHITELIST.includes(gameType?.toLowerCase())) {
      return NextResponse.json({ error: 'Ungültiger Spieltyp' }, { status: 400 })
    }
    if (!['standard', 'highend'].includes(quality)) {
      return NextResponse.json({ error: 'Ungültige Qualität' }, { status: 400 })
    }

    // Profil holen
    const admin = createAdminClient()
    const { data: profile } = await admin
      .from('profiles')
      .select('plan, credits')
      .eq('id', user.id)
      .single() as { data: { plan: string; credits: number } | null }

    if (!profile) {
      return NextResponse.json({ error: 'Profil nicht gefunden' }, { status: 404 })
    }

    // Rate-Limit prüfen
    const withinLimit = await checkRateLimit(user.id)
    if (!withinLimit) {
      return NextResponse.json(
        { error: 'Rate-Limit erreicht. Maximal 10 Generierungen pro Stunde.' },
        { status: 429 }
      )
    }

    // Credit-Kosten berechnen
    const creditCost = calculateCreditCost(quality, gameType)

    // Credits prüfen
    const enough = await hasEnoughCredits(user.id, creditCost)
    if (!enough) {
      return NextResponse.json(
        { error: 'Nicht genug Credits', required: creditCost, current: profile.credits },
        { status: 402 }
      )
    }

    // Projekt anlegen (Status: generating)
    const projectName = `${gameType.charAt(0).toUpperCase() + gameType.slice(1)}-Spiel ${new Date().toLocaleDateString('de-DE')}`
    const { data: project, error: projectError } = await admin
      .from('projects')
      .insert({
        user_id: user.id,
        name: projectName,
        prompt,
        game_type: gameType,
        quality,
        status: 'generating',
      })
      .select()
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Projekt konnte nicht erstellt werden' }, { status: 500 })
    }

    // Credits SOFORT abziehen
    await deductCredits(
      user.id,
      creditCost,
      `Generierung: ${projectName} (${creditCost} Credits)`
    )

    // KI generieren (async im Hintergrund)
    generateAsync(project.id, user.id, prompt, gameType, quality, profile.plan)

    return NextResponse.json({
      projectId: project.id,
      creditCost,
      message: 'Generierung gestartet',
    })
  } catch (err) {
    console.error('[/api/generate]', err)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}

// ============================================================
// ASYNC GENERIERUNG (läuft im Hintergrund)
// ============================================================
async function generateAsync(
  projectId: string,
  userId: string,
  prompt: string,
  gameType: string,
  quality: string,
  plan: string
) {
  const admin = createAdminClient()

  try {
    const result = await routeAndGenerate({
      prompt,
      gameType,
      quality: quality as 'standard' | 'highend',
      plan: plan as 'free' | 'starter' | 'pro' | 'enterprise',
    })

    // Lua-Output zusammensetzen
    const luaOutput = result.tasks
      .map((t) => `-- === ${t.name} ===\n${t.lua}`)
      .join('\n\n')

    // Projekt aktualisieren
    await admin
      .from('projects')
      .update({
        status: 'done',
        lua_output: luaOutput,
        summary: result.summary,
        controls_info: result.controls,
      })
      .eq('id', projectId)

    // Generation-Log speichern
    await admin.from('generations').insert({
      project_id: projectId,
      steps_json: result.tasks,
      tokens_used: result.tokens_used,
      cost_usd: result.cost_usd,
      ai_model: result.ai_model,
    })
  } catch (err) {
    console.error('[generateAsync]', err)
    await admin
      .from('projects')
      .update({ status: 'error' })
      .eq('id', projectId)
  }
}
