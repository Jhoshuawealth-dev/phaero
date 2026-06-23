import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const options = [
  { key: 'light', icon: (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg> },
  { key: 'dark', icon: (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg> },
  { key: 'system', icon: (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
]

export default function ThemeToggle({ position = 'fixed' }) {
  const { mode, setMode, theme } = useTheme()
  const [hover, setHover] = useState(null)

  return (
    <div style={{
      position,
      top: position === 'fixed' ? '20px' : undefined,
      right: position === 'fixed' ? '20px' : undefined,
      zIndex: 200,
      display: 'flex', gap: '2px',
      background: theme.bgCard, border: `1px solid ${theme.border}`,
      borderRadius: '20px', padding: '3px',
      boxShadow: position === 'fixed' ? '0 4px 16px rgba(0,0,0,0.2)' : 'none',
    }}>
      {options.map(opt => {
        const active = mode === opt.key
        const isHovered = hover === opt.key
        const color = active ? '#000' : (isHovered ? theme.gold : theme.textFaint)
        return (
          <button
            key={opt.key}
            onClick={() => setMode(opt.key)}
            onMouseEnter={() => setHover(opt.key)}
            onMouseLeave={() => setHover(null)}
            title={opt.key.charAt(0).toUpperCase() + opt.key.slice(1)}
            style={{
              width: '30px', height: '30px', borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: active ? theme.gold : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            {opt.icon(color)}
          </button>
        )
      })}
    </div>
  )
}
