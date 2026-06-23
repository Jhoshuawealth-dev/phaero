import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

export default function Features() {
  const navigate = useNavigate()
  return (
    <div style={{ background: '#0A0A0A', color: '#fff', fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      <Navbar />
      <section style={{ textAlign: 'center', padding: '80px 60px 60px' }}>
        <p style={{ color: '#D4AF37', fontSize: '13px', letterSpacing: '2px', fontWeight: '600', marginBottom: '12px' }}>FEATURES</p>
        <h1 style={{ fontSize: '60px', fontWeight: '900', marginBottom: '16px', letterSpacing: '-2px' }}>Everything in <span style={{ color: '#D4AF37' }}>one place</span></h1>
        <p style={{ color: '#555', fontSize: '18px', maxWidth: '540px', margin: '0 auto 48px', lineHeight: '1.7' }}>Every tool an African business needs to go online — built in, not bolted on.</p>
        <button onClick={() => navigate('/signup')} style={{ background: '#D4AF37', color: '#000', border: 'none', padding: '14px 36px', borderRadius: '8px', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}>Start Building Free</button>
      </section>

      {[
        { category: 'AI & Generation', features: [
          { icon: '🤖', title: 'AI Site Generation', desc: 'Describe your business and get a complete, styled, functional website in seconds. No templates to fill in.' },
          { icon: '🧠', title: 'Phaero Agent', desc: 'The AI acts as a real developer — fetching data, connecting APIs, writing backend logic, and fixing its own errors.' },
          { icon: '🖼️', title: 'AI Image Generation', desc: 'Generate professional images for your site using Ideogram AI. No stock photo subscription needed.' },
          { icon: '✍️', title: 'AI Copywriting', desc: 'Every section comes with copy written for your specific business — not generic placeholder text.' },
        ]},
        { category: 'Building Tools', features: [
          { icon: '🧱', title: 'Drag & Drop Editor', desc: 'Move sections, delete blocks, duplicate what you need. Every element is editable inline — no code needed.' },
          { icon: '💻', title: 'Live Code View', desc: 'Toggle to see and edit the full generated code. Export it anytime. You own every line.' },
          { icon: '📱', title: 'Mobile Preview', desc: 'Switch between desktop, tablet, and mobile views instantly before you publish.' },
          { icon: '🔄', title: 'Version History', desc: 'Every save is stored. Preview and restore any previous version in one click.' },
        ]},
        { category: 'African Stack', features: [
          { icon: '💳', title: 'Paystack Built-In', desc: 'Connect your Paystack account in settings. Every buy button and checkout flow works instantly.' },
          { icon: '💬', title: 'WhatsApp Widget', desc: 'A floating WhatsApp button on every site by default. The single most valuable feature for African businesses.' },
          { icon: '🌍', title: 'African Templates', desc: 'Built for suya spots, ankara boutiques, Lagos churches, Accra clinics, Nairobi startups.' },
          { icon: '💰', title: 'Local Currency Support', desc: 'Naira, Cedi, Shilling, Rand, Franc — all major African currencies supported out of the box.' },
        ]},
        { category: 'Publishing & Growth', features: [
          { icon: '🚀', title: 'One-Click Deploy', desc: 'Publish to your free phaero.app subdomain instantly. Every deployment is versioned.' },
          { icon: '🌐', title: 'Custom Domains', desc: 'Connect your own domain or buy one through Whogohost, QServers, or Namecheap inside Phaero.' },
          { icon: '🐙', title: 'GitHub Push', desc: 'Export your full project to GitHub in one click. Continue building manually anytime.' },
          { icon: '👥', title: 'Team Collaboration', desc: 'Invite teammates. Build together. Manage multiple client projects from one account.' },
        ]},
      ].map((section, si) => (
        <section key={si} style={{ padding: '60px 60px', background: si % 2 === 0 ? '#0A0A0A' : '#0d0d0d' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px', paddingLeft: '0', maxWidth: '1100px', margin: '0 auto 32px' }}>
            <span style={{ color: '#D4AF37' }}>{section.category}</span>
          </h2>
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>
            {section.features.map((f, i) => (
              <div key={i} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section style={{ padding: '80px 60px', textAlign: 'center', background: '#0d0d0d' }}>
        <h2 style={{ fontSize: '44px', fontWeight: '900', marginBottom: '16px' }}>Ready to build like a <span style={{ color: '#D4AF37' }}>king?</span></h2>
        <p style={{ color: '#555', marginBottom: '32px' }}>Join 10,000+ African businesses already on Phaero.</p>
        <button onClick={() => navigate('/signup')} style={{ background: '#D4AF37', color: '#000', border: 'none', padding: '16px 40px', borderRadius: '8px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>Start Building Free →</button>
      </section>
      <Footer />
    </div>
  )
}
