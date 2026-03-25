import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export type ClaudeModel = 'claude-haiku-4-5' | 'claude-sonnet-4-6'

export interface AIGenerationResult {
  tasks: GeneratedTask[]
  summary: string
  controls: string
  ai_model: string
  tokens_used: number
  cost_usd: number
}

export interface GeneratedTask {
  id: number
  name: string
  status: 'done' | 'error'
  lua: string
}

const SYSTEM_PROMPT = `Du bist ein Experte für Roblox-Spielentwicklung mit Lua.
Du generierst vollständige, lauffähige Roblox Studio Lua-Scripts.

WICHTIGE REGELN:
- Gib IMMER valides JSON zurück, niemals anderen Text
- Alle Lua-Scripts müssen sofort in Roblox Studio ausführbar sein
- Verwende game:GetService() für alle Roblox Services
- Erstelle professionellen, kommentierten Code
- Arbeite IMMER in dieser Reihenfolge: Terrain → Lighting/Atmosphäre → Karte/Zonen → Gebäude → Vegetation → Fahrzeuge/NPCs → Scripts → GUI → Spawnpoints → Aufräumen

AUSGABEFORMAT (NUR dieses JSON, kein anderer Text):
{
  "tasks": [
    { "id": 1, "name": "Terrain generieren", "status": "done", "lua": "-- Lua code here" },
    { "id": 2, "name": "Lighting setzen", "status": "done", "lua": "-- Lua code here" },
    { "id": 3, "name": "Assets platzieren", "status": "done", "lua": "-- Lua code here" },
    { "id": 4, "name": "Scripts erstellen", "status": "done", "lua": "-- Lua code here" },
    { "id": 5, "name": "GUI aufbauen", "status": "done", "lua": "-- Lua code here" }
  ],
  "summary": "Kurze Beschreibung was erstellt wurde",
  "controls": "WASD = Bewegen | E = Interagieren",
  "ai_model": "claude-haiku-4-5",
  "tokens_used": 0
}`

export async function generateWithClaude(
  prompt: string,
  gameType: string,
  quality: 'standard' | 'highend',
  model: ClaudeModel = 'claude-haiku-4-5'
): Promise<AIGenerationResult> {
  const userPrompt = `Erstelle ein vollständiges Roblox-Spiel:

Spieltyp: ${gameType}
Qualität: ${quality === 'highend' ? 'High-End (maximale Grafik und Details)' : 'Standard'}
Beschreibung: ${prompt}

Generiere alle notwendigen Lua-Scripts für ein vollständiges, spielbares Roblox-Spiel.
Jeder Task soll echten, funktionsfähigen Lua-Code enthalten.`

  const maxTokens = model === 'claude-sonnet-4-6' ? 8192 : 4096

  const message = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unerwarteter Antworttyp von Claude')
  }

  // JSON aus Antwort extrahieren
  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Kein valides JSON in Claude-Antwort gefunden')
  }

  const parsed = JSON.parse(jsonMatch[0]) as Omit<AIGenerationResult, 'cost_usd'>

  // Kosten berechnen
  const inputTokens = message.usage.input_tokens
  const outputTokens = message.usage.output_tokens
  const totalTokens = inputTokens + outputTokens

  const costPerMillion = model === 'claude-sonnet-4-6' ? 3.0 : 1.0
  const cost_usd = (totalTokens / 1_000_000) * costPerMillion

  return {
    ...parsed,
    ai_model: model,
    tokens_used: totalTokens,
    cost_usd,
  }
}
