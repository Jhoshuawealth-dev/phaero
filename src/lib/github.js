import { supabase } from './supabase'

export async function pushToGitHub(projectName, blocks, existingRepo = null) {
  const githubToken = sessionStorage.getItem('gh_provider_token')

  if (!githubToken) {
    return { error: 'NEED_CONNECT' }
  }

  const { data, error } = await supabase.functions.invoke('github-push', {
    body: { githubToken, projectName, blocks, existingRepo }
  })

  if (error) return { error: error.message || 'Push failed' }
  if (data?.error) return { error: data.error }

  return { repoUrl: data.repoUrl, repoName: data.repoName }
}
