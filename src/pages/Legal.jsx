import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const content = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'June 2026',
    sections: [
      { heading: 'Information We Collect', body: 'We collect information you provide when creating an account (name, email), using the builder (prompts, projects), and making payments (processed securely via Paystack — we never store card details).' },
      { heading: 'How We Use Your Information', body: 'We use your information to provide and improve Phaero, send important account notifications, process payments, and offer customer support. We never sell your data to third parties.' },
      { heading: 'Data Storage', body: 'Your data is stored securely using Supabase infrastructure. Projects, prompts, and account data are encrypted at rest. Backups are maintained automatically.' },
      { heading: 'Cookies', body: 'We use essential cookies to keep you logged in and remember your preferences. We do not use advertising cookies or tracking pixels.' },
      { heading: 'Your Rights', body: 'You can request a copy of your data, correct inaccurate information, or delete your account at any time from your dashboard settings.' },
      { heading: 'Contact', body: 'For privacy questions, contact us at privacy@phaero.app or via WhatsApp support.' },
    ]
  },
  terms: {
    title: 'Terms of Service',
    updated: 'June 2026',
    sections: [
      { heading: 'Acceptance', body: 'By using Phaero, you agree to these terms. If you disagree, please do not use our service.' },
      { heading: 'Your Account', body: 'You are responsible for maintaining the security of your account. Do not share your login credentials. You must be 18 or older to use Phaero.' },
      { heading: 'Acceptable Use', body: 'You may not use Phaero to build websites that promote illegal activity, hate speech, spam, or content that violates the rights of others.' },
      { heading: 'Credits and Billing', body: 'Credits are consumed per AI action. Unused credits on paid plans roll over up to the plan limit. Refunds are available within 7 days of purchase if you have not used more than 10 credits.' },
      { heading: 'Your Content', body: 'You own all content you create on Phaero. We do not claim ownership of your projects. You grant us a license to host and serve your content while you use the platform.' },
      { heading: 'Termination', body: 'We may suspend or terminate accounts that violate these terms. You may delete your account at any time from your dashboard.' },
    ]
  },
  cookies: {
    title: 'Cookie Policy',
    updated: 'June 2026',
    sections: [
      { heading: 'What Are Cookies', body: 'Cookies are small text files stored in your browser when you visit websites. They help us keep you logged in and remember your preferences.' },
      { heading: 'Essential Cookies', body: 'We use session cookies to authenticate you and keep you logged in. These are required for Phaero to function and cannot be disabled.' },
      { heading: 'Preference Cookies', body: 'We store your editor preferences (device view, theme, last project) to improve your experience on return visits.' },
      { heading: 'Analytics Cookies', body: 'We use privacy-respecting analytics (PostHog) to understand how users interact with Phaero. This data is anonymized and never sold.' },
      { heading: 'No Advertising Cookies', body: 'We do not use any advertising or tracking cookies. We do not work with ad networks. Phaero is completely ad-free.' },
      { heading: 'Managing Cookies', body: 'You can clear cookies at any time through your browser settings. Note that clearing session cookies will log you out of Phaero.' },
    ]
  }
}

export default function Legal() {
  const navigate = useNavigate()
  const location = useLocation()
  const page = location.pathname.replace('/', '')
  const data = content[page] || content.privacy

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      <Navbar />
      <section className="section-pad" style={{ padding: '80px 60px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
            {['privacy', 'terms', 'cookies'].map(p => (
              <button key={p} onClick={() => navigate(`/${p}`)} style={{ background: page === p ? '#D4AF37' : '#111', color: page === p ? '#000' : '#555', border: `1px solid ${page === p ? '#D4AF37' : '#222'}`, padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}>{p}</button>
            ))}
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '8px' }}>{data.title}</h1>
          <p style={{ color: '#444', fontSize: '13px', marginBottom: '48px' }}>Last updated: {data.updated}</p>
          {data.sections.map((s, i) => (
            <div key={i} style={{ marginBottom: '36px', paddingBottom: '36px', borderBottom: i < data.sections.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#D4AF37' }}>{s.heading}</h2>
              <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.8' }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  )
}
