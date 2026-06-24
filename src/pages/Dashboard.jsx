import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useAuth } from '../context/AuthContext'
import { getProjects } from '../lib/projects'
import PageLoader from '../components/PageLoader'
import NotificationToggles from '../components/NotificationToggles'
import UsageChart from '../components/UsageChart'
import AgentsConnectors from '../components/AgentsConnectors'

function Sidebar({ tab, setTab, navigate, profile, signOut, mobileMenuOpen, setMobileMenuOpen }) {
  const initial = profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'
  return (
    <div className={`dashboard-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`} style={{ width: '240px', background: '#0d0d0d', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', padding: '0', minHeight: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 50 }}>
      <div className="dashboard-sidebar-logo" style={{ padding: '20px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src={logo} alt="Phaero" style={{ height: '44px', cursor: 'pointer' }} onClick={() => navigate('/')} />
        <button className="dashboard-mobile-close" onClick={() => setMobileMenuOpen(false)} style={{ display: 'none', background: '#1a1a1a', border: '1px solid #222', color: '#fff', width: '28px', height: '28px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>✕</button>
      </div>

      <div className="dashboard-sidebar-nav" style={{ padding: '12px', flex: 1 }}>
        <p style={{ fontSize: '11px', color: '#333', fontWeight: '700', letterSpacing: '1px', padding: '8px 12px', marginBottom: '4px' }}>MAIN</p>
        {[
          { icon: '⊞', label: 'Dashboard', key: 'projects' },
          { icon: '✦', label: 'New Project', key: 'new' },
          { icon: '🌍', label: 'Showcase', key: 'showcase' },
        ].map((item, i) => (
          <div key={i} onClick={() => item.key === 'new' ? navigate('/onboarding') : item.key === 'showcase' ? navigate('/showcase') : item.key === 'settings' ? navigate('/settings') : setTab(item.key)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '2px', background: tab === item.key ? '#1a1a0a' : 'transparent', color: tab === item.key ? '#D4AF37' : '#666', fontSize: '14px', fontWeight: tab === item.key ? '700' : '400' }}>
            <span style={{ fontSize: '16px' }}>{item.icon}</span> {item.label}
          </div>
        ))}

        <p style={{ fontSize: '11px', color: '#333', fontWeight: '700', letterSpacing: '1px', padding: '8px 12px', margin: '12px 0 4px' }}>ACCOUNT</p>
        {[
          { icon: '⚙️', label: 'Settings', key: 'settings' },
          { icon: '💳', label: 'Billing', key: 'billing' },
          { icon: '👥', label: 'Team', key: 'team' },
        ].map((item, i) => (
          <div key={i} onClick={() => { setMobileMenuOpen(false); navigate('/settings') }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '2px', background: tab === item.key ? '#1a1a0a' : 'transparent', color: tab === item.key ? '#D4AF37' : '#666', fontSize: '14px', fontWeight: tab === item.key ? '700' : '400' }}>
            <span style={{ fontSize: '16px' }}>{item.icon}</span> {item.label}
          </div>
        ))}
      </div>

      <div className="dashboard-sidebar-credits" style={{ margin: '0 12px 12px', background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: '#555', fontWeight: '600' }}>CREDITS</span>
          <span style={{ fontSize: '12px', color: '#D4AF37', fontWeight: '700' }}>{profile?.credits ?? 0} / 10</span>
        </div>
        <div style={{ height: '4px', background: '#222', borderRadius: '2px', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{ width: `${Math.min(((profile?.credits ?? 0) / 10) * 100, 100)}%`, height: '100%', background: '#D4AF37', borderRadius: '2px' }} />
        </div>
        <div style={{ fontSize: '11px', color: '#444', marginBottom: '10px' }}>Resets tomorrow · {profile?.plan === 'free' ? 'Free' : profile?.plan} plan</div>
        <button onClick={() => navigate('/upgrade?plan=elite')} style={{ width: '100%', background: '#D4AF37', color: '#000', border: 'none', padding: '7px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}>Upgrade →</button>
      </div>

      <div className="dashboard-sidebar-user" style={{ padding: '14px 16px', borderTop: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#D4AF3733', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#D4AF37', flexShrink: 0 }}>{initial}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile?.full_name || 'User'}</div>
          <div style={{ fontSize: '11px', color: '#444' }}>{profile?.plan === 'free' ? 'Free Plan' : `${profile?.plan} Plan`}</div>
        </div>
        <span title="Sign out" style={{ color: '#444', cursor: 'pointer', fontSize: '16px' }} onClick={async () => { await signOut(); navigate('/') }}>⏻</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, profile, signOut, refreshProfile } = useAuth()

  useEffect(() => {
    if (refreshProfile) refreshProfile()
  }, [])
  const [tab, setTab] = useState('projects')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('recent')
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)

  useEffect(() => {
    if (!user) return
    getProjects(user.id).then(({ data }) => {
      setProjects(data || [])
      setLoadingProjects(false)
    })
  }, [user])

  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="dashboard-outer" style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex' }}>
      <button className="dashboard-mobile-toggle" onClick={() => setMobileMenuOpen(true)} style={{ display: 'none', position: 'fixed', top: '16px', left: '16px', zIndex: 60, background: '#111', border: '1px solid #222', color: '#fff', width: '40px', height: '40px', borderRadius: '8px', fontSize: '18px', cursor: 'pointer' }}>☰</button>
      <Sidebar tab={tab} setTab={setTab} navigate={navigate} profile={profile} signOut={signOut} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <div className="dashboard-main-content" style={{ marginLeft: '240px', flex: 1, padding: '40px', minHeight: '100vh' }}>

        {tab === 'projects' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px' }}>My Projects</h1>
                <p style={{ color: '#555', fontSize: '14px' }}>{projects.length} project{projects.length !== 1 ? 's' : ''} · {profile?.plan === 'free' ? 'Free' : profile?.plan} plan</p>
              </div>
              <button onClick={() => navigate('/onboarding')} style={{ background: '#D4AF37', color: '#000', border: 'none', padding: '11px 22px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>+ New Project</button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." style={{ flex: 1, background: '#111', border: '1px solid #1e1e1e', color: '#fff', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: '#111', border: '1px solid #1e1e1e', color: '#aaa', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
                <option value="recent">Recently Updated</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>

            {loadingProjects ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#444' }}>Loading your projects...</div>
            ) : filtered.length === 0 ? (
              <div style={{ background: '#0d0d0d', border: '1px dashed #222', borderRadius: '14px', padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👑</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No projects yet</h3>
                <p style={{ color: '#555', fontSize: '14px', marginBottom: '24px' }}>Describe your business and Phaero will build your first site in seconds.</p>
                <button onClick={() => navigate('/onboarding')} style={{ background: '#D4AF37', color: '#000', border: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Build Your First Site →</button>
              </div>
            ) : (
              <div className="dashboard-projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {filtered.map((p) => (
                  <div key={p.id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#D4AF37'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}>
                    <div style={{ height: '150px', background: p.color, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => navigate('/builder', { state: { projectId: p.id, projectName: p.name } })}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '90px', height: '8px', background: '#D4AF37', borderRadius: '3px', margin: '0 auto 8px' }} />
                        <div style={{ width: '70px', height: '5px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', margin: '0 auto' }} />
                      </div>
                      <div style={{ position: 'absolute', top: '10px', right: '10px', background: p.status === 'published' ? '#25D36622' : '#1a1a1a', color: p.status === 'published' ? '#25D366' : '#555', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '10px', border: `1px solid ${p.status === 'published' ? '#25D36644' : '#333'}` }}>{p.status === 'published' ? 'Published' : 'Draft'}</div>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{p.name}</h3>
                      <p style={{ color: '#444', fontSize: '12px', marginBottom: '4px' }}>Updated {new Date(p.updated_at).toLocaleDateString()}</p>
                      <p style={{ color: '#333', fontSize: '11px', marginBottom: '14px' }}>🌐 {p.subdomain}</p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => navigate('/builder', { state: { projectId: p.id, projectName: p.name } })} style={{ flex: 1, background: 'transparent', color: '#fff', border: '1px solid #222', padding: '7px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>✏️ Edit</button>
                        <button style={{ flex: 1, background: 'transparent', color: '#D4AF37', border: '1px solid #D4AF3766', padding: '7px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>🌐 View</button>
                      </div>
                    </div>
                  </div>
                ))}

                <div onClick={() => navigate('/onboarding')} style={{ background: '#0d0d0d', border: '1px dashed #222', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '260px', cursor: 'pointer', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px dashed #333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#333' }}>+</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#555', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>New Project</div>
                    <div style={{ color: '#333', fontSize: '12px' }}>Describe and build in seconds</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'billing' && (
          <div style={{ maxWidth: '680px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>Billing</h1>
            <p style={{ color: '#555', fontSize: '14px', marginBottom: '32px' }}>Manage your plan and credit usage.</p>
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#555', fontWeight: '600', marginBottom: '6px' }}>CURRENT PLAN</div>
                  <div style={{ fontSize: '22px', fontWeight: '800', textTransform: 'capitalize' }}>{profile?.plan || 'free'}</div>
                </div>
                <button onClick={() => navigate('/upgrade?plan=elite')} style={{ background: '#D4AF37', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Upgrade Plan</button>
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <UsageChart userId={user?.id} />
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px' }}>Settings</h1>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', color: '#555', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Full Name</label>
              <input defaultValue={profile?.full_name} style={{ width: '100%', background: '#111', border: '1px solid #222', color: '#fff', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', color: '#555', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Email</label>
              <input defaultValue={profile?.email} disabled style={{ width: '100%', background: '#0d0d0d', border: '1px solid #222', color: '#555', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button style={{ background: '#D4AF37', color: '#000', border: 'none', padding: '12px 32px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Save Changes</button>

            <h2 style={{ fontSize: '18px', fontWeight: '800', marginTop: '48px', marginBottom: '8px' }}>Notifications</h2>
            <p style={{ color: '#555', fontSize: '13px', marginBottom: '20px' }}>Choose what updates you want to receive.</p>
            <NotificationToggles profile={profile} refreshProfile={refreshProfile} />

            <div style={{ marginTop: '48px' }}>
              <AgentsConnectors userPlan={profile?.plan} />
            </div>
          </div>
        )}

        {tab === 'team' && (
          <div style={{ maxWidth: '680px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>Team</h1>
            <p style={{ color: '#555', fontSize: '14px' }}>Upgrade to invite team members.</p>
          </div>
        )}
      </div>
    </div>
  )
}
