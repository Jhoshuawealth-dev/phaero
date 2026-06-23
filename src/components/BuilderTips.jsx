import { useState, useEffect } from 'react'

const tips = [
  { icon: '🎯', text: 'Start with a Hero Banner — it\'s the first thing visitors see.' },
  { icon: '💬', text: 'Always add a WhatsApp CTA block — it\'s the #1 way African customers reach businesses.' },
  { icon: '💳', text: 'Add a Paystack Button if you sell anything — customers can pay you directly.' },
  { icon: '📸', text: 'Upload real photos of your products or location — they build more trust than stock images.' },
  { icon: '✍️', text: 'Keep your hero subtitle short — under 10 words converts better.' },
  { icon: '🎨', text: 'Click any block to change its color from the settings panel on the right.' },
  { icon: '📱', text: 'Use the device switcher in the top bar to check how your site looks on mobile.' },
  { icon: '⭐', text: 'Add a Testimonials block — social proof helps customers trust you faster.' },
  { icon: '🔄', text: 'Don\'t worry about mistakes — every change is autosaved and you can restore old versions anytime.' },
  { icon: '📋', text: 'Add a FAQ block to answer common questions before customers even ask.' },
  { icon: '🌐', text: 'Once you\'re happy with your site, click Publish to make it live with your own URL.' },
  { icon: '🐙', text: 'Push your project to GitHub anytime to keep a backup of your code.' },
]

export default function BuilderTips({ theme }) {
  const [index, setIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % tips.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  if (dismissed) return null

  const tip = tips[index]

  return (
    <div style={{
      background: '#1a1a0a', border: '1px solid #D4AF3733', borderRadius: '8px',
      padding: '10px 12px', margin: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px',
      animation: 'fadeIn 0.4s ease', position: 'relative',
    }}>
      <span style={{ fontSize: '14px', flexShrink: 0 }}>{tip.icon}</span>
      <span style={{ fontSize: '11px', color: '#D4AF37', lineHeight: '1.5', flex: 1 }}>{tip.text}</span>
      <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '12px', flexShrink: 0, padding: 0 }}>✕</button>
    </div>
  )
}
