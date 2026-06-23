import Editor from '@monaco-editor/react'
import { useState } from 'react'

const files = {
  'HeroSection.jsx': `import React from 'react'

export default function HeroSection() {
  return (
    <section className="hero">
      <h1>Zara Ankara Boutique</h1>
      <p>Premium Ankara Fashion · Lagos, Nigeria</p>
      <div className="cta-buttons">
        <button className="btn-primary">Shop Now</button>
        <button className="btn-whatsapp">WhatsApp</button>
      </div>
    </section>
  )
}`,
  'App.jsx': `import HeroSection from './HeroSection'
import ProductGrid from './ProductGrid'

export default function App() {
  return (
    <div>
      <HeroSection />
      <ProductGrid />
    </div>
  )
}`,
  'styles.css': `.hero {
  background: #8B4513;
  padding: 60px 24px;
  text-align: center;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 24px;
}

.btn-primary {
  background: #D4AF37;
  color: #000;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
}`,
}

export default function CodeView() {
  const [activeFile, setActiveFile] = useState('HeroSection.jsx')

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#1e1e1e' }}>
      {/* File tabs sidebar */}
      <div style={{ width: '200px', flexShrink: 0, background: '#0d0d0d', borderRight: '1px solid #1a1a1a', padding: '12px 8px', height: '100%', overflowY: 'auto' }}>
        <p style={{ fontSize: '10px', color: '#444', fontWeight: '700', letterSpacing: '1px', padding: '4px 8px', marginBottom: '8px' }}>FILES</p>
        {Object.keys(files).map((file) => (
          <div key={file} onClick={() => setActiveFile(file)} style={{
            padding: '8px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', marginBottom: '2px',
            background: activeFile === file ? '#1a1a0a' : 'transparent',
            color: activeFile === file ? '#D4AF37' : '#888',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <span style={{ fontSize: '11px' }}>{file.endsWith('.css') ? '🎨' : '📄'}</span> {file}
          </div>
        ))}
      </div>

      {/* Editor — fills remaining space */}
      <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
        <Editor
          width="100%"
          height="100%"
          language={activeFile.endsWith('.css') ? 'css' : 'javascript'}
          theme="vs-dark"
          value={files[activeFile]}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16 },
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  )
}
