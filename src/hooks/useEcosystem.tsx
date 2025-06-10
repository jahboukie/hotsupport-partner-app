import React, { createContext, useContext, useState, useEffect } from 'react'

interface EcosystemContextType {
  isConnected: boolean
  partnerData: any
  crossAppData: any
  sentimentData: any
  connectToEcosystem: () => Promise<void>
}

const EcosystemContext = createContext<EcosystemContextType | undefined>(undefined)

export function EcosystemProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [partnerData, setPartnerData] = useState(null)
  const [crossAppData, setCrossAppData] = useState(null)
  const [sentimentData, setSentimentData] = useState(null)

  const connectToEcosystem = async () => {
    try {
      // Simulate ecosystem connection
      setIsConnected(true)
      
      // Mock partner's cross-app data
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
      
      // Mock cross-app insights
      setCrossAppData({
        menowellness: { 
          effectiveness: 89, 
          insight: 'Sarah had 4 hot flashes yesterday - offer extra patience and cool drinks',
          urgentAlert: 'Sleep quality low for 3 days - suggest earlier bedtime'
        },
        pregnancycompanion: { 
          effectiveness: 92, 
          insight: 'Week 24 - Sarah may have back pain, offer foot rubs and help with chores',
          urgentAlert: null
        },
        postpartumsupport: { 
          effectiveness: 87, 
          insight: 'Postpartum day 42 - emotional rollercoaster is normal, be extra patient',
          urgentAlert: 'Signs of baby blues detected - monitor closely'
        }
      })
      
      // Mock relationship sentiment data
      setSentimentData({
        relationshipScore: 8.2,
        communicationTrend: 'improving',
        supportEffectiveness: 84,
        recentPositive: 'You offered to cook dinner during her difficult day',
        areasToImprove: ['Listen more before offering solutions', 'Ask about her day differently']
      })
    } catch (error) {
      console.error('Failed to connect to ecosystem:', error)
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
      connectToEcosystem
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