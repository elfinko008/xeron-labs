import { getServerProfile } from '@/lib/supabase-server'
import GenerateForm from '@/components/dashboard/GenerateForm'

export default async function DashboardPage() {
  const profile = await getServerProfile()
  if (!profile) return null

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl mb-2">Spiel generieren</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Beschreibe dein Roblox-Spiel und die KI baut es für dich.
        </p>
      </div>
      <GenerateForm profile={profile} />
    </div>
  )
}
