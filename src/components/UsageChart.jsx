import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function UsageChart({ userId }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    supabase
      .from('projects')
      .select('created_at')
      .eq('user_id', userId)
      .then(({ data }) => {
        setProjects(data || [])
        setLoading(false)
      })
  }, [userId])

  // Build last 7 days bucket
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d
  })

  const counts = days.map(day => {
    return projects.filter(p => {
      const pd = new Date(p.created_at)
      return pd.toDateString() === day.toDateString()
    }).length
  })

  const max = Math.max(...counts, 1)

  if (loading) return <div style={{ color: '#444', fontSize: '13px', padding: '20px 0' }}>Loading activity...</div>

  return (
    <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
      <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Projects Created — Last 7 Days</div>
      <div style={{ fontSize: '11px', color: '#555', marginBottom: '20px' }}>Total: {projects.length} project{projects.length !== 1 ? 's' : ''} all time</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px' }}>
        {counts.map((count, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '100%', maxWidth: '32px', height: `${Math.max((count / max) * 70, 4)}px`, background: count > 0 ? '#D4AF37' : '#222', borderRadius: '4px 4px 0 0', transition: 'height 0.3s' }} title={`${count} project${count !== 1 ? 's' : ''}`} />
            <span style={{ fontSize: '10px', color: '#444' }}>{days[i].toLocaleDateString('en', { weekday: 'short' })}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
