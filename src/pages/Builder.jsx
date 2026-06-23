import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import PageLoader from '../components/PageLoader'
import CodeView from '../components/CodeView'
import PublishModal from '../components/PublishModal'
import ProjectMenu from '../components/ProjectMenu'
import { useTheme } from '../context/ThemeContext'
import { askPhaeroAI } from '../lib/ai'
import { useAuth } from '../context/AuthContext'
import { getProjects, updateProject } from '../lib/projects'
import { saveVersion, getVersions } from '../lib/versions'
import { pushToGitHub } from '../lib/github'
import { deductCredits } from '../lib/credits'
import SupabaseConnectModal from '../components/SupabaseConnectModal'
import GitHubModal from '../components/GitHubModal'
import ThemeToggle from '../components/ThemeToggle'
import BuilderTips from '../components/BuilderTips'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import DraggableBlock from '../components/DraggableBlock'
import PageCanvas from '../components/PageCanvas'
import { defaultBlockData } from '../components/BlockLibrary'
import BlockSettingsPanel from '../components/BlockSettingsPanel'
import { tryPerformAction } from '../lib/actionGuard'
import UpgradeRequiredModal from '../components/UpgradeRequiredModal'

const blocks = ['Hero Banner', 'About Section', 'Services', 'Pricing Table', 'Testimonials', 'Contact Form', 'Photo Gallery', 'Team Section', 'FAQ Accordion', 'WhatsApp CTA', 'Paystack Button', 'Footer']
const devices = [
  { label: 'Desktop', width: '100%', svg: (active) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={active ? '#000' : '#666'} strokeWidth="2"><rect x="2" y="4" width="20" height="13" rx="1.5"/><path d="M8 21h8M12 17v4"/></svg>
  )},
  { label: 'Tablet', width: '600px', svg: (active) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={active ? '#000' : '#666'} strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M11 18h2"/></svg>
  )},
  { label: 'Mobile', width: '390px', svg: (active) => (
    <svg width="13" height="15" viewBox="0 0 24 24" fill="none" stroke={active ? '#000' : '#666'} strokeWidth="2"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>
  )},
]

