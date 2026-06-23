import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useAuth } from '../context/AuthContext'

import AccountSettings from '../components/settings/AccountSettings'
import GeneralSettings from '../components/settings/GeneralSettings'
import GitSettings from '../components/settings/GitSettings'
import DomainSettings from '../components/settings/DomainSettings'
import SupabaseSettings from '../components/settings/SupabaseSettings'
import BillingSettings from '../components/settings/BillingSettings'
import TeamSettings from '../components/settings/TeamSettings'
import AgentsSettings from '../components/settings/AgentsSettings'
import PrivacySettings from '../components/settings/PrivacySettings'
import NotificationSettings from '../components/settings/NotificationSettings'

const sections = [
  { group: 'ACCOUNT', items: [
    { key: 'account', label: 'Your Account', icon: '👤' },
    { key: 'notifications', label: 'Notifications', icon: '🔔' },
  ]},
  { group: 'PROJECT', items: [
    { key: 'general', label: 'General', icon: '⚙️' },
    { key: 'git', label: 'GitHub', icon: '🐙' },
    { key: 'supabase', label: 'Supabase', icon: '⚡' },
    { key: 'domains', label: 'Domains', icon: '🌐' },
  ]},
  { group: 'WORKSPACE', items: [
    { key: 'billing', label: 'Plans & Billing', icon: '💳' },
  ]},
  { group: 'MEMBERS & ACCESS', items: [
    { key: 'team', label: 'Team', icon: '👥' },
  ]},
  { group: 'AUTOMATION', items: [
    { key: 'agents', label: 'Agents & Connectors', icon: '🔗' },
  ]},
  { group: 'SECURITY & COMPLIANCE', items: [
    { key: 'privacy', label: 'Privacy & Security', icon: '🔒' },
  ]},
]

export default function SettingsLayout() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [active, setActive] = useState('account')

  const renderContent = () => {
    switch (active) {
      case 'account': return <AccountSettings />
      case 'notifications': return <NotificationSettings />
      case 'general': return <GeneralSettings />
      case 'git': return <GitSettings />
      case 'supabase': return <SupabaseSettings />
      case 'domains': return <DomainSettings />
      case 'billing': return <BillingSettings />
      case 'team': return <TeamSettings />
      case 'agents': return <AgentsSettings userPlan={profile?.plan} />
      case 'privacy': return <PrivacySettings />
      default: return null
    }
  }

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex' }}>

      {/* Settings sidebar */}
      <div style={{ width: '260px', background: '#0d0d0d', borderRight: '1px solid #1a1a1a', minHeight: '100vh', padding: '20px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 20px' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}>
            ← Go back
          </button>
        </div>

        {sections.map((section, si) => (
          <div key={si} style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '10px', color: '#333', fontWeight: '700', letterSpacing: '1px', padding: '0 20px', marginBottom: '6px' }}>{section.group}</p>
            {section.items.map(item => (
              <div key={item.key} onClick={() => setActive(item.key)} style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 20px', cursor: 'pointer',
                background: active === item.key ? '#1a1a0a' : 'transparent',
                color: active === item.key ? '#D4AF37' : '#999',
                fontSize: '13px', fontWeight: active === item.key ? '700' : '400',
                borderLeft: active === item.key ? '2px solid #D4AF37' : '2px solid transparent',
              }}>
                <span style={{ fontSize: '14px' }}>{item.icon}</span> {item.label}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Content area */}
      <div style={{ flex: 1, padding: '40px 48px', overflowY: 'auto', maxHeight: '100vh' }}>
        <div style={{ maxWidth: '700px' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
