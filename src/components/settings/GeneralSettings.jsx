import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getProjects } from '../../lib/projects'

export default function GeneralSettings() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])

  useEffect(() => {
    if (user) getProjects(user.id).then(({ data }) => setProjects(data || []))
  }, [user])

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>General</h1>
      <p style={{ color: '#555', fontSize: '13px', marginBottom: '32px' }}>An overview of all your projects on Phaero.</p>

      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {[
            { label: 'Total Projects', value: projects.length },
            { label: 'Published', value: projects.filter(p => p.status === 'published').length },
            { label: 'Drafts', value: projects.filter(p => p.status !== 'published').length },
            { label: 'In Showcase', value: projects.filter(p => p.show_in_showcase).length },
          ].map((s, i) => (
            <div key={i} style={{ background: '#0d0d0d', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#D4AF37' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#555' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
        <p style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>All Projects</p>
        {projects.length === 0 ? (
          <p style={{ color: '#555', fontSize: '13px' }}>No projects yet.</p>
        ) : (
          projects.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1a1a1a', fontSize: '13px' }}>
              <span>{p.name}</span>
              <span style={{ color: p.status === 'published' ? '#25D366' : '#555', fontSize: '11px' }}>{p.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
