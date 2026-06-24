import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getProjects } from '../../lib/projects'
import { useToast } from '../ToastManager'

export default function GitSettings() {
  const { user, connectGitHubRepo } = useAuth()
  const addToast = useToast()
  const [projects, setProjects] = useState([])
  const [hasToken, setHasToken] = useState(!!sessionStorage.getItem('gh_provider_token'))

  useEffect(() => {
    if (user) getProjects(user.id).then(({ data }) => setProjects((data || []).filter(p => p.github_connected)))
  }, [user])

  const handleConnect = async () => {
    const proceed = window.confirm('Connect your GitHub account? You\'ll be redirected to GitHub to approve repo access.')
    if (proceed) await connectGitHubRepo('/settings')
  }

  const handleDisconnect = () => {
    sessionStorage.removeItem('gh_provider_token')
    setHasToken(false)
    addToast && addToast('GitHub disconnected from this session', 'info')
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>GitHub</h1>
      <p style={{ color: '#555', fontSize: '13px', marginBottom: '32px' }}>Connect your GitHub account to push projects as real repositories.</p>

      <div style={{ background: '#202024', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🐙</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700' }}>GitHub Account</div>
              <div style={{ fontSize: '12px', color: hasToken ? '#25D366' : '#555' }}>{hasToken ? '● Connected' : 'Not connected'}</div>
            </div>
          </div>
          {hasToken ? (
            <button onClick={handleDisconnect} style={{ background: 'transparent', color: '#ff6666', border: '1px solid #ff444466', padding: '9px 18px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>Disconnect</button>
          ) : (
            <button onClick={handleConnect} className="btn-gold" style={{ padding: '9px 18px', borderRadius: '8px', fontSize: '13px' }}>Connect GitHub</button>
          )}
        </div>
        {hasToken && (
          <p style={{ fontSize: '11px', color: '#444', marginTop: '12px', lineHeight: '1.6' }}>To fully revoke access, also remove Phaero from your GitHub account's <a href="https://github.com/settings/applications" target="_blank" rel="noreferrer" style={{ color: '#D4AF37' }}>authorized apps</a>.</p>
        )}
      </div>

      <p style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>Connected Projects</p>
      {projects.length === 0 ? (
        <div style={{ background: '#202024', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '13px' }}>No projects pushed to GitHub yet. Open a project in Builder and click GitHub to push it.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {projects.map(p => (
            <div key={p.id} style={{ background: '#202024', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700' }}>{p.name}</div>
                <a href={p.github_url} target="_blank" rel="noreferrer" style={{ color: '#D4AF37', fontSize: '12px', textDecoration: 'none' }}>{p.github_repo}</a>
              </div>
              <button onClick={() => window.open(p.github_url, '_blank')} style={{ background: 'transparent', color: '#aaa', border: '1px solid #222', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>View ↗</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
