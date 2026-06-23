import { useState, useRef, useEffect } from 'react'

export default function EditableText({ value, onChange, style, tag = 'div', placeholder = 'Click to edit' }) {
  const [editing, setEditing] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus()
      const range = document.createRange()
      range.selectNodeContents(ref.current)
      range.collapse(false)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }, [editing])

  const Tag = tag

  return (
    <Tag
      ref={ref}
      contentEditable={editing}
      suppressContentEditableWarning
      onClick={(e) => { e.stopPropagation(); setEditing(true) }}
      onBlur={(e) => { setEditing(false); onChange(e.target.innerText) }}
      onKeyDown={(e) => { if (e.key === 'Enter' && tag !== 'p') { e.preventDefault(); e.target.blur() } }}
      style={{
        ...style,
        cursor: 'text',
        outline: editing ? '2px solid #D4AF37' : 'none',
        outlineOffset: '2px',
        borderRadius: '3px',
        transition: 'outline 0.15s',
        minWidth: '20px',
        display: 'inline-block',
      }}
      onMouseEnter={(e) => { if (!editing) e.currentTarget.style.outline = '1px dashed #D4AF3766' }}
      onMouseLeave={(e) => { if (!editing) e.currentTarget.style.outline = 'none' }}
    >
      {value || placeholder}
    </Tag>
  )
}
