import { supabase } from './supabase'

export async function askPhaeroAI(prompt, context = '') {
  const { data, error } = await supabase.functions.invoke('ai-builder', {
    body: { prompt, context }
  })

  if (error) {
    return { text: null, error: error.message || 'Something went wrong' }
  }
  if (data?.error) {
    return { text: null, error: data.error }
  }
  return { text: data.text, error: null }
}
