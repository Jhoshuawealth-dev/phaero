import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useToast } from './ToastManager'
import { updateProject } from '../lib/projects'
import { pushToGitHub } from '../lib/github'
import { useAuth } from '../context/AuthContext'

export default function GitHubModal({ onClose, project, onUpdate, canvasBlocks }) {
  const { theme } = useTheme()
  const { connectGitHubRepo } = useAuth()
  const addToast = useToast()
  const [pushing, setPushing] = useState(false)

  const isConnected = !!project?.github_connected
  const hasToken = !!sessionStorage.getItem('gh_provider_token')

  const timeAgo = (dateStr) => {
    if (!dateStr) return 'never'
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins} min ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return new Date(dateStr).toLocaleDateString()
  }

  const handleConnect = async () => {
    const proceed = window.confirm('Connect your GitHub account to push this project? You\'ll be redirected to GitHub to approve repo access.')
    if (proceed) await connectGitHubRepo('/builder')
  }

  const handlePush = async () => {
    if (!hasToken) {
      handleConnect()
      return
    }
    setPushing(true)
    const result = await pushToGitHub(project?.name || 'Phaero Site', canvasBlocks, project?.github_repo)
    setPushing(false)

    if (result.error) {
      addToast && addToast(`Push failed: ${result.error}`, 'error')
      return
    }

    const { data } = await updateProject(project.id, {
      github_repo: result.repoName,
      github_connected: true,
      github_url: result.repoUrl,
      github_last_pushed_at: new Date().toISOString(),
    })
    if (data) onUpdate && onUpdate(data)
    addToast && addToast('Pushed to GitHub! 🎉', 'success')
  }

  const handleDisconnect = async () => {
    const { data } = await updateProject(project.id, {
      github_repo: null, github_connected: false, github_url: null, github_last_pushed_at: null,
    })
    if (data) onUpdate && onUpdate(data)
    sessionStorage.removeItem('gh_provider_token')
    addToast && addToast('GitHub disconnected', 'info')
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: theme.overlayBg, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', maxWidth: '420px', width: '100%', overflow: 'hidden', animation: 'fadeUp 0.3s ease' }}>

        <div style={{ padding: '24px', borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: theme.text, display: 'flex', alignItems: 'center', gap: '8px' }}>🐙 GitHub</h2>
            <button onClick={onClose} style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.textMuted, width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer' }}>✕</button>
          </div>
          <p style={{ color: theme.textMuted, fontSize: '13px', lineHeight: '1.6' }}>Push your project's code to a GitHub repository to keep a backup or continue building manually.</p>
        </div>

        <div style={{ padding: '24px' }}>
          {isConnected ? (
            <>
              <div style={{ background: '#0a1a0a', border: '1px solid #25D36644', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ color: '#25D366' }}>●</span>
                  <span style={{ color: '#25D366', fontSize: '13px', fontWeight: '700' }}>Connected</span>
                </div>
                <a href={project.github_url} target="_blank" rel="noreferrer" style={{ color: theme.gold, fontSize: '13px', textDecoration: 'none', wordBreak: 'break-all' }}>{project.github_repo}</a>
                <div style={{ fontSize: '12px', color: theme.textFaint, marginTop: '6px' }}>Last pushed {timeAgo(project.github_last_pushed_at)}</div>
              </div>

              <button onClick={handlePush} disabled={pushing} className="btn-gold" style={{ width: '100%', padding: '13px', borderRadius: '8px', fontSize: '14px', marginBottom: '10px' }}>
                {pushing ? 'Pushing...' : '🔄 Push Latest Changes'}
              </button>
              <button onClick={() => window.open(project.github_url, '_blank')} style={{ width: '100%', background: 'transparent', color: theme.text, border: `1px solid ${theme.border}`, padding: '11px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', marginBottom: '10px' }}>
                ↗ View on GitHub
              </button>
              <button onClick={handleDisconnect} style={{ width: '100%', background: 'transparent', color: '#ff6666', border: '1px solid #ff444444', padding: '11px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                Disconnect
              </button>
            </>
          ) : (
            <>
              <div style={{ background: theme.bgSecondary, borderRadius: '10px', padding: '16px', marginBottom: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>📦</div>
                <p style={{ color: theme.textMuted, fontSize: '13px', lineHeight: '1.6' }}>Not connected yet. Push your project to create a real GitHub repository.</p>
              </div>
              <button onClick={handlePush} disabled={pushing} className="btn-gold" style={{ width: '100%', padding: '13px', borderRadius: '8px', fontSize: '14px' }}>
                {pushing ? 'Connecting...' : '🐙 Connect & Push to GitHub'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
