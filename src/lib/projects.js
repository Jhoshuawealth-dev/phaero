import { supabase } from './supabase'

export async function getProjects(userId) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  return { data, error }
}

export async function createProject(userId, name, category = 'General') {
  const colors = ['#8B4513', '#2F4F4F', '#1a3a5c', '#1a1a3a', '#3a1a3a', '#1a3a1a']
  const color = colors[Math.floor(Math.random() * colors.length)]
  const subdomain = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.phaero.app'

  const { data, error } = await supabase
    .from('projects')
    .insert([{ user_id: userId, name, category, color, subdomain, status: 'draft' }])
    .select()
    .single()
  return { data, error }
}

export async function updateProject(id, updates) {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  return { error }
}
