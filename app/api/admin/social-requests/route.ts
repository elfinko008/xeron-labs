import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

function validateAdminSecret(req: NextRequest): boolean {
  // Accept from Authorization header (Bearer <secret>) or ?secret= query param
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

export async function GET(req: NextRequest) {
  try {
    if (!validateAdminSecret(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createAdminClient()

    const { data, error } = await admin
      .from('social_credit_requests')
      .select(`
        id,
        user_id,
        platforms,
        status,
        created_at,
        profiles:user_id (
          email,
          plan,
          credits
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[/api/admin/social-requests] fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 })
    }

    return NextResponse.json({ requests: data ?? [] })
  } catch (err) {
    console.error('[/api/admin/social-requests]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
