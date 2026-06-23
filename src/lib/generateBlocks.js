import { supabase } from './supabase'

export async function generateBlocksFromPrompt(prompt) {
  const { data, error } = await supabase.functions.invoke('generate-blocks', {
    body: { prompt }
  })

  if (error) return { site: null, error: error.message || 'Generation failed' }
  if (data?.error) return { site: null, error: data.error }

  return { site: data.site, error: null }
}
