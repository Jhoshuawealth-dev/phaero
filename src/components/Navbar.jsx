import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import logo from '../assets/logo.png'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const active = (path) => location.pathname === path

  return (
    <>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 60px', borderBottom: '1px solid #1a1a1a', background: '#16161Aee', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src={logo} alt="Phaero" style={{ height: '48px', width: 'auto' }} />
        </div>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {[{ label: 'Features', path: '/features' }, { label: 'Pricing', path: '/pricing' }, { label: 'Templates', path: '/templates' }, { label: 'Showcase', path: '/showcase' }].map((item, i) => (
            <span key={i} onClick={() => navigate(item.path)} style={{ color: active(item.path) ? '#D4AF37' : '#aaa', fontSize: '14px', cursor: 'pointer', fontWeight: active(item.path) ? '700' : '400', borderBottom: active(item.path) ? '1px solid #D4AF37' : '1px solid transparent', paddingBottom: '2px', transition: 'all 0.2s' }}>{item.label}</span>
          ))}
        </div>
        <div className="desktop-nav" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '8px 18px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#D4AF37'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}>Sign In</button>
          <button onClick={() => navigate('/signup')} className="btn-gold" style={{ padding: '8px 18px', borderRadius: '6px', fontSize: '14px' }}>Start Free →</button>
        </div>

        {/* Mobile hamburger */}
        <button className="mobile-only" onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: '1px solid #222', color: '#fff', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '18px' }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-only" style={{ position: 'fixed', top: '64px', left: 0, right: 0, background: '#1C1C21', borderBottom: '1px solid #1a1a1a', zIndex: 99, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[{ label: 'Features', path: '/features' }, { label: 'Pricing', path: '/pricing' }, { label: 'Templates', path: '/templates' }, { label: 'Showcase', path: '/showcase' }].map((item, i) => (
            <div key={i} onClick={() => { navigate(item.path); setMenuOpen(false) }} style={{ padding: '14px 16px', color: active(item.path) ? '#D4AF37' : '#aaa', fontSize: '16px', fontWeight: active(item.path) ? '700' : '400', cursor: 'pointer', borderRadius: '8px', background: active(item.path) ? '#1a1a0a' : 'transparent' }}>{item.label}</div>
          ))}
          <div style={{ height: '1px', background: '#1a1a1a', margin: '8px 0' }} />
          <button onClick={() => { navigate('/login'); setMenuOpen(false) }} style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '15px', marginBottom: '8px' }}>Sign In</button>
          <button onClick={() => { navigate('/signup'); setMenuOpen(false) }} className="btn-gold" style={{ padding: '12px', borderRadius: '8px', fontSize: '15px' }}>Start Building Free →</button>
        </div>
      )}
    </>
  )
}
