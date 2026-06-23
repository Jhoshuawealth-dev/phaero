import { supabase } from './supabase'

export async function uploadImage(file, userId) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('project-images')
    .upload(fileName, file)

  if (error) return { url: null, error: error.message }

  const { data: urlData } = supabase.storage
    .from('project-images')
    .getPublicUrl(fileName)

  return { url: urlData.publicUrl, error: null }
}
