import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })

  const projectId = req.nextUrl.searchParams.get('projectId')
  if (!projectId) return NextResponse.json({ error: 'projectId fehlt' }, { status: 400 })

  const admin = createAdminClient()
  const { data: project } = await admin
    .from('projects')
    .select('id, status, summary, controls_info, lua_output, name')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (!project) return NextResponse.json({ error: 'Projekt nicht gefunden' }, { status: 404 })

  // Wenn fertig: auch Generation-Steps laden
  let steps = null
  if (project.status === 'done') {
    const { data: gen } = await admin
      .from('generations')
      .select('steps_json, tokens_used, ai_model')
      .eq('project_id', projectId)
      .single()
    steps = gen?.steps_json ?? null
  }

  return NextResponse.json({
    status: project.status,
    name: project.name,
    summary: project.summary,
    controls: project.controls_info,
    luaOutput: project.lua_output,
    steps,
  })
}
