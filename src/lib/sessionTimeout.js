const TIMEOUT_MS = 20 * 60 * 1000 // 20 minutes
const STORAGE_KEY = 'phaero_last_activity'

export function recordActivity() {
  localStorage.setItem(STORAGE_KEY, Date.now().toString())
}

export function getLastActivity() {
  const val = localStorage.getItem(STORAGE_KEY)
  return val ? parseInt(val, 10) : Date.now()
}

export function isSessionExpired() {
  const last = getLastActivity()
  return Date.now() - last > TIMEOUT_MS
}

export function startActivityTracking(onTimeout) {
  recordActivity()

  const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
  const handler = () => recordActivity()
  events.forEach(e => window.addEventListener(e, handler))

  const interval = setInterval(() => {
    if (isSessionExpired()) {
      onTimeout()
    }
  }, 30000) // check every 30s

  return () => {
    events.forEach(e => window.removeEventListener(e, handler))
    clearInterval(interval)
  }
}
