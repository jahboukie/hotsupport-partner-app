import React, { useState } from 'react'
import { 
  ChatBubbleLeftRightIcon,
  SpeakerWaveIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function Communication() {
  const [activeSection, setActiveSection] = useState('daily')
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)

  const sections = [
    { id: 'daily', name: 'Daily Check-ins', icon: '🌅' },
    { id: 'difficult', name: 'Difficult Conversations', icon: '🤝' },
    { id: 'support', name: 'Support Phrases', icon: '💝' },
    { id: 'avoid', name: 'What NOT to Say', icon: '🚫' },
    { id: 'scenarios', name: 'Common Scenarios', icon: '🎭' }
  ]

  const dailyCheckIns = [
    {
      time: 'Morning',
      icon: '🌅',
      good: [
        "How did you sleep last night?",
        "What can I do to make your morning easier?",
        "Any plans for today I should know about?",
        "How are you feeling this morning?"
      ],
      why: "Morning check-ins set a supportive tone for the day and show you care about her rest quality"
    },
    {
      time: 'Midday',
      icon: '☀️',
      good: [
        "How's your day going so far?",
        "Anything I can help with when I get home?",
        "Need me to pick up anything?",
        "Thinking about you - hope you're having a good day"
      ],
      why: "Midday touches show ongoing care and offer practical support"
    },
    {
      time: 'Evening',
      icon: '🌆',
      good: [
        "How was your day?",
        "What was the best part of your day?",
        "Anything you want to talk about?",
        "What sounds good for dinner?"
      ],
      why: "Evening conversations help decompress and plan together"
    },
    {
      time: 'Bedtime',
      icon: '🌙',
      good: [
        "What would help you sleep better tonight?",
        "Should I adjust the temperature?",
        "Need anything before bed?",
        "Sweet dreams, love you"
      ],
      why: "Bedtime support helps with sleep quality issues common in menopause"
    }
  ]

  const supportPhrases = [
    {
      category: 'Validation',
      icon: '✅',
      phrases: [
        "That sounds really hard",
        "Your feelings make complete sense",
        "I can see why that would be frustrating",
        "You're handling this so well",
        "Thank you for sharing that with me"
      ]
    },
    {
      category: 'Comfort',
      icon: '🤗',
      phrases: [
        "I'm here with you",
        "You don't have to go through this alone",
        "We'll figure this out together",
        "I love you no matter what",
        "Take all the time you need"
      ]
    },
    {
      category: 'Support Offers',
      icon: '🙋‍♂️',
      phrases: [
        "What can I do to help right now?",
        "Would you like me to handle [specific task]?",
        "Should I give you some space or stay close?",
        "Want me to call the doctor for you?",
        "Let me take care of dinner tonight"
      ]
    },
    {
      category: 'Appreciation',
      icon: '💖',
      phrases: [
        "I admire how strong you are",
        "You're amazing even on hard days",
        "Thank you for being patient with me",
        "I'm proud of how you're handling this",
        "You make our relationship better every day"
      ]
    }
  ]

  const avoidPhrases = [
    {
      category: 'Dismissive',
      icon: '❌',
      bad: [
        "You're overreacting",
        "It's not that bad",
        "At least it's not...",
        "Other women handle this fine",
        "You're being dramatic"
      ],
      why: "These phrases minimize her experience and make her feel unheard"
    },
    {
      category: 'Unhelpful Solutions',
      icon: '🔧',
      bad: [
        "Just calm down",
        "Have you tried not thinking about it?",
        "Maybe you should exercise more",
        "Just get more sleep",
        "Why don't you just..."
      ],
      why: "Oversimplified solutions suggest you don't understand the complexity of what she's facing"
    },
    {
      category: 'Comparison',
      icon: '⚖️',
      bad: [
        "My mom went through this fine",
        "Other women don't complain this much",
        "At least you're not pregnant",
        "My sister said menopause was easy",
        "Women have been doing this forever"
      ],
      why: "Comparisons invalidate her unique experience and make her feel isolated"
    },
    {
      category: 'Self-Centered',
      icon: '🤷‍♂️',
      bad: [
        "This is hard for me too",
        "What about my needs?",
        "You're always tired lately",
        "This is affecting our relationship",
        "I don't know what you want from me"
      ],
      why: "Making it about you shifts focus away from her needs during a vulnerable time"
    }
  ]

  const commonScenarios = [
    {
      id: 'tired',
      title: 'She says she\'s exhausted (again)',
      icon: '😴',
      situation: 'She\'s constantly tired and you\'re wondering if it\'s something you did',
      goodResponse: "Sleep issues are really common with menopause. What can I do to help you rest better?",
      badResponse: "You\'re always tired. Maybe you should go to bed earlier.",
      explanation: "Fatigue in menopause is often due to hormone changes and sleep disruption, not lifestyle choices."
    },
    {
      id: 'irritable',
      title: 'She seems irritated by everything',
      icon: '😠',
      situation: 'Small things are setting her off and you feel like you\'re walking on eggshells',
      goodResponse: "I can see you\'re having a tough day. Is there anything making it worse that I can help with?",
      badResponse: "Why are you so grumpy lately? You get mad at everything.",
      explanation: "Hormone fluctuations can cause irritability. Focus on support rather than judgment."
    },
    {
      id: 'forgetful',
      title: 'She\'s forgetting things more often',
      icon: '🤔',
      situation: 'She forgot an important appointment or task and seems upset about it',
      goodResponse: "Brain fog is so frustrating. Let\'s figure out some systems that might help.",
      badResponse: "You forgot again? You need to start writing things down.",
      explanation: "Memory issues are a real symptom of menopause, not carelessness or lack of trying."
    },
    {
      id: 'no_intimacy',
      title: 'She\'s not interested in physical intimacy',
      icon: '💔',
      situation: 'Physical intimacy has decreased and you\'re feeling rejected',
      goodResponse: "I understand things are different right now. How can I show love in ways that feel good to you?",
      badResponse: "We never have sex anymore. Don\'t you find me attractive?",
      explanation: "Physical changes and hormone shifts can affect libido. Focus on emotional connection."
    },
    {
      id: 'hot_flash',
      title: 'She\'s having a hot flash',
      icon: '🔥',
      situation: 'She suddenly gets very hot and uncomfortable',
      goodResponse: "Let me turn up the AC and get you something cold to drink.",
      badResponse: "Are you having another hot flash? Maybe you should see if there\'s medication for that.",
      explanation: "During hot flashes, focus on immediate comfort rather than medical advice."
    },
    {
      id: 'mood_swing',
      title: 'Her mood changed suddenly',
      icon: '🎭',
      situation: 'She went from fine to upset in what seems like seconds',
      goodResponse: "I can see something shifted. I\'m here if you want to talk or if you need space.",
      badResponse: "You were fine a minute ago. What\'s wrong now?",
      explanation: "Rapid mood changes are common with hormone fluctuations. Offer stability, not confusion."
    }
  ]

  const difficultTopics = [
    {
      topic: 'Talking about seeing a doctor',
      icon: '🏥',
      approach: "I\'ve noticed you\'ve been struggling with [specific symptoms]. Would it help if I helped you find a doctor who specializes in menopause?",
      avoid: "You really need to see a doctor about this.",
      tips: [
        "Focus on specific symptoms you\'ve observed",
        "Offer to help with research or appointments",
        "Don\'t pressure or ultimatum",
        "Emphasize you want her to feel better"
      ]
    },
    {
      topic: 'Discussing treatment options',
      icon: '💊',
      approach: "I found some information about menopause treatments. Want to look at it together, or would you prefer I just leave it for you?",
      avoid: "You should try hormone therapy like my friend\'s wife.",
      tips: [
        "Present information, don\'t prescribe solutions",
        "Let her lead the decision-making",
        "Offer to attend appointments with her",
        "Research reputable sources together"
      ]
    },
    {
      topic: 'Changes in intimacy',
      icon: '💕',
      approach: "I want you to know that I love you and I\'m here for whatever feels right for you. No pressure, just love.",
      avoid: "When do you think things will get back to normal?",
      tips: [
        "Reassure her of your love and attraction",
        "Don\'t put timeline pressure on recovery",
        "Focus on emotional intimacy",
        "Be patient with physical changes"
      ]
    },
    {
      topic: 'Impact on your relationship',
      icon: '💑',
      approach: "I love you and I want to support you through this. Help me understand how to be the best partner I can be.",
      avoid: "This menopause thing is really affecting our marriage.",
      tips: [
        "Frame it as wanting to improve, not problems to fix",
        "Ask what she needs rather than what you\'re missing",
        "Acknowledge this is temporary",
        "Focus on growing stronger together"
      ]
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <ChatBubbleLeftRightIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">💬 Communication Mastery</h1>
        <p className="text-xl text-gray-600">
          Transform from "What did I say wrong?" to "I always know the right thing to say"
        </p>
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="font-medium">{section.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      {activeSection === 'daily' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🌅 Daily Check-in Scripts</h2>
            <p className="text-gray-600 mb-6">
              Consistent, caring check-ins show ongoing support and help you stay connected to her experience.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dailyCheckIns.map((checkIn, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">{checkIn.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{checkIn.time}</h3>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {checkIn.good.map((phrase, i) => (
                      <div key={i} className="bg-green-50 border border-green-200 rounded p-2">
                        <p className="text-green-800 text-sm italic">"{phrase}"</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-blue-800 text-xs">
                      <strong>Why this works:</strong> {checkIn.why}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'support' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💝 Support Phrase Library</h2>
            <p className="text-gray-600 mb-6">
              These phrases show empathy, validation, and support. Keep them handy for any situation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportPhrases.map((category, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {category.phrases.map((phrase, i) => (
                      <div key={i} className="bg-green-50 border border-green-200 rounded p-3 flex items-center justify-between">
                        <p className="text-green-800 text-sm italic">"{phrase}"</p>
                        <button className="text-xs text-green-600 hover:text-green-700 ml-2">
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Practice Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Practice Makes Perfect</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Daily Challenge</h3>
            <p className="text-gray-600 text-sm mb-3">
              Try one new support phrase from today's lesson in a natural conversation.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              Get Today's Challenge
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Communication Score</h3>
            <div className="flex items-center space-x-2 mb-2">
              <div className="bg-green-200 h-2 rounded-full flex-1">
                <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
              </div>
              <span className="text-sm font-medium">78%</span>
            </div>
            <p className="text-gray-600 text-xs">
              You're improving! Keep practicing these new communication skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
