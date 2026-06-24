import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { supabase } from '../lib/supabase'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }
    setError('')
    setLoading(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin + '/reset-password',
    })
    setLoading(false)
    if (resetError) {
      setError(resetError.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div style={{ background: '#16161A', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', backgroundImage: 'radial-gradient(circle at 1px 1px, #D4AF3706 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <img src={logo} alt="Phaero" onClick={() => navigate('/')} style={{ height: '72px', width: 'auto', cursor: 'pointer', marginBottom: '8px', filter: 'drop-shadow(0 0 20px #D4AF3744)' }} />
          <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>{sent ? 'Check your email' : 'Reset your password'}</h1>
          <p style={{ color: '#555', fontSize: '14px' }}>{sent ? `We sent a reset link to ${email}` : 'Enter your email and we\'ll send you a reset link.'}</p>
        </div>

        {sent ? (
          <div style={{ background: '#0a1a0a', border: '1px solid #25D36644', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📧</div>
            <p style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.7', marginBottom: '20px' }}>Click the link in the email to set a new password. If you don't see it, check your spam folder.</p>
            <button onClick={() => navigate('/login')} style={{ background: 'transparent', color: '#D4AF37', border: '1px solid #D4AF3766', padding: '11px 24px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>Back to Sign In</button>
          </div>
        ) : (
          <>
            {error && (
              <div style={{ background: '#1a0a0a', border: '1px solid #ff444444', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px', color: '#ff6666', fontSize: '13px' }}>{error}</div>
            )}
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Email address"
              type="email"
              className="input-gold"
              style={{ background: '#202024', border: '1px solid #1e1e1e', color: '#fff', padding: '13px 16px', borderRadius: '8px', fontSize: '14px', width: '100%', boxSizing: 'border-box', marginBottom: '20px' }}
            />
            <button onClick={handleSubmit} disabled={loading} className="btn-gold" style={{ width: '100%', padding: '13px', borderRadius: '8px', fontSize: '15px', marginBottom: '20px' }}>
              {loading ? 'Sending...' : 'Send Reset Link →'}
            </button>
            <p style={{ textAlign: 'center', color: '#444', fontSize: '14px' }}>
              Remember your password?{' '}
              <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#D4AF37', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Sign in</button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
