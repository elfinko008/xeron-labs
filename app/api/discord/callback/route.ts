import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const userId = searchParams.get('state')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://xeron-labs.com'

  if (!code || !userId || userId === 'anonymous') {
    return NextResponse.redirect(`${appUrl}/community?discord=error`)
  }

  try {
    // Discord OAuth Token holen
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${appUrl}/api/discord/callback`,
      }),
    })

    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) {
      return NextResponse.redirect(`${appUrl}/community?discord=error`)
    }

    // Discord User-Info holen
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const discordUser = await userRes.json()

    if (!discordUser.id) {
      return NextResponse.redirect(`${appUrl}/community?discord=error`)
    }

    // Discord ID in Profil speichern
    const supabase = createAdminClient()
    await supabase
      .from('profiles')
      .update({ discord_id: discordUser.id, discord_joined_server: true })
      .eq('id', userId)

    return NextResponse.redirect(`${appUrl}/community?discord=connected`)
  } catch {
    return NextResponse.redirect(`${appUrl}/community?discord=error`)
  }
}
