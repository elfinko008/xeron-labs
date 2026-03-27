import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'

// ============================================================
// CREDIT PACKAGES (price ID → credit amount)
// Keep in sync with webhooks/stripe/route.ts
// ============================================================
const CREDIT_PACKAGES: Record<string, { credits: number; label: string; price_eur: number }> = {
  [process.env.STRIPE_CREDIT_MINI    ?? 'price_mini']:    { credits: 25,   label: '25 Credits',   price_eur: 1.99  },
  [process.env.STRIPE_CREDIT_STARTER ?? 'price_starter']: { credits: 75,   label: '75 Credits',   price_eur: 4.99  },
  [process.env.STRIPE_CREDIT_VALUE   ?? 'price_value']:   { credits: 200,  label: '200 Credits',  price_eur: 9.99  },
  [process.env.STRIPE_CREDIT_POWER   ?? 'price_power']:   { credits: 500,  label: '500 Credits',  price_eur: 19.99 },
  [process.env.STRIPE_CREDIT_MEGA    ?? 'price_mega']:    { credits: 1500, label: '1500 Credits', price_eur: 49.99 },
}

// ============================================================
// ROUTE HANDLER
// ============================================================
export async function POST(req: NextRequest) {
  try {
    // Auth required
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await req.json()
    const {
      price_id,
      success_url,
      cancel_url,
      withdrawal_waiver_accepted,
      waiver_text,
    } = body

    // Validate withdrawal waiver first
    if (!withdrawal_waiver_accepted) {
      return NextResponse.json(
        { error: 'Waiver not accepted' },
        { status: 400 }
      )
    }

    if (!waiver_text || typeof waiver_text !== 'string') {
      return NextResponse.json(
        { error: 'waiver_text is required when waiver is accepted' },
        { status: 400 }
      )
    }

    // Validate price_id
    if (!price_id || typeof price_id !== 'string') {
      return NextResponse.json({ error: 'price_id is required' }, { status: 400 })
    }

    const pkg = CREDIT_PACKAGES[price_id]
    if (!pkg) {
      return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Fetch or create stripe customer
    const { data: profile } = await admin
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Save withdrawal waiver BEFORE creating the Stripe checkout session
    const productName = pkg.label
    const amountEur = pkg.price_eur

    const { data: consentData, error: consentError } = await admin
      .from('purchase_consents')
      .insert({
        user_id: user.id,
        product_name: productName,
        amount_eur: amountEur,
        waiver_text,
        accepted_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (consentError || !consentData) {
      console.error('[/api/credits/purchase] consent insert error:', consentError)
      return NextResponse.json({ error: 'Failed to record withdrawal waiver' }, { status: 500 })
    }

    // Create Stripe Checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      customer: profile.stripe_customer_id ?? undefined,
      customer_email: !profile.stripe_customer_id ? profile.email : undefined,
      metadata: {
        userId: user.id,
        priceId: price_id,
        consent_id: consentData.id,
      },
      success_url: success_url ?? `${baseUrl}/dashboard?purchase=success`,
      cancel_url:  cancel_url  ?? `${baseUrl}/dashboard?purchase=cancelled`,
    })

    return NextResponse.json({
      url: session.url,
      session_id: session.id,
      consent_id: consentData.id,
    })
  } catch (err) {
    console.error('[/api/credits/purchase]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
