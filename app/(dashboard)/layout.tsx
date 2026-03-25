import { redirect } from 'next/navigation'
import { getServerUser, getServerProfile } from '@/lib/supabase-server'
import DashboardSidebar from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getServerUser()
  if (!user) redirect('/login')

  const profile = await getServerProfile()
  if (!profile) redirect('/login')

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar profile={profile} />
      <main className="flex-1 overflow-auto" style={{ background: 'var(--bg-primary)' }}>
        {children}
      </main>
    </div>
  )
}
