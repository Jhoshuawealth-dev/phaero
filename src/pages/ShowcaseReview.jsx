import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { getPendingSubmissions, approveSubmission, rejectSubmission } from '../lib/showcase'
import { useToast } from '../components/ToastManager'
import PageLoader from '../components/PageLoader'

export default function ShowcaseReview() {
  const navigate = useNavigate()
  const { profile, loading: authLoading } = useAuth()
  const addToast = useToast()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [actioningId, setActioningId] = useState(null)

  useEffect(() => {
    if (authLoading) return
    if (!profile?.is_admin) {
      navigate('/')
      return
    }
    getPendingSubmissions().then(({ data }) => {
      setSubmissions(data || [])
      setLoading(false)
    })
  }, [authLoading, profile])

  const handleApprove = async (id) => {
    setActioningId(id)
    const { error } = await approveSubmission(id)
    setActioningId(null)
    if (!error) {
      setSubmissions(prev => prev.filter(s => s.id !== id))
      addToast && addToast('Approved! Now live in Showcase.', 'success')
    } else {
      addToast && addToast('Failed to approve', 'error')
    }
  }

  const handleReject = async (id) => {
    setActioningId(id)
    const { error } = await rejectSubmission(id)
    setActioningId(null)
    if (!error) {
      setSubmissions(prev => prev.filter(s => s.id !== id))
      addToast && addToast('Rejected', 'info')
    } else {
      addToast && addToast('Failed to reject', 'error')
    }
  }

  if (authLoading || loading) return <PageLoader text="LOADING SUBMISSIONS..." />
  if (!profile?.is_admin) return null

  return (
    <div style={{ background: '#16161A', color: '#fff', fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      <Navbar />

      <section style={{ padding: '60px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ color: '#D4AF37', fontSize: '13px', letterSpacing: '2px', fontWeight: '600', marginBottom: '8px' }}>ADMIN</p>
          <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>Showcase Review Queue</h1>
          <p style={{ color: '#555', fontSize: '14px', marginBottom: '40px' }}>{submissions.length} pending submission{submissions.length !== 1 ? 's' : ''}</p>

          {submissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#444' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <p>No pending submissions right now.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {submissions.map(sub => (
                <div key={sub.id} style={{ background: '#202024', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', display: 'flex', gap: '20px' }}>
                  <div style={{ width: '120px', height: '90px', background: sub.color || '#8B4513', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '60px', height: '6px', background: '#D4AF37', borderRadius: '3px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{sub.name}</h3>
                        <p style={{ fontSize: '12px', color: '#555' }}>{sub.subdomain}</p>
                      </div>
                      <span style={{ fontSize: '11px', background: '#D4AF3722', color: '#D4AF37', padding: '3px 10px', borderRadius: '10px' }}>{sub.showcase_category}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#888', marginBottom: '8px', lineHeight: '1.6' }}>{sub.showcase_description}</p>
                    <p style={{ fontSize: '12px', color: '#444', marginBottom: '16px' }}>
                      By {sub.showcase_show_name ? (sub.profiles?.full_name || 'Phaero Builder') : 'Phaero Builder'} ({sub.profiles?.email}) · Submitted {new Date(sub.showcase_submitted_at).toLocaleDateString()}
                    </p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => window.open(`https://${sub.subdomain}`, '_blank')} style={{ background: 'transparent', color: '#aaa', border: '1px solid #222', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>View Site ↗</button>
                      <button onClick={() => handleReject(sub.id)} disabled={actioningId === sub.id} style={{ background: 'transparent', color: '#ff6666', border: '1px solid #ff444444', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>Reject</button>
                      <button onClick={() => handleApprove(sub.id)} disabled={actioningId === sub.id} className="btn-gold" style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '12px' }}>
                        {actioningId === sub.id ? 'Working...' : '✓ Approve'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
