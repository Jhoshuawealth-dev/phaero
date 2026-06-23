import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BuilderDemo from '../components/BuilderDemo'

export default function Landing() {
  const navigate = useNavigate()
  return (
    <div style={{ background: '#0A0A0A', color: '#fff', fontFamily: 'Inter, sans-serif', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      {/* HERO */}
      <section className="hero-section" style={{ textAlign: 'center', padding: '100px 60px 60px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, #D4AF3708 1px, transparent 0)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: '#D4AF37', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.04, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1a1a0a', border: '1px solid #D4AF3744', borderRadius: '20px', padding: '6px 16px', marginBottom: '28px', fontSize: '13px', color: '#D4AF37' }}>
            🏛️ The African Builder Has Arrived
          </div>
          <h1 className="hero-title" style={{ fontSize: '80px', fontWeight: '900', lineHeight: '1.05', margin: '0 0 24px', letterSpacing: '-2px' }}>
            Build like a <span className="gold-shimmer">king.</span>
          </h1>
          <p style={{ fontSize: '20px', color: '#888', maxWidth: '580px', margin: '0 auto 48px', lineHeight: '1.7' }}>
            Describe your business. Phaero builds your website in seconds — with Paystack, WhatsApp, and Africa built in.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '80px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/signup')} className="btn-gold" style={{ padding: '16px 40px', borderRadius: '8px', fontSize: '16px' }}>Start Building Free</button>
            <button style={{ background: 'transparent', color: '#fff', border: '1px solid #444', padding: '16px 40px', borderRadius: '8px', fontWeight: '600', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>▶</span>
              Watch Demo
            </button>
          </div>
          <div className="hide-mobile"><BuilderDemo /></div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="section-pad" style={{ padding: '80px 60px 60px', textAlign: 'center' }}>
        <p style={{ color: '#555', fontSize: '13px', letterSpacing: '2px', marginBottom: '32px', fontWeight: '600' }}>TRUSTED BY 10,000+ AFRICAN BUSINESSES</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
          {['Paystack', 'Flutterwave', 'Whogohost', 'Supabase', 'Namecheap'].map((p, i) => (
            <div key={i} style={{ color: '#2a2a2a', fontSize: '18px', fontWeight: '800' }}>{p}</div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-pad" style={{ padding: '80px 60px', background: '#0d0d0d' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ color: '#D4AF37', fontSize: '13px', letterSpacing: '2px', fontWeight: '600', marginBottom: '12px' }}>HOW IT WORKS</p>
          <h2 style={{ fontSize: '40px', fontWeight: '800' }}>From idea to live website <span style={{ color: '#D4AF37' }}>in 3 steps</span></h2>
        </div>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
          {[
            { step: '01', title: 'Describe your business', desc: 'Type what you do in plain English. Phaero understands African context deeply.' },
            { step: '02', title: 'Phaero builds it instantly', desc: 'Complete, styled, functional website with real content and African context baked in.' },
            { step: '03', title: 'Publish and go live', desc: 'Click publish. Live on a free Phaero subdomain instantly. Custom domain in one click.' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#1e1e1e', marginBottom: '16px' }}>{s.step}</div>
              <div style={{ width: '40px', height: '2px', background: '#D4AF37', margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>{s.title}</h3>
              <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.7' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="section-pad" style={{ padding: '80px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ color: '#D4AF37', fontSize: '13px', letterSpacing: '2px', fontWeight: '600', marginBottom: '12px' }}>FEATURES</p>
          <h2 style={{ fontSize: '40px', fontWeight: '800' }}>Everything you need to <span style={{ color: '#D4AF37' }}>go live</span></h2>
        </div>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>
          {[
            { icon: '🤖', title: 'AI Generation', desc: 'Complete styled site with real content in seconds.' },
            { icon: '🧱', title: 'Drag & Drop Editor', desc: 'Move, delete, duplicate sections. No code needed.' },
            { icon: '💳', title: 'Paystack Built-In', desc: 'Accept payments from day one. Zero setup.' },
            { icon: '💬', title: 'WhatsApp Integration', desc: 'Floating WhatsApp button on every site by default.' },
            { icon: '🌐', title: 'Custom Domains', desc: 'Connect your domain or buy through Whogohost.' },
            { icon: '🌍', title: 'African Templates', desc: 'Built for suya spots, boutiques, churches, clinics.' },
            { icon: '🔄', title: 'Version History', desc: 'Every save stored. Restore any version in one click.' },
            { icon: '👥', title: 'Team Collaboration', desc: 'Build together. Perfect for agencies.' },
            { icon: '📱', title: 'Mobile-First', desc: 'Fully responsive from day one. Always.' },
            { icon: '⚡', title: 'One-Click Deploy', desc: 'Publish to free phaero.app subdomain instantly.' },
            { icon: '🛡️', title: 'Auto Error Fixing', desc: 'Phaero Agent fixes its own errors automatically.' },
            { icon: '💻', title: 'Live Code View', desc: 'See, edit, and export your full code anytime.' },
          ].map((f, i) => (
            <div key={i} className="card-hover" style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '6px' }}>{f.title}</h3>
              <p style={{ color: '#555', lineHeight: '1.6', margin: 0, fontSize: '13px' }}>{f.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button onClick={() => navigate('/features')} style={{ background: 'transparent', color: '#D4AF37', border: '1px solid #D4AF37', padding: '12px 28px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>See All Features →</button>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-pad" style={{ padding: '80px 60px', background: '#0d0d0d' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ color: '#D4AF37', fontSize: '13px', letterSpacing: '2px', fontWeight: '600', marginBottom: '12px' }}>TESTIMONIALS</p>
          <h2 style={{ fontSize: '40px', fontWeight: '800' }}>Builders love <span style={{ color: '#D4AF37' }}>Phaero</span></h2>
        </div>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>
          {[
            { name: 'Amaka Osei', role: 'Fashion Boutique Owner, Lagos', text: 'Phaero built my entire site in 2 minutes. Paystack was already connected. I made my first sale the same day.' },
            { name: 'Kwame Asante', role: 'Web Designer, Accra', text: 'I build client sites in 20 minutes now and charge my normal rate. Phaero has doubled my income.' },
            { name: 'Fatima Bello', role: 'Clinic Owner, Abuja', text: 'My clinic finally has a professional website with booking. My patients find me on Google now.' },
          ].map((t, i) => (
            <div key={i} className="card-hover" style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px' }}>
              <div style={{ fontSize: '32px', color: '#D4AF37', marginBottom: '12px', lineHeight: 1 }}>"</div>
              <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.8', marginBottom: '20px' }}>{t.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#D4AF3722', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '700', color: '#D4AF37', flexShrink: 0 }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700' }}>{t.name}</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="section-pad" style={{ padding: '80px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ color: '#D4AF37', fontSize: '13px', letterSpacing: '2px', fontWeight: '600', marginBottom: '12px' }}>PRICING</p>
          <h2 style={{ fontSize: '40px', fontWeight: '800' }}>Simple, honest <span style={{ color: '#D4AF37' }}>pricing</span></h2>
          <p style={{ color: '#555', marginTop: '12px', fontSize: '15px' }}>More credits than Lovable. Lower price than Bolt. Always.</p>
        </div>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { name: 'Free', price: '$0', sub: 'Forever free', credits: '10 credits/day · 5 days', features: ['Phaero subdomain', 'Public projects', 'Basic blocks', 'Community showcase'] },
            { name: 'Starter', price: '$15', sub: 'per month', credits: '150 credits/month', features: ['Everything in Free', 'Custom domain', 'Paystack integration', 'WhatsApp button', 'Badge removal'] },
            { name: 'Elite', price: '$35', sub: 'per month', credits: '350 credits/month', features: ['Everything in Starter', 'Team collaboration', 'Version history', 'Code view', 'WhatsApp support'], highlight: true },
          ].map((p, i) => (
            <div key={i} className="card-hover" style={{ background: p.highlight ? '#0f0f00' : '#111', border: `1px solid ${p.highlight ? '#D4AF37' : '#1e1e1e'}`, borderRadius: '12px', padding: '28px', position: 'relative' }}>
              {p.highlight && <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#D4AF37', color: '#000', fontSize: '10px', fontWeight: '800', padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#D4AF37', marginBottom: '6px' }}>{p.name}</div>
              <div style={{ fontSize: '36px', fontWeight: '900', marginBottom: '2px' }}>{p.price}</div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '6px' }}>{p.sub}</div>
              <div style={{ fontSize: '11px', color: '#D4AF37', background: '#1a1a0a', display: 'inline-block', padding: '3px 10px', borderRadius: '10px', marginBottom: '20px' }}>{p.credits}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ color: '#aaa', marginBottom: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#D4AF37' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/signup')} className={p.highlight ? 'btn-gold' : ''} style={{ width: '100%', background: p.highlight ? undefined : 'transparent', color: p.highlight ? '#000' : '#fff', border: p.highlight ? 'none' : '1px solid #333', padding: '11px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
                {p.name === 'Free' ? 'Start Free' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button onClick={() => navigate('/pricing')} style={{ background: 'transparent', color: '#D4AF37', border: '1px solid #D4AF37', padding: '11px 28px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>See Full Pricing →</button>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad" style={{ padding: '80px 60px', textAlign: 'center', background: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}>
        <h2 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '16px', letterSpacing: '-1px' }}>Ready to build like a <span className="gold-shimmer">king?</span></h2>
        <p style={{ color: '#555', fontSize: '16px', marginBottom: '40px' }}>Join 10,000+ African businesses already building with Phaero.</p>
        <button onClick={() => navigate('/signup')} className="btn-gold" style={{ padding: '18px 48px', borderRadius: '8px', fontSize: '18px' }}>Start Building Free →</button>
      </section>

      <Footer />
    </div>
  )
}
