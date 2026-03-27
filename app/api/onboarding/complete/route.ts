import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(_req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const admin = createAdminClient()

    const { error: updateError } = await admin
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', user.id)

    if (updateError) {
      console.error('[/api/onboarding/complete] update error:', updateError)
      return NextResponse.json({ error: 'Failed to update onboarding status' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/onboarding/complete]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
