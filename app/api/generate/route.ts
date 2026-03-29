import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import {
  PLATFORM_CONFIG, PLATFORM_ORDER,
  getPlatformCreditCost, getPlatformModel,
  type PlatformKey, type GenerationMode,
} from '@/lib/platform-router'
import { hasEnoughCredits, deductCredits, checkIpRateLimit, logRateLimitRequest } from '@/lib/credits'

const VALID_MODES = new Set<string>(['game','script','ui','fix','clean','diagnose','chat','shader','blueprint','component','scene','mobile_ui'])

// Build content array for AI (with optional image references)
function buildMessages(prompt: string, mode: string, config: typeof PLATFORM_CONFIG[PlatformKey], imageUrls: string[]) {
  const modeInstructions: Record<string, string> = {
    fix:      'Here is a broken script. Please analyze and fix all issues:\n\n',
    diagnose: 'Please diagnose the following code or issue and explain the problems:\n\n',
    clean:    'Please clean, organize, and improve the following code:\n\n',
    ui:       'Create a UI component based on this description:\n\n',
    game:     'Build a complete game based on this description:\n\n',
    shader:   'Create a shader based on this description:\n\n',
    blueprint:'Create a Blueprint system based on this description:\n\n',
    component:'Create a reusable component based on this description:\n\n',
    scene:    'Set up a scene based on this description:\n\n',
  }
  const prefix = modeInstructions[mode] ?? ''
  const fullPrompt = prefix + prompt

  // Claude message format with optional images
  const contentParts: Record<string, unknown>[] = []
  for (const url of imageUrls) {
    contentParts.push({ type: 'image', source: { type: 'url', url } })
  }
  contentParts.push({ type: 'text', text: fullPrompt })

  return [{ role: 'user', content: contentParts }]
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      prompt,
      mode = 'script',
      platform = 'roblox',
      quality = 'standard',
      imageUrls = [],
      gameType,   // legacy support
    } = body

    // Validate
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }
    if (prompt.length > 4000) {
      return NextResponse.json({ error: 'Prompt too long (max 4000 characters)' }, { status: 400 })
    }
    if (!PLATFORM_ORDER.includes(platform as PlatformKey)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
    }
    if (!VALID_MODES.has(mode)) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
    }

    const platformKey = platform as PlatformKey
    const modeKey = mode as GenerationMode
    const config = PLATFORM_CONFIG[platformKey]

    // Get profile
    const admin = createAdminClient()
    const { data: profile } = await admin
      .from('profiles')
      .select('plan, credits, purchased_credits')
      .eq('id', user.id)
      .single() as { data: { plan: string; credits: number; purchased_credits: number } | null }

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check plan can use platform
    const model = getPlatformModel(platformKey, profile.plan)
    if (!model) {
      return NextResponse.json({
        error: `${config.name} requires Pro or Enterprise plan`,
        upgradeUrl: '/shop',
      }, { status: 403 })
    }

    // Check mode plan restriction (game requires pro+)
    if (modeKey === 'game' && !['pro', 'enterprise'].includes(profile.plan)) {
      return NextResponse.json({
        error: 'Game generation requires Pro or Enterprise plan',
        upgradeUrl: '/shop',
      }, { status: 403 })
    }

    // Rate limit check
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? 'unknown'
    const rateCheck = await checkIpRateLimit(ip, profile.plan)
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: rateCheck.reason ?? 'Rate limit reached.' }, { status: 429 })
    }

    // Credit cost
    const creditCost = getPlatformCreditCost(platformKey, modeKey)

    // Check credits
    const enough = await hasEnoughCredits(user.id, creditCost)
    if (!enough) {
      return NextResponse.json({
        error: 'Not enough credits',
        required: creditCost,
        current: profile.credits,
        shopUrl: '/shop',
      }, { status: 402 })
    }

    // Create project record
    const projectName = `${config.name} ${modeKey} — ${new Date().toLocaleDateString('en-US')}`
    const { data: project, error: projectError } = await admin
      .from('projects')
      .insert({
        user_id: user.id,
        name: projectName,
        prompt,
        game_type: gameType ?? modeKey,
        quality,
        status: 'generating',
        platform: platformKey,
        output_language: config.outputLanguage,
        image_references: imageUrls.length > 0 ? imageUrls : null,
      })
      .select()
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
    }

    // Deduct credits immediately
    await deductCredits(user.id, creditCost, `${config.name} ${modeKey} (${creditCost} credits)`)
    await logRateLimitRequest(ip, user.id, 'generate')

    // Generate async in background
    generateAsync(project.id, user.id, prompt, modeKey, platformKey, profile.plan, imageUrls)

    return NextResponse.json({
      projectId: project.id,
      creditCost,
      platform: platformKey,
      language: config.outputLanguage,
      message: 'Generation started',
    })
  } catch (err) {
    console.error('[/api/generate]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── Async generation ──────────────────────────────────────────────────────────

async function generateAsync(
  projectId: string,
  userId: string,
  prompt: string,
  mode: GenerationMode,
  platform: PlatformKey,
  plan: string,
  imageUrls: string[]
) {
  const admin = createAdminClient()
  const config = PLATFORM_CONFIG[platform]
  const model = getPlatformModel(platform, plan)

  try {
    let codeOutput = ''
    let summary = ''

    const messages = buildMessages(prompt, mode, config, imageUrls)

    if (model?.startsWith('claude-')) {
      const { default: Anthropic } = await import('@anthropic-ai/sdk')
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
      const response = await anthropic.messages.create({
        model,
        max_tokens: mode === 'game' ? 8192 : 4096,
        system: config.systemPrompt,
        messages: messages as unknown as Parameters<typeof anthropic.messages.create>[0]['messages'],
      })
      const text = response.content.find(c => c.type === 'text')?.text ?? ''
      codeOutput = extractCode(text)
      summary = extractSummary(text)
    } else if (model?.startsWith('gemini-')) {
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY ?? process.env.GOOGLE_GEMINI_API_KEY ?? '')
      const gemModel = genAI.getGenerativeModel({ model })
      const result = await gemModel.generateContent(config.systemPrompt + '\n\n' + prompt)
      const text = result.response.text()
      codeOutput = extractCode(text)
      summary = extractSummary(text)
    }

    await admin
      .from('projects')
      .update({
        status: 'done',
        code_output: codeOutput,
        lua_output: platform === 'roblox' ? codeOutput : null,
        summary,
      })
      .eq('id', projectId)

    // Update platform stats
    const creditCost = getPlatformCreditCost(platform, mode)
    try {
      await admin.rpc('increment_platform_stats', { p_platform: platform, p_credits: creditCost })
    } catch (_) {}

  } catch (err) {
    console.error('[generateAsync]', err)
    await admin.from('projects').update({ status: 'error' }).eq('id', projectId)
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractCode(text: string): string {
  // Try to extract code from markdown code blocks
  const codeBlockMatch = text.match(/```(?:\w+)?\n([\s\S]*?)```/)
  if (codeBlockMatch) return codeBlockMatch[1].trim()
  // If no code block, return the whole text (it's already raw code)
  return text.trim()
}

function extractSummary(text: string): string {
  // Take first non-code paragraph as summary
  const withoutCode = text.replace(/```[\s\S]*?```/g, '').trim()
  const firstPara = withoutCode.split('\n\n')[0]
  return firstPara?.slice(0, 300) ?? ''
}
