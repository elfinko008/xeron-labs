// ============================================================
// XERON PLATFORM ROUTER — Part 3
// Routes each platform to the correct AI model + credit costs
// ============================================================

export type PlatformKey = 'roblox' | 'unity' | 'godot' | 'unreal' | 'mobile'
export type GenerationMode = 'game' | 'script' | 'ui' | 'fix' | 'clean' | 'diagnose' | 'chat' | 'shader' | 'blueprint' | 'component' | 'scene' | 'mobile_ui'

export interface PlatformConfig {
  name: string
  outputLanguage: string
  fileExtension: string
  systemPrompt: string
  creditCosts: Partial<Record<GenerationMode, number>>
  models: {
    free: string | null
    starter: string | null
    pro: string | null
    enterprise: string | null
  }
  planRequired?: string // minimum plan required to use this platform
}

export const PLATFORM_CONFIG: Record<PlatformKey, PlatformConfig> = {
  roblox: {
    name: 'Roblox Studio',
    outputLanguage: 'lua',
    fileExtension: '.lua',
    systemPrompt: `You are an expert Roblox Lua developer.
Generate production-ready Lua scripts for Roblox Studio.
Use proper Roblox APIs: game, workspace, Players, RunService, TweenService, etc.
Always wrap critical code in pcall for error handling.
Use ModuleScripts, LocalScripts, and Scripts appropriately.
Follow Roblox best practices: remote events for client-server communication, datastores for persistence.
Output ONLY the Lua code without markdown code blocks unless showing multiple files.`,
    creditCosts: {
      game: 50,
      script: 10,
      ui: 10,
      fix: 15,
      clean: 10,
      diagnose: 5,
      chat: 2,
    },
    models: {
      free: 'gemini-2.5-flash-lite',
      starter: 'gemini-2.5-flash',
      pro: 'claude-haiku-4-5-20251001',
      enterprise: 'claude-sonnet-4-6',
    },
  },

  unity: {
    name: 'Unity Engine',
    outputLanguage: 'csharp',
    fileExtension: '.cs',
    systemPrompt: `You are an expert Unity C# developer.
Generate production-ready C# scripts for Unity 6.
Use proper Unity APIs: MonoBehaviour, Update, Start, Awake, OnEnable, etc.
Follow Unity best practices: object pooling, coroutines, ScriptableObjects.
Always include using statements at the top. Namespace: XeronGenerated.
Use [SerializeField] for inspector-exposed fields. Avoid FindObjectOfType in Update loops.
Output ONLY the C# code without markdown code blocks unless showing multiple files.`,
    creditCosts: {
      game: 75,
      script: 10,
      component: 10,
      ui: 10,
      fix: 15,
      clean: 10,
      diagnose: 5,
      shader: 20,
      chat: 2,
    },
    models: {
      free: 'gemini-2.5-flash-lite',
      starter: 'gemini-2.5-flash',
      pro: 'claude-haiku-4-5-20251001',
      enterprise: 'claude-sonnet-4-6',
    },
  },

  godot: {
    name: 'Godot Engine',
    outputLanguage: 'gdscript',
    fileExtension: '.gd',
    systemPrompt: `You are an expert Godot GDScript developer.
Generate production-ready GDScript for Godot 4.
Use proper Godot 4 APIs: Node, @export, signals, await, get_tree(), etc.
Follow Godot patterns: get_node(), $NodeName syntax, connect() for signals.
Use typed variables where possible. Handle null checks.
Output ONLY the GDScript code without markdown code blocks unless showing multiple files.`,
    creditCosts: {
      game: 60,
      script: 10,
      scene: 15,
      ui: 10,
      fix: 15,
      clean: 10,
      diagnose: 5,
      shader: 20,
      chat: 2,
    },
    models: {
      free: 'gemini-2.5-flash-lite',
      starter: 'gemini-2.5-flash',
      pro: 'claude-haiku-4-5-20251001',
      enterprise: 'claude-sonnet-4-6',
    },
  },

  unreal: {
    name: 'Unreal Engine 5',
    outputLanguage: 'cpp',
    fileExtension: '.cpp',
    systemPrompt: `You are an expert Unreal Engine 5 C++ developer.
Generate production-ready UE5 C++ code.
Use proper UE5 macros: UCLASS, UPROPERTY, UFUNCTION, GENERATED_BODY.
Always provide BOTH the .h header file AND the .cpp implementation file.
Use TObjectPtr for UObject references. Follow UE5 naming conventions (A for Actors, U for UObjects).
Include all necessary #include statements. Describe Blueprint setup when relevant.
Output both files clearly labeled with filename headers.`,
    creditCosts: {
      game: 150,
      script: 20,
      component: 20,
      ui: 20,
      fix: 25,
      clean: 15,
      diagnose: 10,
      blueprint: 30,
      shader: 30,
      chat: 3,
    },
    models: {
      free: null,    // Unreal: Pro+ only
      starter: null,
      pro: 'claude-sonnet-4-6',
      enterprise: 'claude-sonnet-4-6',
    },
    planRequired: 'pro',
  },

  mobile: {
    name: 'Mobile (Unity)',
    outputLanguage: 'csharp',
    fileExtension: '.cs',
    systemPrompt: `You are an expert Unity mobile developer.
Generate C# optimized for iOS and Android with Unity.
Use touch controls, Screen.safeArea, mobile performance patterns.
Avoid heavy physics calculations, optimize draw calls, use object pooling.
Handle different screen sizes with Canvas Scaler. Support both portrait and landscape.
Always include using statements. Namespace: XeronMobile.
Output ONLY the C# code without markdown code blocks unless showing multiple files.`,
    creditCosts: {
      game: 80,
      script: 10,
      ui: 15,
      component: 10,
      fix: 15,
      clean: 10,
      diagnose: 5,
      chat: 2,
    },
    models: {
      free: 'gemini-2.5-flash-lite',
      starter: 'gemini-2.5-flash',
      pro: 'claude-haiku-4-5-20251001',
      enterprise: 'claude-sonnet-4-6',
    },
  },
}

