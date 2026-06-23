import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

const themes = {
  dark: {
    bg: '#0A0A0A', bgSecondary: '#0d0d0d', bgCard: '#111', bgCardHover: '#161616',
    border: '#1e1e1e', borderLight: '#2a2a2a', text: '#fff', textMuted: '#888',
    textFaint: '#555', textFainter: '#333', gold: '#D4AF37', goldBg: '#1a1a0a',
    inputBg: '#111', overlayBg: 'rgba(0,0,0,0.85)'
  },
  light: {
    bg: '#FAFAF8', bgSecondary: '#F2F0EA', bgCard: '#FFFFFF', bgCardHover: '#F7F5EF',
    border: '#E8E4D8', borderLight: '#D8D2C0', text: '#1A1A1A', textMuted: '#666',
    textFaint: '#999', textFainter: '#bbb', gold: '#B8902C', goldBg: '#FBF3DD',
    inputBg: '#FFFFFF', overlayBg: 'rgba(0,0,0,0.4)'
  }
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('dark')
  const [systemPref, setSystemPref] = useState('dark')

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemPref(mq.matches ? 'dark' : 'light')
    const handler = (e) => setSystemPref(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const resolved = mode === 'system' ? systemPref : mode
  const theme = themes[resolved]

  useEffect(() => {
    document.body.style.background = theme.bg
  }, [theme])

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolved, theme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
