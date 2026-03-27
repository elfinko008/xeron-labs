import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

const AFFILIATE_COOKIE_NAME = 'xeron_aff'
const COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60 // 30 days

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { affiliate_code } = body

    if (!affiliate_code || typeof affiliate_code !== 'string') {
      return NextResponse.json({ error: 'affiliate_code is required' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Look up affiliate by their stored affiliate_code in profiles
    const { data: affiliate, error } = await admin
      .from('profiles')
      .select('id')
      .eq('affiliate_code', affiliate_code.trim())
      .single()

    if (error || !affiliate) {
      return NextResponse.json({ error: 'Invalid affiliate code' }, { status: 404 })
    }

    const response = NextResponse.json({ success: true })

    response.cookies.set(AFFILIATE_COOKIE_NAME, affiliate_code.trim(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE_SECONDS,
      path: '/',
    })

    return response
  } catch (err) {
    console.error('[/api/affiliate/track]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
