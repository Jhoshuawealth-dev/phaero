import { supabase } from './supabase'

export async function getShowcaseProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, category, color, subdomain, likes_count, created_at, user_id, showcase_category, showcase_description, showcase_show_name, profiles(full_name)')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .eq('show_in_showcase', true)
    .eq('showcase_approved', true)
    .order('likes_count', { ascending: false })
  return { data, error }
}

export async function likeProject(projectId, currentLikes) {
  const { data, error } = await supabase
    .from('projects')
    .update({ likes_count: (currentLikes || 0) + 1 })
    .eq('id', projectId)
    .select()
    .single()
  return { data, error }
}

export async function getPendingSubmissions() {
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, category, color, subdomain, showcase_category, showcase_description, showcase_show_name, showcase_submitted_at, user_id, profiles(full_name, email)')
    .eq('show_in_showcase', true)
    .eq('showcase_approved', false)
    .order('showcase_submitted_at', { ascending: true })
  return { data, error }
}

export async function approveSubmission(projectId) {
  const { data, error } = await supabase
    .from('projects')
    .update({ showcase_approved: true })
    .eq('id', projectId)
    .select()
    .single()
  return { data, error }
}

export async function rejectSubmission(projectId) {
  const { data, error } = await supabase
    .from('projects')
    .update({ show_in_showcase: false, showcase_approved: false })
    .eq('id', projectId)
    .select()
    .single()
  return { data, error }
}
