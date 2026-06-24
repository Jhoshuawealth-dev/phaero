import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function TeamSettings() {
  const navigate = useNavigate()
  const { profile, user } = useAuth()
  const isLocked = profile?.plan !== 'elite'

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>Team</h1>
      <p style={{ color: '#555', fontSize: '13px', marginBottom: '32px' }}>Invite teammates to collaborate on your Phaero projects.</p>

      <div style={{ background: '#202024', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700' }}>Members (1)</span>
          <button disabled={isLocked} style={{ background: isLocked ? 'transparent' : 'transparent', color: isLocked ? '#444' : '#D4AF37', border: `1px solid ${isLocked ? '#222' : '#D4AF37'}`, padding: '8px 16px', borderRadius: '6px', fontWeight: '700', cursor: isLocked ? 'not-allowed' : 'pointer', fontSize: '13px' }}>
            {isLocked ? '🔒 Invite' : '+ Invite Member'}
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#1C1C21', borderRadius: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#D4AF3733', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#D4AF37' }}>
            {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: '700' }}>{profile?.full_name || 'You'}</div>
            <div style={{ fontSize: '12px', color: '#555' }}>{user?.email}</div>
          </div>
          <span style={{ fontSize: '11px', color: '#D4AF37', background: '#D4AF3722', padding: '3px 8px', borderRadius: '8px' }}>Owner</span>
        </div>
      </div>

      {isLocked && (
        <div style={{ background: '#1a1a0a', border: '1px solid #D4AF3733', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#D4AF37', marginBottom: '8px' }}>Team collaboration is an Elite feature</div>
          <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px', lineHeight: '1.7' }}>Upgrade to Elite to invite teammates and collaborate on projects together.</p>
          <button onClick={() => navigate('/pricing')} className="btn-gold" style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '13px' }}>View Plans →</button>
        </div>
      )}
    </div>
  )
}
