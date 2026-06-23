import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useToast } from './ToastManager'
import { updateProject } from '../lib/projects'

const categories = ['Fashion', 'Restaurant', 'Church', 'Healthcare', 'Logistics', 'Education', 'Beauty', 'Real Estate', 'Non-Profit', 'Startup', 'Events', 'Portfolio', 'Other']

export default function ShowcaseSubmitModal({ onClose, project, onUpdate }) {
  const { theme } = useTheme()
  const addToast = useToast()
  const [category, setCategory] = useState(project?.showcase_category || '')
  const [description, setDescription] = useState(project?.showcase_description || '')
  const [showName, setShowName] = useState(project?.showcase_show_name ?? true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!category) {
      addToast && addToast('Please select a category', 'error')
      return
    }
    if (!description.trim() || description.trim().length < 10) {
      addToast && addToast('Please write a short description (at least 10 characters)', 'error')
      return
    }

    setSubmitting(true)
    const { data, error } = await updateProject(project.id, {
      show_in_showcase: true,
      showcase_category: category,
      showcase_description: description.trim(),
      showcase_show_name: showName,
      showcase_submitted_at: new Date().toISOString(),
      showcase_approved: false,
    })
    setSubmitting(false)

    if (!error) {
      setSubmitted(true)
      onUpdate && onUpdate(data)
    } else {
      addToast && addToast('Submission failed, please try again', 'error')
    }
  }

  if (submitted) {
    return (
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: theme.overlayBg, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
        <div onClick={e => e.stopPropagation()} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', maxWidth: '400px', width: '100%', padding: '32px', textAlign: 'center', animation: 'fadeUp 0.3s ease' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎉</div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: theme.text, marginBottom: '8px' }}>Submitted for review!</h3>
          <p style={{ color: theme.textMuted, fontSize: '13px', lineHeight: '1.7', marginBottom: '24px' }}>Your site is now pending review. Once approved, it'll appear in the Phaero community showcase where visitors can discover and vote on it.</p>
          <button onClick={onClose} className="btn-gold" style={{ padding: '12px 28px', borderRadius: '8px', fontSize: '14px' }}>Done</button>
        </div>
      </div>
    )
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: theme.overlayBg, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', maxWidth: '440px', width: '100%', overflow: 'hidden', animation: 'fadeUp 0.3s ease', maxHeight: '85vh', overflowY: 'auto' }}>

        <div style={{ padding: '24px', borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: theme.text }}>🌍 Submit to Showcase</h2>
            <button onClick={onClose} style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.textMuted, width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer' }}>✕</button>
          </div>
          <p style={{ color: theme.textMuted, fontSize: '13px', lineHeight: '1.6' }}>Let the Phaero community see your site, vote on it, and discover your business.</p>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '12px', color: theme.textFaint, fontWeight: '700', display: 'block', marginBottom: '8px' }}>CATEGORY</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.text, padding: '12px 14px', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', cursor: 'pointer' }}>
              <option value="">Select a category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '12px', color: theme.textFaint, fontWeight: '700', display: 'block', marginBottom: '8px' }}>DESCRIPTION</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell visitors what this site is about..." rows={3} className="input-gold" style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.text, padding: '12px 14px', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', resize: 'none', fontFamily: 'Inter, sans-serif' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: theme.bgSecondary, borderRadius: '8px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: theme.text }}>Show my name publicly</div>
              <div style={{ fontSize: '11px', color: theme.textFaint }}>Otherwise shown as "Phaero Builder"</div>
            </div>
            <div onClick={() => setShowName(!showName)} style={{ width: '44px', height: '24px', background: showName ? theme.gold : theme.border, borderRadius: '12px', cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
              <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: showName ? '23px' : '3px', transition: 'left 0.2s' }} />
            </div>
          </div>

          <p style={{ fontSize: '11px', color: theme.textFaint, marginBottom: '20px', lineHeight: '1.6' }}>Submissions are reviewed before appearing publicly. You'll be notified once approved.</p>

          <button onClick={handleSubmit} disabled={submitting} className="btn-gold" style={{ width: '100%', padding: '13px', borderRadius: '8px', fontSize: '14px' }}>
            {submitting ? 'Submitting...' : 'Submit for Review →'}
          </button>
        </div>
      </div>
    </div>
  )
}
