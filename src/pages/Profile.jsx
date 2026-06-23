import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useTheme } from '../context/ThemeContext'

const projects = [
  { name: 'Zara Ankara Boutique', category: 'Fashion', color: '#8B4513' },
  { name: 'Grace Assembly Church', category: 'Church', color: '#2F4F4F' },
]

export default function Profile() {
  const navigate = useNavigate()
  const { theme } = useTheme()

  return (
    <div style={{ background: theme.bg, color: theme.text, fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      <Navbar />
      <section className="section-pad" style={{ padding: '60px 60px 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          {/* Profile header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: theme.goldBg, border: `2px solid ${theme.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '800', color: theme.gold, flexShrink: 0 }}>J</div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px' }}>Joshua</h1>
              <p style={{ color: theme.textMuted, fontSize: '14px', marginBottom: '8px' }}>Builder on Phaero since June 2026 · Lagos, Nigeria</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontSize: '11px', background: theme.goldBg, color: theme.gold, padding: '4px 10px', borderRadius: '10px', fontWeight: '700' }}>👑 Free Plan</span>
                <span style={{ fontSize: '11px', background: theme.bgSecondary, color: theme.textMuted, padding: '4px 10px', borderRadius: '10px' }}>2 public projects</span>
              </div>
            </div>
            <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', color: theme.text, border: `1px solid ${theme.border}`, padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Edit Profile</button>
          </div>

          {/* Stats */}
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '48px' }}>
            {[{ label: 'Sites Published', value: '2' }, { label: 'Total Likes', value: '47' }, { label: 'Member Since', value: 'Jun 2026' }].map((s, i) => (
              <div key={i} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '900', color: theme.gold, marginBottom: '4px' }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: theme.textFaint }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ padding: '0 60px 80px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px' }}>Public Projects</h2>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '20px' }}>
            {projects.map((p, i) => (
              <div key={i} className="card-hover" style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ height: '140px', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '80px', height: '8px', background: theme.gold, borderRadius: '3px' }} />
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{p.name}</div>
                  <span style={{ fontSize: '11px', color: theme.gold, background: theme.goldBg, padding: '2px 8px', borderRadius: '8px' }}>{p.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
