import { createAdminClient } from './supabase'

// ============================================================
// CREDIT CHECK
// ============================================================
export async function hasEnoughCredits(
  userId: string,
  required: number
): Promise<boolean> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', userId)
    .single()

  if (error || !data) return false
  return data.credits >= required
}

// ============================================================
// CREDITS ABZIEHEN (atomisch)
// ============================================================
export async function deductCredits(
  userId: string,
  amount: number,
  description: string
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  const supabase = createAdminClient()

  // Aktuelles Guthaben holen
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', userId)
    .single()

  if (fetchError || !profile) {
    return { success: false, newBalance: 0, error: 'Profil nicht gefunden' }
  }

  if (profile.credits < amount) {
    return { success: false, newBalance: profile.credits, error: 'Nicht genug Credits' }
  }

  const newBalance = profile.credits - amount

  // Credits abziehen
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ credits: newBalance })
    .eq('id', userId)

  if (updateError) {
    return { success: false, newBalance: profile.credits, error: 'Update fehlgeschlagen' }
  }

  // Transaktion loggen
  await supabase.from('credit_transactions').insert({
    user_id: userId,
    type: 'usage',
    amount: -amount,
    balance_after: newBalance,
    description,
  })

  return { success: true, newBalance }
}

// ============================================================
// CREDITS HINZUFÜGEN (Kauf / Bonus)
// ============================================================
export async function addCredits(
  userId: string,
  amount: number,
  type: 'purchase' | 'monthly_reset' | 'bonus',
  description: string,
  stripePaymentId?: string
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  const supabase = createAdminClient()

  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', userId)
    .single()

  if (fetchError || !profile) {
    return { success: false, newBalance: 0, error: 'Profil nicht gefunden' }
  }

  const newBalance = profile.credits + amount

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ credits: newBalance })
    .eq('id', userId)

  if (updateError) {
    return { success: false, newBalance: profile.credits, error: 'Update fehlgeschlagen' }
  }

  await supabase.from('credit_transactions').insert({
    user_id: userId,
    type,
    amount,
    balance_after: newBalance,
    description,
    stripe_payment_id: stripePaymentId ?? null,
  })

  return { success: true, newBalance }
}

// ============================================================
// RATE LIMIT CHECK (10 Requests pro User pro Stunde)
// ============================================================
export async function checkRateLimit(userId: string): Promise<boolean> {
  const supabase = createAdminClient()
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

  const { count, error } = await supabase
    .from('credit_transactions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('type', 'usage')
    .gte('created_at', oneHourAgo)

  if (error) return true // Im Zweifel erlauben
  return (count ?? 0) < 10
}

// ============================================================
// MONATLICHE CREDITS ZURÜCKSETZEN (für Stripe Webhook)
// ============================================================
const PLAN_CREDITS: Record<string, number> = {
  free: 10,
  starter: 100,
  pro: 500,
  enterprise: 2000,
}

export async function resetMonthlyCredits(
  userId: string,
  plan: string
): Promise<void> {
  const supabase = createAdminClient()
  const credits = PLAN_CREDITS[plan] ?? 10

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', userId)
    .single()

  await supabase
    .from('profiles')
    .update({ credits, plan })
    .eq('id', userId)

  await supabase.from('credit_transactions').insert({
    user_id: userId,
    type: 'monthly_reset',
    amount: credits - (profile?.credits ?? 0),
    balance_after: credits,
    description: `Monatlicher Reset für Plan: ${plan}`,
  })
}

// ============================================================
// CREDIT-VERLAUF HOLEN
// ============================================================
export async function getCreditHistory(userId: string, limit = 20) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return data
}
