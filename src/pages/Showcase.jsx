import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getShowcaseProjects, likeProject } from '../lib/showcase'
import { useAuth } from '../context/AuthContext'

const categories = ['All', 'Fashion', 'Restaurant', 'Church', 'Healthcare', 'Logistics', 'Education', 'Beauty', 'Real Estate', 'Non-Profit', 'Startup', 'Events', 'Portfolio', 'Other']

export default function Showcase() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [active, setActive] = useState('All')
  const [search, setSearch] = useState('')
  const [liked, setLiked] = useState([])
  const [visible, setVisible] = useState(6)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getShowcaseProjects().then(({ data, error }) => {
      setProjects(data || [])
      setLoading(false)
    })
  }, [])

  const filtered = projects
    .filter(s => active === 'All' || s.showcase_category === active)
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || (s.showcase_category || '').toLowerCase().includes(search.toLowerCase()))

  const toggleLike = async (project) => {
    if (liked.includes(project.id)) return
    const { data, error } = await likeProject(project.id, project.likes_count)
    if (!error && data) {
      setLiked(prev => [...prev, project.id])
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, likes_count: data.likes_count } : p))
    }
  }

  return (
    <div style={{ background: '#16161A', color: '#fff', fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      <Navbar />

      <section className="section-pad" style={{ textAlign: 'center', padding: '80px 60px 40px' }}>
        <p style={{ color: '#D4AF37', fontSize: '13px', letterSpacing: '2px', fontWeight: '600', marginBottom: '12px' }}>COMMUNITY</p>
        <h1 style={{ fontSize: '56px', fontWeight: '900', marginBottom: '16px', letterSpacing: '-2px' }}>Built with <span className="gold-shimmer">Phaero</span></h1>
        <p style={{ color: '#555', fontSize: '17px', maxWidth: '480px', margin: '0 auto 32px', lineHeight: '1.7' }}>Real websites built by real African businesses. Vote for your favorites.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-gold" style={{ padding: '13px 28px', borderRadius: '8px', fontSize: '14px' }}>Submit Your Site →</button>
      </section>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', padding: '28px 60px', background: '#1C1C21', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', flexWrap: 'wrap' }}>
        {[
          { number: `${projects.length}`, label: 'Sites Showcased' },
          { number: `${projects.reduce((sum, p) => sum + (p.likes_count || 0), 0)}`, label: 'Total Votes' },
          { number: `${new Set(projects.map(p => p.showcase_category)).size}`, label: 'Categories' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#D4AF37', marginBottom: '2px' }}>{s.number}</div>
            <div style={{ fontSize: '12px', color: '#555' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="section-pad" style={{ padding: '32px 60px 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#444', fontSize: '16px' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or category..." className="input-gold" style={{ width: '100%', background: '#202024', border: '1px solid #1e1e1e', color: '#fff', padding: '11px 14px 11px 40px', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
        </div>
      </div>

      <div className="section-pad" style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', padding: '24px 60px' }}>
        {categories.map((c, i) => (
          <button key={i} onClick={() => setActive(c)} style={{ background: active === c ? '#D4AF37' : '#202024', color: active === c ? '#000' : '#555', border: `1px solid ${active === c ? '#D4AF37' : '#222'}`, padding: '7px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>{c}</button>
        ))}
      </div>

      <section className="section-pad" style={{ padding: '0 60px 80px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#444' }}>Loading showcase...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌍</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{projects.length === 0 ? 'No sites in the showcase yet' : 'No results found'}</h3>
            <p style={{ color: '#555' }}>{projects.length === 0 ? 'Be the first to submit your published site!' : 'Try a different search or category.'}</p>
          </div>
        ) : (
          <>
            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
              {filtered.slice(0, visible).map((site) => (
                <div key={site.id} className="card-hover" style={{ background: '#202024', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ height: '200px', background: site.color || '#8B4513', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <div style={{ width: '120px', height: '10px', background: '#D4AF37', borderRadius: '3px', margin: '0 auto 8px' }} />
                      <div style={{ width: '90px', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', margin: '0 auto 6px' }} />
                      <div style={{ width: '70px', height: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '3px', margin: '0 auto' }} />
                    </div>
                    <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#D4AF37', color: '#000', fontSize: '10px', fontWeight: '800', padding: '3px 10px', borderRadius: '10px' }}>{site.showcase_category}</div>
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', borderRadius: '6px', padding: '3px 8px', fontSize: '10px', color: '#aaa' }}>Built with Phaero</div>
                  </div>
                  <div style={{ padding: '18px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{site.name}</h3>
                    <p style={{ color: '#555', fontSize: '12px', marginBottom: '8px' }}>by {site.showcase_show_name ? (site.profiles?.full_name || 'Phaero Builder') : 'Phaero Builder'}</p>
                    {site.showcase_description && <p style={{ color: '#777', fontSize: '12px', marginBottom: '14px', lineHeight: '1.5' }}>{site.showcase_description}</p>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button onClick={() => toggleLike(site)} style={{ background: 'none', border: 'none', color: liked.includes(site.id) ? '#D4AF37' : '#444', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px', padding: 0 }}>
                        <span style={{ fontSize: '16px' }}>{liked.includes(site.id) ? '♥' : '♡'}</span> {site.likes_count || 0}
                      </button>
                      <button onClick={() => window.open(`https://${site.subdomain}`, '_blank')} style={{ background: 'transparent', color: '#D4AF37', border: '1px solid #D4AF3766', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>View Site →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {visible < filtered.length && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button onClick={() => setVisible(v => v + 6)} style={{ background: 'transparent', color: '#D4AF37', border: '1px solid #D4AF37', padding: '12px 32px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
                  Load More ({filtered.length - visible} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="section-pad" style={{ padding: '80px 60px', textAlign: 'center', background: '#1C1C21' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '16px' }}>Your site belongs <span className="gold-shimmer">here</span></h2>
        <p style={{ color: '#555', marginBottom: '32px' }}>Publish your site and submit it to the community showcase.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-gold" style={{ padding: '16px 40px', borderRadius: '8px', fontSize: '16px' }}>Go to Dashboard →</button>
      </section>
      <Footer />
    </div>
  )
}
