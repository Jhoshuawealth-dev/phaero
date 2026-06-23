import { supabase } from './supabase'

export async function saveVersion(projectId, userId, snapshot, label = null) {
  const { data, error } = await supabase
    .from('project_versions')
    .insert([{ project_id: projectId, user_id: userId, snapshot, label }])
    .select()
    .single()
  return { data, error }
}

export async function getVersions(projectId) {
  const { data, error } = await supabase
    .from('project_versions')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function deleteVersion(id) {
  const { error } = await supabase.from('project_versions').delete().eq('id', id)
  return { error }
}
