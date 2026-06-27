import { useState } from 'react'

export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '#444' }
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: 'Weak', color: '#ff4444' }
  if (score <= 3) return { score, label: 'Medium', color: '#D4AF37' }
  return { score, label: 'Strong', color: '#25D366' }
}

export default function PasswordInput({ value, onChange, placeholder = 'Password', showStrength = false, onKeyDown }) {
  const [visible, setVisible] = useState(false)
  const strength = getPasswordStrength(value)

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <input
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          type={visible ? 'text' : 'password'}
          className="input-gold"
          style={{ background: '#202024', border: '1px solid #1e1e1e', color: '#fff', padding: '13px 44px 13px 16px', borderRadius: '8px', fontSize: '14px', width: '100%', boxSizing: 'border-box' }}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '16px', padding: '4px' }}
        >
          {visible ? '🙈' : '👁️'}
        </button>
      </div>

      {showStrength && value && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i < strength.score ? strength.color : '#222' }} />
            ))}
          </div>
          <div style={{ fontSize: '11px', color: strength.color }}>{strength.label} password</div>
        </div>
      )}
    </div>
  )
}
