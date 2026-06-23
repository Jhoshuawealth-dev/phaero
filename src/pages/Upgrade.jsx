import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../components/ToastManager'
import CouponInput from '../components/CouponInput'
import logo from '../assets/logo.png'

const plans = {
  starter: { name: 'Starter', monthly: 15, yearly: 10, credits: '150 credits/month' },
  elite: { name: 'Elite', monthly: 35, yearly: 24, credits: '350 credits/month' },
}

export default function Upgrade() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const addToast = useToast()
  const [params] = useSearchParams()
  const initialPlan = params.get('plan') || 'elite'

  const [selectedPlan, setSelectedPlan] = useState(initialPlan)
  const [yearly, setYearly] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const plan = plans[selectedPlan]
  const basePrice = yearly ? plan.yearly : plan.monthly
  const billCycle = yearly ? basePrice * 12 : basePrice
  const discountAmount = (billCycle * discount) / 100
  const total = billCycle - discountAmount

  const handlePay = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setSuccess(true)
      addToast && addToast(`Upgraded to ${plan.name}! 🎉`, 'success')
    }, 2000)
  }

  if (success) {
    return (
      <div style={{ background: theme.bg, color: theme.text, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#0a1a0a', border: '1px solid #25D36644', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 24px' }}>✅</div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '10px' }}>Welcome to {plan.name}!</h1>
          <p style={{ color: theme.textMuted, fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' }}>Your plan is active. {plan.credits} have been added to your account.</p>
          <button onClick={() => navigate('/dashboard')} className="btn-gold" style={{ padding: '14px 36px', borderRadius: '8px', fontSize: '15px' }}>Go to Dashboard →</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: `1px solid ${theme.border}` }}>
        <img src={logo} alt="Phaero" style={{ height: '40px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')} />
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: theme.textFaint, cursor: 'pointer', fontSize: '14px' }}>Cancel ✕</button>
      </div>

      <div className="upgrade-grid" style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px' }}>

        {/* Left — plan selection */}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Upgrade your plan</h1>
          <p style={{ color: theme.textMuted, fontSize: '14px', marginBottom: '28px' }}>Choose a plan that fits how much you build.</p>

          {/* Billing toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '24px', padding: '5px 16px', marginBottom: '24px' }}>
            <span style={{ fontSize: '13px', color: !yearly ? theme.text : theme.textFaint, fontWeight: !yearly ? '700' : '400' }}>Monthly</span>
            <div onClick={() => setYearly(!yearly)} style={{ width: '38px', height: '20px', background: yearly ? theme.gold : theme.border, borderRadius: '10px', cursor: 'pointer', position: 'relative' }}>
              <div style={{ width: '15px', height: '15px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: yearly ? '20px' : '2px', transition: 'left 0.2s' }} />
            </div>
            <span style={{ fontSize: '13px', color: yearly ? theme.text : theme.textFaint, fontWeight: yearly ? '700' : '400' }}>Yearly</span>
            <span style={{ fontSize: '10px', background: theme.gold, color: '#000', padding: '2px 7px', borderRadius: '8px', fontWeight: '800' }}>SAVE 33%</span>
          </div>

          {Object.entries(plans).map(([key, p]) => (
            <div key={key} onClick={() => setSelectedPlan(key)} style={{ background: selectedPlan === key ? theme.goldBg : theme.bgCard, border: `2px solid ${selectedPlan === key ? theme.gold : theme.border}`, borderRadius: '12px', padding: '20px', marginBottom: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '800' }}>{p.name}</span>
                    {key === 'elite' && <span style={{ fontSize: '10px', background: theme.gold, color: '#000', padding: '2px 7px', borderRadius: '8px', fontWeight: '800' }}>POPULAR</span>}
                  </div>
                  <div style={{ fontSize: '13px', color: theme.textMuted }}>{p.credits}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: theme.gold }}>${yearly ? p.yearly : p.monthly}</div>
                  <div style={{ fontSize: '11px', color: theme.textFaint }}>/month</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right — order summary */}
        <div>
          <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '24px', position: 'sticky', top: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px' }}>Order Summary</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px', color: theme.textMuted }}>
              <span>{plan.name} Plan ({yearly ? 'Yearly' : 'Monthly'})</span>
              <span>${billCycle.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px', color: '#25D366' }}>
                <span>Discount ({discount}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div style={{ height: '1px', background: theme.border, margin: '16px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '900', marginBottom: '24px' }}>
              <span>Total</span>
              <span style={{ color: theme.gold }}>${total.toFixed(2)}</span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <CouponInput onApply={setDiscount} />
            </div>

            <button onClick={handlePay} disabled={processing} className="btn-gold" style={{ width: '100%', padding: '14px', borderRadius: '8px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              {processing ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Processing...
                </>
              ) : (
                <>💳 Pay with Paystack</>
              )}
            </button>
            <p style={{ textAlign: 'center', fontSize: '11px', color: theme.textFaint, marginTop: '12px' }}>Secured by Paystack · Cancel anytime</p>
          </div>
        </div>
      </div>
    </div>
  )
}
