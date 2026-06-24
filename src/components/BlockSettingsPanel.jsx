import { colorOptions } from './BlockLibrary'

export default function BlockSettingsPanel({ block, onUpdate, onClose }) {
  if (!block) return null

  const update = (field, value) => onUpdate({ ...block.data, [field]: value })

  return (
    <div style={{ background: '#1C1C21', borderLeft: '1px solid #1a1a1a', padding: '16px', height: '100%', overflowY: 'auto', width: '240px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <p style={{ fontSize: '10px', color: '#444', fontWeight: '700', letterSpacing: '1px', marginBottom: '2px' }}>EDITING</p>
          <p style={{ fontSize: '13px', color: '#D4AF37', fontWeight: '700' }}>{block.type}</p>
        </div>
        <button onClick={onClose} style={{ background: '#1a1a1a', border: '1px solid #222', color: '#666', width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>✕</button>
      </div>

      <p style={{ fontSize: '11px', color: '#555', fontWeight: '600', marginBottom: '10px' }}>BACKGROUND COLOR</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '20px' }}>
        {colorOptions.map((c, i) => (
          <div key={i} onClick={() => update('bgColor', c)} style={{
            width: '100%', height: '32px', borderRadius: '6px', background: c, cursor: 'pointer',
            border: block.data.bgColor === c ? '2px solid #D4AF37' : '1px solid #2a2a2a',
            transition: 'border 0.15s'
          }} />
        ))}
      </div>

      <p style={{ fontSize: '11px', color: '#555', fontWeight: '600', marginBottom: '10px' }}>TIPS</p>
      <p style={{ fontSize: '12px', color: '#444', lineHeight: '1.6' }}>Click any text in the block to edit it directly. Click outside to save.</p>
    </div>
  )
}
