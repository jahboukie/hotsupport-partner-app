// Feature Gating System for SupportPartner Subscription Tiers
// Based on: https://demo.womenhealth.health/supportivepartner-landing

export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  COMPLETE = 'complete',
  COUPLES_THERAPY_PLUS = 'couples_therapy_plus'
}

export interface FeatureAccess {
  // Core Features
  basicEducation: boolean;
  dailyInsights: boolean;
  progressTracking: boolean;
  
  // Communication & Support
  basicCommunicationTips: boolean;
  advancedCommunicationGuides: boolean;
  crisisIntervention: boolean;
  
  // AI & Coaching
  basicAIGuidance: boolean;
  advancedAICoaching: boolean;
  personalizedSessions: boolean;
  
  // Tracking & Analytics
  simpleMoodTracking: boolean;
  advancedMoodInsights: boolean;
  relationshipAnalytics: boolean;
  
  // Support Channels
  emailSupport: boolean;
  priorityEmailSupport: boolean;
  phoneVideoSupport: boolean;
  dedicatedSpecialist: boolean;
  crisisSupportLine: boolean;
  
  // Specialized Features
  weeklyCheckins: boolean;
  customSupportPlans: boolean;
  couplesTherapyResources: boolean;
  liveExpertConsultations: boolean;
  familySupportIntegration: boolean;
  customInterventionStrategies: boolean;
  
  // SentimentAsAService Integration
  basicCorrelationInsights: boolean;
  advancedCorrelationAnalytics: boolean;
  enterpriseAnalyticsDashboard: boolean;
}

export const FEATURE_ACCESS: Record<SubscriptionTier, FeatureAccess> = {
  [SubscriptionTier.FREE]: {
    // Limited access for non-subscribers
    basicEducation: true,
    dailyInsights: false,
    progressTracking: false,
    basicCommunicationTips: true,
    advancedCommunicationGuides: false,
    crisisIntervention: false,
    basicAIGuidance: false,
    advancedAICoaching: false,
    personalizedSessions: false,
    simpleMoodTracking: false,
    advancedMoodInsights: false,
    relationshipAnalytics: false,
    emailSupport: false,
    priorityEmailSupport: false,
    phoneVideoSupport: false,
    dedicatedSpecialist: false,
    crisisSupportLine: false,
    weeklyCheckins: false,
    customSupportPlans: false,
    couplesTherapyResources: false,
    liveExpertConsultations: false,
    familySupportIntegration: false,
    customInterventionStrategies: false,
    basicCorrelationInsights: false,
    advancedCorrelationAnalytics: false,
    enterpriseAnalyticsDashboard: false,
  },
  
  [SubscriptionTier.BASIC]: {
    // Basic - $9.99 - Essential partner support tools
    basicEducation: true,
    dailyInsights: true,
    progressTracking: true,
    basicCommunicationTips: true,
    advancedCommunicationGuides: false,
    crisisIntervention: false,
    basicAIGuidance: true,
    advancedAICoaching: false,
    personalizedSessions: false,
    simpleMoodTracking: true,
    advancedMoodInsights: false,
    relationshipAnalytics: false,
    emailSupport: true,
    priorityEmailSupport: false,
    phoneVideoSupport: false,
    dedicatedSpecialist: false,
    crisisSupportLine: false,
    weeklyCheckins: false,
    customSupportPlans: false,
    couplesTherapyResources: false,
    liveExpertConsultations: false,
    familySupportIntegration: false,
    customInterventionStrategies: false,
    basicCorrelationInsights: true,
    advancedCorrelationAnalytics: false,
    enterpriseAnalyticsDashboard: false,
  },
  
  [SubscriptionTier.COMPLETE]: {
    // Complete Partner - $19.99 - Advanced support with personalized coaching
    basicEducation: true,
    dailyInsights: true,
    progressTracking: true,
    basicCommunicationTips: true,
    advancedCommunicationGuides: true,
    crisisIntervention: true,
    basicAIGuidance: true,
    advancedAICoaching: true,
    personalizedSessions: true,
    simpleMoodTracking: true,
    advancedMoodInsights: true,
    relationshipAnalytics: true,
    emailSupport: true,
    priorityEmailSupport: true,
    phoneVideoSupport: false,
    dedicatedSpecialist: false,
    crisisSupportLine: false,
    weeklyCheckins: true,
    customSupportPlans: true,
    couplesTherapyResources: false,
    liveExpertConsultations: false,
    familySupportIntegration: false,
    customInterventionStrategies: false,
    basicCorrelationInsights: true,
    advancedCorrelationAnalytics: true,
    enterpriseAnalyticsDashboard: false,
  },
  
  [SubscriptionTier.COUPLES_THERAPY_PLUS]: {
    // Couples Therapy Plus - $29.99 - Complete couples support ecosystem
    basicEducation: true,
    dailyInsights: true,
    progressTracking: true,
    basicCommunicationTips: true,
    advancedCommunicationGuides: true,
    crisisIntervention: true,
    basicAIGuidance: true,
    advancedAICoaching: true,
    personalizedSessions: true,
    simpleMoodTracking: true,
    advancedMoodInsights: true,
    relationshipAnalytics: true,
    emailSupport: true,
    priorityEmailSupport: true,
    phoneVideoSupport: true,
    dedicatedSpecialist: true,
    crisisSupportLine: true,
    weeklyCheckins: true,
    customSupportPlans: true,
    couplesTherapyResources: true,
    liveExpertConsultations: true,
    familySupportIntegration: true,
    customInterventionStrategies: true,
    basicCorrelationInsights: true,
    advancedCorrelationAnalytics: true,
    enterpriseAnalyticsDashboard: true,
  }
};

