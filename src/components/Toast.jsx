import { useEffect, useState } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300) }, 3000)
    return () => clearTimeout(t)
  }, [])
  const colors = { success: '#25D366', error: '#ff4444', info: '#D4AF37' }
  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, background: '#111', border: `1px solid ${colors[type]}44`, borderLeft: `3px solid ${colors[type]}`, borderRadius: '8px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', transition: 'all 0.3s', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)', maxWidth: '320px', fontFamily: 'Inter, sans-serif' }}>
      <span style={{ fontSize: '16px' }}>{type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
      <span style={{ color: '#fff', fontSize: '13px', flex: 1 }}>{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300) }} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '16px', padding: '0' }}>×</button>
    </div>
  )
}
