import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Footer() {
  const navigate = useNavigate()
  return (
    <footer style={{ padding: '60px 60px 32px', borderTop: '1px solid #1a1a1a', background: '#16161A' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px', flexWrap: 'wrap', gap: '40px' }}>
        <div style={{ maxWidth: '240px' }}>
          <div style={{ cursor: 'pointer', marginBottom: '12px' }} onClick={() => navigate('/')}>
            <img src={logo} alt="Phaero" style={{ height: '60px', width: 'auto' }} />
          </div>
          <p style={{ color: '#444', fontSize: '13px', lineHeight: '1.7', marginBottom: '16px' }}>The AI website builder built for Africa and the world.</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[{ icon: '𝕏', label: 'Twitter' }, { icon: 'in', label: 'LinkedIn' }, { icon: 'ig', label: 'Instagram' }].map((s, i) => (
              <div key={i} title={s.label} style={{ color: '#444', fontSize: '13px', cursor: 'pointer', width: '32px', height: '32px', border: '1px solid #1e1e1e', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4AF37'; e.currentTarget.style.color = '#D4AF37' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#444' }}>{s.icon}</div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
          {[
            { title: 'Product', links: [{ label: 'Features', path: '/features' }, { label: 'Pricing', path: '/pricing' }, { label: 'Templates', path: '/templates' }, { label: 'Showcase', path: '/showcase' }] },
            { title: 'Company', links: [{ label: 'About', path: '/about' }, { label: 'Contact', path: '/contact' }] },
            { title: 'Legal', links: [{ label: 'Privacy', path: '/privacy' }, { label: 'Terms', path: '/terms' }, { label: 'Cookies', path: '/cookies' }] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff', marginBottom: '16px', letterSpacing: '1px' }}>{col.title.toUpperCase()}</div>
              {col.links.map((l, j) => (
                <div key={j} onClick={() => navigate(l.path)} style={{ color: '#555', fontSize: '13px', marginBottom: '10px', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
                  onMouseLeave={e => e.currentTarget.style.color = '#555'}>{l.label}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ color: '#2a2a2a', fontSize: '13px' }}>© 2026 Phaero. Built for Africa. Built for the world.</div>
        <div style={{ color: '#2a2a2a', fontSize: '12px' }}>Made with 👑 in Africa</div>
      </div>
    </footer>
  )
}
