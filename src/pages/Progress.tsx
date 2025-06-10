import React, { useState, useEffect } from 'react'
import { 
  TrophyIcon,
  FireIcon,
  HeartIcon,
  ChartBarIcon,
  CalendarIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { useEcosystem } from '../hooks/useEcosystem'

export default function Progress() {
  const { partnerData, crossAppData } = useEcosystem()
  const [activeTab, setActiveTab] = useState('overview')
  const [progressData, setProgressData] = useState(null)

  useEffect(() => {
    // Load progress data from localStorage or API
    const savedProgress = localStorage.getItem('supportpartner-progress')
    if (savedProgress) {
      setProgressData(JSON.parse(savedProgress))
    } else {
      // Initialize default progress data
      const defaultProgress = {
        totalPoints: 145,
        currentLevel: 3,
        currentLevelName: 'Supportive Partner',
        nextLevel: 4,
        nextLevelName: 'Champion Partner',
        pointsToNextLevel: 105,
        learningStreak: 12,
        longestStreak: 18,
        weeklyGoal: 50,
        weeklyProgress: 32,
        totalLessonsCompleted: 24,
        communicationScore: 84,
        emergencyResponseScore: 92,
        partnerSatisfactionScore: 87
      }
      setProgressData(defaultProgress)
      localStorage.setItem('supportpartner-progress', JSON.stringify(defaultProgress))
    }
  }, [])

  const addPoints = (points, activity) => {
    if (!progressData) return
    
    const newProgressData = {
      ...progressData,
      totalPoints: progressData.totalPoints + points,
      weeklyProgress: progressData.weeklyProgress + points
    }

    // Check for level up
    if (newProgressData.totalPoints >= (progressData.currentLevel * 100)) {
      newProgressData.currentLevel += 1
      newProgressData.currentLevelName = getLevelName(newProgressData.currentLevel)
      newProgressData.nextLevel = newProgressData.currentLevel + 1
      newProgressData.nextLevelName = getLevelName(newProgressData.nextLevel)
      
      // Show celebration
      showLevelUpCelebration()
    }

    setProgressData(newProgressData)
    localStorage.setItem('supportpartner-progress', JSON.stringify(newProgressData))
    
    // Log activity
    logActivity(activity, points)
  }

  const getLevelName = (level) => {
    const levels = {
      1: 'Learning Partner',
      2: 'Caring Partner', 
      3: 'Supportive Partner',
      4: 'Champion Partner',
      5: 'Expert Partner',
      6: 'Master Partner',
      7: 'Legendary Partner'
    }
    return levels[level] || 'Ultimate Partner'
  }

  const showLevelUpCelebration = () => {
    // Implementation for celebration animation
    console.log('🎉 Level Up!')
  }

  const logActivity = (activity, points) => {
    const activities = JSON.parse(localStorage.getItem('supportpartner-activities') || '[]')
    activities.unshift({
      id: Date.now(),
      activity,
      points,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    })
    
    // Keep only last 50 activities
    if (activities.length > 50) {
      activities.splice(50)
    }
    
    localStorage.setItem('supportpartner-activities', JSON.stringify(activities))
  }

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Completed onboarding', icon: '🎯', unlocked: true, date: '2024-01-15' },
    { id: 2, name: 'Communication Rookie', description: 'Used 5 support phrases', icon: '💬', unlocked: true, date: '2024-01-16' },
    { id: 3, name: 'Emergency Ready', description: 'Completed crisis training', icon: '🚨', unlocked: true, date: '2024-01-18' },
    { id: 4, name: 'Learning Streak', description: '7 days of learning', icon: '🔥', unlocked: true, date: '2024-01-20' },
    { id: 5, name: 'Empathy Expert', description: 'Mastered validation skills', icon: '❤️', unlocked: true, date: '2024-01-22' },
    { id: 6, name: 'Support Champion', description: 'Helped partner 20 times', icon: '🏆', unlocked: false, progress: 15, total: 20 },
    { id: 7, name: 'Communication Master', description: 'Perfect week of communication', icon: '⭐', unlocked: false, progress: 5, total: 7 },
    { id: 8, name: 'Partner Hero', description: 'Partner rated you 10/10', icon: '💝', unlocked: false, progress: 0, total: 1 }
  ]

  const weeklyActivities = [
    { day: 'Mon', completed: true, activity: 'Morning check-in', points: 5 },
    { day: 'Tue', completed: true, activity: 'Used support phrase', points: 3 },
    { day: 'Wed', completed: true, activity: 'Emergency response', points: 10 },
    { day: 'Thu', completed: true, activity: 'Learning module', points: 8 },
    { day: 'Fri', completed: true, activity: 'Communication practice', points: 6 },
    { day: 'Sat', completed: false, activity: 'Weekend check-in', points: 5 },
    { day: 'Sun', completed: false, activity: 'Reflection exercise', points: 7 }
  ]

  const skillAreas = [
    { name: 'Communication', score: progressData?.communicationScore || 84, maxScore: 100, color: 'bg-blue-500' },
    { name: 'Emergency Response', score: progressData?.emergencyResponseScore || 92, maxScore: 100, color: 'bg-red-500' },
    { name: 'Emotional Support', score: 78, maxScore: 100, color: 'bg-green-500' },
    { name: 'Understanding', score: 81, maxScore: 100, color: 'bg-purple-500' },
    { name: 'Patience', score: 89, maxScore: 100, color: 'bg-yellow-500' },
    { name: 'Problem Solving', score: 76, maxScore: 100, color: 'bg-indigo-500' }
  ]

  const recentActivities = JSON.parse(localStorage.getItem('supportpartner-activities') || '[]').slice(0, 10)

  if (!progressData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Support Journey</h1>
            <p className="text-blue-100">You're becoming an amazing partner! 💪</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">{progressData.totalPoints}</div>
            <div className="text-blue-100">Total Points</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">{progressData.currentLevelName}</h3>
              <p className="text-blue-100">Level {progressData.currentLevel}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Next: {progressData.nextLevelName}</p>
              <p className="font-medium">{progressData.pointsToNextLevel} points to go</p>
            </div>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ 
                width: `${((progressData.currentLevel * 100 - progressData.pointsToNextLevel) / (progressData.currentLevel * 100)) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex space-x-1 p-1">
          {[
            { id: 'overview', name: 'Overview', icon: ChartBarIcon },
            { id: 'achievements', name: 'Achievements', icon: TrophyIcon },
            { id: 'skills', name: 'Skills', icon: StarIcon },
            { id: 'activities', name: 'Activities', icon: CalendarIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Progress */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Progress</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Weekly Goal: {progressData.weeklyGoal} points</span>
                <span className="text-sm font-medium text-blue-600">
                  {progressData.weeklyProgress}/{progressData.weeklyGoal}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-blue-600 rounded-full h-3 transition-all duration-500"
                  style={{ width: `${(progressData.weeklyProgress / progressData.weeklyGoal) * 100}%` }}
                />
              </div>
              
              {/* Daily Activities */}
              <div className="grid grid-cols-7 gap-2">
                {weeklyActivities.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      day.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {day.completed ? '✓' : '○'}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{day.day}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner Integration */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Partner Connection</h3>
              {partnerData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-green-900">Connected to {partnerData.name || 'Partner'}</h4>
                      <p className="text-sm text-green-700">Receiving real-time insights from MenoWellness</p>
                    </div>
                    <div className="text-green-600">
                      <HeartIcon className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{partnerData.moodToday || '7.2'}</div>
                      <div className="text-sm text-blue-700">Mood Today</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{progressData.partnerSatisfactionScore}%</div>
                      <div className="text-sm text-purple-700">Support Score</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <HeartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Connect with your partner's MenoWellness app for real-time insights</p>
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Send Connection Request
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Learning Streak */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FireIcon className="h-6 w-6 text-orange-500" />
                <h3 className="font-semibold text-gray-900">Learning Streak</h3>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{progressData.learningStreak}</div>
                <div className="text-sm text-gray-600">Days in a row</div>
                <div className="text-xs text-gray-500 mt-1">Best: {progressData.longestStreak} days</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => addPoints(5, 'Used morning check-in')}
                  className="w-full text-left p-3 rounded-lg border hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <div className="font-medium text-gray-900">Morning Check-in</div>
                  <div className="text-sm text-gray-600">+5 points</div>
                </button>
                <button 
                  onClick={() => addPoints(3, 'Used support phrase')}
                  className="w-full text-left p-3 rounded-lg border hover:bg-green-50 hover:border-green-200 transition-colors"
                >
                  <div className="font-medium text-gray-900">Used Support Phrase</div>
                  <div className="text-sm text-gray-600">+3 points</div>
                </button>
                <button 
                  onClick={() => addPoints(10, 'Handled emergency situation')}
                  className="w-full text-left p-3 rounded-lg border hover:bg-red-50 hover:border-red-200 transition-colors"
                >
                  <div className="font-medium text-gray-900">Emergency Response</div>
                  <div className="text-sm text-gray-600">+10 points</div>
                </button>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                {achievements.filter(a => a.unlocked).slice(-3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{achievement.name}</div>
                      <div className="text-xs text-gray-500">{achievement.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🏆 Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`border rounded-lg p-6 ${
                achievement.unlocked ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="text-center">
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h3 className={`font-semibold mb-2 ${
                    achievement.unlocked ? 'text-green-900' : 'text-gray-600'
                  }`}>
                    {achievement.name}
                  </h3>
                  <p className={`text-sm ${
                    achievement.unlocked ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                  
                  {achievement.unlocked ? (
                    <div className="mt-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mx-auto" />
                      <div className="text-xs text-green-600 mt-1">Unlocked {achievement.date}</div>
                    </div>
                  ) : achievement.progress !== undefined ? (
                    <div className="mt-4">
                      <div className="text-xs text-gray-600 mb-1">
                        Progress: {achievement.progress}/{achievement.total}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                          style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 text-xs text-gray-500">
                      Keep going to unlock!
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Skill Development</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skillAreas.map((skill, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{skill.name}</h3>
                  <span className="text-sm font-medium text-gray-600">{skill.score}/{skill.maxScore}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`${skill.color} rounded-full h-3 transition-all duration-500`}
                    style={{ width: `${(skill.score / skill.maxScore) * 100}%` }}
                  />
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                  <span>+{Math.floor(Math.random() * 5) + 1} points this week</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Skill Development Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Practice daily check-ins to improve Communication</li>
              <li>• Complete emergency scenarios to boost Emergency Response</li>
              <li>• Use validation phrases to enhance Emotional Support</li>
              <li>• Read educational content to increase Understanding</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📅 Recent Activities</h2>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">{activity.activity}</div>
                      <div className="text-sm text-gray-600">{activity.date}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-blue-600">+{activity.points} points</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <LightBulbIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start your support journey to see activities here!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}