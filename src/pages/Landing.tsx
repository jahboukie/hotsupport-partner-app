import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthModal from '../components/AuthModal'

interface LandingProps {
  onGetStarted: () => void
}

export default function Landing({ onGetStarted }: LandingProps) {
  const navigate = useNavigate()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup')

  const handleGetStarted = () => {
    onGetStarted()
    navigate('/onboarding')
  }

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const handleSelectPlan = (planName: string) => {
    setAuthMode('signup')
    setShowAuthModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="relative z-20 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">🤝 SupportPartner</div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">Stories</a>
              <button
                onClick={() => handleAuthClick('login')}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => handleAuthClick('signup')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <div className="mb-8">
                  <div className="text-6xl mb-4">🤝</div>
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Transform From</span>
                    <span className="block text-red-600">"Clueless"</span>
                    <span className="block">to</span>
                    <span className="block text-blue-600">Champion</span>
                  </h1>
                </div>
                
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  The world's first AI-guided app that transforms any partner into a 
                  <strong className="text-blue-600"> menopause support expert</strong>. 
                  No medical degree required—just love and the right guidance.
                </p>
                
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                  <div className="rounded-md shadow">
                    <button
                      onClick={handleGetStarted}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105"
                    >
                      Become Her Champion 💪
                    </button>
                  </div>
                </div>

                <div className="mt-6 text-sm text-gray-500">
                  💯 <strong>7-day free trial</strong> • 🚀 <strong>Results in 5 minutes</strong> • 🏆 <strong>Used by 10,000+ partners</strong>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              The Problem Every Caring Partner Faces
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              You love her. You want to help. But menopause feels like a mystery.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl mb-4">😰</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Walking on Eggshells</h3>
              <p className="text-gray-600">
                "Everything I say seems wrong. I'm afraid to even ask how she's feeling."
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🤷‍♂️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Information Overload</h3>
              <p className="text-gray-600">
                "I've read about hormones and hot flashes, but what does she actually need from me?"
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">💔</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Feeling Helpless</h3>
              <p className="text-gray-600">
                "She's struggling and I don't know how to make it better. We're growing apart."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div id="features" className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Your AI Support Coach Has Arrived
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Transform from confused to confident in minutes, not months
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Know Exactly What to Do</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Real-time guidance for difficult moments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Daily support missions tailored to her needs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Emergency scripts for crisis situations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Surprise gesture ideas that actually work</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Say the Right Things</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Conversation starters that open hearts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Validation phrases that heal</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>"What NOT to say" warnings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Empathy-building communication training</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Transformation Stories */}
      <div id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Real Transformations, Real Relationships
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              See how SupportPartner is strengthening relationships worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3">💚</div>
                <div>
                  <h4 className="font-semibold">Mark & Sarah</h4>
                  <p className="text-sm text-gray-600">Married 18 years</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "We went from constant arguments to deeper intimacy. I finally understand what she's going through, and she feels truly supported for the first time."
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3">💙</div>
                <div>
                  <h4 className="font-semibold">David & Lisa</h4>
                  <p className="text-sm text-gray-600">Together 12 years</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "I was completely lost before SupportPartner. Now I'm her rock. The daily tips and emergency guidance saved our relationship during her worst symptoms."
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3">💜</div>
                <div>
                  <h4 className="font-semibold">James & Maria</h4>
                  <p className="text-sm text-gray-600">Married 25 years</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Our friends are amazed at how strong we've become. Maria says I'm the best menopause partner she knows. This app taught me everything."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Human-Claude Section */}
      <div className="py-16 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Built Through Revolutionary Human-Claude Collaboration
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              SupportPartner combines human relationship wisdom with Claude AI's technical excellence 
              to create something unprecedented: technology that actually strengthens human connection.
            </p>
            
            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-3xl mb-4">🧠</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Human Expertise</h3>
                <ul className="text-left space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Deep understanding of relationship dynamics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Real-world empathy and emotional intelligence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Vision for global relationship transformation</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Claude AI</h3>
                <ul className="text-left space-y-2">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Intelligent content personalization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Real-time guidance and adaptation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Scalable technology for global impact</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Choose Your Support Level
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              From first steps to relationship mastery – we've got you covered
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Basic Support Plan */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-8 py-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">Basic Support</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">$9.99</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="mt-4 text-gray-600">Essential tools to start your support journey</p>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Essential education resources</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Basic communication tools</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Progress tracking access</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Community support forum</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Crisis contact information</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button
                    onClick={() => handleSelectPlan('basic')}
                    className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Start 7-Day Free Trial
                  </button>
                </div>
              </div>
            </div>

            {/* Complete Partner Plan */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-blue-500 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="px-8 py-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">Complete Partner</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-blue-600">$19.99</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="mt-4 text-gray-600">AI-powered guidance for confident support</p>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Everything in Basic Support</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Personalized AI support plans</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Advanced communication scripts</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Intimacy & relationship guidance</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Crisis intervention protocols</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Partner app integration</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button
                    onClick={() => handleSelectPlan('complete')}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Start 7-Day Free Trial
                  </button>
                </div>
              </div>
            </div>

            {/* Couples Therapy Plus Plan */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-8 py-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">Couples Therapy Plus</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-purple-600">$29.99</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="mt-4 text-gray-600">Advanced AI guidance with professional resources</p>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Everything in Complete Partner</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Advanced AI communication coaching</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Relationship assessment tools</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Family support coordination</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Provider integration & alerts</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Priority crisis support protocols</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button
                    onClick={() => handleSelectPlan('plus')}
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Start 7-Day Free Trial
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              💝 <strong>30-day money-back guarantee</strong> • 🔒 <strong>Cancel anytime</strong> • ✨ <strong>No hidden fees</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Become the Partner She Deserves?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Join thousands of partners who've transformed their relationships through menopause support mastery
          </p>
          
          <div className="mt-8">
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-blue-600 bg-white hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Your Transformation Now 🚀
            </button>
          </div>
          
          <div className="mt-6 text-blue-100">
            <p className="text-sm">
              ✨ <strong>7-day free trial</strong> • 🔒 <strong>Private & secure</strong> • 💝 <strong>Results guaranteed</strong>
            </p>
            <p className="text-xs mt-2 opacity-75">
              Built with ❤️ through Human-Claude collaboration for the strongest relationships on Earth
            </p>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false)
            navigate('/dashboard')
          }}
        />
      )}
    </div>
  )
}