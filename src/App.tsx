import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
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

  useEffect(() => {
    // Check if user has visited before
    const visited = localStorage.getItem('supportpartner-visited')
    const onboardingCompleted = localStorage.getItem('supportpartner-onboarding-completed')
    
    setIsFirstVisit(!visited)
    setHasCompletedOnboarding(!!onboardingCompleted)
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem('supportpartner-onboarding-completed', 'true')
    setHasCompletedOnboarding(true)
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

  // Main app for users who have completed onboarding
  return (
    <EcosystemProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
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
      </Layout>
    </EcosystemProvider>
  )
}

export default App