export default function Builder() {
  const navigate = useNavigate()
  const location = useLocation()
  const isNew = location.state?.isNew || false
  const incomingPrompt = location.state?.prompt || ''
  const incomingName = location.state?.projectName || 'Untitled Project'
  const incomingPreloadBlocks = location.state?.preloadBlocks || null
  const incomingAiMessage = location.state?.aiResponseMessage || null
  const [prompt, setPrompt] = useState('')
  const [buildingNewSite, setBuildingNewSite] = useState(isNew)
  const [buildStage, setBuildStage] = useState(0)
  const [messages, setMessages] = useState(
    isNew ? [] : [
      { role: 'ai', text: '👑 Your fashion boutique site is ready! I\'ve added a hero, product gallery, Paystack checkout, and WhatsApp button. Type a prompt to make changes.' }
    ]
  )
  const [device, setDevice] = useState(0)
  const [activeTab, setActiveTab] = useState('blocks')
  const [viewMode, setViewMode] = useState('preview')
  const [loading, setLoading] = useState(false)
  const [published, setPublished] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [showPublish, setShowPublish] = useState(false)
  const [currentProject, setCurrentProject] = useState(null)
  const [canvasBlocks, setCanvasBlocks] = useState(incomingPreloadBlocks || [])
  const [versions, setVersions] = useState([])
  const [restoringId, setRestoringId] = useState(null)
  const [githubPushing, setGithubPushing] = useState(false)
  const [githubResult, setGithubResult] = useState(null)
  const [showSupabaseModal, setShowSupabaseModal] = useState(false)
  const [showGithubModal, setShowGithubModal] = useState(false)
  const [activeDragId, setActiveDragId] = useState(null)
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragStart = (event) => setActiveDragId(event.active.id)

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveDragId(null)
    if (!over) return

    if (String(active.id).startsWith('sidebar-')) {
      if ((profile?.credits ?? 0) < 0.5) {
        setCreditError(true)
        setTimeout(() => setCreditError(false), 3000)
        return
      }
      const blockType = String(active.id).replace('sidebar-', '')
      const newBlock = { uid: `block-${Date.now()}`, type: blockType, data: { ...defaultBlockData[blockType] } }
      setCanvasBlocks(prev => [...prev, newBlock])

      if (user) {
        const result = await deductCredits(user.id, 0.5)
        if (!result.error) await refreshProfile()
      }
    } else {
      if (active.id !== over.id) {
        setCanvasBlocks(prev => {
          const oldIndex = prev.findIndex(b => b.uid === active.id)
          const newIndex = prev.findIndex(b => b.uid === over.id)
          if (oldIndex === -1 || newIndex === -1) return prev
          return arrayMove(prev, oldIndex, newIndex)
        })
      }
    }
  }

  const handleRemoveBlock = (uid) => {
    setCanvasBlocks(prev => prev.filter(b => b.uid !== uid))
    if (selectedBlockId === uid) setSelectedBlockId(null)
  }

  const handleUpdateBlock = (uid, newData) => {
    setCanvasBlocks(prev => prev.map(b => b.uid === uid ? { ...b, data: newData } : b))
  }

  const handleRestoreVersion = (version) => {
    setRestoringId(version.id)
    setCanvasBlocks(version.snapshot)
    setSelectedBlockId(null)
    setTimeout(() => setRestoringId(null), 1500)
  }

  const handleGithubPush = async () => {
    setGithubPushing(true)
    setGithubResult(null)
    const result = await pushToGitHub(currentProject?.name || 'Phaero Site', canvasBlocks, currentProject?.github_repo)
    setGithubPushing(false)

    if (result.error === 'NEED_CONNECT') {
      const proceed = window.confirm('Connect your GitHub account to push this project? You will be redirected to GitHub.')
      if (proceed) {
        await connectGitHubRepo('/builder')
      }
      return
    }
    if (result.error) {
      alert(`GitHub push failed: ${result.error}`)
      return
    }
    setGithubResult(result)

    if (currentProject?.id) {
      const { data } = await updateProject(currentProject.id, {
        github_repo: result.repoName,
        github_connected: true,
      })
      if (data) setCurrentProject(data)
    }
  }

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins} min ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return new Date(dateStr).toLocaleDateString()
  }
  const incomingProjectId = location.state?.projectId || null
  const preloadBlocks = location.state?.preloadBlocks || null
  const { theme } = useTheme()
  const { user, connectGitHubRepo, profile, refreshProfile } = useAuth()
  const [creditError, setCreditError] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeActionKey, setUpgradeActionKey] = useState(null)

  const handleGatedAction = async (actionKey, label) => {
    const guard = await tryPerformAction({
      actionKey,
      userId: user?.id,
      userPlan: profile?.plan || 'free',
      currentCredits: profile?.credits ?? 0,
    })

    if (!guard.allowed) {
      if (guard.reason === 'PLAN_LOCKED') {
        setUpgradeActionKey(actionKey)
        setShowUpgradeModal(true)
      } else {
        setCreditError(true)
        setTimeout(() => setCreditError(false), 4000)
      }
      return
    }

    if (refreshProfile) await refreshProfile()
    setMessages(prev => [...prev, { role: 'ai', text: `✅ ${label} started! This feature is coming soon to Phaero — your credits for this action have been reserved.` }])
  }
  const [mobileView, setMobileView] = useState('canvas')

  // Load existing version history when project is known
  useEffect(() => {
    if (!currentProject?.id) return
    getVersions(currentProject.id).then(({ data }) => {
      if (data) setVersions(data)
    })
    const pending = localStorage.getItem(`pending_prompt_${currentProject.id}`)
    if (pending) setPrompt(pending)
  }, [currentProject?.id])

  // Autosave a version whenever canvasBlocks changes meaningfully (debounced)
  useEffect(() => {
    if (!currentProject?.id || !user || canvasBlocks.length === 0) return
    const timer = setTimeout(async () => {
      const { data } = await saveVersion(currentProject.id, user.id, canvasBlocks)
      if (data) setVersions(prev => [data, ...prev].slice(0, 30))

      // Also save the live canvas state to the project itself so it persists on reload
      await updateProject(currentProject.id, { canvas_data: canvasBlocks })
    }, 2500)
    return () => clearTimeout(timer)
  }, [canvasBlocks, currentProject?.id, user])

  useEffect(() => {
    if (!user) return
    if (incomingProjectId) {
      getProjects(user.id).then(({ data }) => {
        const found = data?.find(p => p.id === incomingProjectId)
        if (found) {
          setCurrentProject(found)
          if (preloadBlocks) setCanvasBlocks(preloadBlocks)
          else if (found.canvas_data) setCanvasBlocks(found.canvas_data)
        } else {
          setCurrentProject({ id: incomingProjectId, name: incomingName || 'Untitled', status: 'draft', subdomain: 'untitled.phaero.app', visibility: 'public' })
        }
      })
    } else {
      getProjects(user.id).then(({ data }) => {
        if (data && data.length > 0) {
          setCurrentProject(data[0])
          if (data[0].canvas_data) setCanvasBlocks(data[0].canvas_data)
        } else {
          setCurrentProject({ id: null, name: 'Untitled', status: 'draft', subdomain: 'untitled.phaero.app', visibility: 'public' })
        }
      })
    }
  }, [user, incomingProjectId])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    setTimeout(() => setInitialLoad(false), 1200)
  }, [])

  useEffect(() => {
    if (!buildingNewSite) return
    const stages = [
      'Reading your prompt...',
      'Generating layout...',
      'Writing content...',
      'Styling your site...',
      'Almost done...'
    ]
    let i = 0
    const interval = setInterval(() => {
      i++
      setBuildStage(i)
      if (i >= stages.length) {
        clearInterval(interval)
        setTimeout(() => {
          setBuildingNewSite(false)
          setMessages([{ role: 'ai', text: incomingAiMessage ? `👑 ${incomingAiMessage}` : `👑 Your site is ready! Based on "${incomingPrompt}", I've built a complete layout. Type a prompt to make changes.` }])
        }, 800)
      }
    }, 1100)
    return () => clearInterval(interval)
  }, [buildingNewSite])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendPrompt = async () => {
    if (!prompt.trim() || loading) return

    if ((profile?.credits ?? 0) < 1) {
      setCreditError(true)
      setTimeout(() => setCreditError(false), 4000)
      if (currentProject?.id) localStorage.setItem(`pending_prompt_${currentProject.id}`, prompt)
      return
    }

    const userMsg = prompt
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setPrompt('')
    if (currentProject?.id) localStorage.removeItem(`pending_prompt_${currentProject.id}`)
    setLoading(true)

    const { text, error } = await askPhaeroAI(userMsg, 'Zara Ankara Boutique, a fashion website')

    if (!error) {
      const result = await deductCredits(user.id, 1)
      if (!result.error) await refreshProfile()
    }

    if (error) {
      setMessages(prev => [...prev, { role: 'ai', text: `⚠️ ${error}` }])
    } else {
      setMessages(prev => [...prev, { role: 'ai', text }])
    }
    setLoading(false)
  }

  const handlePublish = () => {
    setPublished(true)
    setTimeout(() => setPublished(false), 3000)
  }

  if (initialLoad) return <PageLoader text="LOADING BUILDER..." />

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', height: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Top bar */}
      <div className="builder-topbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid #1a1a1a', background: '#0d0d0d', flexShrink: 0 }}>
        <div className="builder-topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <div onClick={() => setShowMenu(!showMenu)} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', transition: 'background 0.15s' }}>
              <img src={logo} alt="Phaero" style={{ height: '32px' }} />
              <div style={{ width: '1px', height: '20px', background: '#222' }} />
              <span style={{ fontSize: '13px', color: '#aaa', fontWeight: '600' }}>{currentProject?.name || incomingName || 'Loading...'}</span>
              <span style={{ fontSize: '10px', color: '#25D366', background: '#25D36618', border: '1px solid #25D36633', padding: '2px 7px', borderRadius: '8px' }}>● Saved</span>
              <span style={{ color: '#555', fontSize: '10px' }}>▾</span>
            </div>
            {showMenu && <ProjectMenu onClose={() => setShowMenu(false)} projectName={currentProject?.name || incomingName || 'Untitled'} plan="Free" onGithubPush={() => setShowGithubModal(true)} onSupabaseConnect={() => setShowSupabaseModal(true)} onToggleCode={() => setViewMode(viewMode === 'code' ? 'preview' : 'code')} githubConnected={githubResult || currentProject?.github_connected} supabaseConnected={currentProject?.supabase_connected} viewMode={viewMode} />}
          </div>
        </div>

        {/* Device switcher */}
        <div className="builder-device-switcher" style={{ display: 'flex', gap: '2px', background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '3px' }}>
          {devices.map((d, i) => (
            <button key={i} onClick={() => setDevice(i)} title={d.label} style={{ background: device === i ? '#D4AF37' : 'transparent', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center' }}>{d.svg(device === i)}</button>
          ))}
        </div>

        <ThemeToggle position="static" />

        <div className="builder-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button className="hide-mobile" style={{ background: 'transparent', color: '#555', border: '1px solid #1e1e1e', padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>↗ Preview</button>
          <button className="hide-mobile" onClick={() => setViewMode(viewMode === 'code' ? 'preview' : 'code')} style={{ background: viewMode === 'code' ? '#D4AF3722' : 'transparent', color: viewMode === 'code' ? '#D4AF37' : '#555', border: `1px solid ${viewMode === 'code' ? '#D4AF3766' : '#1e1e1e'}`, padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>{'</>'} {viewMode === 'code' ? 'Preview' : 'Code'}</button>
          <button className="hide-mobile" onClick={() => setShowGithubModal(true)} title={currentProject?.github_repo ? `Connected: ${currentProject.github_repo}` : 'Connect to GitHub'} style={{ background: currentProject?.github_connected ? '#25D36622' : 'transparent', color: currentProject?.github_connected ? '#25D366' : '#555', border: `1px solid ${currentProject?.github_connected ? '#25D36666' : '#1e1e1e'}`, padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
            {currentProject?.github_connected ? '✓ Synced' : '🐙 GitHub'}
          </button>
          <button className="hide-mobile" onClick={() => setShowSupabaseModal(true)} title={currentProject?.supabase_connected ? 'Supabase connected' : 'Connect Supabase'} style={{ background: currentProject?.supabase_connected ? '#25D36622' : 'transparent', color: currentProject?.supabase_connected ? '#25D366' : '#555', border: `1px solid ${currentProject?.supabase_connected ? '#25D36666' : '#1e1e1e'}`, padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
            ⚡ {currentProject?.supabase_connected ? 'Connected' : 'Supabase'}
          </button>
          <button onClick={() => setShowPublish(true)} style={{ background: currentProject?.status === 'published' ? 'linear-gradient(135deg,#25D366,#1ea854)' : 'linear-gradient(135deg,#D4AF37,#f5d876)', color: '#000', border: 'none', padding: '7px 18px', borderRadius: '6px', fontWeight: '800', cursor: 'pointer', fontSize: '13px', transition: 'all 0.3s', boxShadow: currentProject?.status === 'published' ? '0 4px 16px #25D36644' : '0 4px 16px #D4AF3744' }}>
            {currentProject?.status === 'published' ? '✓ Published' : '🚀 Publish'}
          </button>
        </div>
      </div>

      {/* Main */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="builder-main-grid" style={{ display: 'grid', gridTemplateColumns: selectedBlockId && viewMode !== 'code' ? '220px 1fr 240px 280px' : '220px 1fr 280px', flex: 1, overflow: 'hidden', transition: 'grid-template-columns 0.2s' }}>

        {/* Left sidebar */}
        <div className={`builder-sidebar ${mobileView === 'blocks' ? 'mobile-open' : ''}`} style={{ background: '#0d0d0d', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="mobile-only" style={{ padding: '10px 12px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#D4AF37', fontWeight: '700' }}>Blocks</span>
            <button onClick={() => setMobileView('canvas')} style={{ background: '#1a1a1a', border: '1px solid #222', color: '#fff', width: '28px', height: '28px', borderRadius: '6px', fontSize: '14px' }}>✕</button>
          </div>
          <div style={{ display: 'flex', borderBottom: '1px solid #1a1a1a' }}>
            {['blocks', 'pages', 'history'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: '11px 4px', background: 'transparent', color: activeTab === t ? '#D4AF37' : '#444', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: activeTab === t ? '2px solid #D4AF37' : '2px solid transparent', transition: 'all 0.15s' }}>{t}</button>
            ))}
          </div>

          <div style={{ padding: '12px', overflowY: 'auto', flex: 1 }}>
            {activeTab === 'blocks' && (
              <>
                <BuilderTips theme={theme} />
                <p style={{ fontSize: '10px', color: '#333', marginBottom: '10px', fontWeight: '700', letterSpacing: '1.5px' }}>DRAG TO ADD</p>
                {blocks.map((b, i) => (
                  <DraggableBlock key={i} id={b} label={b} />
                ))}
              </>
            )}
            {activeTab === 'pages' && (
              <>
                <p style={{ fontSize: '10px', color: '#333', marginBottom: '10px', fontWeight: '700', letterSpacing: '1.5px' }}>PAGES</p>
                {['Home', 'About', 'Shop', 'Contact'].map((p, i) => (
                  <div key={i} style={{ background: i === 0 ? '#1a1a0a' : '#111', border: `1px solid ${i === 0 ? '#D4AF3766' : '#1a1a1a'}`, borderRadius: '6px', padding: '9px 12px', marginBottom: '5px', fontSize: '12px', color: i === 0 ? '#D4AF37' : '#555', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {p} {i === 0 && <span style={{ fontSize: '10px', background: '#D4AF3722', padding: '1px 5px', borderRadius: '4px' }}>active</span>}
                  </div>
                ))}
                <button style={{ width: '100%', background: 'transparent', color: '#444', border: '1px dashed #222', borderRadius: '6px', padding: '9px', fontSize: '12px', cursor: 'pointer', marginTop: '8px' }}>+ Add Page</button>
              </>
            )}
            {activeTab === 'history' && (
              <>
                <p style={{ fontSize: '10px', color: '#333', marginBottom: '10px', fontWeight: '700', letterSpacing: '1.5px' }}>VERSION HISTORY</p>
                {versions.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#444', lineHeight: '1.6' }}>No saved versions yet. Keep editing — Phaero autosaves your progress.</p>
                ) : (
                  versions.map((v, i) => (
                    <div key={v.id} style={{ background: i === 0 ? '#1a1a0a' : '#111', border: `1px solid ${i === 0 ? '#D4AF3766' : '#1a1a1a'}`, borderRadius: '6px', padding: '9px 12px', marginBottom: '5px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: i === 0 ? '#D4AF37' : '#aaa' }}>{timeAgo(v.created_at)}{i === 0 ? ' — Latest' : ''}</div>
                        <div style={{ fontSize: '10px', color: '#444' }}>{v.snapshot?.length || 0} block{v.snapshot?.length === 1 ? '' : 's'}</div>
                      </div>
                      {i > 0 && (
                        <span onClick={() => handleRestoreVersion(v)} style={{ fontSize: '10px', color: restoringId === v.id ? '#25D366' : '#D4AF37', fontWeight: '700' }}>
                          {restoringId === v.id ? '✓ Restored' : 'Restore'}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>

        {/* Preview */}
        <div style={{ background: viewMode === 'code' ? '#1e1e1e' : '#141414', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: viewMode === 'code' ? 'hidden' : 'auto', padding: viewMode === 'code' ? '0' : '24px', backgroundImage: viewMode === 'code' ? 'none' : 'radial-gradient(circle at 1px 1px, #1e1e1e 1px, transparent 0)', backgroundSize: '24px 24px', position: 'relative' }}>
          {viewMode === 'code' ? (
            <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
              <CodeView />
            </div>
          ) : buildingNewSite ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '28px' }}>
                <div style={{ position: 'absolute', inset: '-16px', borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#D4AF37', animation: 'spin 1s linear infinite' }} />
                <img src={logo} alt="Phaero" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
              </div>
              <div style={{ color: '#D4AF37', fontSize: '15px', fontWeight: '700', marginBottom: '8px', letterSpacing: '0.5px' }}>
                {['Reading your prompt...', 'Generating layout...', 'Writing content...', 'Styling your site...', 'Almost done...'][buildStage] || 'Starting...'}
              </div>
              <div style={{ color: '#444', fontSize: '13px', maxWidth: '320px' }}>Phaero is building your site based on what you described.</div>
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '20px' }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{ width: '24px', height: '4px', borderRadius: '2px', background: i <= buildStage ? '#D4AF37' : '#222', transition: 'background 0.3s' }} />
                ))}
              </div>
            </div>
          ) : null}
          {viewMode !== 'code' && !buildingNewSite && (
            <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', width: devices[device].width, maxWidth: '100%', transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)', minHeight: '500px' }}>
              <PageCanvas items={canvasBlocks} onRemove={handleRemoveBlock} onUpdate={handleUpdateBlock} selectedId={selectedBlockId} onSelect={setSelectedBlockId} projectName={currentProject?.name} />
            </div>
          )}
        </div>

        {viewMode !== 'code' && selectedBlockId && (
          <BlockSettingsPanel
            block={canvasBlocks.find(b => b.uid === selectedBlockId)}
            onUpdate={(newData) => handleUpdateBlock(selectedBlockId, newData)}
            onClose={() => setSelectedBlockId(null)}
          />
        )}

        {/* AI Chat */}
        <div className={`builder-ai-chat ${mobileView === 'chat' ? 'mobile-open' : ''}`} style={{ background: '#0d0d0d', borderLeft: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="mobile-only" style={{ padding: '10px 12px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#D4AF37', fontWeight: '700' }}>Osiris</span>
            <button onClick={() => setMobileView('canvas')} style={{ background: '#1a1a1a', border: '1px solid #222', color: '#fff', width: '28px', height: '28px', borderRadius: '6px', fontSize: '14px' }}>✕</button>
          </div>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#444', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '2px' }}>OSIRIS</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#25D366', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: '11px', color: creditError ? '#ff6666' : '#25D366' }}>{creditError ? 'Out of credits!' : `Online · ${profile?.credits ?? 0} credits left`}</span>
              </div>
            </div>
            <img src={logo} alt="Osiris" style={{ height: '28px', opacity: 0.7 }} />
          </div>

          <div style={{ display: 'flex', gap: '6px', padding: '0 16px 12px' }}>
            <button onClick={() => handleGatedAction('module_build', 'Module Build')} style={{ flex: 1, background: '#1a1a1a', border: '1px solid #222', color: '#888', padding: '8px 6px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>🔧 Build Module</button>
            <button onClick={() => handleGatedAction('full_mvp_build', 'Full MVP Build')} style={{ flex: 1, background: '#1a1a1a', border: '1px solid #222', color: '#888', padding: '8px 6px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>🚀 Build Full MVP</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', animation: 'fadeUp 0.3s ease forwards' }}>
                {msg.role === 'ai' && <img src={logo} alt="AI" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'contain', flexShrink: 0, background: '#1a1a0a', padding: '2px' }} />}
                <div style={{ background: msg.role === 'ai' ? '#1a1a0a' : '#1a1a1a', border: `1px solid ${msg.role === 'ai' ? '#D4AF3733' : '#222'}`, borderRadius: msg.role === 'ai' ? '4px 12px 12px 12px' : '12px 4px 12px 12px', padding: '10px 12px', fontSize: '13px', color: msg.role === 'ai' ? '#D4AF37' : '#aaa', maxWidth: '85%', lineHeight: '1.5' }}>{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <img src={logo} alt="AI" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'contain', flexShrink: 0, background: '#1a1a0a', padding: '2px', animation: 'spin 1s linear infinite' }} />
                <div style={{ background: '#1a1a0a', border: '1px solid #D4AF3733', borderRadius: '4px 12px 12px 12px', padding: '10px 14px', fontSize: '13px', color: '#D4AF37' }}>
                  <span style={{ animation: 'blink 0.8s infinite' }}>●</span>
                  <span style={{ animation: 'blink 0.8s 0.2s infinite' }}> ●</span>
                  <span style={{ animation: 'blink 0.8s 0.4s infinite' }}> ●</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid #1a1a1a', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['Make hero darker', 'Add pricing table', 'Change to blue theme', 'Add WhatsApp button'].map((s, i) => (
              <button key={i} onClick={() => setPrompt(s)} style={{ background: '#111', color: '#444', border: '1px solid #1e1e1e', padding: '4px 9px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', transition: 'all 0.15s', fontWeight: '500' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4AF3766'; e.currentTarget.style.color = '#D4AF37' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#444' }}>{s}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #1a1a1a', display: 'flex', gap: '8px' }}>
            <input value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendPrompt()} placeholder="Describe a change..." style={{ flex: 1, background: '#111', border: '1px solid #1e1e1e', color: '#fff', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#D4AF37'}
              onBlur={e => e.target.style.borderColor = '#1e1e1e'} />
            <button onClick={sendPrompt} disabled={loading || !prompt.trim()} style={{ background: prompt.trim() && !loading ? '#D4AF37' : '#111', color: prompt.trim() && !loading ? '#000' : '#333', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}>→</button>
          </div>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <div className="builder-mobile-tabs" style={{ display: 'none', background: '#0d0d0d', borderTop: '1px solid #1a1a1a', padding: '8px 12px', justifyContent: 'space-around', gap: '8px' }}>
        {[
          { key: 'blocks', label: 'Blocks', icon: '🧱' },
          { key: 'canvas', label: 'Site', icon: '🖥️' },
          { key: 'chat', label: 'AI Chat', icon: '💬' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setMobileView(tab.key)} style={{
            flex: 1, background: mobileView === tab.key ? '#1a1a0a' : 'transparent',
            border: 'none', borderRadius: '8px', padding: '8px 4px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
            color: mobileView === tab.key ? '#D4AF37' : '#555',
          }}>
            <span style={{ fontSize: '16px' }}>{tab.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: '600' }}>{tab.label}</span>
          </button>
        ))}
      </div>

      <DragOverlay>
        {activeDragId && String(activeDragId).startsWith('sidebar-') ? (
          <div style={{ background: '#1a1a0a', border: '1px solid #D4AF37', borderRadius: '6px', padding: '9px 12px', fontSize: '12px', color: '#D4AF37', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
            ⠿ {String(activeDragId).replace('sidebar-', '')}
          </div>
        ) : null}
      </DragOverlay>
      </DndContext>
      {showPublish && currentProject && <PublishModal onClose={() => setShowPublish(false)} project={currentProject} onUpdate={setCurrentProject} />}
      {showUpgradeModal && <UpgradeRequiredModal onClose={() => setShowUpgradeModal(false)} actionKey={upgradeActionKey} />}
      {showGithubModal && currentProject && <GitHubModal onClose={() => setShowGithubModal(false)} project={currentProject} onUpdate={setCurrentProject} canvasBlocks={canvasBlocks} />}
      {showSupabaseModal && currentProject && <SupabaseConnectModal onClose={() => setShowSupabaseModal(false)} project={currentProject} onUpdate={setCurrentProject} />}
    </div>
  )
}
