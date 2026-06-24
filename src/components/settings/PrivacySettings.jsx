import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { useToast } from '../ToastManager'

function Toggle({ checked, onChange }) {
  return (
    <div onClick={onChange} style={{ width: '40px', height: '22px', background: checked ? '#D4AF37' : '#222', borderRadius: '11px', cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
      <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: checked ? '21px' : '3px', transition: 'left 0.2s' }} />
    </div>
  )
}

export default function PrivacySettings() {
  const { profile, refreshProfile } = useAuth()
  const addToast = useToast()
  const [settings, setSettings] = useState({
    default_project_visibility: profile?.default_project_visibility || 'public',
    require_security_check: profile?.require_security_check ?? false,
    data_collection_optout: profile?.data_collection_optout ?? false,
    allow_public_preview_links: profile?.allow_public_preview_links ?? true,
  })

  const updateField = async (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    const { error } = await supabase.from('profiles').update({ [field]: value }).eq('id', profile.id)
    if (error) {
      addToast && addToast('Failed to save', 'error')
    } else {
      if (refreshProfile) refreshProfile()
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>Privacy & Security</h1>
      <p style={{ color: '#555', fontSize: '13px', marginBottom: '32px' }}>Manage privacy and security settings for your account.</p>

      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '13px', fontWeight: '700', color: '#D4AF37', marginBottom: '4px' }}>ACCESS</p>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>Choose who can access projects you create.</p>

        <div style={{ background: '#202024', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '16px', marginBottom: '10px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Default project visibility</div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>New projects are public or private by default.</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['public', 'private'].map(v => (
              <button key={v} onClick={() => updateField('default_project_visibility', v)} style={{
                flex: 1, padding: '8px', borderRadius: '6px', fontSize: '12px', textTransform: 'capitalize', cursor: 'pointer',
                background: settings.default_project_visibility === v ? '#D4AF37' : 'transparent',
                color: settings.default_project_visibility === v ? '#000' : '#888',
                border: `1px solid ${settings.default_project_visibility === v ? '#D4AF37' : '#222'}`,
              }}>{v}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '13px', fontWeight: '700', color: '#D4AF37', marginBottom: '4px' }}>PUBLISHING</p>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>Control how your projects are published.</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#202024', border: '1px solid #1e1e1e', borderRadius: '10px', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '2px' }}>Require basic check before publish</div>
            <div style={{ fontSize: '11px', color: '#666' }}>Run a basic review before a project can go live for the first time.</div>
          </div>
          <Toggle checked={settings.require_security_check} onChange={() => updateField('require_security_check', !settings.require_security_check)} />
        </div>
      </div>

      <div>
        <p style={{ fontSize: '13px', fontWeight: '700', color: '#D4AF37', marginBottom: '4px' }}>SHARING</p>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>Control how you share projects and preview links.</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#202024', border: '1px solid #1e1e1e', borderRadius: '10px', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '2px' }}>Allow public preview links</div>
            <div style={{ fontSize: '11px', color: '#666' }}>Let yourself create temporary public preview links to your in-progress sites.</div>
          </div>
          <Toggle checked={settings.allow_public_preview_links} onChange={() => updateField('allow_public_preview_links', !settings.allow_public_preview_links)} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#202024', border: '1px solid #1e1e1e', borderRadius: '10px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '2px' }}>Opt out of data collection</div>
            <div style={{ fontSize: '11px', color: '#666' }}>Stop anonymous usage analytics for your account.</div>
          </div>
          <Toggle checked={settings.data_collection_optout} onChange={() => updateField('data_collection_optout', !settings.data_collection_optout)} />
        </div>
      </div>
    </div>
  )
}
