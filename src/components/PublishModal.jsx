import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useToast } from './ToastManager'
import { updateProject } from '../lib/projects'
import ShowcaseSubmitModal from './ShowcaseSubmitModal'

export default function PublishModal({ onClose, project, onUpdate }) {
  const { theme } = useTheme()
  const addToast = useToast()
  const [view, setView] = useState('main')
  const [copied, setCopied] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [editingUrl, setEditingUrl] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [urlInput, setUrlInput] = useState((project?.subdomain || 'yoursite.phaero.app').replace('.phaero.app', ''))

  const isPublished = project?.status === 'published'
  const subdomain = project?.subdomain || 'yoursite.phaero.app'
  const visibility = project?.visibility || 'public'

  const handleCopy = () => {
    navigator.clipboard?.writeText(`https://${subdomain}`)
    setCopied(true)
    addToast && addToast('URL copied!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePublish = async () => {
    setPublishing(true)
    const { data, error } = await updateProject(project.id, {
      status: 'published',
      published_at: new Date().toISOString(),
    })
    setPublishing(false)
    if (!error) {
      addToast && addToast('Site published! 🎉', 'success')
      onUpdate && onUpdate(data)
    }
  }

  const handleUnpublish = async () => {
    const { data, error } = await updateProject(project.id, { status: 'draft' })
    if (!error) {
      addToast && addToast('Site unpublished', 'info')
      onUpdate && onUpdate(data)
    }
  }

  const handleVisibility = async (val) => {
    const { data, error } = await updateProject(project.id, { visibility: val })
    if (!error) {
      onUpdate && onUpdate(data)
      addToast && addToast(`Visibility set to ${val}`, 'success')
    }
  }

  const handleSaveUrl = async () => {
    const cleaned = urlInput.toLowerCase().trim().replace(/[^a-z0-9-]/g, '')
    if (!cleaned) {
      addToast && addToast('Please enter a valid name', 'error')
      return
    }
    const newSubdomain = `${cleaned}.phaero.app`
    const { data, error } = await updateProject(project.id, { subdomain: newSubdomain })
    if (!error) {
      onUpdate && onUpdate(data)
      addToast && addToast('URL updated!', 'success')
      setEditingUrl(false)
    } else {
      addToast && addToast('That name might be taken, try another', 'error')
    }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: theme.overlayBg, zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '70px 20px 20px', backdropFilter: 'blur(4px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '14px', width: '360px', overflow: 'hidden', animation: 'fadeUp 0.2s ease', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>

        {view === 'main' ? (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isPublished ? '#25D366' : '#555' }} />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: theme.text }}>{isPublished ? 'Published' : 'Not Published'}</h3>
              </div>
              {isPublished && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button title="Analytics" style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.textMuted, width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>📊</button>
                  <button onClick={handleUnpublish} style={{ background: 'none', border: 'none', color: '#ff6666', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>Unpublish</button>
                </div>
              )}
            </div>

            {!isPublished ? (
              <button onClick={handlePublish} disabled={publishing} className="btn-gold" style={{ width: '100%', padding: '13px', borderRadius: '8px', fontSize: '14px', marginBottom: '8px' }}>
                {publishing ? 'Publishing...' : '🚀 Publish Now'}
              </button>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <p style={{ fontSize: '12px', color: theme.textFaint, fontWeight: '700' }}>WEBSITE URL</p>
                  <span onClick={() => setEditingUrl(!editingUrl)} style={{ fontSize: '11px', color: theme.gold, cursor: 'pointer', fontWeight: '600' }}>{editingUrl ? 'Cancel' : 'Edit'}</span>
                </div>

                {editingUrl ? (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: theme.bgSecondary, border: `1px solid ${theme.gold}66`, borderRadius: '8px', overflow: 'hidden' }}>
                      <input value={urlInput} onChange={e => setUrlInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveUrl()} style={{ flex: 1, background: 'transparent', border: 'none', color: theme.text, padding: '10px 12px', fontSize: '13px', outline: 'none' }} />
                      <span style={{ color: theme.textFaint, fontSize: '13px', paddingRight: '12px' }}>.phaero.app</span>
                    </div>
                    <button onClick={handleSaveUrl} className="btn-gold" style={{ width: '100%', padding: '10px', borderRadius: '8px', fontSize: '13px', marginTop: '8px' }}>Save URL</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: theme.bgSecondary, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '10px 12px', marginBottom: '16px' }}>
                    <span style={{ flex: 1, fontSize: '13px', color: theme.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subdomain}</span>
                    <button onClick={handleCopy} style={{ background: 'none', border: 'none', color: theme.gold, cursor: 'pointer', fontSize: '13px' }}>{copied ? '✓' : '📋'}</button>
                  </div>
                )}

                <p style={{ fontSize: '12px', color: theme.textFaint, fontWeight: '700', marginBottom: '8px' }}>WHO CAN SEE THIS WEBSITE</p>
                <div onClick={() => setView('settings')} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: theme.bgSecondary, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '12px', marginBottom: '16px', cursor: 'pointer' }}>
                  <span style={{ fontSize: '18px' }}>{visibility === 'public' ? '🌍' : '🔒'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: theme.text, textTransform: 'capitalize' }}>{visibility}</div>
                    <div style={{ fontSize: '11px', color: theme.textFaint }}>{visibility === 'public' ? 'Anyone with the URL' : 'Only you can view'}</div>
                  </div>
                  <span style={{ color: theme.textFaint }}>›</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <button style={{ flex: 1, background: 'transparent', color: theme.text, border: `1px solid ${theme.border}`, padding: '10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>Review security</button>
                  <button onClick={() => setView('settings')} style={{ flex: 1, background: 'transparent', color: theme.text, border: `1px solid ${theme.border}`, padding: '10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>Edit settings</button>
                </div>

                <div style={{ background: theme.goldBg, color: theme.gold, textAlign: 'center', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>✓ Up to date</div>

                {project?.show_in_showcase ? (
                  <div style={{ background: project?.showcase_approved ? '#0a1a0a' : '#1a1a0a', border: `1px solid ${project?.showcase_approved ? '#25D36644' : theme.gold + '44'}`, borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{project?.showcase_approved ? '✅' : '⏳'}</span>
                    <span style={{ fontSize: '12px', color: project?.showcase_approved ? '#25D366' : theme.gold }}>{project?.showcase_approved ? 'Live in Showcase' : 'Pending review'}</span>
                  </div>
                ) : (
                  <button onClick={() => setShowSubmitModal(true)} style={{ width: '100%', background: 'transparent', color: theme.gold, border: `1px solid ${theme.gold}66`, padding: '11px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                    🌍 Submit to Showcase
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <button onClick={() => setView('main')} style={{ background: 'none', border: 'none', color: theme.textFaint, cursor: 'pointer', fontSize: '16px' }}>←</button>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: theme.text }}>Edit settings</h3>
            </div>

            <p style={{ fontSize: '12px', color: theme.textFaint, fontWeight: '700', marginBottom: '8px' }}>URL</p>
            <div style={{ display: 'flex', alignItems: 'center', background: theme.bgSecondary, border: `1px solid ${theme.border}`, borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
              <input value={urlInput} onChange={e => setUrlInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveUrl()} style={{ flex: 1, background: 'transparent', border: 'none', color: theme.text, padding: '12px', fontSize: '13px', outline: 'none' }} />
              <span style={{ color: theme.textFaint, fontSize: '13px', paddingRight: '12px' }}>.phaero.app</span>
            </div>
            <button onClick={handleSaveUrl} className="btn-gold" style={{ width: '100%', padding: '11px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>Update URL</button>

            <p style={{ fontSize: '12px', color: theme.textFaint, fontWeight: '700', marginBottom: '8px' }}>VISIBILITY</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              {[{ key: 'public', label: 'Public', desc: 'Anyone with the URL', icon: '🌍' }, { key: 'private', label: 'Private', desc: 'Only you can view', icon: '🔒' }].map(opt => (
                <div key={opt.key} onClick={() => handleVisibility(opt.key)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', cursor: 'pointer', background: visibility === opt.key ? theme.goldBg : theme.bgSecondary, border: `1px solid ${visibility === opt.key ? theme.gold + '66' : theme.border}` }}>
                  <span style={{ fontSize: '16px' }}>{opt.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: visibility === opt.key ? theme.gold : theme.text }}>{opt.label}</div>
                    <div style={{ fontSize: '11px', color: theme.textFaint }}>{opt.desc}</div>
                  </div>
                  {visibility === opt.key && <span style={{ color: theme.gold }}>✓</span>}
                </div>
              ))}
            </div>

            <p style={{ fontSize: '12px', color: theme.textFaint, fontWeight: '700', marginBottom: '8px' }}>WEBSITE INFO</p>
            <div style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '12px', fontSize: '13px', color: theme.text }}>{project?.name}</div>
          </div>
        )}
      </div>
      {showSubmitModal && <ShowcaseSubmitModal onClose={() => setShowSubmitModal(false)} project={project} onUpdate={onUpdate} />}
    </div>
  )
}
