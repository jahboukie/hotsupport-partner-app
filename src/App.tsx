import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import MobileLayout from './components/MobileLayout'
import Landing from './pages/Landing'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import QuickHelp from './pages/QuickHelp'
import Understanding from './pages/Understanding'
import Communication from './pages/Communication'
import Education from './pages/Education'
import Tips from './pages/Tips'
import Support from './pages/Support'
import Profile from './pages/Profile'
import Community from './pages/Community'
import Emergency from './pages/Emergency'
import Progress from './pages/Progress'
import MamaGraceChat from './pages/MamaGraceChat'
import SubscriptionTester from './components/SubscriptionTester'
import AuthModal from './components/AuthModal'
import { EcosystemProvider } from './hooks/useEcosystem'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// App Content Component (uses auth context)
function AppContent() {
  const { isAuthenticated, profile, loading } = useAuth();
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    // Check if user has visited before and completed onboarding
    const visited = localStorage.getItem('supportpartner-visited')
    const onboardingCompleted = localStorage.getItem('supportpartner-onboarding-completed')
    
    setIsFirstVisit(!visited)
    setHasCompletedOnboarding(!!onboardingCompleted || !!profile?.profile_data?.onboarding_completed)

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [profile])

  const handleOnboardingComplete = () => {
    localStorage.setItem('supportpartner-onboarding-completed', 'true')
    setHasCompletedOnboarding(true)
  }

  const handleInstallApp = async () => {
    if (installPrompt) {
      installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      if (outcome === 'accepted') {
        setInstallPrompt(null)
      }
    }
  }

  // Show loading while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SupportPartner...</p>
        </div>
      </div>
    )
  }

  // Show landing page for first-time visitors (not authenticated)
  if (isFirstVisit && !isAuthenticated) {
    return (
      <EcosystemProvider>
        <Routes>
          <Route path="/" element={<Landing onGetStarted={() => {
            localStorage.setItem('supportpartner-visited', 'true')
            setIsFirstVisit(false)
            setShowAuthModal(true)
          }} />} />
          <Route path="/onboarding" element={<Onboarding onComplete={handleOnboardingComplete} />} />
          <Route path="/Onboarding" element={<Onboarding onComplete={handleOnboardingComplete} />} />
          <Route path="/landing" element={<Landing onGetStarted={() => {
            localStorage.setItem('supportpartner-visited', 'true')
            setIsFirstVisit(false)
            setShowAuthModal(true)
          }} />} />
        </Routes>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          defaultMode="signup"
        />
      </EcosystemProvider>
    )
  }

  // Show auth modal for returning visitors who aren't authenticated
  if (!isAuthenticated) {
    return (
      <EcosystemProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              💙
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome Back</h1>
            <p className="text-gray-600 mb-8">Sign in to continue supporting your partner through their menopause journey.</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          defaultMode="signin"
        />
      </EcosystemProvider>
    )
  }

  // Show onboarding for authenticated users who haven't completed it
  if (!hasCompletedOnboarding) {
    return (
      <EcosystemProvider>
        <Onboarding onComplete={handleOnboardingComplete} />
      </EcosystemProvider>
    )
  }

  // Show PWA install banner
  const showInstallBanner = installPrompt && hasCompletedOnboarding

  // Main app for authenticated users who have completed onboarding
  return (
    <EcosystemProvider>
      <div className="min-h-screen bg-gray-50">
        {/* PWA Install Banner */}
        {showInstallBanner && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white p-4 lg:px-8">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">📱</div>
                <div>
                  <p className="font-semibold">Install SupportPartner App</p>
                  <p className="text-sm text-blue-100">Get faster access and offline support</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleInstallApp}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Install
                </button>
                <button
                  onClick={() => setInstallPrompt(null)}
                  className="text-blue-100 hover:text-white p-2"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Offline notification */}
        {!isOnline && hasCompletedOnboarding && (
          <div className="fixed top-0 left-0 right-0 z-40 bg-orange-500 text-white p-2 text-center text-sm">
            You're offline. Some features may be limited.
          </div>
        )}

        {/* Main app content */}
        <div className={showInstallBanner ? 'pt-20' : (!isOnline && hasCompletedOnboarding ? 'pt-10' : '')}>
          <MobileLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quick-help" element={<QuickHelp />} />
              <Route path="/understanding" element={<Understanding />} />
              <Route path="/communication" element={<Communication />} />
              <Route path="/education" element={<Education />} />
              <Route path="/tips" element={<Tips />} />
              <Route path="/support" element={<Support />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/community" element={<Community />} />
              <Route path="/mama-grace" element={<MamaGraceChat />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </MobileLayout>
        </div>
        
        {/* Subscription Tester for Demo */}
        {hasCompletedOnboarding && <SubscriptionTester />}
      </div>
    </EcosystemProvider>
  )
}

// Main App Component with Auth Provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App