import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

// ============================================================
// ACHIEVEMENT DEFINITIONS
// ============================================================
const ACHIEVEMENT_IDS = [
  'first_script',
  'first_game',
  'first_fix',
  'script_master_10',
  'game_builder_5',
  'fixer_upper',
  'speed_demon',
  'night_owl',
  'early_adopter',
  'social_butterfly',
  'referral_king',
  'streak_7',
  'streak_30',
  'api_pioneer',
  'power_user',
] as const

type AchievementId = typeof ACHIEVEMENT_IDS[number]

// Maps event names to the achievement IDs they can unlock
const EVENT_ACHIEVEMENT_MAP: Record<string, AchievementId[]> = {
  first_generation:   ['first_script', 'first_game', 'power_user'],
  script_generated:   ['first_script', 'script_master_10', 'speed_demon', 'night_owl', 'power_user'],
  game_created:       ['first_game', 'game_builder_5', 'power_user'],
  fix_applied:        ['first_fix', 'fixer_upper', 'power_user'],
  social_connected:   ['social_butterfly'],
  referral_made:      ['referral_king'],
  streak_updated:     ['streak_7', 'streak_30'],
  api_used:           ['api_pioneer'],
  account_created:    ['early_adopter'],
}

// ============================================================
// CONDITIONS: given user stats, which achievements are earned?
// ============================================================
interface UserStats {
  script_count: number
  game_count: number
  fix_count: number
  streak_days: number
  social_credits_claimed: string[]
  referral_credits_earned: number
  api_calls: number
  created_at: string
}

function evaluateAchievements(
  event: string,
  stats: UserStats,
  alreadyEarned: string[]
): AchievementId[] {
  const candidates = EVENT_ACHIEVEMENT_MAP[event] ?? []
  const newlyEarned: AchievementId[] = []

  const check = (id: AchievementId, condition: boolean) => {
    if (candidates.includes(id) && condition && !alreadyEarned.includes(id)) {
      newlyEarned.push(id)
    }
  }

  const createdAt = new Date(stats.created_at)
  const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  const hour = new Date().getHours()

  check('first_script',      stats.script_count >= 1)
  check('first_game',        stats.game_count >= 1)
  check('first_fix',         stats.fix_count >= 1)
  check('script_master_10',  stats.script_count >= 10)
  check('game_builder_5',    stats.game_count >= 5)
  check('fixer_upper',       stats.fix_count >= 5)
  check('speed_demon',       stats.script_count >= 3)    // proxy: 3+ scripts
  check('night_owl',         hour >= 0 && hour < 5)      // between midnight and 5am
  check('early_adopter',     daysSinceCreation <= 30)    // joined in first 30 days
  check('social_butterfly',  (stats.social_credits_claimed?.length ?? 0) >= 3)
  check('referral_king',     (stats.referral_credits_earned ?? 0) >= 25)
  check('streak_7',          stats.streak_days >= 7)
  check('streak_30',         stats.streak_days >= 30)
  check('api_pioneer',       (stats.api_calls ?? 0) >= 1)
  check('power_user',        stats.script_count + stats.game_count + stats.fix_count >= 20)

  return newlyEarned
}

// ============================================================
// ROUTE HANDLER
// ============================================================
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await req.json()
    const { event } = body

    if (!event || typeof event !== 'string') {
      return NextResponse.json({ error: 'event is required' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Fetch user profile stats
    const { data: profile } = await admin
      .from('profiles')
      .select('credits, purchased_credits, streak_days, social_credits_claimed, referral_credits_earned, created_at')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Fetch usage counts from credit_transactions
    const { data: transactions } = await admin
      .from('credit_transactions')
      .select('description, type')
      .eq('user_id', user.id)
      .eq('type', 'usage')

    const txList = transactions ?? []
    const scriptCount = txList.filter((t: { description: string | null }) =>
      t.description?.toLowerCase().includes('script') || t.description?.toLowerCase().includes('skript')
    ).length
    const gameCount = txList.filter((t: { description: string | null }) =>
      t.description?.toLowerCase().includes('spiel') || t.description?.toLowerCase().includes('game')
    ).length
    const fixCount = txList.filter((t: { description: string | null }) =>
      t.description?.toLowerCase().includes('fix')
    ).length

    // Fetch API usage count
    const { count: apiCallCount } = await admin
      .from('credit_transactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .ilike('description', '%api%')

    // Fetch already earned achievements
    const { data: earnedRows } = await admin
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', user.id)

    const alreadyEarned = (earnedRows ?? []).map((r: { achievement_id: string }) => r.achievement_id)

    const stats: UserStats = {
      script_count: scriptCount,
      game_count: gameCount,
      fix_count: fixCount,
      streak_days: profile.streak_days ?? 0,
      social_credits_claimed: profile.social_credits_claimed ?? [],
      referral_credits_earned: profile.referral_credits_earned ?? 0,
      api_calls: apiCallCount ?? 0,
      created_at: profile.created_at,
    }

    const newAchievements = evaluateAchievements(event, stats, alreadyEarned)

    if (newAchievements.length > 0) {
      const inserts = newAchievements.map((id) => ({
        user_id: user.id,
        achievement_id: id,
        earned_at: new Date().toISOString(),
      }))
      await admin.from('user_achievements').insert(inserts)
    }

    return NextResponse.json({ new_achievements: newAchievements })
  } catch (err) {
    console.error('[/api/achievements/check]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
