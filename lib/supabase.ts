import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// ============================================================
// TYPEN
// ============================================================
export type Plan = 'free' | 'starter' | 'pro' | 'enterprise'
export type Quality = 'standard' | 'highend'
export type ProjectStatus = 'pending' | 'generating' | 'done' | 'error'
export type TransactionType = 'purchase' | 'usage' | 'monthly_reset' | 'bonus'

export interface Profile {
  id: string
  email: string
  plan: Plan
  credits: number
  stripe_customer_id: string | null
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  prompt: string
  game_type: string
  quality: Quality
  status: ProjectStatus
  lua_output: string | null
  summary: string | null
  controls_info: string | null
  is_public: boolean
  created_at: string
}

export interface Generation {
  id: string
  project_id: string
  steps_json: GenerationStep[] | null
  tokens_used: number | null
  cost_usd: number | null
  ai_model: string | null
  created_at: string
}

export interface GenerationStep {
  id: number
  name: string
  status: 'pending' | 'running' | 'done' | 'error'
  lua: string
}

export interface CreditTransaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  balance_after: number
  description: string | null
  stripe_payment_id: string | null
  created_at: string
}

export interface PluginSession {
  id: string
  user_id: string
  session_token: string
  last_ping: string
  expires_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: { id: string; email: string; plan?: string; credits?: number; stripe_customer_id?: string | null }
        Update: Partial<Profile>
        Relationships: []
      }
      projects: {
        Row: Project
        Insert: { user_id: string; name: string; prompt: string; game_type?: string; quality?: string; status?: string; lua_output?: string | null; summary?: string | null; controls_info?: string | null; is_public?: boolean }
        Update: Partial<Project>
        Relationships: []
      }
      generations: {
        Row: Generation
        Insert: { project_id: string; steps_json?: unknown; tokens_used?: number | null; cost_usd?: number | null; ai_model?: string | null }
        Update: Partial<Generation>
        Relationships: []
      }
      credit_transactions: {
        Row: CreditTransaction
        Insert: { user_id: string; type: string; amount: number; balance_after: number; description?: string | null; stripe_payment_id?: string | null }
        Update: Partial<CreditTransaction>
        Relationships: []
      }
      plugin_sessions: {
        Row: PluginSession
        Insert: { user_id: string; session_token: string; last_ping?: string; expires_at?: string }
        Update: Partial<PluginSession>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// ============================================================
// BROWSER CLIENT (Client Components)
// ============================================================
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ============================================================
// ADMIN CLIENT (Service Role — nur server-seitig!)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// ============================================================
export function createAdminClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  ) as any
}
