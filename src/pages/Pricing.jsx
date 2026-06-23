import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Pricing() {
  const navigate = useNavigate()

  const plans = [
    {
      name: 'Free', price: '$0', sub: 'Trial — explore what Phaero can do',
      credits: '10 credits/day · 5 days · 50 max',
      features: [
        { label: 'AI site generation', locked: false },
        { label: 'Drag & drop editor', locked: false },
        { label: 'AI-generated images', locked: false },
        { label: 'Live deploy & shareable URL', locked: false },
        { label: 'Module build (auth, dashboard, checkout)', locked: true },
        { label: 'Custom domain', locked: true },
        { label: 'Export code', locked: true },
      ],
      cta: 'Start Free',
    },
    {
      name: 'Starter', price: '$19', sub: 'per month',
      credits: '150 credits + 10/day for 5 days',
      features: [
        { label: 'Everything in Free', locked: false },
        { label: 'Module build (auth, dashboard, checkout)', locked: false },
        { label: 'Custom domain', locked: false },
        { label: 'Export code', locked: true },
        { label: 'Priority generation', locked: true },
        { label: 'Team collaboration', locked: true },
      ],
      cta: 'Get Started',
    },
    {
      name: 'Elite', price: '$39', sub: 'per month',
      credits: '350 credits + 10/day for 5 days',
      features: [
        { label: 'Everything in Starter', locked: false },
        { label: 'Export code', locked: false },
        { label: 'Priority generation', locked: false },
        { label: 'Team collaboration', locked: false },
        { label: 'Version history', locked: false },
      ],
      cta: 'Get Started',
      highlight: true,
    },
  ]

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      <Navbar />

      <section className="section-pad" style={{ textAlign: 'center', padding: '80px 60px 60px' }}>
        <p style={{ color: '#D4AF37', fontSize: '13px', letterSpacing: '2px', fontWeight: '600', marginBottom: '12px' }}>PRICING</p>
        <h1 style={{ fontSize: '56px', fontWeight: '900', marginBottom: '16px', letterSpacing: '-2px' }}>
          Simple, honest <span className="gold-shimmer">pricing</span>
        </h1>
        <p style={{ color: '#555', fontSize: '17px', maxWidth: '480px', margin: '0 auto', lineHeight: '1.7' }}>
          Start free. Unlock the full builder when you're ready to launch.
        </p>
      </section>

      <section className="section-pad" style={{ padding: '0 60px 60px' }}>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
          {plans.map((p, i) => (
            <div key={i} className="card-hover" style={{ background: p.highlight ? '#0f0f00' : '#111', border: `1px solid ${p.highlight ? '#D4AF37' : '#1e1e1e'}`, borderRadius: '14px', padding: '32px', position: 'relative' }}>
              {p.highlight && (
                <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#D4AF37', color: '#000', fontSize: '10px', fontWeight: '800', padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap' }}>MOST POPULAR</div>
              )}
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#D4AF37', marginBottom: '8px' }}>{p.name}</div>
              <div style={{ fontSize: '42px', fontWeight: '900', lineHeight: 1, marginBottom: '4px' }}>{p.price}{p.price !== '$0' && <span style={{ fontSize: '15px', color: '#555', fontWeight: '500' }}>/mo</span>}</div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px' }}>{p.sub}</div>
              <div style={{ fontSize: '11px', color: '#D4AF37', background: '#1a1a0a', display: 'inline-block', padding: '3px 10px', borderRadius: '10px', marginBottom: '24px' }}>{p.credits}</div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ color: f.locked ? '#444' : '#aaa', marginBottom: '11px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: f.locked ? '#444' : '#D4AF37', fontWeight: '700', flexShrink: 0 }}>{f.locked ? '🔒' : '✓'}</span>
                    {f.label}
                  </li>
                ))}
              </ul>

              <button onClick={() => navigate('/signup')} className={p.highlight ? 'btn-gold' : ''} style={{ width: '100%', background: p.highlight ? undefined : 'transparent', color: p.highlight ? '#000' : '#fff', border: p.highlight ? 'none' : '1px solid #333', padding: '13px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad" style={{ padding: '0 60px 80px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px', textAlign: 'center' }}>What you unlock with <span style={{ color: '#D4AF37' }}>Starter</span></h2>
          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '20px' }}>
            {[
              { icon: '🔓', title: 'Build the real thing', desc: 'Add login, dashboards, and checkout to your site — not just a landing page.' },
              { icon: '🌐', title: 'Connect your own domain', desc: 'Use yourbusiness.com instead of a Phaero subdomain.' },
              { icon: '⚡', title: 'Keep building past day 5', desc: 'Free credits run out after 5 days. Starter keeps your project moving.' },
              { icon: '💻', title: 'More credits, more building', desc: '150 credits a month plus daily bonus credits to build faster.' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', display: 'flex', gap: '14px' }}>
                <span style={{ fontSize: '24px', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ padding: '0 60px 80px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px', textAlign: 'center' }}>Frequently asked <span style={{ color: '#D4AF37' }}>questions</span></h2>
          {[
            { q: 'What happens after my 5 free days end?', a: 'Your free credits stop, but your project stays saved in your dashboard. Subscribe to Starter or Elite anytime to keep building exactly where you left off.' },
            { q: 'Can I publish and share my site on the Free plan?', a: 'Yes! Free users can publish and get a shareable Phaero URL with AI-generated images included.' },
            { q: 'Why is Module Build locked on Free?', a: 'Module Build covers auth, dashboards, and checkout — the parts that make your site a real working app. These require more compute, so they\'re part of paid plans.' },
            { q: 'Can I use my own domain?', a: 'Yes, starting on the Starter plan you can connect a custom domain instead of using a Phaero subdomain.' },
            { q: 'Do unused credits roll over?', a: 'Yes — on paid plans, unused credits roll over up to your plan limit each month.' },
            { q: 'Can I export my code?', a: 'Code export is available on the Elite plan. Starter users can still push to GitHub.' },
          ].map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      <section className="section-pad" style={{ padding: '80px 60px', textAlign: 'center', background: '#0d0d0d' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '16px' }}>Start free. Upgrade when ready.</h2>
        <p style={{ color: '#555', marginBottom: '32px' }}>No card required to start.</p>
        <button onClick={() => navigate('/signup')} className="btn-gold" style={{ padding: '16px 40px', borderRadius: '8px', fontSize: '16px' }}>Start Building Free →</button>
      </section>
      <Footer />
    </div>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #1a1a1a' }}>
      <div onClick={() => setOpen(!open)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', cursor: 'pointer' }}>
        <span style={{ fontSize: '15px', fontWeight: '600', color: open ? '#D4AF37' : '#fff', transition: 'color 0.2s' }}>{q}</span>
        <span style={{ color: '#D4AF37', fontSize: '20px', fontWeight: '300', transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', flexShrink: 0 }}>+</span>
      </div>
      {open && <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.8', paddingBottom: '18px', margin: 0 }}>{a}</p>}
    </div>
  )
}
