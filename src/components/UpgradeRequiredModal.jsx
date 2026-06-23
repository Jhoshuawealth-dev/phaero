import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const actionLabels = {
  module_build: { title: 'Module Build is a paid feature', desc: 'Adding authentication, dashboards, and checkout requires a Starter or Elite plan.' },
  full_mvp_build: { title: 'Full MVP Build is a paid feature', desc: 'Building a complete working app with backend logic requires a Starter or Elite plan.' },
  export_code: { title: 'Export Code is an Elite feature', desc: 'Exporting your full codebase is available on the Elite plan.' },
  custom_domain: { title: 'Custom Domain is a paid feature', desc: 'Connecting your own domain requires a Starter or Elite plan.' },
}

export default function UpgradeRequiredModal({ onClose, actionKey }) {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const info = actionLabels[actionKey] || { title: 'Upgrade required', desc: 'This feature requires a paid plan.' }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: theme.overlayBg, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', maxWidth: '400px', width: '100%', padding: '32px', textAlign: 'center', animation: 'fadeUp 0.3s ease' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: theme.text, marginBottom: '8px' }}>{info.title}</h3>
        <p style={{ color: theme.textMuted, fontSize: '13px', lineHeight: '1.7', marginBottom: '24px' }}>{info.desc} You've already built something great — don't lose momentum now.</p>
        <button onClick={() => navigate('/upgrade?plan=starter')} className="btn-gold" style={{ width: '100%', padding: '13px', borderRadius: '8px', fontSize: '14px', marginBottom: '10px' }}>Upgrade to Continue →</button>
        <button onClick={onClose} style={{ width: '100%', background: 'transparent', color: theme.textFaint, border: `1px solid ${theme.border}`, padding: '11px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Maybe later</button>
      </div>
    </div>
  )
}
