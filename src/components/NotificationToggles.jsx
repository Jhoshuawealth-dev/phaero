import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useToast } from './ToastManager'

const defaultPrefs = {
  site_published: true,
  credit_low: true,
  new_features: false,
  weekly_summary: false,
  payment_received: true,
  team_activity: false,
}

const labels = {
  site_published: { label: 'Site published successfully', desc: 'Get notified when your site goes live' },
  credit_low: { label: 'Credit running low', desc: 'Alert when you have 2 or fewer credits left' },
  new_features: { label: 'New Phaero features', desc: 'Be the first to know about new tools' },
  weekly_summary: { label: 'Weekly build summary', desc: 'A summary of your activity every Monday' },
  payment_received: { label: 'Payment received', desc: 'Notify when a customer pays via Paystack' },
  team_activity: { label: 'Team activity', desc: 'Updates when teammates make changes' },
}

export default function NotificationToggles({ profile, refreshProfile }) {
  const addToast = useToast()
  const [prefs, setPrefs] = useState(profile?.notification_prefs || defaultPrefs)
  const [saving, setSaving] = useState(false)

  const toggle = async (key) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] }
    setPrefs(newPrefs)
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ notification_prefs: newPrefs }).eq('id', profile.id)
    setSaving(false)
    if (error) {
      addToast && addToast('Failed to save preference', 'error')
      setPrefs(prefs) // revert
    } else {
      if (refreshProfile) refreshProfile()
    }
  }

  return (
    <div>
      {Object.keys(labels).map((key) => (
        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#202024', border: '1px solid #1e1e1e', borderRadius: '10px', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '2px' }}>{labels[key].label}</div>
            <div style={{ fontSize: '11px', color: '#555' }}>{labels[key].desc}</div>
          </div>
          <div onClick={() => toggle(key)} style={{ width: '40px', height: '22px', background: prefs[key] ? '#D4AF37' : '#222', borderRadius: '11px', cursor: 'pointer', position: 'relative', flexShrink: 0, opacity: saving ? 0.6 : 1 }}>
            <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: prefs[key] ? '21px' : '3px', transition: 'left 0.2s' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
