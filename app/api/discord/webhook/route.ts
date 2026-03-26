import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { discord_id, secret } = body

  // Secret prüfen
  if (secret !== process.env.DISCORD_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!discord_id) {
    return NextResponse.json({ error: 'Missing discord_id' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Profil mit dieser Discord ID finden
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, discord_credits_claimed, purchased_credits')
    .eq('discord_id', discord_id)
    .single()

  if (!profile) {
    return NextResponse.json({ message: 'Profile not found' })
  }

  if (profile.discord_credits_claimed) {
    return NextResponse.json({ message: 'Already claimed' })
  }

  const reward = parseInt(process.env.DISCORD_CREDITS_REWARD ?? '10')
  const newPurchased = (profile.purchased_credits ?? 0) + reward

  // Credits vergeben
  await supabase
    .from('profiles')
    .update({
      discord_credits_claimed: true,
      discord_joined_server: true,
      purchased_credits: newPurchased,
    })
    .eq('id', profile.id)

  await supabase.from('credit_transactions').insert({
    user_id: profile.id,
    type: 'bonus',
    amount: reward,
    balance_after: newPurchased,
    description: 'Discord Server beigetreten — Bonus Credits',
  })

  return NextResponse.json({ success: true, credits_added: reward })
}
