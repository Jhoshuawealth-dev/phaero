import { supabase } from './supabase'

export async function chatWithPlanner(messages) {
  const { data, error } = await supabase.functions.invoke('ai-planner', {
    body: { messages }
  })

  if (error) return { text: null, plan: null, error: error.message || 'Failed to reach planner' }
  if (data?.error) return { text: null, plan: null, error: data.error }

  return { text: data.text, plan: data.plan, error: null }
}
