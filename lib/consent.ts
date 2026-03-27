// ═══════════════════════════════════════════════════════════════
//  XERON ENGINE v7 — Consent Management
//  Handles cookie + purchase withdrawal waivers
// ═══════════════════════════════════════════════════════════════

import { SupabaseClient } from '@supabase/supabase-js'

export async function saveCookieConsents(
  supabase: SupabaseClient,
  userId: string | null,
  prefs: {
    cookie_essential: boolean
    cookie_analytics: boolean
    cookie_marketing: boolean
  },
  meta: { ip?: string; userAgent?: string; pageUrl?: string }
): Promise<void> {
  const entries = [
    { consent_type: 'cookie_essential',  granted: prefs.cookie_essential },
    { consent_type: 'cookie_analytics',  granted: prefs.cookie_analytics },
    { consent_type: 'cookie_marketing',  granted: prefs.cookie_marketing },
  ]

  for (const entry of entries) {
    await supabase.from('user_consents').insert({
      user_id: userId,
      consent_type: entry.consent_type,
      granted: entry.granted,
      ip_address: meta.ip,
      user_agent: meta.userAgent,
      page_url: meta.pageUrl,
    })
  }
}

export async function savePurchaseConsent(
  supabase: SupabaseClient,
  data: {
    userId: string
    productName: string
    amountEur: number
    waiverText: string
    ip?: string
    userAgent?: string
  }
): Promise<string> {
  const { data: consent, error } = await supabase
    .from('purchase_consents')
    .insert({
      user_id: data.userId,
      product_name: data.productName,
      amount_eur: data.amountEur,
      withdrawal_waiver_accepted: true,
      waiver_text: data.waiverText,
      terms_accepted: true,
      ip_address: data.ip,
      user_agent: data.userAgent,
    })
    .select('id')
    .single()

  if (error) throw new Error('Failed to save purchase consent: ' + error.message)
  return consent.id
}

export async function hasWithdrawalWaiver(
  supabase: SupabaseClient,
  userId: string,
  productName: string
): Promise<boolean> {
  const { data } = await supabase
    .from('purchase_consents')
    .select('id')
    .eq('user_id', userId)
    .eq('product_name', productName)
    .eq('withdrawal_waiver_accepted', true)
    .limit(1)

  return (data?.length ?? 0) > 0
}
