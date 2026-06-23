import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import PageLoader from '../components/PageLoader'
import { generateBlocksFromPrompt } from '../lib/generateBlocks'
import { siteDataToBlocks } from '../lib/aiToBlocks'
import { updateProject } from '../lib/projects'
import { tryPerformAction } from '../lib/actionGuard'
import UpgradeRequiredModal from '../components/UpgradeRequiredModal'
import { useAuth } from '../context/AuthContext'
import { createProject } from '../lib/projects'

const chips = [
  { label: 'Fashion Store', icon: '👗' },
  { label: 'Restaurant', icon: '🍽️' },
  { label: 'Church Website', icon: '⛪' },
  { label: 'Portfolio', icon: '🎨' },
  { label: 'Clinic', icon: '🏥' },
  { label: 'Event Page', icon: '🎉' },
  { label: 'Logistics Company', icon: '🚚' },
  { label: 'School', icon: '🏫' },
  { label: 'Salon', icon: '💇' },
  { label: 'Real Estate', icon: '🏠' },
  { label: 'NGO', icon: '🤝' },
  { label: 'Tech Startup', icon: '🚀' },
]

const examples = [
  "I run a fashion boutique in Lagos that sells ankara dresses and accessories online...",
  "I own a suya spot in Abuja with 3 branches. I want customers to find us and order...",
  "We are a Pentecostal church in Accra. We need a site for sermons and donations...",
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, profile, refreshProfile } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showInsufficientCredits, setShowInsufficientCredits] = useState(false)
  const [exampleIndex, setExampleIndex] = useState(0)

  const handleChip = (chip) => setPrompt(`Build a ${chip.label.toLowerCase()} website`)

  const handleBuild = async () => {
    if (!prompt.trim()) return

    const guard = await tryPerformAction({
      actionKey: 'project_creation',
      userId: user?.id,
      userPlan: profile?.plan || 'free',
      currentCredits: profile?.credits ?? 0,
    })

    if (!guard.allowed) {
      if (guard.reason === 'PLAN_LOCKED') setShowUpgradeModal(true)
      else setShowInsufficientCredits(true)
      return
    }

    if (refreshProfile) await refreshProfile()

    setLoading(true)

    const { site, error } = await generateBlocksFromPrompt(prompt)
    const businessName = site?.businessName || (prompt.length > 40 ? prompt.slice(0, 40) + '...' : prompt)
    let newProject = null

    if (user) {
      const { data } = await createProject(user.id, businessName, 'General')
      newProject = data
    }

    let generatedBlocks = []
    if (!error && site) {
      generatedBlocks = siteDataToBlocks(site)
      if (newProject?.id) {
        await updateProject(newProject.id, { canvas_data: generatedBlocks })
      }
    }

    navigate('/builder', {
      state: {
        isNew: true,
        prompt,
        projectName: businessName,
        projectId: newProject?.id,
        preloadBlocks: generatedBlocks.length > 0 ? generatedBlocks : null,
        aiResponseMessage: site?.responseMessage || null,
      }
    })
  }

  if (loading) return <PageLoader text="BUILDING YOUR SITE..." />

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{ padding: '16px 40px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0d0d0d' }}>
        <img src={logo} alt="Phaero" style={{ height: '44px', cursor: 'pointer' }} onClick={() => navigate('/')} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#111', border: '1px solid #1e1e1e', borderRadius: '20px', padding: '6px 14px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D4AF37', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#D4AF37', fontSize: '13px', fontWeight: '600' }}>10 credits</span>
          </div>
          <div onClick={() => navigate('/dashboard')} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#D4AF3733', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#D4AF37', cursor: 'pointer' }}>J</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>

        {/* Hero text */}
        <div style={{ textAlign: 'center', marginBottom: '48px', animation: 'fadeUp 0.6s ease forwards' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1a1a0a', border: '1px solid #D4AF3744', borderRadius: '20px', padding: '6px 16px', marginBottom: '24px', fontSize: '13px', color: '#D4AF37' }}>
            <span>👑</span> Welcome to Phaero
          </div>
          <h1 style={{ fontSize: '52px', fontWeight: '900', marginBottom: '12px', letterSpacing: '-1.5px', lineHeight: '1.1' }}>
            What do you want to{' '}
            <span className="gold-shimmer">build?</span>
          </h1>
          <p style={{ color: '#555', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: '1.7' }}>
            Describe your business in plain English — Phaero builds a complete, styled, functional website in seconds.
          </p>
        </div>

        {/* Prompt box */}
        <div style={{ width: '100%', maxWidth: '720px', marginBottom: '20px', animation: 'fadeUp 0.7s ease forwards', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: '-1px', borderRadius: '13px', background: 'linear-gradient(135deg, #D4AF3733, transparent, #D4AF3722)', pointerEvents: 'none', zIndex: 0 }} />
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={examples[exampleIndex]}
            rows={5}
            style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px 20px 48px', color: '#fff', fontSize: '15px', outline: 'none', resize: 'none', fontFamily: 'Inter, sans-serif', lineHeight: '1.7', boxSizing: 'border-box', position: 'relative', zIndex: 1, transition: 'border-color 0.2s, box-shadow 0.2s' }}
            onFocus={e => { e.target.style.borderColor = '#D4AF37'; e.target.style.boxShadow = '0 0 0 3px #D4AF3718' }}
            onBlur={e => { e.target.style.borderColor = '#2a2a2a'; e.target.style.boxShadow = 'none' }}
            onKeyDown={e => e.key === 'Enter' && e.metaKey && handleBuild()}
          />
          <div style={{ position: 'absolute', bottom: '14px', left: '20px', right: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
            <span style={{ color: '#333', fontSize: '12px' }}>{prompt.length} chars · ⌘+Enter to build</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setExampleIndex((exampleIndex + 1) % examples.length)} style={{ background: '#1a1a1a', color: '#555', border: '1px solid #222', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>💡 Example</button>
            </div>
          </div>
        </div>

        {/* Chips */}
        <div style={{ width: '100%', maxWidth: '720px', marginBottom: '36px', animation: 'fadeUp 0.8s ease forwards' }}>
          <p style={{ color: '#333', fontSize: '11px', marginBottom: '12px', letterSpacing: '1.5px', fontWeight: '700' }}>QUICK START</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {chips.map((chip, i) => {
              const active = prompt === `Build a ${chip.label.toLowerCase()} website`
              return (
                <button key={i} onClick={() => handleChip(chip)} style={{ background: active ? '#D4AF37' : '#111', color: active ? '#000' : '#555', border: `1px solid ${active ? '#D4AF37' : '#222'}`, padding: '8px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{chip.icon}</span> {chip.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Build button */}
        <div style={{ animation: 'fadeUp 0.9s ease forwards' }}>
          <button onClick={handleBuild} disabled={!prompt.trim()} className={prompt.trim() ? 'btn-gold' : ''} style={{ background: prompt.trim() ? undefined : '#111', color: prompt.trim() ? '#000' : '#333', border: prompt.trim() ? 'none' : '1px solid #222', padding: '18px 64px', borderRadius: '12px', fontWeight: '800', fontSize: '18px', cursor: prompt.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>👑</span>
            Build with Phaero
            <span style={{ fontSize: '14px', opacity: 0.7 }}>→</span>
          </button>
          <p style={{ color: '#2a2a2a', fontSize: '12px', textAlign: 'center', marginTop: '12px' }}>Uses 2 credits · 10 remaining today</p>
        </div>

      </div>

      {/* Bottom decorative grid */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, #D4AF3708 1px, transparent 0)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 }} />

      {showUpgradeModal && <UpgradeRequiredModal onClose={() => setShowUpgradeModal(false)} actionKey="full_mvp_build" />}
      {showInsufficientCredits && (
        <div onClick={() => setShowInsufficientCredits(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', maxWidth: '380px', width: '100%', padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚡</div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>Out of credits</h3>
            <p style={{ color: '#888', fontSize: '13px', lineHeight: '1.7', marginBottom: '24px' }}>You don't have enough credits for this action. They'll refresh tomorrow, or you can upgrade for more.</p>
            <button onClick={() => navigate('/pricing')} className="btn-gold" style={{ width: '100%', padding: '13px', borderRadius: '8px', fontSize: '14px', marginBottom: '10px' }}>View Plans →</button>
            <button onClick={() => setShowInsufficientCredits(false)} style={{ width: '100%', background: 'transparent', color: '#666', border: '1px solid #222', padding: '11px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
