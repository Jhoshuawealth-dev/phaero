import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getProjects } from '../../lib/projects'
import { updateProject } from '../../lib/projects'
import { useToast } from '../ToastManager'

export default function SupabaseSettings() {
  const { user } = useAuth()
  const addToast = useToast()
  const [projects, setProjects] = useState([])

  useEffect(() => {
    if (user) getProjects(user.id).then(({ data }) => setProjects((data || []).filter(p => p.supabase_connected)))
  }, [user])

  const handleDisconnect = async (project) => {
    const { data, error } = await updateProject(project.id, {
      supabase_url: null, supabase_anon_key: null, supabase_connected: false, supabase_last_tested_at: null,
    })
    if (!error) {
      setProjects(prev => prev.filter(p => p.id !== project.id))
      addToast && addToast(`Disconnected from ${project.name}`, 'info')
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>Supabase</h1>
      <p style={{ color: '#555', fontSize: '13px', marginBottom: '32px' }}>Connect your own Supabase projects to give your sites a real backend.</p>

      <div style={{ background: '#1a1a0a', border: '1px solid #D4AF3733', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
        <p style={{ fontSize: '13px', color: '#D4AF37', lineHeight: '1.6' }}>⚡ Supabase connections are made per-project, since each site needs its own database. Open a project in Builder and click the Supabase button to connect it.</p>
      </div>

      <p style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>Connected Projects</p>
      {projects.length === 0 ? (
        <div style={{ background: '#202024', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '13px' }}>No projects connected to Supabase yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {projects.map(p => (
            <div key={p.id} style={{ background: '#202024', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700' }}>{p.name}</div>
                <div style={{ fontSize: '12px', color: '#555' }}>{p.supabase_url}</div>
              </div>
              <button onClick={() => handleDisconnect(p)} style={{ background: 'transparent', color: '#ff6666', border: '1px solid #ff444466', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Disconnect</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
