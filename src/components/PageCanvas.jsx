import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import BlockRenderer from './BlockRenderer'

function SortableBlock({ item, onRemove, onUpdate, isSelected, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.uid })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    outline: isSelected ? '2px solid #D4AF37' : 'none',
    outlineOffset: '-2px',
  }

  return (
    <div ref={setNodeRef} style={style} className="canvas-block-wrapper" onClick={() => onSelect(item.uid)}>
      <div {...attributes} {...listeners} style={{ position: 'absolute', top: '6px', left: '6px', zIndex: 5, background: 'rgba(0,0,0,0.5)', borderRadius: '4px', padding: '3px 6px', fontSize: '10px', color: '#D4AF37', cursor: 'grab', opacity: 0 }} className="block-handle">⠿ drag</div>
      <button onClick={(e) => { e.stopPropagation(); onRemove(item.uid) }} style={{ position: 'absolute', top: '6px', right: '6px', zIndex: 5, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', width: '22px', height: '22px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', opacity: 0 }} className="block-remove">✕</button>
      <BlockRenderer type={item.type} data={item.data} onUpdate={(newData) => onUpdate(item.uid, newData)} />
    </div>
  )
}

export default function PageCanvas({ items, onRemove, onUpdate, selectedId, onSelect, projectName }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-drop-zone' })

  return (
    <div ref={setNodeRef} onClick={() => onSelect(null)} className="site-content" style={{
      minHeight: '500px',
      position: 'relative',
      outline: isOver ? '2px dashed #D4AF37' : 'none',
      outlineOffset: '-2px',
      transition: 'outline 0.2s',
    }}>
      {items.length === 0 ? (
        <>
          {/* Looks like a real site header so it never feels "broken" */}
          <div style={{ padding: '60px 24px', textAlign: 'center', background: '#0d0d0d' }}>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#D4AF37', marginBottom: '8px' }}>{projectName || 'Your Website'}</div>
            <div style={{ fontSize: '13px', color: '#555' }}>This is your blank canvas — drag blocks from the left to start building</div>
          </div>

          <div style={{ position: 'absolute', inset: 0, top: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{
              textAlign: 'center', padding: '32px 40px', borderRadius: '12px',
              background: isOver ? 'rgba(212,175,55,0.08)' : 'transparent',
              border: isOver ? '2px dashed #D4AF37' : '2px dashed transparent',
              transition: 'all 0.2s',
            }}>
              <div style={{ fontSize: '28px', marginBottom: '10px', opacity: isOver ? 1 : 0.4 }}>🧱</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: isOver ? '#D4AF37' : '#bbb' }}>{isOver ? 'Drop it here!' : 'Drag a block here'}</div>
            </div>
          </div>
        </>
      ) : (
        <SortableContext items={items.map(i => i.uid)} strategy={verticalListSortingStrategy}>
          {items.map(item => (
            <SortableBlock key={item.uid} item={item} onRemove={onRemove} onUpdate={onUpdate} isSelected={selectedId === item.uid} onSelect={onSelect} />
          ))}
          {/* Drop zone at the end of existing blocks, always visible */}
          <div style={{
            padding: isOver ? '20px' : '8px', textAlign: 'center', color: isOver ? '#D4AF37' : '#333',
            fontSize: '11px', background: isOver ? 'rgba(212,175,55,0.06)' : 'transparent',
            border: isOver ? '1px dashed #D4AF3766' : 'none', transition: 'all 0.2s', margin: '4px'
          }}>
            {isOver ? '+ Drop to add block' : ''}
          </div>
        </SortableContext>
      )}
    </div>
  )
}
