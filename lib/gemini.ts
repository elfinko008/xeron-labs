import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIGenerationResult } from './claude'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

const SYSTEM_PROMPT = `Du bist ein Experte für Roblox-Spielentwicklung mit Lua.
Du generierst vollständige, lauffähige Roblox Studio Lua-Scripts.

WICHTIGE REGELN:
- Gib IMMER valides JSON zurück, niemals anderen Text
- Alle Lua-Scripts müssen sofort in Roblox Studio ausführbar sein
- Verwende game:GetService() für alle Roblox Services
- Erstelle funktionsfähigen, kommentierten Code

AUSGABEFORMAT (NUR dieses JSON, kein anderer Text):
{
  "tasks": [
    { "id": 1, "name": "Script erstellen", "status": "done", "lua": "-- Lua code here" }
  ],
  "summary": "Kurze Beschreibung was erstellt wurde",
  "controls": "Steuerungshinweise",
  "ai_model": "gemini-2.5-flash-lite",
  "tokens_used": 0
}`

export async function generateWithGemini(
  prompt: string,
  gameType: string
): Promise<AIGenerationResult> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite-preview-06-17',
    systemInstruction: SYSTEM_PROMPT,
  })

  const userPrompt = `Erstelle ein Roblox Lua-Script:

Typ: ${gameType}
Beschreibung: ${prompt}

Generiere funktionsfähigen Lua-Code und gib NUR das JSON-Format zurück.`

  const result = await model.generateContent(userPrompt)
  const text = result.response.text()

  // JSON aus Antwort extrahieren
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Kein valides JSON in Gemini-Antwort gefunden')
  }

  const parsed = JSON.parse(jsonMatch[0]) as Omit<AIGenerationResult, 'cost_usd'>

  // Token-Nutzung
  const usage = result.response.usageMetadata
  const totalTokens = (usage?.totalTokenCount ?? 0)

  return {
    ...parsed,
    ai_model: 'gemini-2.5-flash-lite',
    tokens_used: totalTokens,
    cost_usd: 0, // Kostenlos
  }
}
