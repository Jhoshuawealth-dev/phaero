import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const VALID_CODES = { PHAERO20: 20, WELCOME20: 20 }

export default function CouponInput({ onApply }) {
  const { theme } = useTheme()
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState(null)
  const [error, setError] = useState('')

  const handleApply = () => {
    const upper = code.trim().toUpperCase()
    if (VALID_CODES[upper]) {
      setApplied({ code: upper, discount: VALID_CODES[upper] })
      setError('')
      onApply && onApply(VALID_CODES[upper])
    } else {
      setError('Invalid or expired code')
      setApplied(null)
      onApply && onApply(0)
    }
  }

  const handleRemove = () => {
    setApplied(null)
    setCode('')
    setError('')
    onApply && onApply(0)
  }

  return (
    <div>
      <label style={{ fontSize: '12px', color: theme.textFaint, fontWeight: '600', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>PROMO CODE</label>
      {applied ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a1a0a', border: '1px solid #25D36644', borderRadius: '8px', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#25D366' }}>✓</span>
            <span style={{ color: theme.text, fontSize: '13px', fontWeight: '700' }}>{applied.code}</span>
            <span style={{ color: '#25D366', fontSize: '13px' }}>— {applied.discount}% off applied</span>
          </div>
          <button onClick={handleRemove} style={{ background: 'none', border: 'none', color: theme.textFaint, cursor: 'pointer', fontSize: '13px' }}>Remove</button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleApply()} placeholder="Enter code (try PHAERO20)" className="input-gold" style={{ flex: 1, background: theme.inputBg, border: `1px solid ${error ? '#ff4444' : theme.border}`, color: theme.text, padding: '12px 14px', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            <button onClick={handleApply} style={{ background: theme.bgSecondary, color: theme.text, border: `1px solid ${theme.border}`, padding: '12px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>Apply</button>
          </div>
          {error && <p style={{ color: '#ff6666', fontSize: '12px', marginTop: '6px' }}>{error}</p>}
        </div>
      )}
    </div>
  )
}
