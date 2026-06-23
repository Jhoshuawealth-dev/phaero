import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { templatePresets, templatePrices } from '../lib/templatePresets'
import { useAuth } from '../context/AuthContext'
import { createProject } from '../lib/projects'
import BlockRenderer from '../components/BlockRenderer'

const templateMeta = [
  { name: 'Ankara Boutique', category: 'Fashion', desc: 'Stunning store for fashion sellers with product gallery, Paystack checkout, and WhatsApp order button.', tags: ['Paystack', 'WhatsApp', 'Gallery'] },
  { name: 'Suya Spot', category: 'Restaurant', desc: 'Menu-first restaurant site with location, opening hours, and a WhatsApp order CTA.', tags: ['Menu', 'WhatsApp', 'Location'] },
  { name: 'Lagos Church', category: 'Church', desc: 'Clean ministry site with service times, sermon archive, donation via Paystack, and event calendar.', tags: ['Paystack', 'Events', 'Sermons'] },
  { name: 'Abuja Clinic', category: 'Healthcare', desc: 'Professional clinic site with appointment booking, doctor profiles, and service listings.', tags: ['Booking', 'Doctors', 'WhatsApp'] },
  { name: 'Freelancer Portfolio', category: 'Portfolio', desc: 'Minimal portfolio for designers, developers, and creatives with project showcase and contact form.', tags: ['Projects', 'Contact', 'Gallery'] },
  { name: 'Event Planning', category: 'Events', desc: 'Bold event page with countdown timer, ticket purchase via Paystack, and gallery section.', tags: ['Paystack', 'Gallery', 'Tickets'] },
  { name: 'Logistics Company', category: 'Logistics', desc: 'Trust-building site for delivery and logistics with service areas, pricing, and tracking info.', tags: ['Tracking', 'Pricing', 'WhatsApp'] },
  { name: 'Private School', category: 'Education', desc: 'School website with admissions info, staff profiles, term dates, and parent contact portal.', tags: ['Admissions', 'Staff', 'Contact'] },
  { name: 'Beauty Salon', category: 'Beauty', desc: 'Elegant salon site with service menu, pricing, booking form, and before/after gallery.', tags: ['Booking', 'Gallery', 'Paystack'] },
  { name: 'Real Estate Agency', category: 'Real Estate', desc: 'Property listings site with search filters, agent profiles, and WhatsApp enquiry buttons.', tags: ['Listings', 'WhatsApp', 'Contact'] },
  { name: 'NGO & Charity', category: 'Non-Profit', desc: 'Impact-focused site with donation via Paystack, project gallery, and volunteer sign-up.', tags: ['Donations', 'Gallery', 'Impact'] },
  { name: 'Tech Startup', category: 'Startup', desc: 'Modern SaaS-style landing page with hero, features, pricing table, and waitlist signup.', tags: ['Waitlist', 'Pricing', 'Features'] },
]

const categories = ['All', ...new Set(templateMeta.map(t => t.category))]

