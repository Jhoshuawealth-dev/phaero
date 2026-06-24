import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    }
  }

  return (
    <div style={{ background: '#16161A', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', backgroundImage: 'radial-gradient(circle at 1px 1px, #D4AF3706 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <img src={logo} alt="Phaero" style={{ height: '72px', width: 'auto', marginBottom: '8px', filter: 'drop-shadow(0 0 20px #D4AF3744)' }} />
          <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>{success ? 'Password updated!' : 'Set a new password'}</h1>
          <p style={{ color: '#555', fontSize: '14px' }}>{success ? 'Redirecting you to your dashboard...' : 'Choose a strong new password for your account.'}</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', fontSize: '40px' }}>✅</div>
        ) : (
          <>
            {error && (
              <div style={{ background: '#1a0a0a', border: '1px solid #ff444444', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px', color: '#ff6666', fontSize: '13px' }}>{error}</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <input value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" type="password" className="input-gold" style={{ background: '#202024', border: '1px solid #1e1e1e', color: '#fff', padding: '13px 16px', borderRadius: '8px', fontSize: '14px', width: '100%', boxSizing: 'border-box' }} />
              <input value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} placeholder="Confirm new password" type="password" className="input-gold" style={{ background: '#202024', border: '1px solid #1e1e1e', color: '#fff', padding: '13px 16px', borderRadius: '8px', fontSize: '14px', width: '100%', boxSizing: 'border-box' }} />
            </div>
            <button onClick={handleSubmit} disabled={loading} className="btn-gold" style={{ width: '100%', padding: '13px', borderRadius: '8px', fontSize: '15px' }}>
              {loading ? 'Updating...' : 'Update Password →'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
