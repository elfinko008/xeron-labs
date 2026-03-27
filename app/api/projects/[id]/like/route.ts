import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const admin = createAdminClient()

    // Check if user already liked this project
    const { data: existingLike } = await admin
      .from('project_likes')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single()

    // Fetch current likes count
    const { data: project, error: projectError } = await admin
      .from('projects')
      .select('likes')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const currentLikes: number = project.likes ?? 0
    let liked: boolean
    let newLikes: number

    if (existingLike) {
      // Unlike — remove the like record and decrement count
      await admin
        .from('project_likes')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', user.id)

      newLikes = Math.max(0, currentLikes - 1)
      liked = false
    } else {
      // Like — insert record and increment count
      await admin.from('project_likes').insert({
        project_id: projectId,
        user_id: user.id,
      })

      newLikes = currentLikes + 1
      liked = true
    }

    // Update the projects.likes counter
    await admin
      .from('projects')
      .update({ likes: newLikes })
      .eq('id', projectId)

    return NextResponse.json({ likes: newLikes, liked })
  } catch (err) {
    console.error('[/api/projects/[id]/like]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
