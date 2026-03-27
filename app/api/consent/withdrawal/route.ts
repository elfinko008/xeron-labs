import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await req.json()
    const { product_name, amount_eur, waiver_text } = body

    if (!product_name || typeof product_name !== 'string') {
      return NextResponse.json({ error: 'product_name is required' }, { status: 400 })
    }
    if (typeof amount_eur !== 'number' || amount_eur <= 0) {
      return NextResponse.json({ error: 'amount_eur must be a positive number' }, { status: 400 })
    }
    if (!waiver_text || typeof waiver_text !== 'string') {
      return NextResponse.json({ error: 'waiver_text is required' }, { status: 400 })
    }

    const admin = createAdminClient()

    const { data, error } = await admin
      .from('purchase_consents')
      .insert({
        user_id: user.id,
        product_name,
        amount_eur,
        waiver_text,
        accepted_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error || !data) {
      console.error('[/api/consent/withdrawal] insert error:', error)
      return NextResponse.json({ error: 'Failed to save withdrawal waiver' }, { status: 500 })
    }

    return NextResponse.json({ success: true, consent_id: data.id })
  } catch (err) {
    console.error('[/api/consent/withdrawal]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
