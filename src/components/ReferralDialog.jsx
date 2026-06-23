import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useToast } from './ToastManager'
import { useNavigate } from 'react-router-dom'

export default function ReferralDialog({ onClose }) {
  const { theme } = useTheme()
  const addToast = useToast()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const referralLink = 'phaero.app/invite/JOSHUA20'
  const stats = { signedUp: 11, converted: 8 }

  const handleCopy = () => {
    navigator.clipboard?.writeText(`https://${referralLink}`)
    setCopied(true)
    addToast && addToast('Referral link copied!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: theme.overlayBg, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', maxWidth: '440px', width: '100%', overflow: 'hidden', animation: 'fadeUp 0.3s ease' }}>

        {/* Header art */}
        <div style={{ position: 'relative', padding: '24px', background: `linear-gradient(135deg, ${theme.goldBg}, transparent)`, overflow: 'hidden' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.textMuted, width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>✕</button>

          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, #D4AF3744, transparent 70%)', filter: 'blur(20px)' }} />

          <div style={{ display: 'inline-block', background: theme.goldBg, color: theme.gold, fontSize: '11px', fontWeight: '800', padding: '5px 12px', borderRadius: '20px', marginBottom: '16px', border: `1px solid ${theme.gold}33` }}>👑 EARN 50+ CREDITS</div>

          <h2 style={{ fontSize: '26px', fontWeight: '900', color: theme.text, marginBottom: '4px', letterSpacing: '-0.5px', position: 'relative', zIndex: 1 }}>Spread the love</h2>
          <p style={{ color: theme.textMuted, fontSize: '14px', position: 'relative', zIndex: 1 }}>and earn free credits</p>
        </div>

        {/* How it works */}
        <div style={{ padding: '24px' }}>
          <p style={{ fontSize: '12px', color: theme.textFaint, fontWeight: '700', letterSpacing: '1px', marginBottom: '14px' }}>HOW IT WORKS</p>

          {[
            { icon: '⚡', text: 'Share your invite link', highlight: null },
            { icon: '👑', text: 'They sign up and you get', highlight: '5 credits instantly' },
            { icon: '💬', text: 'You get', highlight: '50 credits', text2: 'once they upgrade to any paid plan' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: theme.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>{item.icon}</div>
              <p style={{ color: theme.textMuted, fontSize: '14px', lineHeight: '1.6', paddingTop: '6px' }}>
                {item.text}{item.highlight && <span style={{ color: theme.text, fontWeight: '700' }}> {item.highlight}</span>}{item.text2 && <span> {item.text2}</span>}
              </p>
            </div>
          ))}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', fontSize: '14px', color: theme.textMuted }}>
            <strong style={{ color: theme.text }}>{stats.signedUp}</strong> signed up, <strong style={{ color: theme.text }}>{stats.converted}</strong> converted 💛
          </div>

          {/* Link box */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <div style={{ flex: 1, background: theme.bgSecondary, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: theme.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ flexShrink: 0 }}>🔗</span> {referralLink}
            </div>
          </div>
          <button onClick={handleCopy} className={!copied ? 'btn-gold' : ''} style={{ width: '100%', padding: '12px', borderRadius: '8px', fontSize: '14px', background: copied ? '#25D366' : undefined, color: copied ? '#fff' : undefined, border: 'none', cursor: 'pointer', fontWeight: '700', transition: 'all 0.3s' }}>
            {copied ? '✓ Link Copied!' : '📋 Copy Link'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <a onClick={() => { onClose(); navigate('/referral-terms') }} style={{ color: theme.textFaint, fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}>View Terms and Conditions</a>
          </div>
        </div>
      </div>
    </div>
  )
}
