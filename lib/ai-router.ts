// ═══════════════════════════════════════════════════════════════
//  XERON ENGINE v7 — AI Routing System
//  Routes requests to appropriate AI model based on plan + mode
// ═══════════════════════════════════════════════════════════════

import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

export type Plan = 'free' | 'starter' | 'pro' | 'enterprise'
export type Mode = 'game' | 'script' | 'ui' | 'fix' | 'clean' | 'diagnose' | 'chat'
export type Quality = 'standard' | 'highend'

// ── CREDIT COSTS ──────────────────────────────────────────────
export const CREDIT_COSTS: Record<string, number> = {
  game_standard: 50,
  game_highend: 200,  // 50 + 150 high-end bonus
  script: 10,
  ui: 10,
  fix_quick: 15,
  fix_deep: 50,
  clean: 10,
  diagnose: 5,
  chat: 2,
}

// ── AI ROUTING TABLE ──────────────────────────────────────────
const AI_ROUTING: Record<Plan, Record<string, string | null>> = {
  free: {
    script:    'gemini-2.5-flash-lite',
    ui:        'gemini-2.5-flash-lite',
    fix:       'gemini-2.5-flash-lite',
    clean:     'gemini-2.5-flash-lite',
    diagnose:  'gemini-2.5-flash-lite',
    game:      null,  // LOCKED
    chat:      null,  // LOCKED
  },
  starter: {
    script:    'gemini-2.5-flash',
    ui:        'gemini-2.5-flash',
    fix:       'gemini-2.5-flash',
    clean:     'gemini-2.5-flash-lite',
    diagnose:  'gemini-2.5-flash-lite',
    game:      null,  // LOCKED
    chat:      null,  // LOCKED
  },
  pro: {
    script:       'claude-haiku-4-5',
    ui:           'claude-haiku-4-5',
    fix_quick:    'claude-haiku-4-5',
    fix_deep:     'claude-sonnet-4-6',
    clean:        'claude-haiku-4-5',
    diagnose:     'claude-haiku-4-5',
    game_normal:  'claude-haiku-4-5',
    game_highend: 'claude-sonnet-4-6',
    chat:         'claude-haiku-4-5',
  },
  enterprise: {
    script:    'claude-sonnet-4-6',
    ui:        'claude-sonnet-4-6',
    fix:       'claude-sonnet-4-6',
    clean:     'claude-haiku-4-5',
    diagnose:  'claude-haiku-4-5',
    game:      'claude-sonnet-4-6',
    chat:      'claude-sonnet-4-6',
  },
}

export interface RouterConfig {
  plan: Plan
  mode: Mode
  quality?: Quality
}

export interface RoutingResult {
  model: string | null
  provider: 'claude' | 'gemini' | null
  creditCost: number
  locked: boolean
  lockReason?: string
}

export function resolveRoute(config: RouterConfig): RoutingResult {
  const { plan, mode, quality = 'standard' } = config
  const routes = AI_ROUTING[plan]

  // Check mode availability per plan
  if (mode === 'game' && (plan === 'free' || plan === 'starter')) {
    return { model: null, provider: null, creditCost: 0, locked: true, lockReason: 'Game generation requires Pro or Enterprise plan.' }
  }
  if (mode === 'chat' && (plan === 'free' || plan === 'starter')) {
    return { model: null, provider: null, creditCost: 0, locked: true, lockReason: 'AI Chat requires Pro or Enterprise plan.' }
  }

  let modelKey: string = mode
  let creditKey: string = mode

  if (mode === 'game') {
    modelKey = quality === 'highend' ? 'game_highend' : (plan === 'pro' ? 'game_normal' : 'game')
    creditKey = quality === 'highend' ? 'game_highend' : 'game_standard'
  } else if (mode === 'fix') {
    modelKey = quality === 'highend' ? 'fix_deep' : (plan === 'pro' ? 'fix_quick' : 'fix')
    creditKey = quality === 'highend' ? 'fix_deep' : 'fix_quick'
  }

  const model = routes[modelKey] || routes[mode] || null
  const creditCost = CREDIT_COSTS[creditKey] || CREDIT_COSTS[mode] || 10

  const provider: 'claude' | 'gemini' | null =
    model === null ? null :
    model.startsWith('claude') ? 'claude' :
    'gemini'

  return { model, provider, creditCost, locked: false }
}

export function getModelDisplayName(model: string): string {
  const names: Record<string, string> = {
    'gemini-2.5-flash-lite': 'Gemini Flash Lite',
    'gemini-2.5-flash':      'Gemini Flash',
    'claude-haiku-4-5':      'Claude Haiku',
    'claude-sonnet-4-6':     'Claude Sonnet',
  }
  return names[model] || model
}

export function canUsePlan(plan: Plan, mode: Mode): boolean {
  const route = resolveRoute({ plan, mode })
  return !route.locked
}

// ── GAME-TYPE → MODE MAPPING ───────────────────────────────────
const GAME_TYPE_TO_MODE: Record<string, Mode> = {
  obby:     'game',
  roleplay: 'game',
  horror:   'game',
  racing:   'game',
  shooter:  'game',
  sandbox:  'game',
  custom:   'game',
  script:   'script',
  ui:       'ui',
  fix:      'fix',
  clean:    'clean',
  diagnose: 'diagnose',
}

