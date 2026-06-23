import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import logo from '../assets/logo.png'

export default function About() {
  const navigate = useNavigate()
  return (
    <div style={{ background: '#0A0A0A', color: '#fff', fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      <Navbar />
      <section className="section-pad" style={{ padding: '80px 60px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, #D4AF3706 1px, transparent 0)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: '#D4AF37', fontSize: '13px', letterSpacing: '2px', fontWeight: '600', marginBottom: '12px' }}>OUR STORY</p>
          <h1 style={{ fontSize: '56px', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1.5px', lineHeight: '1.1' }}>Built for <span className="gold-shimmer">Africa.</span><br />Built for the world.</h1>
          <p style={{ color: '#666', fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.8' }}>Millions of African businesses have no online presence — not because they don't want one, but because the tools available ignore African context entirely. Phaero changes that.</p>
        </div>
      </section>

      <section className="section-pad" style={{ padding: '80px 60px', background: '#0d0d0d' }}>
        <div className="grid-2" style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '20px', lineHeight: '1.2' }}>The pyramids were built by <span style={{ color: '#D4AF37' }}>Africans.</span></h2>
            <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>The greatest structures in human history were built on this continent. Phaero carries that energy into the digital age — building the websites, apps, and digital businesses of modern Africa, one project at a time.</p>
            <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.8' }}>We built Phaero because we were tired of Western tools that don't know Paystack, don't understand WhatsApp, and have never heard of Whogohost. So we built our own — and made it better.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img src={logo} alt="Phaero" style={{ width: '200px', filter: 'drop-shadow(0 0 40px #D4AF3744)', animation: 'float 4s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ padding: '80px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800' }}>Our <span style={{ color: '#D4AF37' }}>mission</span></h2>
        </div>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
          {[
            { icon: '🌍', title: 'African-First', desc: 'We build for Africa first. Paystack, WhatsApp, Naira, Ankara — these aren\'t afterthoughts. They\'re defaults.' },
            { icon: '🏛️', title: 'World-Class', desc: 'African-first doesn\'t mean lesser. Every feature matches or beats the global leaders. No compromises.' },
            { icon: '👑', title: 'Empower Builders', desc: 'Whether you\'re a market trader or a startup founder, Phaero gives you the tools to compete globally.' },
          ].map((v, i) => (
            <div key={i} className="card-hover" style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '28px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{v.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>{v.title}</h3>
              <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.7' }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad" style={{ padding: '80px 60px', background: '#0d0d0d' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800' }}>By the <span style={{ color: '#D4AF37' }}>numbers</span></h2>
        </div>
        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { number: '10,000+', label: 'Sites Built' },
            { number: '48', label: 'Countries' },
            { number: '2 min', label: 'Avg Build Time' },
            { number: '4.9★', label: 'User Rating' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '28px', background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px' }}>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#D4AF37', marginBottom: '8px' }}>{s.number}</div>
              <div style={{ fontSize: '13px', color: '#555' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad" style={{ padding: '80px 60px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '16px' }}>Ready to build like a <span className="gold-shimmer">king?</span></h2>
        <p style={{ color: '#555', marginBottom: '32px' }}>Join thousands of African businesses already on Phaero.</p>
        <button onClick={() => navigate('/signup')} className="btn-gold" style={{ padding: '16px 40px', borderRadius: '8px', fontSize: '16px' }}>Start Building Free →</button>
      </section>
      <Footer />
    </div>
  )
}
