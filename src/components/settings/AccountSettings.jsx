import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../ToastManager'
import { supabase } from '../../lib/supabase'

export default function AccountSettings() {
  const { profile, user, signOut } = useAuth()
  const addToast = useToast()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', profile.id)
    setSaving(false)
    if (error) addToast && addToast('Failed to save', 'error')
    else addToast && addToast('Account updated!', 'success')
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>Your Account</h1>
      <p style={{ color: '#555', fontSize: '13px', marginBottom: '32px' }}>Manage your personal information and account.</p>

      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#D4AF3733', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700', color: '#D4AF37' }}>
            {fullName ? fullName[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700' }}>{fullName || 'User'}</div>
            <div style={{ fontSize: '12px', color: '#555' }}>{user?.email}</div>
          </div>
        </div>

        <label style={{ fontSize: '12px', color: '#666', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Full Name</label>
        <input value={fullName} onChange={e => setFullName(e.target.value)} className="input-gold" style={{ width: '100%', background: '#0d0d0d', border: '1px solid #222', color: '#fff', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' }} />

        <label style={{ fontSize: '12px', color: '#666', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Email</label>
        <input value={user?.email || ''} disabled style={{ width: '100%', background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#555', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />

        <button onClick={handleSave} disabled={saving} className="btn-gold" style={{ marginTop: '20px', padding: '11px 24px', borderRadius: '8px', fontSize: '13px' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={{ background: '#1a0a0a', border: '1px solid #ff444433', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Sign Out</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Sign out of your Phaero account on this device.</div>
        </div>
        <button onClick={handleSignOut} style={{ background: 'transparent', color: '#ff6666', border: '1px solid #ff444466', padding: '9px 18px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>Sign Out</button>
      </div>
    </div>
  )
}
