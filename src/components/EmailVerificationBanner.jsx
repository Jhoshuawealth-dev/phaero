import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useToast } from './ToastManager'

export default function EmailVerificationBanner() {
  const { user } = useAuth()
  const addToast = useToast()
  const [dismissed, setDismissed] = useState(false)
  const [resending, setResending] = useState(false)

  if (!user || user.email_confirmed_at || dismissed) return null

  const handleResend = async () => {
    setResending(true)
    const { error } = await supabase.auth.resend({ type: 'signup', email: user.email })
    setResending(false)
    if (error) {
      addToast && addToast('Could not resend email, try again later', 'error')
    } else {
      addToast && addToast('Verification email sent!', 'success')
    }
  }

  return (
    <div style={{
      background: '#1a1a0a', borderBottom: '1px solid #D4AF3744', padding: '10px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
      fontSize: '13px', color: '#D4AF37', flexWrap: 'wrap', textAlign: 'center',
    }}>
      <span>📧 Please verify your email ({user.email}) to unlock all features.</span>
      <button onClick={handleResend} disabled={resending} style={{ background: 'transparent', color: '#D4AF37', border: '1px solid #D4AF3766', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
        {resending ? 'Sending...' : 'Resend Email'}
      </button>
      <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '14px' }}>✕</button>
    </div>
  )
}
