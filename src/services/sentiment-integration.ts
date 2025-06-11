import { RelationshipInteraction } from '../api/ecosystem-integration'

export class SentimentIntegrationService {
  private apiBaseUrl: string
  private apiKey: string

  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_SENTIMENT_API_URL || 'http://localhost:3005'
    this.apiKey = import.meta.env.VITE_SENTIMENT_API_KEY || 'demo-key'
  }

  // Enhanced interaction processing for SentimentAsAService correlation analytics
  async processInteractionForCorrelation(
    userId: string, 
    partnerId: string, 
    interaction: RelationshipInteraction,
    partnerHealthContext?: any
  ) {
    try {
      // Enrich interaction data with relationship context
      const enrichedData = this.enrichInteractionData(interaction, partnerHealthContext)
      
      // Send to SentimentAsAService with optimized structure
      const sentimentResponse = await this.sendToSentimentPlatform({
        appName: 'SupportPartner',
        userId,
        partnerId,
        textContent: enrichedData.processedText,
        contextMetadata: enrichedData.metadata,
        correlationFlags: enrichedData.correlationFlags,
        timestamp: new Date().toISOString(),
        anonymize: true
      })

      // Process real-time insights for immediate feedback
      const insights = await this.generateRealTimeInsights(sentimentResponse)

      return {
        success: true,
        sentimentData: sentimentResponse,
        correlationInsights: insights,
        dataPoints: enrichedData.dataPoints
      }
    } catch (error) {
      console.error('Error processing interaction for correlation:', error)
      return { success: false, error: error.message }
    }
  }

  private enrichInteractionData(interaction: RelationshipInteraction, partnerHealthContext?: any) {
    // Create enhanced text content for Claude AI analysis
    const processedText = this.buildContextualText(interaction, partnerHealthContext)
    
    // Build comprehensive metadata for correlation analysis
    const metadata = {
      // Relationship dynamics
      supportType: interaction.type,
      supportCategory: interaction.category,
      effectivenessRating: interaction.effectiveness,
      sentimentScore: interaction.sentimentScore,
      partnerResponse: interaction.partnerResponse,
      relationshipPhase: interaction.relationshipPhase || 'active_support',
      
      // Health context integration
      partnerSymptomSeverity: partnerHealthContext?.currentSymptoms?.severity,
      partnerMoodTrend: partnerHealthContext?.moodTrend,
      treatmentDay: partnerHealthContext?.treatmentDay,
      menopauseStage: partnerHealthContext?.currentStage,
      
      // Correlation flags for SentimentAsAService
      correlationTargets: ['menowellness_symptoms', 'treatment_adherence', 'mood_patterns'],
      analysisDepth: 'comprehensive',
      includeRelationshipMetrics: true,
      includePredictiveInsights: true
    }

    // Correlation flags for advanced analytics
    const correlationFlags = {
      trackSupportEffectiveness: true,
      correlateWithPartnerHealth: true,
      generatePredictions: true,
      includeInResearch: interaction.category === 'medical_support',
      flagCrisisPatterns: interaction.type === 'crisis_response'
    }

    // Data points for specific correlation analysis
    const dataPoints = {
      communicationQuality: this.assessCommunicationQuality(interaction),
      supportTiming: this.assessSupportTiming(interaction, partnerHealthContext),
      emotionalResonance: interaction.sentimentScore || 0,
      practicalHelpfulness: interaction.type === 'practical_help' ? interaction.effectiveness : null,
      crisisResponseTime: interaction.type === 'crisis_response' ? Date.now() : null
    }

    return { processedText, metadata, correlationFlags, dataPoints }
  }

  private buildContextualText(interaction: RelationshipInteraction, partnerHealthContext?: any): string {
    let contextualText = interaction.description

    // Add health context for richer analysis
    if (partnerHealthContext) {
      if (partnerHealthContext.currentSymptoms?.length > 0) {
        contextualText += ` [Partner experiencing: ${partnerHealthContext.currentSymptoms.join(', ')}]`
      }
      
      if (partnerHealthContext.moodToday) {
        contextualText += ` [Partner's mood today: ${partnerHealthContext.moodToday}/10]`
      }
      
      if (partnerHealthContext.currentStage) {
        contextualText += ` [Menopause stage: ${partnerHealthContext.currentStage}]`
      }
    }

    // Add interaction context
    contextualText += ` [Support type: ${interaction.type}, Category: ${interaction.category}]`
    
    if (interaction.partnerResponse) {
      contextualText += ` [Partner responded: ${interaction.partnerResponse}]`
    }

    return contextualText
  }

  private assessCommunicationQuality(interaction: RelationshipInteraction): number {
    let quality = interaction.effectiveness || 3

    // Boost for positive outcomes
    if (interaction.partnerResponse === 'positive') quality += 1
    if (interaction.type === 'emotional_support' && interaction.effectiveness >= 4) quality += 0.5
    if (interaction.category === 'emotional' && interaction.sentimentScore && interaction.sentimentScore > 0.5) quality += 0.5

    // Adjust for communication type
    if (interaction.type === 'communication' && interaction.effectiveness >= 4) quality += 0.5

    return Math.min(5, quality)
  }

  private assessSupportTiming(interaction: RelationshipInteraction, partnerHealthContext?: any): string {
    if (!partnerHealthContext) return 'unknown'

    const currentHour = new Date().getHours()
    const isHighSymptomDay = partnerHealthContext.symptomsToday === 'High'
    const isMoodLow = partnerHealthContext.moodToday < 5

    if (isHighSymptomDay && interaction.type === 'practical_help') {
      return 'optimal_crisis_support'
    }

    if (isMoodLow && interaction.type === 'emotional_support') {
      return 'optimal_emotional_support'
    }

    if (currentHour >= 18 && interaction.category === 'general') {
      return 'evening_check_in'
    }

    return 'standard_timing'
  }

  private async sendToSentimentPlatform(data: any) {
    const response = await fetch(`${this.apiBaseUrl}/api/data/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`SentimentAsAService error: ${response.statusText}`)
    }

    return await response.json()
  }

  private async generateRealTimeInsights(sentimentResponse: any) {
    try {
      // Process sentiment response for immediate insights
      const insights = {
        supportEffectiveness: sentimentResponse.metadata?.supportEffectiveness || 'moderate',
        relationshipImpact: sentimentResponse.metadata?.relationshipImpact || 'positive',
        recommendedActions: sentimentResponse.recommendations || [],
        correlationStrength: sentimentResponse.correlationMetrics?.strength || 0.5,
        predictedOutcome: sentimentResponse.predictions?.nextInteraction || 'continued_support',
        
        // Real-time feedback for partner
        immediateAdvice: this.generateImmediateAdvice(sentimentResponse),
        nextSteps: this.generateNextSteps(sentimentResponse)
      }

      return insights
    } catch (error) {
      console.error('Error generating real-time insights:', error)
      return null
    }
  }

  private generateImmediateAdvice(sentimentResponse: any): string {
    const sentiment = sentimentResponse.sentiment || 0
    const effectiveness = sentimentResponse.metadata?.effectivenessRating || 3

    if (sentiment > 0.7 && effectiveness >= 4) {
      return "Excellent support! Your partner appreciates this approach."
    } else if (sentiment > 0.3 && effectiveness >= 3) {
      return "Good support. Consider following up to see how she's feeling."
    } else if (sentiment < 0 || effectiveness < 3) {
      return "This approach might need adjustment. Try listening more before offering solutions."
    } else {
      return "Your support is helping. Stay consistent with this caring approach."
    }
  }

  private generateNextSteps(sentimentResponse: any): string[] {
    const steps = []
    const sentiment = sentimentResponse.sentiment || 0
    const category = sentimentResponse.metadata?.supportCategory

    if (category === 'symptoms' && sentiment > 0) {
      steps.push("Ask about her comfort level in an hour")
      steps.push("Offer to prepare something soothing")
    } else if (category === 'emotional' && sentiment < 0.3) {
      steps.push("Give her some space, then check in gently")
      steps.push("Focus on listening rather than problem-solving")
    } else {
      steps.push("Continue being present and supportive")
      steps.push("Watch for opportunities to anticipate her needs")
    }

    return steps
  }

  // Batch correlation analysis for enterprise insights
  async requestBatchCorrelationAnalysis(
    userId: string, 
    partnerId: string, 
    timeframe: string = '30d'
  ) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/enterprise/analytics/correlations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify({
          userId,
          partnerId,
          appCombinations: ['SupportPartner', 'MenoWellness'],
          timeframe,
          analysisType: 'comprehensive',
          includeRelationshipMetrics: true,
          includeClinicalOutcomes: true,
          includePredictiveModeling: true
        })
      })

      if (!response.ok) {
        throw new Error(`Correlation analysis error: ${response.statusText}`)
      }

      const result = await response.json()
      return { success: true, data: result }
    } catch (error) {
      console.error('Error requesting batch correlation analysis:', error)
      return { success: false, error: error.message }
    }
  }
}

// Export singleton instance
export const sentimentIntegration = new SentimentIntegrationService()