export function getFeatureAccess(tier: SubscriptionTier): FeatureAccess {
  return FEATURE_ACCESS[tier];
}

export function hasFeatureAccess(tier: SubscriptionTier, feature: keyof FeatureAccess): boolean {
  return FEATURE_ACCESS[tier][feature];
}

export function getSubscriptionTierFromPriceId(priceId: string): SubscriptionTier {
  switch (priceId) {
    case 'price_1RYnQqELGHd3NbdJ5eEbaYbw':
      return SubscriptionTier.BASIC;
    case 'price_1RYnRdELGHd3NbdJ8UAOxdJq':
      return SubscriptionTier.COMPLETE;
    case 'price_1RYnSTELGHd3NbdJQ9OyjJsZ':
      return SubscriptionTier.COUPLES_THERAPY_PLUS;
    default:
      return SubscriptionTier.FREE;
  }
}

export function getRequiredTierForFeature(feature: keyof FeatureAccess): SubscriptionTier {
  // Find the lowest tier that includes this feature
  const tiers = [
    SubscriptionTier.FREE,
    SubscriptionTier.BASIC,
    SubscriptionTier.COMPLETE,
    SubscriptionTier.COUPLES_THERAPY_PLUS
  ];
  
  for (const tier of tiers) {
    if (FEATURE_ACCESS[tier][feature]) {
      return tier;
    }
  }
  
  return SubscriptionTier.COUPLES_THERAPY_PLUS; // Fallback to highest tier
}

export function getTierDisplayName(tier: SubscriptionTier): string {
  switch (tier) {
    case SubscriptionTier.FREE:
      return 'Free';
    case SubscriptionTier.BASIC:
      return 'Basic';
    case SubscriptionTier.COMPLETE:
      return 'Complete Partner';
    case SubscriptionTier.COUPLES_THERAPY_PLUS:
      return 'Couples Therapy Plus';
    default:
      return 'Unknown';
  }
}

export function getTierPrice(tier: SubscriptionTier): number {
  switch (tier) {
    case SubscriptionTier.FREE:
      return 0;
    case SubscriptionTier.BASIC:
      return 9.99;
    case SubscriptionTier.COMPLETE:
      return 19.99;
    case SubscriptionTier.COUPLES_THERAPY_PLUS:
      return 29.99;
    default:
      return 0;
  }
}