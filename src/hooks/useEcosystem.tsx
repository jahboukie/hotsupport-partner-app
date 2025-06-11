import React, { createContext, useContext, useState, useEffect } from 'react'
import { ecosystemAPI, SupportAction, SupportMessage, RelationshipInteraction } from '../api/ecosystem-integration'

interface EcosystemContextType {
  isConnected: boolean
  partnerData: any
  crossAppData: any
  sentimentData: any
  correlationInsights: any
  loading: boolean
  error: string | null
  connectToEcosystem: () => Promise<void>
  connectToPartner: (partnerCode: string) => Promise<{ success: boolean; error?: string }>
  logSupportAction: (action: SupportAction) => Promise<{ success: boolean; error?: string }>
  sendSupportMessage: (message: SupportMessage) => Promise<{ success: boolean; error?: string }>
  trackRelationshipInteraction: (interaction: RelationshipInteraction) => Promise<{ success: boolean; error?: string }>
  getCorrelationInsights: () => Promise<{ success: boolean; data?: any; error?: string }>
  getSharingPreferences: () => Promise<any>
  updateSharingPreferences: (preferences: any) => Promise<any>
  refreshData: () => Promise<void>
}

const EcosystemContext = createContext<EcosystemContextType | undefined>(undefined)

export function EcosystemProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [partnerData, setPartnerData] = useState(null)
  const [crossAppData, setCrossAppData] = useState(null)
  const [sentimentData, setSentimentData] = useState(null)
  const [correlationInsights, setCorrelationInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get current user ID (from auth context or localStorage)
  const getCurrentUserId = () => {
    return localStorage.getItem('supportpartner-user-id') || 'demo-user-id'
  }

  const connectToEcosystem = async () => {
    try {
      setLoading(true)
      setError(null)
      const userId = getCurrentUserId()

      // Get partner connections
      const connections = await ecosystemAPI.getPartnerConnections(userId)
      
      if (connections.success && connections.data.length > 0) {
        const partner = connections.data[0]
        setIsConnected(true)
        
        // Load partner data
        await loadPartnerData(partner.partner_id, userId)
        
        // Subscribe to real-time updates
        subscribeToUpdates(userId)
      } else {
        // No partner connected - show demo data
        setMockData()
      }
    } catch (err) {
      console.error('Error connecting to ecosystem:', err)
      setError(err.message)
      setMockData() // Fallback to mock data
    } finally {
      setLoading(false)
    }
  }

  const loadPartnerData = async (partnerId: string, userId: string) => {
    try {
      // Load health insights
      const insights = await ecosystemAPI.getPartnerHealthInsights(partnerId, userId)
      
      // Load mood trends
      const moodTrends = await ecosystemAPI.getPartnerMoodTrends(partnerId, userId, 7)
      
      // Load symptom alerts
      const symptomAlerts = await ecosystemAPI.getPartnerSymptomAlerts(partnerId, userId)

      if (insights.success) {
        const latestMood = moodTrends.success && moodTrends.data.length > 0 
          ? moodTrends.data[moodTrends.data.length - 1] 
          : null

        setPartnerData({
          id: partnerId,
          name: insights.data[0]?.partnerName || 'Your Partner',
          currentStage: 'Perimenopause',
          moodToday: latestMood?.mood_score || 6.2,
          symptomsToday: symptomAlerts.success && symptomAlerts.data.length > 0 ? 'High' : 'Moderate',
          sleepQuality: latestMood?.energy_level || 4.8,
          treatmentDay: 63,
          recentInsights: insights.data.slice(0, 3),
          moodTrend: moodTrends.data || [],
          recentSymptoms: symptomAlerts.data || []
        })

        setCrossAppData({
          menowellness: {
            effectiveness: 89,
            insight: insights.data[0]?.summary || 'Your partner is managing her symptoms well',
            urgentAlert: symptomAlerts.data.length > 0 ? symptomAlerts.data[0].notes : null,
            recentSymptoms: symptomAlerts.data || []
          }
        })

        // Mock sentiment data based on recent interactions
        setSentimentData({
          relationshipScore: 8.2,
          communicationTrend: 'improving',
          supportEffectiveness: 84,
          recentPositive: 'You offered to cook dinner during her difficult day',
          areasToImprove: ['Listen more before offering solutions', 'Ask about her day differently']
        })
      }
    } catch (err) {
      console.error('Error loading partner data:', err)
      setError(err.message)
    }
  }

  const subscribeToUpdates = (userId: string) => {
    ecosystemAPI.subscribeToPartnerUpdates(userId, (update) => {
      if (update.type === 'health_insight') {
        // Update partner insights
        setPartnerData(prev => ({
          ...prev,
          recentInsights: [update.data, ...(prev?.recentInsights || [])].slice(0, 3)
        }))
      } else if (update.type === 'symptom_alert') {
        // Update symptom alerts
        setCrossAppData(prev => ({
          ...prev,
          menowellness: {
            ...prev?.menowellness,
            urgentAlert: update.data.notes,
            recentSymptoms: [update.data, ...(prev?.menowellness?.recentSymptoms || [])].slice(0, 5)
          }
        }))
      }
    })
  }

  const setMockData = () => {
    // Fallback mock data for demo purposes
    setIsConnected(false)
    setPartnerData({
      name: 'Sarah',
      currentStage: 'Perimenopause',
      recentSymptoms: ['Hot flashes', 'Sleep issues', 'Mood swings'],
      symptomsToday: 'Moderate hot flashes (3/10)',
      moodToday: 6.2,
      sleepQuality: 4.8,
      stressLevel: 7.1,
      treatmentDay: 63,
      nextAppointment: '2024-01-15'
    })
    
    setCrossAppData({
      menowellness: { 
        effectiveness: 89, 
        insight: 'Sarah had 4 hot flashes yesterday - offer extra patience and cool drinks',
        urgentAlert: 'Sleep quality low for 3 days - suggest earlier bedtime'
      }
    })
    
    setSentimentData({
      relationshipScore: 8.2,
      communicationTrend: 'improving',
      supportEffectiveness: 84,
      recentPositive: 'You offered to cook dinner during her difficult day',
      areasToImprove: ['Listen more before offering solutions', 'Ask about her day differently']
    })
  }

  // Partner connection methods
  const connectToPartner = async (partnerCode: string) => {
    try {
      const userId = getCurrentUserId()
      const result = await ecosystemAPI.createPartnerConnection(userId, partnerCode)
      
      if (result.success) {
        // Refresh ecosystem data
        await connectToEcosystem()
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // Support action logging
  const logSupportAction = async (action: SupportAction) => {
    try {
      const userId = getCurrentUserId()
      const partnerId = partnerData?.id || 'demo-partner-id'
      
      const result = await ecosystemAPI.logSupportAction(userId, partnerId, action)
      
      if (result.success) {
        // Update local progress tracking
        const points = action.effectiveness * 2 // Convert 1-5 scale to points
        
        const activities = JSON.parse(localStorage.getItem('supportpartner-activities') || '[]')
        activities.unshift({
          id: Date.now(),
          activity: action.description,
          points: points,
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString()
        })
        localStorage.setItem('supportpartner-activities', JSON.stringify(activities.slice(0, 50)))
        
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // Send support message
  const sendSupportMessage = async (message: SupportMessage) => {
    try {
      const userId = getCurrentUserId()
      const partnerId = partnerData?.id || 'demo-partner-id'
      
      const result = await ecosystemAPI.sendSupportMessage(userId, partnerId, message)
      
      if (result.success) {
        // Log as support action
        await logSupportAction({
          type: 'communication',
          description: `Sent ${message.type} message`,
          effectiveness: 4 // Default good rating for messages
        })
        
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // Enhanced relationship interaction tracking for SentimentAsAService
  const trackRelationshipInteraction = async (interaction: RelationshipInteraction) => {
    try {
      const userId = getCurrentUserId()
      const partnerId = partnerData?.id || 'demo-partner-id'
      
      const result = await ecosystemAPI.trackRelationshipDynamics(userId, partnerId, interaction)
      
      if (result.success) {
        // Update local sentiment data with latest insights
        setSentimentData(prev => ({
          ...prev,
          relationshipScore: interaction.effectiveness * 2, // Convert to 10-point scale
          lastInteraction: {
            type: interaction.type,
            effectiveness: interaction.effectiveness,
            sentiment: interaction.sentimentScore,
            timestamp: new Date().toISOString()
          },
          recentInteractions: [
            ...(prev?.recentInteractions || []).slice(0, 9),
            {
              type: interaction.type,
              description: interaction.description,
              effectiveness: interaction.effectiveness,
              timestamp: new Date().toISOString()
            }
          ]
        }))
        
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // Get correlation insights from SentimentAsAService
  const getCorrelationInsights = async () => {
    try {
      const userId = getCurrentUserId()
      const partnerId = partnerData?.id || 'demo-partner-id'
      
      const result = await ecosystemAPI.getCrossAppCorrelationInsights(userId, partnerId)
      
      if (result.success) {
        setCorrelationInsights(result.data)
        return { success: true, data: result.data }
      } else {
        return { success: false, error: result.error }
      }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // Get sharing preferences
  const getSharingPreferences = async () => {
    try {
      const userId = getCurrentUserId()
      const result = await ecosystemAPI.getSharingPreferences(userId)
      return result
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // Update sharing preferences
  const updateSharingPreferences = async (preferences) => {
    try {
      const userId = getCurrentUserId()
      const result = await ecosystemAPI.updateSharingPreferences(userId, preferences)
      return result
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    connectToEcosystem()
  }, [])

  return (
    <EcosystemContext.Provider value={{
      isConnected,
      partnerData,
      crossAppData,
      sentimentData,
      correlationInsights,
      loading,
      error,
      connectToEcosystem,
      connectToPartner,
      logSupportAction,
      sendSupportMessage,
      trackRelationshipInteraction,
      getCorrelationInsights,
      getSharingPreferences,
      updateSharingPreferences,
      refreshData: connectToEcosystem
    }}>
      {children}
    </EcosystemContext.Provider>
  )
}

export function useEcosystem() {
  const context = useContext(EcosystemContext)
  if (!context) {
    throw new Error('useEcosystem must be used within an EcosystemProvider')
  }
  return context
}