function MiniPreview({ name }) {
  const blocks = templatePresets[name] || []
  return (
    <div style={{ height: '200px', overflow: 'hidden', position: 'relative', background: '#fff' }}>
      <div style={{ transform: 'scale(0.42)', transformOrigin: 'top left', width: '238%', pointerEvents: 'none' }}>
        {blocks.slice(0, 3).map((b, i) => (
          <div key={i} style={{ pointerEvents: 'none' }}>
            <BlockRenderer type={b.type} data={b.data} onUpdate={() => {}} />
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(transparent, #fff)' }} />
    </div>
  )
}

export default function Templates() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [active, setActive] = useState('All')
  const [search, setSearch] = useState('')
  const [preview, setPreview] = useState(null)

  const filtered = templateMeta
    .filter(t => active === 'All' || t.category === active)
    .filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))

  const handleUseTemplate = async (template) => {
    const blocks = templatePresets[template.name]
    if (!user) {
      sessionStorage.setItem('pending_template', JSON.stringify({ name: template.name, blocks }))
      navigate('/signup?redirect=/onboarding')
      return
    }
    const canvasBlocks = (blocks || []).map((b, i) => ({ uid: `block-${Date.now()}-${i}`, type: b.type, data: { ...b.data } }))
    const { data } = await createProject(user.id, template.name, template.category)
    if (data) {
      navigate('/builder', { state: { projectId: data.id, projectName: data.name, preloadBlocks: canvasBlocks } })
    }
  }

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      <Navbar />

      <section className="section-pad" style={{ textAlign: 'center', padding: '80px 60px 40px' }}>
        <p style={{ color: '#D4AF37', fontSize: '13px', letterSpacing: '2px', fontWeight: '600', marginBottom: '12px' }}>PREMIUM TEMPLATES</p>
        <h1 style={{ fontSize: '56px', fontWeight: '900', marginBottom: '16px', letterSpacing: '-2px' }}>Built for <span className="gold-shimmer">African businesses</span></h1>
        <p style={{ color: '#555', fontSize: '17px', maxWidth: '520px', margin: '0 auto', lineHeight: '1.7' }}>Professionally designed templates ready to launch. Pick one, customize it to your brand, and go live in minutes.</p>
      </section>

      <div className="section-pad" style={{ padding: '0 60px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#444', fontSize: '16px' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..." className="input-gold" style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#fff', padding: '12px 14px 12px 42px', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div className="section-pad" style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', padding: '0 60px 32px' }}>
        {categories.map((c, i) => (
          <button key={i} onClick={() => setActive(c)} style={{ background: active === c ? '#D4AF37' : '#111', color: active === c ? '#000' : '#555', border: `1px solid ${active === c ? '#D4AF37' : '#222'}`, padding: '7px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>{c}</button>
        ))}
      </div>

      <section className="section-pad" style={{ padding: '0 60px 80px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>No templates found</h3>
          </div>
        ) : (
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
            {filtered.map((t, i) => (
              <div key={i} className="card-hover" style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ cursor: 'pointer', position: 'relative' }} onClick={() => setPreview(t)}>
                  <MiniPreview name={t.name} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#D4AF37', color: '#000', fontSize: '10px', fontWeight: '800', padding: '3px 10px', borderRadius: '10px' }}>{t.category}</div>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.75)', border: '1px solid #D4AF3766', color: '#D4AF37', fontSize: '13px', fontWeight: '800', padding: '4px 12px', borderRadius: '10px' }}>${templatePrices[t.name]}</div>
                </div>
                <div style={{ padding: '18px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '6px' }}>{t.name}</h3>
                  <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>{t.desc}</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    {t.tags.map((tag, j) => (
                      <span key={j} style={{ background: '#1a1a0a', color: '#D4AF37', fontSize: '11px', padding: '3px 8px', borderRadius: '8px', border: '1px solid #D4AF3722' }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setPreview(t)} style={{ flex: 1, background: 'transparent', color: '#aaa', border: '1px solid #222', padding: '9px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>Preview</button>
                    <button onClick={() => handleUseTemplate(t)} className="btn-gold" style={{ flex: 2, padding: '9px', borderRadius: '6px', fontSize: '12px' }}>${templatePrices[t.name]} · Use Template</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {preview && (
        <div onClick={() => setPreview(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(8px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111', border: '1px solid #D4AF3744', borderRadius: '16px', overflow: 'hidden', maxWidth: '700px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', animation: 'fadeUp 0.3s ease' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e1e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: '800' }}>{preview.name}</h2>
                <span style={{ fontSize: '11px', background: '#D4AF3722', color: '#D4AF37', padding: '3px 10px', borderRadius: '10px' }}>{preview.category}</span>
              </div>
              <button onClick={() => setPreview(null)} style={{ background: '#1a1a1a', color: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>
              {(templatePresets[preview.name] || []).map((b, i) => (
                <BlockRenderer key={i} type={b.type} data={b.data} onUpdate={() => {}} />
              ))}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #1e1e1e', display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#D4AF37' }}>${templatePrices[preview.name]}</div>
              <button onClick={() => setPreview(null)} style={{ background: 'transparent', color: '#aaa', border: '1px solid #222', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>Close</button>
              <button onClick={() => handleUseTemplate(preview)} className="btn-gold" style={{ flex: 1, padding: '12px', borderRadius: '8px', fontSize: '14px' }}>Use This Template →</button>
            </div>
          </div>
        </div>
      )}

      <section className="section-pad" style={{ padding: '80px 60px', textAlign: 'center', background: '#0d0d0d' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '16px' }}>Don't see your industry?</h2>
        <p style={{ color: '#555', marginBottom: '32px' }}>Describe your business and Phaero builds a custom site from scratch.</p>
        <button onClick={() => navigate('/onboarding')} className="btn-gold" style={{ padding: '16px 40px', borderRadius: '8px', fontSize: '16px' }}>Start Building Free →</button>
      </section>
      <Footer />
    </div>
  )
}
