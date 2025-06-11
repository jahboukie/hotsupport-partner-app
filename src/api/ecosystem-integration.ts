import { createClient } from '@supabase/supabase-js'

// Ecosystem Integration API for SupportPartner
export class EcosystemIntegration {
  private supabase: any
  private apiBaseUrl: string

  constructor() {
    // Initialize Supabase client for ecosystem data
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
      import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
    )
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
  }

  // Partner Connection Management
  async createPartnerConnection(userId: string, partnerCode: string) {
    try {
      const { data, error } = await this.supabase
        .from('partner_connections')
        .insert({
          user_id: userId,
          partner_code: partnerCode,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error creating partner connection:', error)
      return { success: false, error: error.message }
    }
  }

  async acceptPartnerConnection(connectionId: string) {
    try {
      const { data, error } = await this.supabase
        .from('partner_connections')
        .update({ 
          status: 'active',
          connected_at: new Date().toISOString()
        })
        .eq('id', connectionId)
        .select()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error accepting partner connection:', error)
      return { success: false, error: error.message }
    }
  }

  async getPartnerConnections(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('partner_connections')
        .select(`
          *,
          partner_profile:user_profiles!partner_connections_partner_id_fkey(*)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching partner connections:', error)
      return { success: false, error: error.message }
    }
  }

  // MenoWellness Data Integration
  async getPartnerHealthInsights(partnerId: string, userId: string) {
    try {
      // Verify partner connection exists and is active
      const connectionCheck = await this.verifyPartnerConnection(userId, partnerId)
      if (!connectionCheck.success) {
        return { success: false, error: 'No active partner connection found' }
      }

      // Fetch partner's health insights (with privacy controls)
      const { data, error } = await this.supabase
        .from('menowellness_shared_insights')
        .select(`
          *,
          user_profiles(name, avatar_url)
        `)
        .eq('user_id', partnerId)
        .eq('shared_with_partner', true)
        .order('created_at', { ascending: false })
        .limit(30)

      if (error) throw error

      // Transform data for SupportPartner display
      const transformedData = this.transformHealthInsights(data)
      
      return { success: true, data: transformedData }
    } catch (error) {
      console.error('Error fetching partner health insights:', error)
      return { success: false, error: error.message }
    }
  }

  async getPartnerMoodTrends(partnerId: string, userId: string, days: number = 7) {
    try {
      const connectionCheck = await this.verifyPartnerConnection(userId, partnerId)
      if (!connectionCheck.success) {
        return { success: false, error: 'No active partner connection found' }
      }

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await this.supabase
        .from('mood_tracking')
        .select('mood_score, energy_level, symptom_severity, date, notes')
        .eq('user_id', partnerId)
        .eq('shared_with_partner', true)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true })

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Error fetching mood trends:', error)
      return { success: false, error: error.message }
    }
  }

  async getPartnerSymptomAlerts(partnerId: string, userId: string) {
    try {
      const connectionCheck = await this.verifyPartnerConnection(userId, partnerId)
      if (!connectionCheck.success) {
        return { success: false, error: 'No active partner connection found' }
      }

      // Get recent high-severity symptoms that partner should know about
      const { data, error } = await this.supabase
        .from('symptom_tracking')
        .select(`
          symptom_type,
          severity,
          frequency,
          notes,
          date,
          support_needed
        `)
        .eq('user_id', partnerId)
        .eq('notify_partner', true)
        .gte('severity', 7) // High severity symptoms only
        .gte('date', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()) // Last 3 days
        .order('date', { ascending: false })

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Error fetching symptom alerts:', error)
      return { success: false, error: error.message }
    }
  }

  // Partner Support Tracking
  async logSupportAction(userId: string, partnerId: string, action: SupportAction) {
    try {
      const { data, error } = await this.supabase
        .from('partner_support_actions')
        .insert({
          supporter_id: userId,
          partner_id: partnerId,
          action_type: action.type,
          action_description: action.description,
          effectiveness_rating: action.effectiveness,
          partner_response: action.partnerResponse,
          notes: action.notes,
          timestamp: new Date().toISOString()
        })
        .select()

      if (error) throw error

      // Update partner support score
      await this.updatePartnerSupportScore(userId, partnerId, action.effectiveness)

      return { success: true, data }
    } catch (error) {
      console.error('Error logging support action:', error)
      return { success: false, error: error.message }
    }
  }

  async getSupportHistory(userId: string, partnerId: string, limit: number = 20) {
    try {
      const { data, error } = await this.supabase
        .from('partner_support_actions')
        .select('*')
        .eq('supporter_id', userId)
        .eq('partner_id', partnerId)
        .order('timestamp', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching support history:', error)
      return { success: false, error: error.message }
    }
  }

  // Real-time Notifications
  async subscribeToPartnerUpdates(userId: string, callback: (update: any) => void) {
    try {
      // Subscribe to partner's mood and symptom updates
      const subscription = this.supabase
        .channel('partner-updates')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'menowellness_shared_insights',
            filter: `shared_with_partner=eq.true`
          },
          (payload) => {
            // Check if this update is for our partner
            this.checkIfPartnerUpdate(userId, payload.new.user_id).then((isPartner) => {
              if (isPartner) {
                callback({
                  type: 'health_insight',
                  data: payload.new
                })
              }
            })
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'symptom_tracking',
            filter: `notify_partner=eq.true`
          },
          (payload) => {
            this.checkIfPartnerUpdate(userId, payload.new.user_id).then((isPartner) => {
              if (isPartner) {
                callback({
                  type: 'symptom_alert',
                  data: payload.new
                })
              }
            })
          }
        )
        .subscribe()

      return { success: true, subscription }
    } catch (error) {
      console.error('Error subscribing to partner updates:', error)
      return { success: false, error: error.message }
    }
  }

  // Communication Integration
  async sendSupportMessage(userId: string, partnerId: string, message: SupportMessage) {
    try {
      const { data, error } = await this.supabase
        .from('partner_communications')
        .insert({
          sender_id: userId,
          recipient_id: partnerId,
          message_type: message.type,
          message_content: message.content,
          support_category: message.category,
          sentiment_score: message.sentiment,
          timestamp: new Date().toISOString()
        })
        .select()

      if (error) throw error

      // Trigger notification to partner via MenoWellness app
      await this.sendPushNotification(partnerId, {
        title: 'Support Message from Your Partner',
        body: message.preview || message.content.substring(0, 50) + '...',
        data: {
          type: 'partner_support',
          message_id: data[0].id
        }
      })

      return { success: true, data }
    } catch (error) {
      console.error('Error sending support message:', error)
      return { success: false, error: error.message }
    }
  }

  // Privacy and Consent Management
  async updateSharingPreferences(userId: string, preferences: SharingPreferences) {
    try {
      const { data, error } = await this.supabase
        .from('partner_sharing_preferences')
        .upsert({
          user_id: userId,
          share_mood_data: preferences.shareMoodData,
          share_symptom_data: preferences.shareSymptomData,
          share_treatment_data: preferences.shareTreatmentData,
          emergency_notifications: preferences.emergencyNotifications,
          daily_summaries: preferences.dailySummaries,
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error updating sharing preferences:', error)
      return { success: false, error: error.message }
    }
  }

  async getSharingPreferences(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('partner_sharing_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
      
      // Return default preferences if none exist
      const defaultPreferences = {
        share_mood_data: true,
        share_symptom_data: true,
        share_treatment_data: false,
        emergency_notifications: true,
        daily_summaries: true
      }

      return { success: true, data: data || defaultPreferences }
    } catch (error) {
      console.error('Error fetching sharing preferences:', error)
      return { success: false, error: error.message }
    }
  }

  // Helper Methods
  private async verifyPartnerConnection(userId: string, partnerId: string) {
    try {
      const { data, error } = await this.supabase
        .from('partner_connections')
        .select('id')
        .eq('user_id', userId)
        .eq('partner_id', partnerId)
        .eq('status', 'active')
        .single()

      if (error) return { success: false, error: error.message }
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  private async checkIfPartnerUpdate(userId: string, updateUserId: string): Promise<boolean> {
    const result = await this.verifyPartnerConnection(userId, updateUserId)
    return result.success
  }

  private transformHealthInsights(insights: any[]) {
    return insights.map(insight => ({
      id: insight.id,
      type: insight.insight_type,
      title: insight.title,
      summary: insight.summary,
      recommendations: insight.recommendations,
      urgency: insight.urgency_level,
      date: insight.created_at,
      partnerName: insight.user_profiles?.name || 'Your Partner'
    }))
  }

  private async updatePartnerSupportScore(userId: string, partnerId: string, effectiveness: number) {
    try {
      // Calculate new support score based on recent actions
      const recentActions = await this.getSupportHistory(userId, partnerId, 10)
      if (!recentActions.success) return

      const averageEffectiveness = recentActions.data.reduce(
        (sum, action) => sum + (action.effectiveness_rating || 5), 
        effectiveness
      ) / (recentActions.data.length + 1)

      // Update partner support score
      await this.supabase
        .from('partner_support_scores')
        .upsert({
          supporter_id: userId,
          partner_id: partnerId,
          current_score: Math.round(averageEffectiveness * 20), // Convert to 0-100 scale
          last_updated: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error updating support score:', error)
    }
  }

  private async sendPushNotification(userId: string, notification: any) {
    try {
      // Integration with push notification service
      await fetch(`${this.apiBaseUrl}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          notification
        })
      })
    } catch (error) {
      console.error('Error sending push notification:', error)
    }
  }
}

// Type Definitions
export interface SupportAction {
  type: 'communication' | 'emergency_response' | 'emotional_support' | 'practical_help'
  description: string
  effectiveness: number // 1-5 scale
  partnerResponse?: 'positive' | 'neutral' | 'negative'
  notes?: string
}

export interface SupportMessage {
  type: 'encouragement' | 'check_in' | 'support_offer' | 'emergency'
  content: string
  category: 'general' | 'symptoms' | 'treatment' | 'emotional'
  sentiment?: number // -1 to 1
  preview?: string
}

export interface SharingPreferences {
  shareMoodData: boolean
  shareSymptomData: boolean
  shareTreatmentData: boolean
  emergencyNotifications: boolean
  dailySummaries: boolean
}

// Initialize and export singleton instance
export const ecosystemAPI = new EcosystemIntegration()