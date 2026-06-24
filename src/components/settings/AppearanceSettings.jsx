import { useTheme } from '../../context/ThemeContext'

const options = [
  { key: 'light', label: 'Light', icon: '☀️', desc: 'Bright theme for daytime use' },
  { key: 'dark', label: 'Dark', icon: '🌙', desc: 'Easier on the eyes at night' },
  { key: 'system', label: 'System', icon: '💻', desc: 'Match your device settings' },
]

export default function AppearanceSettings() {
  const { mode, setMode, theme } = useTheme()

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>Appearance</h1>
      <p style={{ color: '#555', fontSize: '13px', marginBottom: '32px' }}>Choose how Phaero looks on your device.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map(opt => (
          <div
            key={opt.key}
            onClick={() => setMode(opt.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px', padding: '16px',
              background: mode === opt.key ? '#1a1a0a' : '#202024',
              border: `1px solid ${mode === opt.key ? '#D4AF3766' : '#1e1e1e'}`,
              borderRadius: '12px', cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: '24px' }}>{opt.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: mode === opt.key ? '#D4AF37' : '#fff' }}>{opt.label}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{opt.desc}</div>
            </div>
            {mode === opt.key && <span style={{ color: '#D4AF37', fontSize: '18px' }}>✓</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
