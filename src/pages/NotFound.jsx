import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: '24px', backgroundImage: 'radial-gradient(circle at 1px 1px, #D4AF3706 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      <img src={logo} alt="Phaero" style={{ height: '80px', marginBottom: '32px', opacity: 0.5, animation: 'float 4s ease-in-out infinite' }} />
      <div style={{ fontSize: '120px', fontWeight: '900', color: '#1a1a1a', lineHeight: 1, marginBottom: '16px' }}>404</div>
      <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px' }}>Page not found</h1>
      <p style={{ color: '#555', fontSize: '16px', marginBottom: '40px', maxWidth: '400px', lineHeight: '1.6' }}>Even kings take a wrong turn sometimes. This page doesn't exist.</p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => navigate('/')} className="btn-gold" style={{ padding: '13px 32px', borderRadius: '8px', fontSize: '15px' }}>Go Home →</button>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '13px 32px', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: '600' }}>Go Back</button>
      </div>
    </div>
  )
}
