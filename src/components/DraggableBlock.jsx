import { useDraggable } from '@dnd-kit/core'

export default function DraggableBlock({ id, label }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `sidebar-${id}` })

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={{
      background: '#202024', border: '1px solid #1a1a1a', borderRadius: '6px', padding: '9px 12px',
      marginBottom: '5px', fontSize: '12px', color: '#666', cursor: isDragging ? 'grabbing' : 'grab',
      display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.15s',
      opacity: isDragging ? 0.4 : 1,
    }}
      onMouseEnter={e => { if (!isDragging) { e.currentTarget.style.borderColor = '#D4AF3766'; e.currentTarget.style.color = '#D4AF37' } }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#666' }}>
      <span style={{ color: '#2a2a2a', fontSize: '14px' }}>⠿</span> {label}
    </div>
  )
}