// ── GENERATION RESULT ─────────────────────────────────────────
export interface GenerationTask {
  name: string
  lua: string
}

export interface GenerationResult {
  tasks: GenerationTask[]
  summary: string
  controls: string
  tokens_used: number
  cost_usd: number
  ai_model: string
}

// ── calculateCreditCost (legacy compat) ───────────────────────
export function calculateCreditCost(quality: string, gameType: string): number {
  const mode = GAME_TYPE_TO_MODE[gameType?.toLowerCase()] ?? 'game'
  if (mode === 'game') {
    return quality === 'highend' ? CREDIT_COSTS.game_highend : CREDIT_COSTS.game_standard
  }
  if (mode === 'fix') {
    return quality === 'highend' ? CREDIT_COSTS.fix_deep : CREDIT_COSTS.fix_quick
  }
  return CREDIT_COSTS[mode] ?? 10
}

// ── System prompt factory ─────────────────────────────────────
function buildSystemPrompt(mode: Mode, gameType: string): string {
  const base = `You are XERON ENGINE, an expert Roblox Lua developer. Output ONLY valid JSON, no markdown fences.`

  const schema = `Return this exact JSON structure:
{
  "tasks": [
    { "name": "TaskName", "lua": "-- Lua code here" }
  ],
  "summary": "One sentence describing what was built.",
  "controls": "Brief controls/usage description."
}`

  if (mode === 'script') return `${base} Generate a clean, efficient Roblox LocalScript or Script.\n${schema}`
  if (mode === 'ui')     return `${base} Generate Roblox UI code using ScreenGui and Frame elements.\n${schema}`
  if (mode === 'fix')    return `${base} Fix the provided Roblox Lua code. Return the corrected version.\n${schema}`
  if (mode === 'clean')  return `${base} Generate Lua code to clean and organize the Roblox Explorer hierarchy.\n${schema}`
  if (mode === 'diagnose') return `${base} Diagnose the Roblox Lua code issues and provide fixed code.\n${schema}`
  // game
  return `${base} Generate a complete Roblox ${gameType} game with multiple scripts.\n${schema}`
}

// ── Parse AI response into tasks ──────────────────────────────
function parseResponse(text: string, fallbackPrompt: string): { tasks: GenerationTask[]; summary: string; controls: string } {
  try {
    // Strip potential markdown fences
    const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
    const parsed = JSON.parse(cleaned)
    return {
      tasks:    Array.isArray(parsed.tasks) ? parsed.tasks : [{ name: 'Generated', lua: cleaned }],
      summary:  parsed.summary  ?? 'Generated successfully.',
      controls: parsed.controls ?? 'See code comments for usage.',
    }
  } catch {
    return {
      tasks:   [{ name: 'Generated', lua: text }],
      summary: `Generated for: ${fallbackPrompt.slice(0, 60)}`,
      controls: 'See code comments for usage.',
    }
  }
}

// ── routeAndGenerate (main entry point for API routes) ────────
export async function routeAndGenerate(params: {
  prompt: string
  gameType: string
  quality: 'standard' | 'highend'
  plan: Plan
}): Promise<GenerationResult> {
  const { prompt, gameType, quality, plan } = params
  const mode: Mode = GAME_TYPE_TO_MODE[gameType?.toLowerCase()] ?? 'game'
  const route = resolveRoute({ plan, mode, quality })

  if (route.locked || !route.model) {
    throw new Error(route.lockReason ?? 'This feature is locked for your plan.')
  }

  const systemPrompt = buildSystemPrompt(mode, gameType)
  const userMessage  = prompt.slice(0, 3000)

  let rawText    = ''
  let tokensUsed = 0
  let costUsd    = 0

  if (route.provider === 'claude') {
    const client   = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const response = await client.messages.create({
      model:      route.model,
      max_tokens: quality === 'highend' ? 8192 : 4096,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: userMessage }],
    })
    const block = response.content[0]
    rawText    = block.type === 'text' ? block.text : ''
    tokensUsed = response.usage.input_tokens + response.usage.output_tokens
    // Rough cost estimate (per million tokens)
    const inputCost  = route.model.includes('sonnet') ? 3.0  : 0.8
    const outputCost = route.model.includes('sonnet') ? 15.0 : 4.0
    costUsd = (response.usage.input_tokens / 1e6) * inputCost
            + (response.usage.output_tokens / 1e6) * outputCost
  } else {
    // Gemini
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY ?? '')
    const model = genAI.getGenerativeModel({
      model:            route.model,
      systemInstruction: systemPrompt,
    })
    const result = await model.generateContent(userMessage)
    rawText     = result.response.text()
    tokensUsed  = result.response.usageMetadata?.totalTokenCount ?? 0
    costUsd     = 0 // Gemini free tier / cost handled separately
  }

  const { tasks, summary, controls } = parseResponse(rawText, prompt)

  return {
    tasks,
    summary,
    controls,
    tokens_used: tokensUsed,
    cost_usd:    costUsd,
    ai_model:    route.model,
  }
}
