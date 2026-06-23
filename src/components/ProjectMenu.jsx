import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import ReferralDialog from './ReferralDialog'
import { RenameModal, MoveToFolderModal, DetailsModal } from './ProjectModals'

export default function ProjectMenu({ onClose, projectName = 'Zara Ankara Boutique', plan = 'Free', onGithubPush, onSupabaseConnect, onToggleCode, githubConnected, supabaseConnected, viewMode }) {
  const navigate = useNavigate()
  const { theme, mode, setMode } = useTheme()
  const [showReferral, setShowReferral] = useState(false)
  const [showAppearance, setShowAppearance] = useState(false)
  const [starred, setStarred] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const [showMove, setShowMove] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [name, setName] = useState(projectName)

  const { profile } = useAuth()
  const credits = profile?.credits ?? 0
  const maxCredits = 10

  const menuItem = (icon, label, onClick, extra) => (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.background = theme.bgCardHover}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '15px', width: '18px', textAlign: 'center' }}>{icon}</span>
        <span style={{ fontSize: '14px', color: theme.text }}>{label}</span>
      </div>
      {extra}
    </div>
  )

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 998 }} />
      <div style={{ position: 'absolute', top: '48px', left: '0', width: '280px', background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '14px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', zIndex: 999, overflow: 'hidden', animation: 'fadeUp 0.2s ease' }}>

        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.border}` }}>
          <div onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '12px', color: theme.textMuted, fontSize: '13px' }}>
            <span>←</span> Go to Dashboard
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: theme.gold, flexShrink: 0 }} />
            <span style={{ fontSize: '14px', color: theme.text, fontWeight: '600', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
            <span style={{ fontSize: '10px', background: theme.bgSecondary, color: theme.textMuted, padding: '2px 8px', borderRadius: '10px', fontWeight: '700', flexShrink: 0 }}>{plan.toUpperCase()}</span>
          </div>
        </div>

        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ background: theme.bgSecondary, borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: theme.textMuted, fontWeight: '600' }}>Credits</span>
              <span onClick={() => navigate('/pricing')} style={{ fontSize: '13px', color: theme.gold, cursor: 'pointer', fontWeight: '700' }}>Upgrade ›</span>
            </div>
            <div style={{ height: '6px', background: theme.border, borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ width: `${(credits / maxCredits) * 100}%`, height: '100%', background: theme.gold, borderRadius: '3px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: theme.textFaint }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: theme.textFaint, display: 'inline-block' }} />
              {credits} of {maxCredits} · Resets tomorrow
            </div>
          </div>
        </div>

        <div style={{ padding: '8px' }}>
          {menuItem('🎁', 'Get free credits', () => setShowReferral(true))}
          <div className="mobile-only-menu-item">
            {menuItem(viewMode === 'code' ? '🖥️' : '💻', viewMode === 'code' ? 'View Preview' : 'View Code', () => { onToggleCode && onToggleCode(); onClose() })}
            {menuItem('🐙', githubConnected ? 'GitHub — Synced' : 'Push to GitHub', () => { onGithubPush && onGithubPush(); onClose() })}
            {menuItem('⚡', supabaseConnected ? 'Supabase — Connected' : 'Connect Supabase', () => { onSupabaseConnect && onSupabaseConnect(); onClose() })}
          </div>
          {menuItem('⚙️', 'Settings', () => { navigate('/dashboard'); onClose() }, <span style={{ fontSize: '11px', color: theme.textFainter }}>⌘.</span>)}
          {menuItem('🔁', 'Remix this project', () => navigate('/onboarding'))}
          {menuItem('✦', 'Open Phaero profile', () => { navigate('/profile'); onClose() })}
          {menuItem('✏️', 'Rename project', () => setShowRename(true))}
          {menuItem(starred ? '⭐' : '☆', starred ? 'Unstar project' : 'Star project', () => setStarred(!starred))}
          {menuItem('📁', 'Move to folder', () => setShowMove(true))}
          {menuItem('ⓘ', 'Details', () => setShowDetails(true))}

          <div style={{ height: '1px', background: theme.border, margin: '6px 8px' }} />

          <div style={{ position: 'relative' }}>
            {menuItem('◐', 'Appearance', () => setShowAppearance(!showAppearance), <span style={{ color: theme.textFaint, fontSize: '12px' }}>›</span>)}
            {showAppearance && (
              <div style={{ padding: '4px 8px 8px 44px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {[{ key: 'dark', label: '🌙 Dark' }, { key: 'light', label: '☀️ Light' }, { key: 'system', label: '💻 System' }].map(opt => (
                  <div key={opt.key} onClick={() => setMode(opt.key)} style={{ padding: '8px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', background: mode === opt.key ? theme.goldBg : 'transparent', color: mode === opt.key ? theme.gold : theme.textMuted, fontWeight: mode === opt.key ? '700' : '400' }}>
                    {opt.label} {mode === opt.key && ' ✓'}
                  </div>
                ))}
              </div>
            )}
          </div>

          {menuItem('❓', 'Help', () => navigate('/contact'))}
        </div>
      </div>

      {showReferral && <ReferralDialog onClose={() => setShowReferral(false)} />}
      {showRename && <RenameModal currentName={name} onClose={() => setShowRename(false)} onSave={setName} />}
      {showMove && <MoveToFolderModal onClose={() => setShowMove(false)} />}
      {showDetails && <DetailsModal onClose={() => setShowDetails(false)} project={{ name, created: 'June 17, 2026', updated: '2 hours ago', credits: 6, pages: 4, url: 'zarankara.phaero.app', status: 'Published' }} />}
    </>
  )
}
