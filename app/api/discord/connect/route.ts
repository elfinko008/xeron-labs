import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://xeron-labs.com'
  const clientId = process.env.DISCORD_CLIENT_ID!

  const redirectUri = `${appUrl}/api/discord/callback`
  const scope = 'identify guilds.join'

  // State enthält user ID für späteren Callback
  const state = user?.id ?? 'anonymous'

  const url = new URL('https://discord.com/api/oauth2/authorize')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', scope)
  url.searchParams.set('state', state)

  return NextResponse.redirect(url.toString())
}
