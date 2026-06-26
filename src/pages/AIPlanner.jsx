import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useAuth } from '../context/AuthContext'
import { chatWithPlanner } from '../lib/aiPlanner'
import { createProject, updateProject } from '../lib/projects'
import { siteDataToBlocks } from '../lib/aiToBlocks'

export default function AIPlanner() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hey! I'm Osiris 👑 Tell me about the business or idea you want to build, and I'll help you shape a clear plan before we build it together." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState(null)
  const [building, setBuilding] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg = input
    const newMessages = [...messages, { role: 'user', text: userMsg }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const apiMessages = newMessages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text }))
    const { text, plan: newPlan, error } = await chatWithPlanner(apiMessages)
    setLoading(false)

    if (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: `⚠️ ${error}` }])
      return
    }

    setMessages(prev => [...prev, { role: 'assistant', text }])
    if (newPlan) setPlan(newPlan)
  }

  const handleBuildPlan = async () => {
    if (!plan) return
    setBuilding(true)

    const blocks = siteDataToBlocks({ ...plan, businessName: plan.businessName })
    let newProject = null
    if (user) {
      const { data } = await createProject(user.id, plan.businessName, 'General')
      newProject = data
      if (newProject?.id) {
        await updateProject(newProject.id, { canvas_data: blocks })
      }
    }

    navigate('/builder', {
      state: {
        isNew: true,
        projectName: plan.businessName,
        projectId: newProject?.id,
        preloadBlocks: blocks,
        aiResponseMessage: plan.summary,
      }
    })
  }

  return (
    <div style={{ background: '#16161A', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #2a2a30', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logo} alt="Phaero" style={{ height: '36px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')} />
          <div style={{ width: '1px', height: '20px', background: '#2a2a30' }} />
          <span style={{ fontSize: '14px', color: '#aaa', fontWeight: '600' }}>AI Planner</span>
        </div>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', color: '#666', border: '1px solid #2a2a30', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>← Dashboard</button>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', height: '100%' }}>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                {msg.role === 'assistant' && <img src={logo} alt="Osiris" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'contain', background: '#1a1a0a', padding: '3px', flexShrink: 0 }} />}
                <div style={{
                  background: msg.role === 'assistant' ? '#1a1a0a' : '#202024',
                  border: `1px solid ${msg.role === 'assistant' ? '#D4AF3733' : '#2a2a30'}`,
                  borderRadius: msg.role === 'assistant' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                  padding: '12px 16px', fontSize: '14px', lineHeight: '1.6',
                  color: msg.role === 'assistant' ? '#D4AF37' : '#ddd',
                  maxWidth: '85%',
                }}>{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <img src={logo} alt="Osiris" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'contain', background: '#1a1a0a', padding: '3px', animation: 'spin 1s linear infinite' }} />
                <div style={{ background: '#1a1a0a', border: '1px solid #D4AF3733', borderRadius: '4px 14px 14px 14px', padding: '12px 16px', fontSize: '14px', color: '#D4AF37' }}>Thinking...</div>
              </div>
            )}

            {plan && (
              <div style={{ background: '#0f0f00', border: '1px solid #D4AF3766', borderRadius: '14px', padding: '20px', marginTop: '8px' }}>
                <div style={{ fontSize: '12px', color: '#D4AF37', fontWeight: '700', letterSpacing: '1px', marginBottom: '10px' }}>📋 PLAN READY</div>
                <div style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>{plan.businessName}</div>
                <p style={{ fontSize: '13px', color: '#aaa', lineHeight: '1.7', marginBottom: '14px' }}>{plan.summary}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                  {(plan.blocks || []).map((b, i) => (
                    <span key={i} style={{ fontSize: '11px', background: '#1a1a0a', color: '#D4AF37', padding: '4px 10px', borderRadius: '10px', border: '1px solid #D4AF3733' }}>{b}</span>
                  ))}
                </div>
                <button onClick={handleBuildPlan} disabled={building} className="btn-gold" style={{ width: '100%', padding: '13px', borderRadius: '8px', fontSize: '14px' }}>
                  {building ? 'Building...' : '🚀 Build This Plan →'}
                </button>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div style={{ padding: '16px 24px', borderTop: '1px solid #2a2a30', display: 'flex', gap: '10px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Tell Osiris about your idea..."
              style={{ flex: 1, background: '#202024', border: '1px solid #2a2a30', color: '#fff', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()} className="btn-gold" style={{ padding: '12px 20px', borderRadius: '10px', fontSize: '14px' }}>→</button>
          </div>
        </div>
      </div>
    </div>
  )
}
