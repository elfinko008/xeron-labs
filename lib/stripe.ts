import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

// ============================================================
// ABO-PREISE (Stripe Price IDs — nach Erstellung eintragen)
// ============================================================
export const STRIPE_PRICES = {
  starter:    process.env.STRIPE_PRICE_STARTER    ?? '',
  pro:        process.env.STRIPE_PRICE_PRO        ?? '',
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE ?? '',
}

// ============================================================
// CREDIT-PAKETE (Stripe Price IDs — nach Erstellung eintragen)
// ============================================================
export const CREDIT_PRICES = {
  mini:    { priceId: process.env.STRIPE_CREDIT_MINI    ?? '', credits: 50 },
  starter: { priceId: process.env.STRIPE_CREDIT_STARTER ?? '', credits: 150 },
  value:   { priceId: process.env.STRIPE_CREDIT_VALUE   ?? '', credits: 400 },
  power:   { priceId: process.env.STRIPE_CREDIT_POWER   ?? '', credits: 1000 },
  mega:    { priceId: process.env.STRIPE_CREDIT_MEGA    ?? '', credits: 3000 },
}

// ============================================================
// CHECKOUT SESSION erstellen
// ============================================================
export async function createCheckoutSession(params: {
  userId: string
  email: string
  priceId: string
  mode: 'subscription' | 'payment'
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  const session = await stripe.checkout.sessions.create({
    customer_email: params.email,
    mode: params.mode,
    line_items: [{ price: params.priceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: params.userId,
      ...params.metadata,
    },
    allow_promotion_codes: true,
  })
  return session
}

// ============================================================
// CUSTOMER PORTAL
// ============================================================
export async function createPortalSession(customerId: string, returnUrl: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}