// ── Helper: get credit cost for a mode on a platform ──────────────────────
export function getPlatformCreditCost(platform: PlatformKey, mode: GenerationMode): number {
  const costs = PLATFORM_CONFIG[platform]?.creditCosts
  return costs?.[mode] ?? 10
}

// ── Helper: get AI model for a plan on a platform ─────────────────────────
export function getPlatformModel(platform: PlatformKey, plan: string): string | null {
  const models = PLATFORM_CONFIG[platform]?.models
  if (!models) return null
  return models[plan as keyof typeof models] ?? null
}

// ── Helper: check if a plan can use a platform ────────────────────────────
export function canUsePlatform(platform: PlatformKey, plan: string): boolean {
  const model = getPlatformModel(platform, plan)
  return model !== null
}

// ── Helper: get output language label ─────────────────────────────────────
export function getLanguageLabel(platform: PlatformKey): string {
  const lang = PLATFORM_CONFIG[platform]?.outputLanguage
  const labels: Record<string, string> = {
    lua: 'Lua 5.1',
    csharp: 'C#',
    gdscript: 'GDScript',
    cpp: 'C++ / UE5',
  }
  return labels[lang] ?? lang
}

// ── All platform keys in display order ────────────────────────────────────
export const PLATFORM_ORDER: PlatformKey[] = ['roblox', 'unity', 'godot', 'unreal', 'mobile']

// ── Platform display info (icons, colors) ─────────────────────────────────
export const PLATFORM_META: Record<PlatformKey, { emoji: string; color: string; bgColor: string }> = {
  roblox:  { emoji: '🟥', color: '#E74C3C', bgColor: 'rgba(231,76,60,0.10)' },
  unity:   { emoji: '⬛', color: '#C0C0C0', bgColor: 'rgba(192,192,192,0.10)' },
  godot:   { emoji: '🔵', color: '#478CBF', bgColor: 'rgba(71,140,191,0.10)' },
  unreal:  { emoji: '🔷', color: '#0080FF', bgColor: 'rgba(0,128,255,0.10)' },
  mobile:  { emoji: '📱', color: '#27AE60', bgColor: 'rgba(39,174,96,0.10)' },
}
