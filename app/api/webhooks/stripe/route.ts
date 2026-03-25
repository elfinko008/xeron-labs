import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase'
import { addCredits, resetMonthlyCredits } from '@/lib/credits'
import type Stripe from 'stripe'

const PLAN_FROM_PRICE: Record<string, string> = {
  [process.env.STRIPE_PRICE_STARTER    ?? 'x']: 'starter',
  [process.env.STRIPE_PRICE_PRO        ?? 'x']: 'pro',
  [process.env.STRIPE_PRICE_ENTERPRISE ?? 'x']: 'enterprise',
}

const CREDITS_FROM_PRICE: Record<string, number> = {
  [process.env.STRIPE_CREDIT_MINI    ?? 'x']: 25,
  [process.env.STRIPE_CREDIT_STARTER ?? 'x']: 75,
  [process.env.STRIPE_CREDIT_VALUE   ?? 'x']: 200,
  [process.env.STRIPE_CREDIT_POWER   ?? 'x']: 500,
  [process.env.STRIPE_CREDIT_MEGA    ?? 'x']: 1500,
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'Keine Signatur' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook-Signatur ungültig' }, { status: 400 })
  }

  const admin = createAdminClient()

  try {
    switch (event.type) {
      // ── Einmalkauf (Credits) ──────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId  = session.metadata?.userId
        if (!userId) break

        // Stripe Customer ID speichern
        if (session.customer) {
          await admin
            .from('profiles')
            .update({ stripe_customer_id: session.customer as string })
            .eq('id', userId)
        }

        if (session.mode === 'payment') {
          // Credit-Kauf
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
          for (const item of lineItems.data) {
            const priceId = item.price?.id ?? ''
            const credits = CREDITS_FROM_PRICE[priceId]
            if (credits) {
              await addCredits(
                userId,
                credits,
                'purchase',
                `${credits} Credits gekauft`,
                session.payment_intent as string
              )
            }
          }
        } else if (session.mode === 'subscription') {
          // Abo gestartet → Credits setzen
          const priceId = session.metadata?.priceId ?? ''
          const plan = PLAN_FROM_PRICE[priceId]
          if (plan) {
            await resetMonthlyCredits(userId, plan)
          }
        }
        break
      }

      // ── Abo erneuert ──────────────────────────────────────
      case 'customer.subscription.updated': {
        const sub     = event.data.object as Stripe.Subscription
        const priceId = sub.items.data[0]?.price.id ?? ''
        const plan    = PLAN_FROM_PRICE[priceId]

        if (!plan) break

        // User via Customer ID finden
        const { data: profile } = await admin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', sub.customer as string)
          .single()

        if (profile) {
          await resetMonthlyCredits(profile.id, plan)
        }
        break
      }

      // ── Abo gekündigt ─────────────────────────────────────
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription

        const { data: profile } = await admin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', sub.customer as string)
          .single()

        if (profile) {
          await admin
            .from('profiles')
            .update({ plan: 'free' })
            .eq('id', profile.id)
        }
        break
      }
    }
  } catch (err) {
    console.error('[Stripe Webhook Error]', err)
    return NextResponse.json({ error: 'Verarbeitungsfehler' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
