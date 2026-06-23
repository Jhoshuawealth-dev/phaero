import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getProjects } from '../../lib/projects'

export default function DomainSettings() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [projects, setProjects] = useState([])
  const isLocked = profile?.plan === 'free' || !profile?.plan

  useEffect(() => {
    if (user) getProjects(user.id).then(({ data }) => setProjects(data || []))
  }, [user])

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>Domains</h1>
      <p style={{ color: '#555', fontSize: '13px', marginBottom: '32px' }}>Manage subdomains and custom domains for your projects.</p>

      {isLocked && (
        <div style={{ background: '#1a1a0a', border: '1px solid #D4AF3733', borderRadius: '10px', padding: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <p style={{ color: '#D4AF37', fontSize: '13px', flex: 1 }}>Custom domains are available on Starter and Elite plans.</p>
          <button onClick={() => navigate('/pricing')} className="btn-gold" style={{ padding: '9px 18px', borderRadius: '8px', fontSize: '13px' }}>Upgrade →</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {projects.map(p => (
          <div key={p.id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '2px' }}>{p.name}</div>
              <div style={{ fontSize: '12px', color: '#555' }}>{p.subdomain}</div>
            </div>
            <button disabled={isLocked} style={{ background: 'transparent', color: isLocked ? '#444' : '#D4AF37', border: `1px solid ${isLocked ? '#222' : '#D4AF3766'}`, padding: '7px 14px', borderRadius: '6px', fontSize: '12px', cursor: isLocked ? 'not-allowed' : 'pointer' }}>
              {isLocked ? '🔒 Add Domain' : '+ Add Domain'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
