import logo from '../assets/logo.png'

export default function PageLoader({ text = 'Loading...' }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#16161A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ position: 'relative', marginBottom: '32px' }}>
        <div style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#D4AF37', animation: 'spin 1s linear infinite' }} />
        <div style={{ position: 'absolute', inset: '-32px', borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#D4AF3744', animation: 'spin 1.5s linear infinite reverse' }} />
        <img src={logo} alt="Phaero" style={{ width: '80px', height: '80px', objectFit: 'contain', animation: 'pulse 2s ease-in-out infinite' }} />
      </div>
      <p style={{ color: '#D4AF37', fontSize: '14px', fontWeight: '600', letterSpacing: '2px', animation: 'fade 1.5s ease-in-out infinite' }}>{text}</p>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.8;transform:scale(0.95)} }
        @keyframes fade { 0%,100%{opacity:0.4} 50%{opacity:1} }
      `}</style>
    </div>
  )
}
