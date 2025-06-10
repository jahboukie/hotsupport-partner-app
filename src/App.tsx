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
import { EcosystemProvider } from './hooks/useEcosystem'

function App() {
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    // Check if user has visited before
    const visited = localStorage.getItem('supportpartner-visited')
    const onboardingCompleted = localStorage.getItem('supportpartner-onboarding-completed')
    
    setIsFirstVisit(!visited)
    setHasCompletedOnboarding(!!onboardingCompleted)

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
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem('supportpartner-onboarding-completed', 'true')
    setHasCompletedOnboarding(true)
    
    // Initialize user ID for ecosystem integration
    if (!localStorage.getItem('supportpartner-user-id')) {
      localStorage.setItem('supportpartner-user-id', `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    }
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

  // Show landing page for first-time visitors
  if (isFirstVisit && !hasCompletedOnboarding) {
    return (
      <EcosystemProvider>
        <Routes>
          <Route path="/" element={<Landing onGetStarted={() => {
            localStorage.setItem('supportpartner-visited', 'true')
            setIsFirstVisit(false)
          }} />} />
          <Route path="/onboarding" element={<Onboarding onComplete={handleOnboardingComplete} />} />
        </Routes>
      </EcosystemProvider>
    )
  }

  // Show onboarding for users who haven't completed it
  if (!hasCompletedOnboarding) {
    return (
      <EcosystemProvider>
        <Onboarding onComplete={handleOnboardingComplete} />
      </EcosystemProvider>
    )
  }

  // Show PWA install banner
  const showInstallBanner = installPrompt && hasCompletedOnboarding

  // Main app for users who have completed onboarding
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
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </MobileLayout>
        </div>
      </div>
    </EcosystemProvider>
  )
}

export default App