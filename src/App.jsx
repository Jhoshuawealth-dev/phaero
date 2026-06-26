import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Features from './pages/Features'
import Pricing from './pages/Pricing'
import Templates from './pages/Templates'
import Onboarding from './pages/Onboarding'
import Showcase from './pages/Showcase'
import Dashboard from './pages/Dashboard'
import Builder from './pages/Builder'
import NotFound from './pages/NotFound'
import About from './pages/About'
import Contact from './pages/Contact'
import Legal from './pages/Legal'
import Upgrade from './pages/Upgrade'
import Profile from './pages/Profile'
import ReferralTerms from './pages/ReferralTerms'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import EmailVerificationBanner from './components/EmailVerificationBanner'
import ShowcaseReview from './pages/ShowcaseReview'
import SettingsLayout from './pages/SettingsLayout'
import AIPlanner from './pages/AIPlanner'
import ThemeToggle from './components/ThemeToggle'
import { useLocation } from 'react-router-dom'

function GlobalThemeToggle() {
  const location = useLocation()
  if (location.pathname === '/builder') return null
  return null // Theme toggle now lives in Settings > Appearance and inside Builder
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <EmailVerificationBanner />
      <GlobalThemeToggle />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Legal />} />
        <Route path="/terms" element={<Legal />} />
        <Route path="/cookies" element={<Legal />} />
        <Route path="/referral-terms" element={<ReferralTerms />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/showcase-review" element={<ProtectedRoute><ShowcaseReview /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsLayout /></ProtectedRoute>} />
        <Route path="/planner" element={<ProtectedRoute><AIPlanner /></ProtectedRoute>} />

        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/builder" element={<ProtectedRoute><Builder /></ProtectedRoute>} />
        <Route path="/upgrade" element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
