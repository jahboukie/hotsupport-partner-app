import React, { useState } from 'react'

interface OnboardingProps {
  onComplete: () => void
}

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome, Future Champion!',
    icon: '🎯',
    description: 'Transform from confused to confident in just 5 minutes'
  },
  {
    id: 'situation',
    title: 'What\'s Your Current Situation?',
    icon: '🤔',
    description: 'Help us understand where you\'re starting from'
  },
  {
    id: 'relationship',
    title: 'About Your Relationship',
    icon: '💑',
    description: 'Tell us about your partnership'
  },
  {
    id: 'challenges',
    title: 'Your Biggest Challenges',
    icon: '🎢',
    description: 'What support areas need the most help?'
  },
  {
    id: 'goals',
    title: 'Your Support Goals',
    icon: '🏆',
    description: 'What kind of partner do you want to become?'
  },
  {
    id: 'personalization',
    title: 'Personalizing Your Experience',
    icon: '⚙️',
    description: 'Setting up your custom support plan'
  },
  {
    id: 'ready',
    title: 'You\'re Ready to Be Amazing!',
    icon: '🚀',
    description: 'Welcome to your transformation journey'
  }
]

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  
  const currentStepData = ONBOARDING_STEPS[currentStep]
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Save onboarding data and complete
      localStorage.setItem('supportpartner-profile', JSON.stringify(responses))
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateResponse = (key: string, value: any) => {
    setResponses(prev => ({ ...prev, [key]: value }))
  }

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'welcome':
        return <WelcomeStep />
      case 'situation':
        return <SituationStep responses={responses} updateResponse={updateResponse} />
      case 'relationship':
        return <RelationshipStep responses={responses} updateResponse={updateResponse} />
      case 'challenges':
        return <ChallengesStep responses={responses} updateResponse={updateResponse} />
      case 'goals':
        return <GoalsStep responses={responses} updateResponse={updateResponse} />
      case 'personalization':
        return <PersonalizationStep responses={responses} />
      case 'ready':
        return <ReadyStep responses={responses} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">SupportPartner</h1>
            <span className="text-blue-100">
              {currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
          </div>
          <div className="w-full bg-blue-300 rounded-full h-3">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{currentStepData.icon}</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600 text-lg">
              {currentStepData.description}
            </p>
          </div>

          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-colors"
            >
              {currentStep === ONBOARDING_STEPS.length - 1 ? 'Start My Journey!' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step Components
function WelcomeStep() {
  return (
    <div className="text-center space-y-6">
      <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          You're About to Become a Menopause Support Expert
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl mb-2">🎓</div>
            <p className="font-medium">Learn the Basics</p>
            <p className="text-gray-600">No medical degree required</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">💬</div>
            <p className="font-medium">Master Communication</p>
            <p className="text-gray-600">Say the right things always</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🏆</div>
            <p className="font-medium">Become Her Champion</p>
            <p className="text-gray-600">Transform your relationship</p>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>🤝 Human-Claude Collaboration:</strong> This app combines real relationship wisdom 
          with AI-powered guidance to give you exactly what you need, when you need it.
        </p>
      </div>
    </div>
  )
}

function SituationStep({ responses, updateResponse }: { responses: any, updateResponse: (key: string, value: any) => void }) {
  const situations = [
    { 
      id: 'just_starting', 
      title: 'She\'s just entering menopause', 
      description: 'Early symptoms, lots of questions',
      icon: '🌱'
    },
    { 
      id: 'in_middle', 
      title: 'We\'re in the thick of it', 
      description: 'Symptoms are challenging both of us',
      icon: '🌊'
    },
    { 
      id: 'struggling', 
      title: 'We\'re really struggling', 
      description: 'Relationship is under strain',
      icon: '⛈️'
    },
    { 
      id: 'learning', 
      title: 'I want to be prepared', 
      description: 'Learning now to support her better',
      icon: '📚'
    }
  ]

  return (
    <div className="space-y-4">
      <p className="text-center text-gray-600 mb-6">
        This helps us give you the most relevant guidance right away
      </p>
      
      {situations.map((situation) => (
        <label key={situation.id} className="block">
          <input
            type="radio"
            name="situation"
            value={situation.id}
            checked={responses.situation === situation.id}
            onChange={(e) => updateResponse('situation', e.target.value)}
            className="sr-only"
          />
          <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
            responses.situation === situation.id 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{situation.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{situation.title}</h4>
                <p className="text-gray-600 text-sm">{situation.description}</p>
              </div>
            </div>
          </div>
        </label>
      ))}
    </div>
  )
}

function RelationshipStep({ responses, updateResponse }: { responses: any, updateResponse: (key: string, value: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How long have you been together?
        </label>
        <select
          value={responses.relationship_length || ''}
          onChange={(e) => updateResponse('relationship_length', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select duration</option>
          <option value="less_than_1">Less than 1 year</option>
          <option value="1_to_5">1-5 years</option>
          <option value="5_to_10">5-10 years</option>
          <option value="10_to_20">10-20 years</option>
          <option value="more_than_20">More than 20 years</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What's your communication style usually like?
        </label>
        <div className="space-y-2">
          {[
            { id: 'very_open', label: 'Very open - we talk about everything' },
            { id: 'mostly_open', label: 'Mostly open - we share important things' },
            { id: 'somewhat_reserved', label: 'Somewhat reserved - we keep some things private' },
            { id: 'struggle_communication', label: 'We struggle to communicate about difficult topics' }
          ].map((option) => (
            <label key={option.id} className="flex items-center">
              <input
                type="radio"
                name="communication_style"
                value={option.id}
                checked={responses.communication_style === option.id}
                onChange={(e) => updateResponse('communication_style', e.target.value)}
                className="mr-3 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

function ChallengesStep({ responses, updateResponse }: { responses: any, updateResponse: (key: string, value: any) => void }) {
  const challenges = [
    { id: 'communication', label: 'Knowing what to say', icon: '💬' },
    { id: 'understanding', label: 'Understanding what she\'s going through', icon: '🧠' },
    { id: 'mood_changes', label: 'Dealing with mood changes', icon: '🎭' },
    { id: 'physical_symptoms', label: 'Helping with physical symptoms', icon: '🌡️' },
    { id: 'intimacy', label: 'Maintaining intimacy and connection', icon: '💕' },
    { id: 'helplessness', label: 'Feeling helpless or useless', icon: '😔' },
    { id: 'walking_eggshells', label: 'Walking on eggshells', icon: '🥚' },
    { id: 'information_overload', label: 'Too much confusing information', icon: '📚' }
  ]

  const selectedChallenges = responses.challenges || []

  const toggleChallenge = (challengeId: string) => {
    const updated = selectedChallenges.includes(challengeId)
      ? selectedChallenges.filter((id: string) => id !== challengeId)
      : [...selectedChallenges, challengeId]
    updateResponse('challenges', updated)
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-gray-600 mb-6">
        Select all that apply - we'll prioritize these areas in your support plan
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {challenges.map((challenge) => (
          <label key={challenge.id} className="block">
            <input
              type="checkbox"
              checked={selectedChallenges.includes(challenge.id)}
              onChange={() => toggleChallenge(challenge.id)}
              className="sr-only"
            />
            <div className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
              selectedChallenges.includes(challenge.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <div className="flex items-center space-x-2">
                <div className="text-lg">{challenge.icon}</div>
                <span className="text-sm font-medium">{challenge.label}</span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

function GoalsStep({ responses, updateResponse }: { responses: any, updateResponse: (key: string, value: any) => void }) {
  const goals = [
    { 
      id: 'better_communicator', 
      title: 'Become a better communicator',
      description: 'Always know the right thing to say',
      icon: '🗣️'
    },
    { 
      id: 'rock_support', 
      title: 'Be her rock during difficult times',
      description: 'Provide steady, reliable support',
      icon: '🗿'
    },
    { 
      id: 'strengthen_relationship', 
      title: 'Strengthen our relationship',
      description: 'Come through this closer than ever',
      icon: '💪'
    },
    { 
      id: 'reduce_conflict', 
      title: 'Reduce arguments and tension',
      description: 'Create more peace and understanding',
      icon: '☮️'
    },
    { 
      id: 'be_advocate', 
      title: 'Become her health advocate',
      description: 'Help her get the best care possible',
      icon: '🏥'
    },
    { 
      id: 'show_love', 
      title: 'Show love in ways she feels it',
      description: 'Make sure she knows how much I care',
      icon: '❤️'
    }
  ]

  const selectedGoals = responses.goals || []

  const toggleGoal = (goalId: string) => {
    const updated = selectedGoals.includes(goalId)
      ? selectedGoals.filter((id: string) => id !== goalId)
      : [...selectedGoals, goalId]
    updateResponse('goals', updated)
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-gray-600 mb-6">
        Choose the goals that resonate most with you (select multiple)
      </p>
      
      {goals.map((goal) => (
        <label key={goal.id} className="block">
          <input
            type="checkbox"
            checked={selectedGoals.includes(goal.id)}
            onChange={() => toggleGoal(goal.id)}
            className="sr-only"
          />
          <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
            selectedGoals.includes(goal.id)
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{goal.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{goal.title}</h4>
                <p className="text-gray-600 text-sm">{goal.description}</p>
              </div>
            </div>
          </div>
        </label>
      ))}
    </div>
  )
}

function PersonalizationStep({ responses }: { responses: any }) {
  const insights = []
  
  // Generate personalized insights based on responses
  if (responses.situation === 'struggling') {
    insights.push({
      icon: '🚨',
      title: 'Priority: Immediate Support',
      description: 'We\'ll focus on crisis communication and emergency guidance first'
    })
  }
  
  if (responses.challenges?.includes('communication')) {
    insights.push({
      icon: '💬',
      title: 'Communication Mastery',
      description: 'Daily conversation starters and response templates'
    })
  }
  
  if (responses.goals?.includes('be_advocate')) {
    insights.push({
      icon: '🏥',
      title: 'Healthcare Advocacy',
      description: 'Tools to help her navigate medical care effectively'
    })
  }

  // Default insights if we don't have enough data
  if (insights.length < 3) {
    insights.push(
      {
        icon: '🎯',
        title: 'Daily Support Missions',
        description: 'Simple, actionable ways to show support every day'
      },
      {
        icon: '📚',
        title: 'Menopause Education',
        description: 'Learn what she\'s experiencing in simple terms'
      },
      {
        icon: '💡',
        title: 'Real-Time Guidance',
        description: 'Get help in the moment when you need it most'
      }
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Your Personal Support Plan
        </h3>
        <p className="text-gray-600">
          Based on your responses, here's what we're focusing on for you:
        </p>
      </div>
      
      <div className="space-y-4">
        {insights.slice(0, 3).map((insight, index) => (
          <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{insight.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{insight.title}</h4>
                <p className="text-gray-600 text-sm">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-green-800 font-medium">
          🎉 Your personalized support plan is ready!
        </p>
        <p className="text-green-700 text-sm mt-1">
          We'll start with the most important areas and build from there.
        </p>
      </div>
    </div>
  )
}

function ReadyStep({ responses }: { responses: any }) {
  return (
    <div className="text-center space-y-6">
      <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          🎉 You're Ready to Transform Your Relationship!
        </h3>
        <p className="text-gray-700 mb-6">
          You've just taken the most important step: deciding to become the partner she needs. 
          Your personalized support journey starts now!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-2">📱</div>
            <h4 className="font-semibold text-gray-800">Start Today</h4>
            <p className="text-gray-600">Get your first support mission immediately</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-2">🏆</div>
            <h4 className="font-semibold text-gray-800">Track Progress</h4>
            <p className="text-gray-600">Watch your support skills grow daily</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-2">💝</div>
            <h4 className="font-semibold text-gray-800">See Results</h4>
            <p className="text-gray-600">Stronger relationship in weeks, not months</p>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>🤝 Remember:</strong> This app was built through Human-Claude collaboration 
          to combine real relationship wisdom with intelligent technology. You're getting 
          the best of both worlds!
        </p>
      </div>
    </div>
  )
}