import { useState, useEffect } from 'react'

const PROMPT = "Build a fashion designer website"
const RESPONSE = "Building your fashion site... Done! Created a stunning ankara boutique with hero, gallery, Paystack checkout and WhatsApp button."

const blocks = ['Hero Banner', 'About Section', 'Services', 'Pricing Table', 'Testimonials', 'Contact Form', 'WhatsApp CTA', 'Paystack Button']

export default function BuilderDemo() {
  const [typedPrompt, setTypedPrompt] = useState('')
  const [typedResponse, setTypedResponse] = useState('')
  const [showResponse, setShowResponse] = useState(false)
  const [activeBlock, setActiveBlock] = useState(null)
  const [visibleSections, setVisibleSections] = useState([])
  const [cursorPos, setCursorPos] = useState({ x: 30, y: 80 })
  const [phase, setPhase] = useState('typing') // typing | responding | building | dragging

  // Phase 1: type the prompt
  useEffect(() => {
    if (phase !== 'typing') return
    let i = 0
    setTypedPrompt('')
    const interval = setInterval(() => {
      i++
      setTypedPrompt(PROMPT.slice(0, i))
      if (i >= PROMPT.length) {
        clearInterval(interval)
        setTimeout(() => {
          setShowResponse(true)
          setPhase('responding')
        }, 600)
      }
    }, 60)
    return () => clearInterval(interval)
  }, [phase])

  // Phase 2: type the response
  useEffect(() => {
    if (phase !== 'responding') return
    let i = 0
    setTypedResponse('')
    const interval = setInterval(() => {
      i++
      setTypedResponse(RESPONSE.slice(0, i))
      if (i >= RESPONSE.length) {
        clearInterval(interval)
        setTimeout(() => setPhase('building'), 600)
      }
    }, 30)
    return () => clearInterval(interval)
  }, [phase])

  // Phase 3: build sections one by one in preview
  useEffect(() => {
    if (phase !== 'building') return
    setVisibleSections([])
    const sections = ['hero', 'gallery', 'paystack', 'whatsapp']
    sections.forEach((s, i) => {
      setTimeout(() => {
        setVisibleSections(prev => [...prev, s])
        if (i === sections.length - 1) setTimeout(() => setPhase('dragging'), 800)
      }, i * 700)
    })
  }, [phase])

  // Phase 4: cursor moves through blocks
  useEffect(() => {
    if (phase !== 'dragging') return
    const targets = [
      { x: 30, y: 80, block: 0 },
      { x: 30, y: 120, block: 1 },
      { x: 30, y: 160, block: 2 },
      { x: 30, y: 200, block: 3 },
      { x: 30, y: 240, block: 4 },
    ]
    let i = 0
    const run = () => {
      if (i >= targets.length) {
        setTimeout(() => {
          setPhase('typing')
          setTypedPrompt('')
          setTypedResponse('')
          setShowResponse(false)
          setVisibleSections([])
          setActiveBlock(null)
          i = 0
        }, 1000)
        return
      }
      setCursorPos({ x: targets[i].x, y: targets[i].y })
      setActiveBlock(targets[i].block)
      i++
      setTimeout(run, 700)
    }
    run()
  }, [phase])

  return (
    <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
      {/* Glow */}
      <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', width: '70%', height: '60px', background: '#D4AF37', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.25 }} />

      {/* Browser chrome */}
      <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', position: 'relative', zIndex: 1 }}>

        {/* Title bar */}
        <div style={{ background: '#1a1a1a', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #2a2a2a' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28c840' }} />
          <div style={{ flex: 1, background: '#222', borderRadius: '4px', padding: '4px 12px', fontSize: '12px', color: '#555', marginLeft: '8px' }}>phaero.app/builder</div>
        </div>

        {/* Builder body */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 260px', height: '400px', position: 'relative' }}>

          {/* Sidebar blocks */}
          <div style={{ background: '#0f0f0f', borderRight: '1px solid #1a1a1a', padding: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px', fontWeight: '600', letterSpacing: '1px' }}>BLOCKS</div>
            {blocks.map((b, i) => (
              <div key={i} style={{
                background: activeBlock === i ? '#D4AF3722' : '#1a1a1a',
                border: `1px solid ${activeBlock === i ? '#D4AF37' : '#222'}`,
                borderRadius: '6px', padding: '8px 10px', marginBottom: '6px',
                fontSize: '12px', color: activeBlock === i ? '#D4AF37' : '#aaa',
                transition: 'all 0.2s', cursor: 'pointer'
              }}>{b}</div>
            ))}

            {/* Animated cursor */}
            {phase === 'dragging' && (
              <div style={{
                position: 'absolute',
                left: cursorPos.x,
                top: cursorPos.y,
                transition: 'all 0.5s ease',
                pointerEvents: 'none',
                zIndex: 10,
                fontSize: '18px'
              }}>🖱️</div>
            )}
          </div>

          {/* Preview */}
          <div style={{ background: '#0d0d0d', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {visibleSections.length === 0 && phase !== 'building' && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '13px' }}>
                {phase === 'typing' ? 'Waiting for prompt...' : 'Building your site...'}
              </div>
            )}

            {/* Hero section */}
            {visibleSections.includes('hero') && (
              <div style={{ background: '#111', padding: '16px', borderBottom: '1px solid #1a1a1a', animation: 'fadeIn 0.5s ease' }}>
                <div style={{ width: '70%', height: '10px', background: '#D4AF37', borderRadius: '3px', marginBottom: '6px' }} />
                <div style={{ width: '50%', height: '6px', background: '#333', borderRadius: '3px', marginBottom: '4px' }} />
                <div style={{ width: '40%', height: '6px', background: '#333', borderRadius: '3px' }} />
              </div>
            )}

            {/* Gallery */}
            {visibleSections.includes('gallery') && (
              <div style={{ padding: '10px', borderBottom: '1px solid #1a1a1a', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', animation: 'fadeIn 0.5s ease' }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{ height: '40px', background: '#1a1a1a', borderRadius: '4px' }} />
                ))}
              </div>
            )}

            {/* Paystack */}
            {visibleSections.includes('paystack') && (
              <div style={{ padding: '10px', borderBottom: '1px solid #1a1a1a', animation: 'fadeIn 0.5s ease' }}>
                <div style={{ background: '#D4AF37', borderRadius: '4px', padding: '6px 12px', fontSize: '11px', color: '#000', fontWeight: '700', display: 'inline-block' }}>💳 Buy Now — ₦15,000</div>
              </div>
            )}

            {/* WhatsApp */}
            {visibleSections.includes('whatsapp') && (
              <div style={{ padding: '10px', animation: 'fadeIn 0.5s ease' }}>
                <div style={{ background: '#25D366', borderRadius: '4px', padding: '6px 12px', fontSize: '11px', color: '#fff', fontWeight: '700', display: 'inline-block' }}>💬 Chat on WhatsApp</div>
              </div>
            )}
          </div>

          {/* AI Chat panel */}
          <div style={{ background: '#0f0f0f', borderLeft: '1px solid #1a1a1a', padding: '16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px', fontWeight: '600', letterSpacing: '1px' }}>AI CHAT</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>

              {/* User message */}
              {typedPrompt && (
                <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#aaa' }}>
                  {typedPrompt}
                  {phase === 'typing' && <span style={{ animation: 'blink 1s infinite', color: '#D4AF37' }}>|</span>}
                </div>
              )}

              {/* AI response */}
              {showResponse && (
                <div style={{ background: '#1a1a0a', border: '1px solid #D4AF3733', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#D4AF37' }}>
                  {typedResponse}
                  {phase === 'responding' && <span style={{ animation: 'blink 1s infinite' }}>|</span>}
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', color: '#555', marginTop: '8px' }}>
              {phase === 'typing' ? typedPrompt || 'Type a prompt...' : 'Type a prompt...'}
              {phase === 'typing' && typedPrompt && <span style={{ color: '#D4AF37' }}>|</span>}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  )
}
