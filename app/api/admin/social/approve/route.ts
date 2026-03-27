import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

function validateAdminSecret(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization')
  const headerSecret = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader ?? undefined

  const querySecret = req.nextUrl.searchParams.get('secret') ?? undefined

  const provided = headerSecret ?? querySecret
  const expected = process.env.ADMIN_SECRET

  if (!expected) {
    console.error('[admin] ADMIN_SECRET env variable is not set')
    return false
  }

  return provided === expected
}

export async function POST(req: NextRequest) {
  try {
    if (!validateAdminSecret(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { request_id, credits_per_platform } = body

    if (!request_id || typeof request_id !== 'string') {
      return NextResponse.json({ error: 'request_id is required' }, { status: 400 })
    }
    if (typeof credits_per_platform !== 'number' || credits_per_platform <= 0) {
      return NextResponse.json({ error: 'credits_per_platform must be a positive number' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Fetch the request
    const { data: request, error: fetchError } = await admin
      .from('social_credit_requests')
      .select('id, user_id, platforms, status')
      .eq('id', request_id)
      .single()

    if (fetchError || !request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }
    if (request.status !== 'pending') {
      return NextResponse.json({ error: 'Request is not pending' }, { status: 400 })
    }

    const platforms: Array<{ platform: string; username: string }> = request.platforms ?? []

    // Fetch current profile to compute new balances
    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('credits, purchased_credits, social_credits_claimed')
      .eq('id', request.user_id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    const platformNames = platforms.map((p) => p.platform.toLowerCase())
    const alreadyClaimed: string[] = profile.social_credits_claimed ?? []
    const newClaims = platformNames.filter((p) => !alreadyClaimed.includes(p))

    if (newClaims.length === 0) {
      // Mark approved but nothing to credit
      await admin
        .from('social_credit_requests')
        .update({ status: 'approved' })
        .eq('id', request_id)

      return NextResponse.json({ success: true })
    }

    const totalCredits = newClaims.length * credits_per_platform
    const newPurchased = (profile.purchased_credits ?? 0) + totalCredits
    const newBalance = (profile.credits ?? 0) + newPurchased
    const updatedClaimed = [...alreadyClaimed, ...newClaims]

    // Update profile credits and claimed platforms
    const { error: updateError } = await admin
      .from('profiles')
      .update({
        purchased_credits: newPurchased,
        social_credits_claimed: updatedClaimed,
      })
      .eq('id', request.user_id)

    if (updateError) {
      console.error('[/api/admin/social/approve] profile update error:', updateError)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    // Insert one credit_transaction per platform
    const transactions = newClaims.map((platform) => ({
      user_id: request.user_id,
      type: 'bonus',
      amount: credits_per_platform,
      balance_after: newBalance,
      description: `Social credit: ${platform}`,
    }))

    await admin.from('credit_transactions').insert(transactions)

    // Update request status to approved
    await admin
      .from('social_credit_requests')
      .update({ status: 'approved' })
      .eq('id', request_id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/admin/social/approve]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
