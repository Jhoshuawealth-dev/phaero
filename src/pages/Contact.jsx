import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Contact() {
  const navigate = useNavigate()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return
    setSent(true)
  }

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      <Navbar />
      <section className="section-pad" style={{ padding: '80px 60px', textAlign: 'center' }}>
        <p style={{ color: '#D4AF37', fontSize: '13px', letterSpacing: '2px', fontWeight: '600', marginBottom: '12px' }}>CONTACT</p>
        <h1 style={{ fontSize: '52px', fontWeight: '900', marginBottom: '16px', letterSpacing: '-1.5px' }}>Get in <span className="gold-shimmer">touch</span></h1>
        <p style={{ color: '#555', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: '1.7' }}>We're here to help. Reach out on WhatsApp for the fastest response.</p>
      </section>

      <section className="section-pad" style={{ padding: '0 60px 80px' }}>
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', maxWidth: '1000px', margin: '0 auto' }}>

          {/* Contact options */}
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '32px' }}>Reach us directly</h2>
            {[
              { icon: '💬', title: 'WhatsApp Support', desc: 'Fastest response. Available for paid users.', action: 'Chat on WhatsApp', color: '#25D366' },
              { icon: '📧', title: 'Email Support', desc: 'hello@phaero.app — we reply within 24 hours.', action: 'Send Email', color: '#D4AF37' },
              { icon: '🐦', title: 'Twitter / X', desc: 'Follow us @phaeroapp for updates and tips.', action: 'Follow us', color: '#1DA1F2' },
            ].map((c, i) => (
              <div key={i} className="card-hover" style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', marginBottom: '14px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '28px', flexShrink: 0 }}>{c.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{c.title}</div>
                  <div style={{ fontSize: '13px', color: '#555', marginBottom: '10px' }}>{c.desc}</div>
                  <button style={{ background: 'transparent', color: c.color, border: `1px solid ${c.color}66`, padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>{c.action} →</button>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '32px' }}>Send a message</h2>
            {sent ? (
              <div style={{ background: '#0a1a0a', border: '1px solid #25D36644', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: '#25D366' }}>Message sent!</h3>
                <p style={{ color: '#555', fontSize: '14px' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { key: 'name', label: 'Your Name', placeholder: 'Amaka Osei', type: 'text' },
                  { key: 'email', label: 'Email Address', placeholder: 'amaka@example.com', type: 'email' },
                  { key: 'subject', label: 'Subject', placeholder: 'I need help with...', type: 'text' },
                ].map((field, i) => (
                  <div key={i}>
                    <label style={{ fontSize: '12px', color: '#555', fontWeight: '600', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>{field.label.toUpperCase()}</label>
                    <input type={field.type} placeholder={field.placeholder} value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} className="input-gold" style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#fff', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: '12px', color: '#555', fontWeight: '600', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>MESSAGE</label>
                  <textarea placeholder="Tell us what you need help with..." rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="input-gold" style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#fff', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', resize: 'none', fontFamily: 'Inter, sans-serif' }} />
                </div>
                <button onClick={handleSubmit} className="btn-gold" style={{ padding: '13px', borderRadius: '8px', fontSize: '15px' }}>Send Message →</button>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
