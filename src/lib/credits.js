import { supabase } from './supabase'

export async function deductCredits(userId, amount) {
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', userId)
    .single()

  if (fetchError || !profile) return { error: 'Could not fetch credits', newCredits: null }

  if (profile.credits < amount) {
    return { error: 'INSUFFICIENT_CREDITS', newCredits: profile.credits }
  }

  const newCredits = profile.credits - amount
  const { data, error } = await supabase
    .from('profiles')
    .update({ credits: newCredits })
    .eq('id', userId)
    .select()
    .single()

  if (error) return { error: error.message, newCredits: profile.credits }
  return { error: null, newCredits: data.credits }
}
