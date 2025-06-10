import React from 'react'
import { 
  HeartIcon, 
  ExclamationTriangleIcon, 
  ChatBubbleLeftRightIcon, 
  AcademicCapIcon,
  LightBulbIcon,
  FireIcon,
  CalendarIcon,
  TrophyIcon,
  HandRaisedIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { useEcosystem } from '../hooks/useEcosystem'

export default function Dashboard() {
  const { isConnected, partnerData, crossAppData, sentimentData } = useEcosystem()

  const userData = {
    name: 'Mike',
    partnerName: 'Sarah',
    relationshipYears: 8,
    supportScore: 84,
    learningStreak: 12,
    communicationImprovement: '+23%'
  }

  const todayStats = [
    {
      name: 'Support Score',
      value: `${userData.supportScore}%`,
      change: '+12%',
      changeType: 'increase',
      icon: HandRaisedIcon,
      color: 'text-guidance-600',
      bgColor: 'bg-guidance-100'
    },
    {
      name: 'Learning Streak',
      value: userData.learningStreak,
      change: '+1 day',
      changeType: 'increase',
      icon: FireIcon,
      color: 'text-partner-600',
      bgColor: 'bg-partner-100'
    },
    {
      name: 'Communication',
      value: 'Strong',
      change: userData.communicationImprovement,
      changeType: 'increase',
      icon: ChatBubbleLeftRightIcon,
      color: 'text-empathy-600',
      bgColor: 'bg-empathy-100'
    },
    {
      name: 'Her Wellness',
      value: partnerData?.moodToday ? `${partnerData.moodToday}/10` : '6.2/10',
      change: 'Stable',
      changeType: 'neutral',
      icon: HeartIcon,
      color: 'text-connection-600',
      bgColor: 'bg-connection-100'
    }
  ]

  const urgentAlerts = [
    {
      priority: 'high',
      message: 'Sarah had trouble sleeping for 3 nights - she may be extra sensitive today',
      action: 'Offer to handle morning routine, bring her coffee in bed',
      source: 'MenoWellness'
    },
    {
      priority: 'medium', 
      message: 'Her hot flashes increased yesterday evening',
      action: 'Keep the house cooler, have cold drinks ready',
      source: 'MenoWellness'
    }
  ]

  const todayTips = [
    {
      category: 'Morning',
      tip: 'Check in with "How did you sleep?" rather than "How are you feeling?"',
      reason: 'Sleep quality directly affects her mood and symptoms'
    },
    {
      category: 'Afternoon',
      tip: 'If she seems irritated, offer a back rub without asking what\'s wrong',
      reason: 'Physical comfort can help without requiring her to explain her feelings'
    },
    {
      category: 'Evening',
      tip: 'Suggest watching something funny together',
      reason: 'Laughter releases endorphins that help with hormonal mood swings'
    }
  ]

  const conversationStarters = [
    {
      situation: 'She seems stressed',
      script: '"I can see you\'re having a tough time. Want me to handle dinner tonight?"',
      why: 'Offers support without making her explain her feelings'
    },
    {
      situation: 'After a hot flash',
      script: '"Can I get you something cold? Ice water or maybe a cold towel?"',
      why: 'Shows you notice and want to help practically'
    },
    {
      situation: 'She\'s quiet',
      script: '"I\'m here if you want to talk, or if you just want quiet company."',
      why: 'Gives her control over the level of interaction'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-partner-600 via-empathy-600 to-guidance-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">
            You're being an amazing partner, {userData.name}! 💪❤️
          </h1>
          <div className="flex items-center space-x-8 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{userData.supportScore}%</p>
              <p className="text-sm opacity-90">Support Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{userData.learningStreak}</p>
              <p className="text-sm opacity-90">Days Learning</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{userData.relationshipYears} years</p>
              <p className="text-sm opacity-90">Together</p>
            </div>
          </div>
          <p className="text-lg opacity-90">
            {userData.partnerName} is navigating {partnerData?.currentStage || 'perimenopause'}. 
            Your understanding and support are making a real difference in her journey.
          </p>
        </div>
        
        {/* Heart animation */}
        <div className="absolute top-4 right-4 w-24 h-24">
          <HandRaisedIcon className="w-full h-full text-white/20 animate-pulse" />
        </div>
      </div>

      {/* Urgent Alerts */}
      {urgentAlerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">🚨 Today's Important Updates</h2>
          {urgentAlerts.map((alert, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              alert.priority === 'high' ? 'bg-red-50 border-red-400' : 'bg-yellow-50 border-yellow-400'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    alert.priority === 'high' ? 'text-red-900' : 'text-yellow-900'
                  }`}>
                    {alert.message}
                  </p>
                  <p className={`text-sm mt-1 ${
                    alert.priority === 'high' ? 'text-red-700' : 'text-yellow-700'
                  }`}>
                    💡 <strong>What you can do:</strong> {alert.action}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Source: {alert.source}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  alert.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {alert.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {todayStats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <span className={`ml-2 text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-guidance-600' : 
                    stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Ecosystem Intelligence */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">🌐 Live Updates About {userData.partnerName}</h3>
              <div className="text-xs text-gray-500">
                🤖 Powered by SentimentAsAService
              </div>
            </div>
            {isConnected && crossAppData ? (
              <div className="space-y-4">
                <div className="p-4 bg-empathy-50 rounded-lg border-l-4 border-empathy-400">
                  <p className="text-sm font-medium text-empathy-900">MenoWellness Integration</p>
                  <p className="text-sm text-empathy-700 mt-1">
                    {crossAppData.menowellness?.insight || 'Sarah had 4 hot flashes yesterday - offer extra patience and cool drinks'}
                  </p>
                  {crossAppData.menowellness?.urgentAlert && (
                    <p className="text-sm text-red-600 mt-2 font-medium">
                      ⚠️ {crossAppData.menowellness.urgentAlert}
                    </p>
                  )}
                </div>
                
                {partnerData?.currentStage === 'Pregnancy' && (
                  <div className="p-4 bg-guidance-50 rounded-lg border-l-4 border-guidance-400">
                    <p className="text-sm font-medium text-guidance-900">PregnancyCompanion Integration</p>
                    <p className="text-sm text-guidance-700 mt-1">
                      {crossAppData.pregnancycompanion?.insight || 'Week 24 - Sarah may have back pain, offer foot rubs and help with chores'}
                    </p>
                  </div>
                )}

                {partnerData?.currentStage === 'Postpartum' && (
                  <div className="p-4 bg-connection-50 rounded-lg border-l-4 border-connection-400">
                    <p className="text-sm font-medium text-connection-900">PostpartumSupport Integration</p>
                    <p className="text-sm text-connection-700 mt-1">
                      {crossAppData.postpartumsupport?.insight || 'Postpartum day 42 - emotional rollercoaster is normal, be extra patient'}
                    </p>
                    {crossAppData.postpartumsupport?.urgentAlert && (
                      <p className="text-sm text-red-600 mt-2 font-medium">
                        ⚠️ {crossAppData.postpartumsupport.urgentAlert}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <SparklesIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Connecting to her health apps...</p>
              </div>
            )}
          </div>

          {/* Conversation Starters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">💬 What to Say Right Now</h3>
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {conversationStarters.map((starter, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-partner-900">{starter.situation}</span>
                    <span className="text-xs bg-partner-100 text-partner-800 px-2 py-1 rounded">Script</span>
                  </div>
                  <div className="bg-gray-50 rounded p-3 mb-2">
                    <p className="text-sm text-gray-800 italic">"{starter.script}"</p>
                  </div>
                  <p className="text-xs text-gray-600">
                    <strong>Why this works:</strong> {starter.why}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Tips */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">💡 Today's Support Tips</h3>
              <LightBulbIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {todayTips.map((tip, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-guidance-900">{tip.category}</span>
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-800 mb-2">{tip.tip}</p>
                  <p className="text-xs text-gray-600">
                    <strong>Why:</strong> {tip.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Emergency Help */}
          <div className="bg-red-50 rounded-xl border border-red-200 p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4">🚨 Need Help Right Now?</h3>
            <div className="space-y-3">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-left">
                😢 She's crying and I don't know why
              </button>
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-left">
                😠 She snapped at me - what did I do?
              </button>
              <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-left">
                🤷‍♂️ She says "I'm fine" but clearly isn't
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-left">
                💤 She can't sleep - how can I help?
              </button>
            </div>
          </div>

          {/* AI Partner Coach */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🤖 AI Partner Coach
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-guidance-50 rounded-lg">
                <p className="text-sm text-guidance-800 font-medium">Learning Progress</p>
                <p className="text-sm text-guidance-700 mt-1">
                  You're getting better at reading the signs! Your support score improved 12% this week.
                </p>
              </div>
              <div className="p-4 bg-empathy-50 rounded-lg">
                <p className="text-sm text-empathy-800 font-medium">Communication Win</p>
                <p className="text-sm text-empathy-700 mt-1">
                  Yesterday when you offered to cook without her asking - that was perfect timing.
                </p>
              </div>
              <div className="p-4 bg-partner-50 rounded-lg">
                <p className="text-sm text-partner-800 font-medium">Tomorrow's Focus</p>
                <p className="text-sm text-partner-700 mt-1">
                  Based on her cycle, she may be more sensitive. Extra patience will go a long way.
                </p>
              </div>
            </div>
          </div>

          {/* Partner's Health Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{userData.partnerName}'s Health Today</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-connection-50 rounded-lg">
                <span className="text-sm font-medium text-connection-800">Mood Level</span>
                <span className="text-sm text-connection-600">{partnerData?.moodToday || '6.2'}/10</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-empathy-50 rounded-lg">
                <span className="text-sm font-medium text-empathy-800">Sleep Quality</span>
                <span className="text-sm text-empathy-600">{partnerData?.sleepQuality || '4.8'}/10</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-guidance-50 rounded-lg">
                <span className="text-sm font-medium text-guidance-800">Current Symptoms</span>
                <span className="text-sm text-guidance-600">{partnerData?.symptomsToday || 'Moderate'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-partner-50 rounded-lg">
                <span className="text-sm font-medium text-partner-800">Treatment Day</span>
                <span className="text-sm text-partner-600">Day {partnerData?.treatmentDay || '63'}</span>
              </div>
            </div>
          </div>

          {/* Ecosystem Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🌐 Monitoring Her Apps
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">MenoWellness</span>
                <span className="px-2 py-1 bg-empathy-100 text-empathy-800 text-xs rounded-full">
                  Live Updates
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">MyConfidant</span>
                <span className="px-2 py-1 bg-connection-100 text-connection-800 text-xs rounded-full">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Provider Dashboard</span>
                <span className="px-2 py-1 bg-guidance-100 text-guidance-800 text-xs rounded-full">
                  Monitoring
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">AI Coach</span>
                <span className="px-2 py-1 bg-partner-100 text-partner-800 text-xs rounded-full">
                  Learning
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}