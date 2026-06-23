import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../assets/logo.png'
import PageLoader from '../components/PageLoader'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, signInWithGitHub } = useAuth()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    setError('')
    if (!email || !password) {
      setError('Please enter your email and password')
      return
    }
    setLoading(true)
    const { error: loginError } = await signIn(email, password)
    setLoading(false)

    if (loginError) {
      setError(loginError.message)
      return
    }
    navigate(redirect)
  }

  const handleGitHub = async () => {
    setLoading(true)
    await signInWithGitHub()
  }

  if (loading) return <PageLoader text="SIGNING YOU IN..." />

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', backgroundImage: 'radial-gradient(circle at 1px 1px, #D4AF3706 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src={logo} alt="Phaero" onClick={() => navigate('/')} style={{ height: '72px', width: 'auto', cursor: 'pointer', marginBottom: '8px', filter: 'drop-shadow(0 0 20px #D4AF3744)' }} />
          <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>Welcome back</h1>
          <p style={{ color: '#555', fontSize: '14px' }}>Sign in to continue building.</p>
        </div>

        {error && (
          <div style={{ background: '#1a0a0a', border: '1px solid #ff444444', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px', color: '#ff6666', fontSize: '13px' }}>{error}</div>
        )}

        <button onClick={handleGitHub} style={{ width: '100%', background: '#111', border: '1px solid #222', color: '#fff', padding: '13px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4AF3766'; e.currentTarget.style.background = '#1a1a0a' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.background = '#111' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
          Continue with GitHub
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: '#1a1a1a' }} />
          <span style={{ color: '#333', fontSize: '12px' }}>or continue with email</span>
          <div style={{ flex: 1, height: '1px', background: '#1a1a1a' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <input placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-gold" style={{ background: '#111', border: '1px solid #1e1e1e', color: '#fff', padding: '13px 16px', borderRadius: '8px', fontSize: '14px', width: '100%', boxSizing: 'border-box' }} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} className="input-gold" style={{ background: '#111', border: '1px solid #1e1e1e', color: '#fff', padding: '13px 16px', borderRadius: '8px', fontSize: '14px', width: '100%', boxSizing: 'border-box' }} />
        </div>

        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <span onClick={() => navigate('/forgot-password')} style={{ color: '#D4AF37', fontSize: '13px', cursor: 'pointer' }}>Forgot password?</span>
        </div>

        <button onClick={handleLogin} className="btn-gold" style={{ width: '100%', padding: '13px', borderRadius: '8px', fontSize: '15px', marginBottom: '20px' }}>Sign In →</button>

        <p style={{ textAlign: 'center', color: '#444', fontSize: '14px' }}>
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} style={{ background: 'none', border: 'none', color: '#D4AF37', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Register free</button>
        </p>
      </div>
    </div>
  )
}
