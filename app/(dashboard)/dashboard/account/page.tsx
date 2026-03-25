import { getServerUser, getServerProfile, createAdminClient } from '@/lib/supabase-server'
import AccountClient from '@/components/dashboard/AccountClient'

export default async function AccountPage() {
  const user = await getServerUser()
  const profile = await getServerProfile()
  if (!user || !profile) return null

  const admin = createAdminClient()
  const { data: transactions } = await admin
    .from('credit_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl mb-2">Account</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Plan, Credits und Einstellungen
        </p>
      </div>
      <AccountClient profile={profile} transactions={transactions ?? []} />
    </div>
  )
}
