import type { Plan, Quality } from './supabase'
import type { AIGenerationResult, ClaudeModel } from './claude'
import { generateWithClaude } from './claude'
import { generateWithGemini } from './gemini'

// ============================================================
// TASK-TYPEN & CREDIT-KOSTEN
// ============================================================
export type TaskType =
  | 'script_ui'      // 1 Credit  — Gemini
  | 'small_game'     // 5 Credits — Haiku
  | 'normal_game'    // 15 Credits — Haiku
  | 'highend_game'   // 30 Credits — Sonnet
  | 'fix_small'      // 3 Credits — Haiku
  | 'fix_large'      // 10 Credits — Sonnet

export const CREDIT_COSTS: Record<TaskType, number> = {
  script_ui:    1,
  small_game:   5,
  normal_game:  15,
  highend_game: 30,
  fix_small:    3,
  fix_large:    10,
}

// ============================================================
// MODELL-ROUTING
// ============================================================
export interface RouterConfig {
  plan: Plan
  taskType: TaskType
  quality: Quality
}

export type AIProvider = 'gemini' | 'haiku' | 'sonnet'

export function resolveModel(config: RouterConfig): AIProvider {
  const { plan, taskType, quality } = config

  // Free User + einfache Tasks -> Gemini (GRATIS)
  if (plan === 'free' && taskType === 'script_ui') {
    return 'gemini'
  }

  // High-End Spiel -> Sonnet (nur wenn explizit gewählt)
  if (quality === 'highend' || taskType === 'highend_game' || taskType === 'fix_large') {
    return 'sonnet'
  }

  // Free User ohne Gemini-Option -> Haiku (günstig)
  // Pro/Starter/Enterprise normales Spiel -> Haiku
  return 'haiku'
}

export function getClaudeModel(provider: AIProvider): ClaudeModel {
  return provider === 'sonnet' ? 'claude-sonnet-4-6' : 'claude-haiku-4-5'
}

// ============================================================
// TASK-TYPE ERMITTELN
// ============================================================
export function resolveTaskType(
  quality: Quality,
  gameType: string,
  isFix: boolean = false,
  fixSize: 'small' | 'large' = 'small'
): TaskType {
  if (isFix) {
    return fixSize === 'large' ? 'fix_large' : 'fix_small'
  }

  if (quality === 'highend') return 'highend_game'

  // Script/UI-only Tasks
  const scriptTypes = ['script', 'ui', 'gui']
  if (scriptTypes.includes(gameType.toLowerCase())) return 'script_ui'

  // Kleine Spiele
  const smallTypes = ['obby', 'minigame']
  if (smallTypes.includes(gameType.toLowerCase())) return 'small_game'

  // Standard
  return 'normal_game'
}

// ============================================================
// HAUPT-ROUTER
// ============================================================
export interface GenerateOptions {
  prompt: string
  gameType: string
  quality: Quality
  plan: Plan
  isFix?: boolean
  fixSize?: 'small' | 'large'
}

export async function routeAndGenerate(
  options: GenerateOptions
): Promise<AIGenerationResult> {
  const { prompt, gameType, quality, plan, isFix = false, fixSize = 'small' } = options

  const taskType = resolveTaskType(quality, gameType, isFix, fixSize)
  const provider = resolveModel({ plan, taskType, quality })

  console.log(`[AI-Router] Provider: ${provider} | Task: ${taskType} | Plan: ${plan}`)

  if (provider === 'gemini') {
    return await generateWithGemini(prompt, gameType)
  }

  const claudeModel = getClaudeModel(provider)
  return await generateWithClaude(prompt, gameType, quality, claudeModel)
}

// ============================================================
// CREDIT-KOSTEN BERECHNEN
// ============================================================
export function calculateCreditCost(
  quality: Quality,
  gameType: string,
  isFix: boolean = false,
  fixSize: 'small' | 'large' = 'small'
): number {
  const taskType = resolveTaskType(quality, gameType, isFix, fixSize)
  return CREDIT_COSTS[taskType]
}
