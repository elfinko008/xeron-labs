import { getServerUser, createAdminClient } from '@/lib/supabase-server'
import ProjectsGrid from '@/components/dashboard/ProjectsGrid'

export default async function ProjectsPage() {
  const user = await getServerUser()
  if (!user) return null

  const admin = createAdminClient()
  const { data: projects } = await admin
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl mb-2">Meine Projekte</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {projects?.length ?? 0} Projekte insgesamt
        </p>
      </div>
      <ProjectsGrid projects={projects ?? []} />
    </div>
  )
}
