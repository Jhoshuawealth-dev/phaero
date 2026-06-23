import { useState, useRef } from 'react'
import { uploadImage } from '../lib/storage'
import { useAuth } from '../context/AuthContext'

export default function ImageUpload({ value, onChange, height = '100px', label = 'Upload image' }) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setUploading(true)
    const { url, error } = await uploadImage(file, user?.id || 'anon')
    setUploading(false)
    if (url) onChange(url)
  }

  return (
    <div
      onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        handleFile(file)
      }}
      style={{
        height, borderRadius: '6px', cursor: 'pointer', position: 'relative', overflow: 'hidden',
        background: value ? `url(${value})` : '#1a1a1a',
        backgroundSize: 'cover', backgroundPosition: 'center',
        border: dragOver ? '2px dashed #D4AF37' : value ? 'none' : '2px dashed #2a2a2a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'border 0.15s',
      }}
    >
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />

      {uploading ? (
        <div style={{ color: '#D4AF37', fontSize: '11px', fontWeight: '700' }}>Uploading...</div>
      ) : !value ? (
        <div style={{ textAlign: 'center', color: '#555' }}>
          <div style={{ fontSize: '20px', marginBottom: '4px' }}>📷</div>
          <div style={{ fontSize: '10px' }}>{label}</div>
        </div>
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}>
          <span style={{ color: '#fff', fontSize: '10px', fontWeight: '700', opacity: 0 }} className="upload-hint">Change image</span>
        </div>
      )}
    </div>
  )
}
