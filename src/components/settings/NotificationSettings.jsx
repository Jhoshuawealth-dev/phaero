import { useAuth } from '../../context/AuthContext'
import NotificationToggles from '../NotificationToggles'

export default function NotificationSettings() {
  const { profile, refreshProfile } = useAuth()
  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>Notifications</h1>
      <p style={{ color: '#555', fontSize: '13px', marginBottom: '32px' }}>Choose what updates you want to receive.</p>
      <NotificationToggles profile={profile} refreshProfile={refreshProfile} />
    </div>
  )
}
