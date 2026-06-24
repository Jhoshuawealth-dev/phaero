import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import UsageChart from '../UsageChart'

export default function BillingSettings() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  const credits = profile?.credits ?? 0
  const plan = profile?.plan || 'free'
  const isOutOfCredits = credits <= 0

  const plans = [
    { name: 'Free', price: '$0', credits: '10 credits/day · 5 days · 50 max', current: plan === 'free' },
    { name: 'Starter', price: '$19/mo', credits: '150 credits + 10/day for 5 days', current: plan === 'starter', key: 'starter' },
    { name: 'Elite', price: '$39/mo', credits: '350 credits + 10/day for 5 days', current: plan === 'elite', key: 'elite', popular: true },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800' }}>Plans & Credit Usage</h1>
      </div>
      <p style={{ color: '#555', fontSize: '13px', marginBottom: '24px' }}>Manage your subscription plan and credit balance.</p>

      {isOutOfCredits && (
        <div style={{ background: '#1a0a0a', border: '1px solid #ff444444', borderRadius: '10px', padding: '14px 16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '16px' }}>⚠️</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#ff6666' }}>You're out of credits</div>
              <div style={{ fontSize: '12px', color: '#aa8888' }}>{plan === 'free' ? 'They\'ll reset tomorrow, or upgrade to keep building.' : 'Upgrade for more credits, or wait for your next billing cycle.'}</div>
            </div>
          </div>
          <button onClick={() => navigate('/pricing')} className="btn-gold" style={{ padding: '8px 18px', borderRadius: '7px', fontSize: '13px', flexShrink: 0 }}>Upgrade</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#202024', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>👑</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', textTransform: 'capitalize' }}>Phaero {plan}</div>
              <div style={{ fontSize: '11px', color: '#555' }}>{plan === 'free' ? 'Free usage included' : 'Active subscription'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>Credits remaining</span>
            <span style={{ fontSize: '12px', color: '#D4AF37', fontWeight: '700' }}>{credits} left</span>
          </div>
          <div style={{ height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ width: `${Math.min((credits / 50) * 100, 100)}%`, height: '100%', background: isOutOfCredits ? '#444' : '#D4AF37', borderRadius: '3px' }} />
          </div>
          <div style={{ fontSize: '11px', color: '#444' }}>Resets {plan === 'free' ? 'daily' : 'monthly'}</div>
        </div>

        <div style={{ background: '#202024', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
          <UsageChart userId={user?.id} />
        </div>
      </div>

      <p style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>Available Plans</p>
      {plans.map((p, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: p.popular ? '#1a1a0a' : '#202024', border: `1px solid ${p.popular ? '#D4AF3744' : '#1e1e1e'}`, borderRadius: '10px', marginBottom: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700' }}>{p.name}</span>
              {p.popular && <span style={{ fontSize: '10px', background: '#D4AF37', color: '#000', padding: '2px 6px', borderRadius: '8px', fontWeight: '700' }}>POPULAR</span>}
              {p.current && <span style={{ fontSize: '10px', color: '#25D366', background: '#25D36622', padding: '2px 6px', borderRadius: '8px' }}>CURRENT</span>}
            </div>
            <div style={{ fontSize: '12px', color: '#555' }}>{p.credits}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '16px', fontWeight: '800', color: '#D4AF37' }}>{p.price}</span>
            {!p.current && p.key && <button onClick={() => navigate(`/upgrade?plan=${p.key}`)} style={{ background: p.popular ? '#D4AF37' : 'transparent', color: p.popular ? '#000' : '#D4AF37', border: '1px solid #D4AF37', padding: '6px 14px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}>Upgrade</button>}
          </div>
        </div>
      ))}
    </div>
  )
}
