import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { startActivityTracking, isSessionExpired } from '../lib/sessionTimeout'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && isSessionExpired()) {
        supabase.auth.signOut()
        setUser(null)
        setProfile(null)
        setLoading(false)
        return
      }
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      if (session?.provider_token) {
        sessionStorage.setItem('gh_provider_token', session.provider_token)
      }
      setLoading(false)
    })

    const stopTracking = startActivityTracking(async () => {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      window.location.href = '/login'
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
      if (session?.provider_token) {
        sessionStorage.setItem('gh_provider_token', session.provider_token)
      }
    })

    return () => {
      listener.subscription.unsubscribe()
      stopTracking()
    }
  }, [])

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } }
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signInWithGitHub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin + '/dashboard' }
    })
    return { data, error }
  }

  const connectGitHubRepo = async (returnPath) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        scopes: 'repo',
        redirectTo: window.location.origin + (returnPath || '/builder')
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signInWithGitHub, signOut, connectGitHubRepo, refreshProfile: () => user && fetchProfile(user.id) }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
