import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useToast } from './ToastManager'
import { updateProject } from '../lib/projects'

export default function SupabaseConnectModal({ onClose, project, onUpdate }) {
  const { theme } = useTheme()
  const addToast = useToast()
  const [url, setUrl] = useState(project?.supabase_url || '')
  const [key, setKey] = useState(project?.supabase_anon_key || '')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const isConnected = !!project?.supabase_url

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

  const validateUrl = (u) => /^https:\/\/[a-z0-9]+\.supabase\.co\/?$/.test(u.trim())

  const handleTest = async () => {
    if (!validateUrl(url)) {
      setTestResult({ status: 'fail', message: 'URL must look like https://xxxxx.supabase.co' })
      return
    }
    setTesting(true)
    setTestResult(null)
    try {
      const cleanUrl = url.trim().replace(/\/$/, '')
      const res = await fetch(`${cleanUrl}/rest/v1/`, { headers: { apikey: key.trim() } })
      if (res.ok || res.status === 404) {
        setTestResult({ status: 'success', message: 'Connection successful' })
        if (project?.id) {
          const { data } = await updateProject(project.id, { supabase_last_tested_at: new Date().toISOString() })
          if (data) onUpdate && onUpdate(data)
        }
      } else if (res.status === 401 || res.status === 403) {
        setTestResult({ status: 'fail', message: 'Reached the project but the key was rejected — check your anon key' })
      } else {
        setTestResult({ status: 'fail', message: `Unexpected response (status ${res.status})` })
      }
    } catch (e) {
      setTestResult({ status: 'fail', message: 'Could not reach this URL — check it\'s correct and the project is active' })
    }
    setTesting(false)
  }

  const handleSave = async () => {
    if (!validateUrl(url)) {
      addToast && addToast('Enter a valid Supabase Project URL (https://xxxxx.supabase.co)', 'error')
      return
    }
    if (!key.trim() || key.trim().length < 20) {
      addToast && addToast('Enter a valid anon public key', 'error')
      return
    }
    setSaving(true)
    const { data, error } = await updateProject(project.id, {
      supabase_url: url.trim().replace(/\/$/, ''),
      supabase_anon_key: key.trim(),
      supabase_connected: true,
    })
    setSaving(false)
    if (!error) {
      addToast && addToast('Supabase connected! 🎉', 'success')
      onUpdate && onUpdate(data)
      onClose()
    } else {
      addToast && addToast('Failed to save connection', 'error')
    }
  }

  const handleDisconnect = async () => {
    setSaving(true)
    const { data, error } = await updateProject(project.id, {
      supabase_url: null, supabase_anon_key: null, supabase_connected: false, supabase_last_tested_at: null,
    })
    setSaving(false)
    if (!error) {
      addToast && addToast('Supabase disconnected', 'info')
      onUpdate && onUpdate(data)
      setUrl('')
      setKey('')
    }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: theme.overlayBg, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', maxWidth: '440px', width: '100%', overflow: 'hidden', animation: 'fadeUp 0.3s ease' }}>

        <div style={{ padding: '24px', borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px' }}>⚡</span>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: theme.text }}>Connect Supabase</h2>
            </div>
            <button onClick={onClose} style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.textMuted, width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer' }}>✕</button>
          </div>
          <p style={{ color: theme.textMuted, fontSize: '13px', lineHeight: '1.6' }}>
            Give this site its own database, auth, and storage by connecting your own Supabase project.
          </p>
        </div>

        <div style={{ padding: '24px' }}>
          {isConnected && (
            <div style={{ background: '#0a1a0a', border: '1px solid #25D36644', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ color: '#25D366' }}>●</span>
                <span style={{ color: '#25D366', fontSize: '13px', fontWeight: '600' }}>Connected to {project.supabase_url}</span>
              </div>
              <div style={{ fontSize: '11px', color: theme.textFaint }}>Last tested: {timeAgo(project.supabase_last_tested_at)}</div>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: theme.textFaint, fontWeight: '700', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>PROJECT URL</label>
            <input value={url} onChange={e => { setUrl(e.target.value); setTestResult(null) }} placeholder="https://xxxxx.supabase.co" className="input-gold" style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.text, padding: '12px 14px', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: theme.textFaint, fontWeight: '700', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>ANON PUBLIC KEY</label>
            <input value={key} onChange={e => { setKey(e.target.value); setTestResult(null) }} placeholder="eyJhbGciOiJIUzI1NiIs..." type="password" className="input-gold" style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.text, padding: '12px 14px', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
          </div>

          {testResult && (
            <div style={{ marginBottom: '16px', fontSize: '12px', color: testResult.status === 'success' ? '#25D366' : '#ff6666', display: 'flex', alignItems: 'flex-start', gap: '6px', background: testResult.status === 'success' ? '#0a1a0a' : '#1a0a0a', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${testResult.status === 'success' ? '#25D36633' : '#ff444433'}` }}>
              <span>{testResult.status === 'success' ? '✓' : '✕'}</span>
              <span>{testResult.message}</span>
            </div>
          )}

          <button onClick={handleTest} disabled={testing || !url || !key} style={{ width: '100%', background: 'transparent', color: theme.gold, border: `1px solid ${theme.gold}66`, padding: '11px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', marginBottom: '12px' }}>
            {testing ? 'Testing...' : '🔍 Test Connection'}
          </button>

          <button onClick={handleSave} disabled={saving} className="btn-gold" style={{ width: '100%', padding: '13px', borderRadius: '8px', fontSize: '14px', marginBottom: isConnected ? '10px' : '0' }}>
            {saving ? 'Saving...' : isConnected ? 'Update Connection' : 'Connect Supabase'}
          </button>

          {isConnected && (
            <button onClick={handleDisconnect} disabled={saving} style={{ width: '100%', background: 'transparent', color: '#ff6666', border: '1px solid #ff444444', padding: '11px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
              Disconnect
            </button>
          )}

          <div style={{ marginTop: '20px', padding: '14px', background: theme.bgSecondary, borderRadius: '8px' }}>
            <p style={{ fontSize: '11px', color: theme.textFaint, fontWeight: '700', marginBottom: '6px' }}>HOW TO GET THESE</p>
            <p style={{ fontSize: '12px', color: theme.textMuted, lineHeight: '1.7' }}>
              1. Create a free project at supabase.com<br />
              2. Go to Project Settings → API<br />
              3. Copy the Project URL and anon public key
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
