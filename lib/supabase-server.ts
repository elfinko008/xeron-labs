import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createAdminClient, type Database, type Profile } from './supabase'

export { createAdminClient } from './supabase'

// ============================================================
// SERVER CLIENT (Server Components, API Routes, Server Actions)
// ============================================================
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Server Component — Cookies können nicht gesetzt werden
          }
        },
      },
    }
  )
}

// ============================================================
// HELPER: Aktuellen User holen (server-seitig)
// ============================================================
export async function getServerUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

// ============================================================
// HELPER: Profil holen (server-seitig)
// ============================================================
export async function getServerProfile(): Promise<Profile | null> {
  const user = await getServerUser()
  if (!user) return null

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return null
  return data
}
