import { useNavigate } from 'react-router-dom'

const agents = [
  { category: 'African Business', items: [
    { icon: '💬', name: 'WhatsApp Business Agent', desc: 'Auto-respond to customers, send order confirmations directly through WhatsApp.' },
    { icon: '💳', name: 'Paystack Agent', desc: 'Handle refunds, send receipts, and check transaction status conversationally.' },
    { icon: '📱', name: 'SMS Agent', desc: 'Send order and appointment reminders via SMS — works even with low data.' },
    { icon: '🌍', name: 'Currency Converter Agent', desc: 'Auto-display prices in Naira, Cedi, Shilling, or Rand based on visitor location.' },
  ]},
  { category: 'Business Automation', items: [
    { icon: '🤖', name: 'AI Chatbot Agent', desc: 'Embed a conversational assistant directly into your built site.' },
    { icon: '📧', name: 'Email Agent', desc: 'Automated order confirmations and newsletters.' },
    { icon: '🔍', name: 'Research Agent', desc: 'Let your site answer customer questions with real-time information.' },
    { icon: '📅', name: 'Booking Agent', desc: 'Appointment scheduling for clinics, salons, and consultants.' },
    { icon: '📦', name: 'Inventory Agent', desc: 'Simple stock tracking for e-commerce sites.' },
  ]},
  { category: 'Power Automation', items: [
    { icon: '🔗', name: 'n8n', desc: 'Connect your site to n8n workflows — trigger automations on any event.' },
    { icon: '⚡', name: 'Make (Integromat)', desc: 'Build visual automation scenarios that react to your site\'s data.' },
    { icon: '🔌', name: 'Zapier', desc: 'Link your site to 6,000+ apps through Zapier\'s automation network.' },
    { icon: '📊', name: 'Google Sheets Agent', desc: 'Sync form submissions, orders, or leads directly to a spreadsheet.' },
    { icon: '📈', name: 'Analytics Agent', desc: 'Get automated weekly business insights about your site.' },
  ]},
]

export default function AgentsConnectors({ userPlan }) {
  const navigate = useNavigate()
  const isLocked = userPlan === 'free' || !userPlan

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Agents & Connectors</h2>
          <p style={{ color: '#555', fontSize: '13px' }}>Add AI agents and automations to your sites. Starter & Elite only.</p>
        </div>
        {isLocked && (
          <span style={{ fontSize: '11px', background: '#D4AF3722', color: '#D4AF37', padding: '4px 10px', borderRadius: '10px', fontWeight: '700', flexShrink: 0 }}>🔒 LOCKED</span>
        )}
      </div>

      {isLocked && (
        <div style={{ background: '#1a1a0a', border: '1px solid #D4AF3733', borderRadius: '10px', padding: '16px', marginTop: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <p style={{ color: '#D4AF37', fontSize: '13px', flex: 1, minWidth: '200px' }}>Upgrade to Starter or Elite to connect agents to your sites.</p>
          <button onClick={() => navigate('/pricing')} className="btn-gold" style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '13px', whiteSpace: 'nowrap' }}>View Plans →</button>
        </div>
      )}

      <div style={{ opacity: isLocked ? 0.5 : 1, pointerEvents: isLocked ? 'none' : 'auto', marginTop: isLocked ? '0' : '20px' }}>
        {agents.map((section, si) => (
          <div key={si} style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '11px', color: '#D4AF37', fontWeight: '700', letterSpacing: '1px', marginBottom: '14px' }}>{section.category.toUpperCase()}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {section.items.map((agent, i) => (
                <div key={i} className="card-hover" style={{ background: '#202024', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '16px', position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '120px' }}>
                  <span style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '9px', background: '#1a1a1a', color: '#666', padding: '3px 7px', borderRadius: '8px', fontWeight: '600' }}>Soon</span>
                  <span style={{ fontSize: '24px', marginBottom: '10px' }}>{agent.icon}</span>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{agent.name}</div>
                  <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.5' }}>{agent.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
