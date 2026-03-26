import { createAdminClient } from './supabase'

// ============================================================
// PLAN-CREDITS
// ============================================================
export const PLAN_CREDITS: Record<string, number> = {
  free:       10,
  starter:    100,
  pro:        500,
  enterprise: 1000,
}

// ============================================================
// FEATURE-TYPEN & CREDIT-KOSTEN
// ============================================================
export type FeatureType =
  | 'script'       // 10 Credits — Gemini Flash-Lite
  | 'small_game'   // 25 Credits — Claude Haiku
  | 'normal_game'  // 50 Credits — Claude Haiku
  | 'highend_game' // 200 Credits — Claude Sonnet
  | 'fix_small'    // 15 Credits — Claude Haiku
  | 'fix_large'    // 50 Credits — Claude Sonnet

export const FEATURE_COSTS: Record<FeatureType, number> = {
  script:       10,
  small_game:   25,
  normal_game:  50,
  highend_game: 200,
  fix_small:    15,
  fix_large:    50,
}

// Features die ein aktives Abo benötigen (nicht mit purchased_credits)
const REQUIRES_SUBSCRIPTION: FeatureType[] = [
  'small_game',
  'normal_game',
  'highend_game',
  'fix_small',
  'fix_large',
]

// ============================================================
// FEATURE FREIGABE PRÜFEN
// ============================================================
export async function canUseFeature(
  userId: string,
  featureType: FeatureType
): Promise<{ allowed: boolean; reason?: string }> {
  const supabase = createAdminClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, credits, purchased_credits')
    .eq('id', userId)
    .single()

  if (!profile) return { allowed: false, reason: 'Profil nicht gefunden' }

  const cost = FEATURE_COSTS[featureType]

  // Spiele benötigen Abo
  if (REQUIRES_SUBSCRIPTION.includes(featureType) && profile.plan === 'free') {
    return {
      allowed: false,
      reason: 'Nur mit Abo verfügbar. Upgrade auf Starter oder höher.',
    }
  }

  // Free-Plan: max 1 Generierung pro Tag
  if (profile.plan === 'free' && featureType === 'script') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count } = await supabase
      .from('credit_transactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('type', 'usage')
      .gte('created_at', today.toISOString())

    if ((count ?? 0) >= 1) {
      return {
        allowed: false,
        reason: 'Tageslimit erreicht. Upgrade auf Starter für mehr Generierungen.',
      }
    }
  }

  // Credits prüfen (Abo-Credits zuerst, dann purchased)
  const totalCredits = (profile.credits ?? 0) + (profile.purchased_credits ?? 0)
  if (totalCredits < cost) {
    return { allowed: false, reason: 'Nicht genug Credits' }
  }

  return { allowed: true }
}

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
    .select('credits, purchased_credits')
    .eq('id', userId)
    .single()

  if (error || !data) return false
  return (data.credits + (data.purchased_credits ?? 0)) >= required
}

// ============================================================
// CREDITS ABZIEHEN (Abo-Credits zuerst, dann purchased)
// ============================================================
export async function deductCredits(
  userId: string,
  amount: number,
  description: string
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  const supabase = createAdminClient()

  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('credits, purchased_credits')
    .eq('id', userId)
    .single()

  if (fetchError || !profile) {
    return { success: false, newBalance: 0, error: 'Profil nicht gefunden' }
  }

  const subCredits = profile.credits ?? 0
  const purchCredits = profile.purchased_credits ?? 0
  const total = subCredits + purchCredits

  if (total < amount) {
    return { success: false, newBalance: total, error: 'Nicht genug Credits' }
  }

  // Abo-Credits zuerst verbrauchen
  let newSubCredits = subCredits
  let newPurchCredits = purchCredits
  let remaining = amount

  if (newSubCredits >= remaining) {
    newSubCredits -= remaining
    remaining = 0
  } else {
    remaining -= newSubCredits
    newSubCredits = 0
    newPurchCredits -= remaining
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ credits: newSubCredits, purchased_credits: newPurchCredits })
    .eq('id', userId)

  if (updateError) {
    return { success: false, newBalance: total, error: 'Update fehlgeschlagen' }
  }

  const newBalance = newSubCredits + newPurchCredits

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
    .select('credits, purchased_credits')
    .eq('id', userId)
    .single()

  if (fetchError || !profile) {
    return { success: false, newBalance: 0, error: 'Profil nicht gefunden' }
  }

  let updateData: Record<string, number> = {}
  let newBalance = 0

  if (type === 'purchase') {
    // Käufe gehen in purchased_credits
    const newPurch = (profile.purchased_credits ?? 0) + amount
    updateData = { purchased_credits: newPurch }
    newBalance = (profile.credits ?? 0) + newPurch
  } else {
    // Bonus/Reset gehen in normale credits
    const newCredits = (profile.credits ?? 0) + amount
    updateData = { credits: newCredits }
    newBalance = newCredits + (profile.purchased_credits ?? 0)
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)

  if (updateError) {
    return { success: false, newBalance: 0, error: 'Update fehlgeschlagen' }
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
// RATE LIMIT — IP-basiert
// ============================================================
export async function checkIpRateLimit(
  ip: string,
  plan: string
): Promise<{ allowed: boolean; reason?: string }> {
  const supabase = createAdminClient()

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const oneDayAgo  = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  // Max 3 Requests pro IP pro Stunde
  const { count: hourCount } = await supabase
    .from('rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .eq('action', 'generate')
    .gte('created_at', oneHourAgo)

  if ((hourCount ?? 0) >= 3) {
    return { allowed: false, reason: 'Zu viele Anfragen. Bitte warte eine Stunde.' }
  }

  // Free-Plan: max 1 Request pro Tag
  if (plan === 'free') {
    const { count: dayCount } = await supabase
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .eq('action', 'generate')
      .gte('created_at', oneDayAgo)

    if ((dayCount ?? 0) >= 1) {
      return { allowed: false, reason: 'Tageslimit erreicht. Upgrade auf Starter für mehr Generierungen.' }
    }
  }

  return { allowed: true }
}

export async function logRateLimitRequest(
  ip: string,
  userId: string,
  action: string
): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from('rate_limits').insert({
    ip_address: ip,
    user_id: userId,
    action,
  })
}

// ============================================================
// MONATLICHE CREDITS ZURÜCKSETZEN
// ============================================================
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
