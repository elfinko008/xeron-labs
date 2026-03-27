import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

const VALID_PLATFORMS = ['tiktok', 'youtube', 'discord', 'instagram', 'x']

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await req.json()
    const { platforms } = body

    if (!Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json({ error: 'platforms array is required' }, { status: 400 })
    }
    if (platforms.length > 5) {
      return NextResponse.json({ error: 'Maximum 5 platforms allowed' }, { status: 400 })
    }

    for (const entry of platforms) {
      if (!entry.platform || !VALID_PLATFORMS.includes(entry.platform.toLowerCase())) {
        return NextResponse.json(
          { error: `Invalid platform: ${entry.platform}. Allowed: ${VALID_PLATFORMS.join(', ')}` },
          { status: 400 }
        )
      }
      if (!entry.username || typeof entry.username !== 'string') {
        return NextResponse.json({ error: 'Each platform entry must have a username' }, { status: 400 })
      }
    }

    const admin = createAdminClient()

    // Fetch already claimed platforms
    const { data: profile } = await admin
      .from('profiles')
      .select('social_credits_claimed')
      .eq('id', user.id)
      .single()

    const alreadyClaimed: string[] = profile?.social_credits_claimed ?? []

    // Filter out already claimed platforms
    const unclaimed = platforms.filter(
      (p: { platform: string; username: string }) =>
        !alreadyClaimed.includes(p.platform.toLowerCase())
    )

    if (unclaimed.length === 0) {
      return NextResponse.json(
        { error: 'All submitted platforms have already been claimed' },
        { status: 400 }
      )
    }

    const { data, error } = await admin
      .from('social_credit_requests')
      .insert({
        user_id: user.id,
        platforms: unclaimed,
        status: 'pending',
      })
      .select('id')
      .single()

    if (error || !data) {
      console.error('[/api/social/request] insert error:', error)
      return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
    }

    return NextResponse.json({ success: true, request_id: data.id })
  } catch (err) {
    console.error('[/api/social/request]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
