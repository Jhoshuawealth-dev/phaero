import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useTheme } from '../context/ThemeContext'

export default function ReferralTerms() {
  const navigate = useNavigate()
  const { theme } = useTheme()

  const sections = [
    { heading: 'Eligibility', body: 'Any registered Phaero user with a verified account can participate in the referral program. You must be in good standing — accounts suspended for terms violations are not eligible.' },
    { heading: 'How Credits Are Earned', body: 'You earn 5 credits automatically when someone signs up using your referral link. You earn an additional 50 credits when that referred user upgrades to any paid plan (Starter or Elite) for the first time.' },
    { heading: 'Referred User Bonus', body: 'New users who sign up via a referral link receive an extra 10 credits added to their free plan, on top of the standard free tier credits.' },
    { heading: 'Payout Timing', body: 'Referral credits are added to your account within 24 hours of the qualifying action (signup or upgrade). Credits do not expire once earned, but are subject to the rollover limits of your current plan.' },
    { heading: 'Self-Referrals Prohibited', body: 'You may not refer yourself using multiple accounts, email aliases, or any other method to claim referral credits fraudulently. Accounts found doing this will have referral credits revoked and may be suspended.' },
    { heading: 'Fraud and Abuse', body: 'Phaero reserves the right to investigate suspicious referral activity, including bulk signups, fake accounts, or bot-driven referrals. Credits earned through fraudulent activity will be reversed.' },
    { heading: 'Program Changes', body: 'Phaero may modify, pause, or end the referral program at any time. Credits already earned before any change will be honored.' },
    { heading: 'No Cash Value', body: 'Referral credits have no cash value and cannot be exchanged, transferred, sold, or redeemed for money. They can only be used within the Phaero platform for AI generation and edits.' },
  ]

  return (
    <div style={{ background: theme.bg, color: theme.text, fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      <Navbar />
      <section className="section-pad" style={{ padding: '80px 60px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: theme.textFaint, cursor: 'pointer', fontSize: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>← Back</button>
          <p style={{ color: theme.gold, fontSize: '13px', letterSpacing: '2px', fontWeight: '600', marginBottom: '12px' }}>REFERRAL PROGRAM</p>
          <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '8px' }}>Terms & Conditions</h1>
          <p style={{ color: theme.textFaint, fontSize: '13px', marginBottom: '48px' }}>Last updated: June 2026</p>

          {sections.map((s, i) => (
            <div key={i} style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: i < sections.length - 1 ? `1px solid ${theme.border}` : 'none' }}>
              <h2 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '10px', color: theme.gold }}>{s.heading}</h2>
              <p style={{ color: theme.textMuted, fontSize: '14px', lineHeight: '1.8' }}>{s.body}</p>
            </div>
          ))}

          <div style={{ background: theme.goldBg, border: `1px solid ${theme.gold}33`, borderRadius: '12px', padding: '20px', marginTop: '20px' }}>
            <p style={{ fontSize: '13px', color: theme.textMuted, lineHeight: '1.7' }}>Questions about the referral program? <a href="#" onClick={() => navigate('/contact')} style={{ color: theme.gold, fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}>Contact support</a>.</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
