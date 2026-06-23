import { useState, createContext, useContext, useCallback } from 'react'
import Toast from './Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }, [])
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])
  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />)}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
