import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

async function getSessionUser(req: NextRequest) {
  const token = req.headers.get('x-session-token')
  if (!token) return null
  const admin = createAdminClient()
  const { data: session } = await admin
    .from('plugin_sessions')
    .select('user_id, expires_at')
    .eq('session_token', token)
    .single()
  if (!session || new Date(session.expires_at) < new Date()) return null
  return session.user_id
}

export async function GET(req: NextRequest) {
  const userId = await getSessionUser(req)
  if (!userId) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })

  const projectId = req.nextUrl.searchParams.get('projectId')
  if (!projectId) return NextResponse.json({ error: 'projectId fehlt' }, { status: 400 })

  const admin = createAdminClient()
  const { data: project } = await admin
    .from('projects')
    .select('id, name, status, lua_output, summary, controls_info')
    .eq('id', projectId)
    .eq('user_id', userId)
    .single()

  if (!project) return NextResponse.json({ error: 'Projekt nicht gefunden' }, { status: 404 })
  if (project.status !== 'done') {
    return NextResponse.json({ error: 'Projekt noch nicht fertig', status: project.status }, { status: 409 })
  }

  const { data: gen } = await admin
    .from('generations')
    .select('steps_json')
    .eq('project_id', projectId)
    .single()

  return NextResponse.json({
    projectName: project.name,
    summary: project.summary,
    controls: project.controls_info,
    tasks: gen?.steps_json ?? [],
  })
}
