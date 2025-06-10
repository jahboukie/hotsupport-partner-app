import React, { useState } from 'react'
import { 
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ClockIcon,
  PhoneIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'

export default function Emergency() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [timeOfDay, setTimeOfDay] = useState('any')

  const emergencyScenarios = [
    {
      id: 'crying',
      title: 'She\'s crying and I don\'t know why',
      icon: '😢',
      urgency: 'high',
      description: 'She\'s upset and you feel helpless'
    },
    {
      id: 'snapped',
      title: 'She snapped at me - what did I do?',
      icon: '😠',
      urgency: 'high',
      description: 'She seems angry and you\'re confused'
    },
    {
      id: 'says_fine',
      title: 'She says "I\'m fine" but clearly isn\'t',
      icon: '🤷‍♀️',
      urgency: 'medium',
      description: 'You can tell something\'s wrong but she won\'t share'
    },
    {
      id: 'cant_sleep',
      title: 'She can\'t sleep and it\'s affecting everything',
      icon: '😴',
      urgency: 'medium',
      description: 'Sleep issues are impacting her mood and health'
    },
    {
      id: 'hot_flash_crisis',
      title: 'Hot flash emergency - she\'s miserable',
      icon: '🔥',
      urgency: 'high',
      description: 'Severe hot flash and she needs immediate help'
    },
    {
      id: 'mood_swing',
      title: 'Extreme mood swing - walking on eggshells',
      icon: '🎭',
      urgency: 'high',
      description: 'Her emotions are all over the place'
    },
    {
      id: 'anxiety_panic',
      title: 'She\'s anxious or having a panic attack',
      icon: '😰',
      urgency: 'high',
      description: 'High anxiety or panic symptoms'
    },
    {
      id: 'feeling_helpless',
      title: 'I feel completely helpless and useless',
      icon: '😔',
      urgency: 'medium',
      description: 'You don\'t know how to support her anymore'
    }
  ]

  const getGuidanceForScenario = (scenarioId: string) => {
    const guidance = {
      crying: {
        immediate: [
          "DO NOT ask 'What\'s wrong?' or 'Why are you crying?'",
          "Sit near her (not touching unless she initiates)",
          "Say: 'I\'m here with you' and wait",
          "Offer tissues without commenting on the crying",
          "Your presence is more important than words right now"
        ],
        avoid: [
          "Trying to 'fix' whatever is wrong",
          "Asking questions about why she's upset",
          "Saying 'Don't cry' or 'It's okay'",
          "Making jokes to lighten the mood",
          "Leaving her alone unless she asks"
        ],
        scripts: [
          "I'm here with you",
          "Take all the time you need",
          "Would you like me to just sit here with you?",
          "Is there anything I can get for you?",
          "You don't have to explain anything"
        ],
        followUp: "After she's calmer, ask 'How can I help?' not 'What happened?'"
      },
      snapped: {
        immediate: [
          "Take a deep breath - this isn't really about you",
          "DO NOT get defensive or argue back",
          "Give her space to calm down first",
          "Remember: her hormones are making emotions intense",
          "Your job is to be the stable one right now"
        ],
        avoid: [
          "Saying 'You're being irrational'",
          "Snapping back or getting angry",
          "Asking 'What's your problem?'",
          "Bringing up past arguments",
          "Taking it personally"
        ],
        scripts: [
          "I can see you're really upset",
          "I'm sorry - let me give you some space",
          "When you're ready, I'd like to understand better",
          "I love you and I'm here when you need me",
          "Take the time you need"
        ],
        followUp: "Wait 20-30 minutes, then approach with: 'I love you. Bad moment?'"
      },
      says_fine: {
        immediate: [
          "Don't push or probe when she says 'fine'",
          "Show support through actions, not questions",
          "Make her comfort a priority without asking",
          "Be extra attentive to her needs",
          "Create a supportive environment"
        ],
        avoid: [
          "Saying 'You don't seem fine'",
          "Pushing her to talk",
          "Getting frustrated with her",
          "Ignoring the obvious signs",
          "Making it about you"
        ],
        scripts: [
          "Okay. I'm here if that changes",
          "Would you like me to handle dinner?",
          "I notice you seem tired - want to rest?",
          "No pressure to talk, just know I care",
          "Let me take care of [specific task]"
        ],
        followUp: "Show care through actions: bring her tea, handle chores, create calm space"
      },
      cant_sleep: {
        immediate: [
          "Make the bedroom as cool and comfortable as possible",
          "Offer to sleep separately if heat is an issue",
          "Remove any sleep disruptions you control",
          "Be patient if she's tired and irritable during the day",
          "Don't take her exhaustion personally"
        ],
        avoid: [
          "Suggesting 'just relax'",
          "Getting frustrated if she keeps you awake",
          "Making the bedroom temperature about your comfort",
          "Snoring or making noise if she's struggling",
          "Expecting her to function normally on no sleep"
        ],
        scripts: [
          "What would make you most comfortable tonight?",
          "I can sleep in the guest room if that helps",
          "Should I adjust the thermostat?",
          "Want me to get you anything for tonight?",
          "No pressure to sleep - just rest"
        ],
        followUp: "Next day: 'How did you sleep?' and adjust evening routine accordingly"
      },
      hot_flash_crisis: {
        immediate: [
          "Get cold drinks ready immediately",
          "Turn up the AC or open windows",
          "Bring a cold, damp towel for her neck",
          "Give her space - don't hover",
          "Stay calm and supportive"
        ],
        avoid: [
          "Asking if she's having a hot flash (she knows)",
          "Complaining about the temperature",
          "Making jokes about 'personal summer'",
          "Trying to touch or hug her during it",
          "Acting annoyed by temperature changes"
        ],
        scripts: [
          "I'll get you something cold",
          "Let me turn up the AC",
          "Want me to get the fan?",
          "Take your time - I've got this",
          "Can I get you a cold towel?"
        ],
        followUp: "Once it passes: 'Feeling better?' and offer continued support"
      },
      mood_swing: {
        immediate: [
          "Stay calm and don't react emotionally",
          "Remember this is temporary and hormone-driven",
          "Be the emotional anchor she needs",
          "Don't try to reason with the emotions",
          "Focus on being supportive, not solution-oriented"
        ],
        avoid: [
          "Saying 'You're being dramatic'",
          "Trying to logic her out of emotions",
          "Getting upset because she's upset",
          "Bringing up past mood swings",
          "Making it about how it affects you"
        ],
        scripts: [
          "I can see this is really hard right now",
          "Your feelings are valid",
          "I'm going to stay right here with you",
          "This will pass, and I'll be here when it does",
          "You're not alone in this"
        ],
        followUp: "When calm: 'That looked really difficult. How are you feeling now?'"
      },
      anxiety_panic: {
        immediate: [
          "Stay calm yourself - anxiety is contagious",
          "Help her breathe slowly (model deep breathing)",
          "Remind her this is temporary",
          "Create a calm, safe environment",
          "Don't leave her alone during high anxiety"
        ],
        avoid: [
          "Saying 'Calm down' or 'Relax'",
          "Getting anxious yourself",
          "Overwhelming her with questions",
          "Making sudden movements or loud noises",
          "Dismissing her fears as irrational"
        ],
        scripts: [
          "Let's breathe together slowly",
          "You're safe. I'm right here",
          "This feeling will pass",
          "Focus on my voice",
          "In through your nose, out through your mouth"
        ],
        followUp: "After episode: Encourage professional support if panic attacks are frequent"
      },
      feeling_helpless: {
        immediate: [
          "Remember: being present IS helping",
          "You don't have to fix everything",
          "Consistency matters more than perfection",
          "Small gestures have big impact",
          "Your willingness to learn shows love"
        ],
        avoid: [
          "Giving up on trying to help",
          "Making it about your frustration",
          "Expecting immediate results",
          "Comparing yourself to others",
          "Thinking you're doing nothing right"
        ],
        scripts: [
          "I want to help but I'm not sure how",
          "Can you tell me what would be most helpful?",
          "I'm learning and I care about getting this right",
          "Your patience with me means everything",
          "We'll figure this out together"
        ],
        followUp: "Focus on one small thing you can do consistently well"
      }
    }

    return guidance[scenarioId as keyof typeof guidance] || guidance.feeling_helpless
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-red-400 bg-red-50'
      case 'medium': return 'border-yellow-400 bg-yellow-50'
      default: return 'border-gray-400 bg-gray-50'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🚨 Emergency Support</h1>
        <p className="text-xl text-gray-600">
          When you need help right now - we've got your back
        </p>
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-sm text-blue-800">
            <strong>Remember:</strong> You're not expected to be perfect. These are challenging situations 
            even for experts. The fact that you're here seeking help shows you're an amazing partner.
          </p>
        </div>
      </div>

      {!selectedScenario ? (
        <>
          {/* Time Context */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📅 When is this happening?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'morning', label: 'Morning', icon: '🌅' },
                { id: 'afternoon', label: 'Afternoon', icon: '☀️' },
                { id: 'evening', label: 'Evening', icon: '🌆' },
                { id: 'night', label: 'Night', icon: '🌙' }
              ].map((time) => (
                <button
                  key={time.id}
                  onClick={() => setTimeOfDay(time.id)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    timeOfDay === time.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{time.icon}</div>
                  <div className="text-sm font-medium">{time.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Emergency Scenarios */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">🆘 What's happening right now?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyScenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  className={`text-left p-4 rounded-lg border-2 transition-colors hover:shadow-md ${getUrgencyColor(scenario.urgency)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{scenario.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{scenario.title}</h3>
                      <p className="text-sm text-gray-600">{scenario.description}</p>
                      <div className="mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          scenario.urgency === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {scenario.urgency === 'high' ? 'High Priority' : 'Medium Priority'}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <EmergencyGuidance 
          scenario={emergencyScenarios.find(s => s.id === selectedScenario)!}
          guidance={getGuidanceForScenario(selectedScenario)}
          timeOfDay={timeOfDay}
          onBack={() => setSelectedScenario(null)}
        />
      )}

      {/* Quick Crisis Contacts */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-red-900 mb-4">📞 When to Seek Professional Help</h2>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-white rounded border-l-4 border-red-500">
            <p className="font-medium text-red-900">Call 988 (Suicide & Crisis Lifeline) if:</p>
            <p className="text-red-700">She mentions wanting to hurt herself or talks about suicide</p>
          </div>
          <div className="p-3 bg-white rounded border-l-4 border-orange-500">
            <p className="font-medium text-orange-900">Call her doctor if:</p>
            <p className="text-orange-700">Symptoms are severely impacting daily life or you're worried about her safety</p>
          </div>
          <div className="p-3 bg-white rounded border-l-4 border-blue-500">
            <p className="font-medium text-blue-900">Consider counseling if:</p>
            <p className="text-blue-700">Relationship strain is constant or you both feel overwhelmed regularly</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface EmergencyGuidanceProps {
  scenario: any
  guidance: any
  timeOfDay: string
  onBack: () => void
}

function EmergencyGuidance({ scenario, guidance, timeOfDay, onBack }: EmergencyGuidanceProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { title: 'Immediate Actions', key: 'immediate', icon: '⚡' },
    { title: 'What NOT to Do', key: 'avoid', icon: '🚫' },
    { title: 'What to Say', key: 'scripts', icon: '💬' },
    { title: 'Follow-Up', key: 'followUp', icon: '🔄' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium"
        >
          ← Back to scenarios
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{scenario.icon}</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{scenario.title}</h1>
            <p className="text-gray-600">Emergency guidance for this situation</p>
          </div>
        </div>

        {timeOfDay !== 'any' && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Time-specific note:</strong> Since this is happening in the {timeOfDay}, 
              {timeOfDay === 'morning' && ' she may be especially tired from poor sleep'}
              {timeOfDay === 'afternoon' && ' she may be dealing with accumulated stress from the day'}
              {timeOfDay === 'evening' && ' she may be exhausted and have less emotional reserves'}
              {timeOfDay === 'night' && ' sleep disruption may be making everything feel worse'}
            </p>
          </div>
        )}
      </div>

      {/* Step Navigation */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex space-x-4 mb-6">
          {steps.map((step, index) => (
            <button
              key={step.key}
              onClick={() => setCurrentStep(index)}
              className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                currentStep === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-lg mb-1">{step.icon}</div>
              <div className="text-sm font-medium">{step.title}</div>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {currentStep === 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Do This RIGHT NOW</h3>
              <div className="space-y-3">
                {guidance.immediate?.map((action: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-green-600 font-bold text-sm">{index + 1}.</div>
                    <p className="text-green-800 text-sm font-medium">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🚫 AVOID These Mistakes</h3>
              <div className="space-y-3">
                {guidance.avoid?.map((mistake: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-red-600 text-xl">✗</div>
                    <p className="text-red-800 text-sm font-medium">{mistake}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💬 Say Exactly This</h3>
              <div className="space-y-4">
                {guidance.scripts?.map((script: string, index: number) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-600">Script {index + 1}</span>
                    </div>
                    <p className="text-blue-900 font-medium italic">"{script}"</p>
                    <button className="mt-2 text-xs text-blue-600 hover:text-blue-700">
                      Copy to clipboard
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔄 After the Crisis</h3>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-purple-900 font-medium mb-3">Follow-up strategy:</p>
                <p className="text-purple-800">{guidance.followUp}</p>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">💝 Remember for next time:</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• You handled this crisis with love and care</li>
                  <li>• Every difficult moment you navigate together makes you stronger</li>
                  <li>• She's lucky to have someone who seeks help when needed</li>
                  <li>• Keep learning - you're becoming an amazing support partner</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className={`px-4 py-2 rounded-lg ${
              currentStep === steps.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
            <PhoneIcon className="h-5 w-5 text-blue-600 mb-2" />
            <div className="text-sm font-medium text-blue-900">Call Her Doctor</div>
          </button>
          <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
            <HeartIcon className="h-5 w-5 text-green-600 mb-2" />
            <div className="text-sm font-medium text-green-900">Send Love Message</div>
          </button>
          <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
            <LightBulbIcon className="h-5 w-5 text-purple-600 mb-2" />
            <div className="text-sm font-medium text-purple-900">Get More Tips</div>
          </button>
        </div>
      </div>
    </div>
  )
}