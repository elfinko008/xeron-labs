import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10) // 'YYYY-MM-DD'
}

export async function POST(_req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const admin = createAdminClient()

    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('last_active_date, streak_days')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const today = toDateString(new Date())
    const lastActive: string | null = profile.last_active_date ?? null
    const currentStreak: number = profile.streak_days ?? 0

    let newStreak = currentStreak
    let isNewDay = false

    if (!lastActive) {
      // First activity ever
      newStreak = 1
      isNewDay = true
    } else if (lastActive === today) {
      // Already logged in today — no change
      newStreak = currentStreak
      isNewDay = false
    } else {
      // Compute yesterday's date string
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = toDateString(yesterday)

      if (lastActive === yesterdayStr) {
        // Consecutive day — increment
        newStreak = currentStreak + 1
        isNewDay = true
      } else {
        // Gap — reset streak
        newStreak = 1
        isNewDay = true
      }
    }

    if (isNewDay) {
      const { error: updateError } = await admin
        .from('profiles')
        .update({
          last_active_date: today,
          streak_days: newStreak,
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('[/api/streak/check] update error:', updateError)
        return NextResponse.json({ error: 'Failed to update streak' }, { status: 500 })
      }
    }

    return NextResponse.json({ streak_days: newStreak, is_new_day: isNewDay })
  } catch (err) {
    console.error('[/api/streak/check]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
