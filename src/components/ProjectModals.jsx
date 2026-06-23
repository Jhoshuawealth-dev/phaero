import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useToast } from './ToastManager'

function ModalShell({ onClose, children, title }) {
  const { theme } = useTheme()
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: theme.overlayBg, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '14px', maxWidth: '380px', width: '100%', padding: '24px', animation: 'fadeUp 0.25s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: theme.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.textMuted, width: '26px', height: '26px', borderRadius: '8px', cursor: 'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function RenameModal({ currentName, onClose, onSave }) {
  const { theme } = useTheme()
  const addToast = useToast()
  const [name, setName] = useState(currentName)

  const handleSave = () => {
    if (!name.trim()) return
    onSave && onSave(name)
    addToast && addToast('Project renamed!', 'success')
    onClose()
  }

  return (
    <ModalShell onClose={onClose} title="Rename project">
      <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSave()} autoFocus className="input-gold" style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.text, padding: '12px 14px', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '20px' }} />
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onClose} style={{ flex: 1, background: 'transparent', color: theme.textMuted, border: `1px solid ${theme.border}`, padding: '11px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Cancel</button>
        <button onClick={handleSave} className="btn-gold" style={{ flex: 1, padding: '11px', borderRadius: '8px', fontSize: '13px' }}>Save</button>
      </div>
    </ModalShell>
  )
}

export function MoveToFolderModal({ onClose, onMove }) {
  const { theme } = useTheme()
  const addToast = useToast()
  const [selected, setSelected] = useState(null)
  const folders = ['Client Projects', 'Personal', 'Archived', 'Drafts']

  const handleMove = () => {
    if (!selected) return
    onMove && onMove(selected)
    addToast && addToast(`Moved to "${selected}"`, 'success')
    onClose()
  }

  return (
    <ModalShell onClose={onClose} title="Move to folder">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
        {folders.map((f, i) => (
          <div key={i} onClick={() => setSelected(f)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 12px', borderRadius: '8px', cursor: 'pointer', background: selected === f ? theme.goldBg : theme.bgSecondary, border: `1px solid ${selected === f ? theme.gold + '66' : theme.border}` }}>
            <span>📁</span>
            <span style={{ fontSize: '14px', color: selected === f ? theme.gold : theme.text, fontWeight: selected === f ? '700' : '400' }}>{f}</span>
            {selected === f && <span style={{ marginLeft: 'auto', color: theme.gold }}>✓</span>}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 12px', borderRadius: '8px', cursor: 'pointer', border: `1px dashed ${theme.border}`, color: theme.textFaint, fontSize: '14px' }}>
          <span>+</span> New folder
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onClose} style={{ flex: 1, background: 'transparent', color: theme.textMuted, border: `1px solid ${theme.border}`, padding: '11px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Cancel</button>
        <button onClick={handleMove} className="btn-gold" style={{ flex: 1, padding: '11px', borderRadius: '8px', fontSize: '13px' }}>Move</button>
      </div>
    </ModalShell>
  )
}

export function DetailsModal({ onClose, project }) {
  const { theme } = useTheme()
  const data = project || { name: 'Zara Ankara Boutique', created: 'June 17, 2026', updated: '2 hours ago', credits: 6, pages: 4, url: 'zarankara.phaero.app', status: 'Published' }

  return (
    <ModalShell onClose={onClose} title="Project details">
      {[
        { label: 'Project Name', value: data.name },
        { label: 'Status', value: data.status },
        { label: 'Live URL', value: data.url },
        { label: 'Created', value: data.created },
        { label: 'Last Updated', value: data.updated },
        { label: 'Credits Used', value: `${data.credits} credits` },
        { label: 'Pages', value: `${data.pages} pages` },
      ].map((row, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 6 ? `1px solid ${theme.border}` : 'none', fontSize: '13px' }}>
          <span style={{ color: theme.textFaint }}>{row.label}</span>
          <span style={{ color: theme.text, fontWeight: '600' }}>{row.value}</span>
        </div>
      ))}
      <button onClick={onClose} style={{ width: '100%', background: theme.bgSecondary, color: theme.text, border: `1px solid ${theme.border}`, padding: '11px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', marginTop: '20px' }}>Close</button>
    </ModalShell>
  )
}
