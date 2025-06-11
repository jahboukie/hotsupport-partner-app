/**
 * Subscription Service - Feature Gating for SupportPartner
 * Manages subscription tiers and feature access
 */

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  priceId: string;
  features: string[];
  mamaGraceQueries: number;
  hasAdvancedFeatures: boolean;
  hasCouplesTherapy: boolean;
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    priceId: 'price_1RYnQqELGHd3NbdJ5eEbaYbw',
    features: [
      'Chat with Mama Grace (5 questions/day)',
      'Basic communication guides',
      'Symptom understanding',
      'Daily support tips',
      'Emergency crisis support'
    ],
    mamaGraceQueries: 5,
    hasAdvancedFeatures: false,
    hasCouplesTherapy: false
  },
  complete: {
    id: 'complete',
    name: 'Complete Partner',
    price: 19.99,
    priceId: 'price_1RYnRdELGHd3NbdJ8UAOxdJq',
    features: [
      'Unlimited Mama Grace conversations',
      'Advanced communication strategies',
      'Personalized support plans',
      'Progress tracking & insights',
      'Community access',
      'Crisis intervention protocols',
      'Intimate relationship guidance'
    ],
    mamaGraceQueries: -1, // Unlimited
    hasAdvancedFeatures: true,
    hasCouplesTherapy: false
  },
  therapy: {
    id: 'therapy',
    name: 'Couples Therapy Plus',
    price: 29.99,
    priceId: 'price_1RYnSTELGHd3NbdJQ9OyjJsZ',
    features: [
      'Everything in Complete Partner',
      'AI-guided couples therapy sessions',
      'Relationship assessment tools',
      'Professional therapist referrals',
      'Couples communication workbook',
      'Video session recordings',
      'Priority support'
    ],
    mamaGraceQueries: -1, // Unlimited
    hasAdvancedFeatures: true,
    hasCouplesTherapy: true
  }
};

export class SubscriptionService {
  private currentTier: SubscriptionTier;
  private dailyQueries: number = 0;
  private lastQueryDate: string = '';

  constructor() {
    // Load from localStorage or default to basic
    const savedTier = localStorage.getItem('supportpartner-subscription');
    const savedQueries = localStorage.getItem('supportpartner-daily-queries');
    const savedDate = localStorage.getItem('supportpartner-query-date');

    this.currentTier = savedTier ? 
      SUBSCRIPTION_TIERS[savedTier] || SUBSCRIPTION_TIERS.basic : 
      SUBSCRIPTION_TIERS.basic;
    
    const today = new Date().toDateString();
    if (savedDate === today) {
      this.dailyQueries = parseInt(savedQueries || '0');
    } else {
      this.dailyQueries = 0;
      this.resetDailyQueries();
    }
    this.lastQueryDate = today;
  }

  /**
   * Get current subscription tier
   */
  getCurrentTier(): SubscriptionTier {
    return this.currentTier;
  }

  /**
   * Check if user can ask Mama Grace
   */
  canAskMamaGrace(): { allowed: boolean; remaining?: number; reason?: string } {
    // Unlimited for paid tiers
    if (this.currentTier.mamaGraceQueries === -1) {
      return { allowed: true };
    }

    // Check daily limit for basic tier
    if (this.dailyQueries >= this.currentTier.mamaGraceQueries) {
      return { 
        allowed: false, 
        remaining: 0,
        reason: `You've reached your daily limit of ${this.currentTier.mamaGraceQueries} questions. Upgrade for unlimited access!`
      };
    }

    return { 
      allowed: true, 
      remaining: this.currentTier.mamaGraceQueries - this.dailyQueries 
    };
  }

  /**
   * Record a Mama Grace query
   */
  recordQuery(): void {
    if (this.currentTier.mamaGraceQueries !== -1) {
      this.dailyQueries++;
      localStorage.setItem('supportpartner-daily-queries', this.dailyQueries.toString());
      localStorage.setItem('supportpartner-query-date', this.lastQueryDate);
    }
  }

  /**
   * Check feature access
   */
  hasFeatureAccess(feature: string): boolean {
    switch (feature) {
      case 'community':
        return this.currentTier.hasAdvancedFeatures;
      case 'progress_tracking':
        return this.currentTier.hasAdvancedFeatures;
      case 'couples_therapy':
        return this.currentTier.hasCouplesTherapy;
      case 'unlimited_mama_grace':
        return this.currentTier.mamaGraceQueries === -1;
      default:
        return true; // Basic features available to all
    }
  }

  /**
   * Update subscription tier
   */
  updateSubscription(tierId: string): void {
    const tier = SUBSCRIPTION_TIERS[tierId];
    if (tier) {
      this.currentTier = tier;
      localStorage.setItem('supportpartner-subscription', tierId);
      this.resetDailyQueries(); // Reset queries when upgrading
    }
  }

  /**
   * Reset daily query count
   */
  private resetDailyQueries(): void {
    this.dailyQueries = 0;
    localStorage.setItem('supportpartner-daily-queries', '0');
    localStorage.setItem('supportpartner-query-date', new Date().toDateString());
  }

  /**
   * Get upgrade suggestions
   */
  getUpgradeSuggestions(): { tier: SubscriptionTier; reason: string }[] {
    if (this.currentTier.id === 'therapy') return [];

    const suggestions = [];
    
    if (this.currentTier.id === 'basic') {
      suggestions.push({
        tier: SUBSCRIPTION_TIERS.complete,
        reason: 'Get unlimited Mama Grace conversations and advanced features'
      });
      suggestions.push({
        tier: SUBSCRIPTION_TIERS.therapy,
        reason: 'Add couples therapy sessions and relationship tools'
      });
    } else if (this.currentTier.id === 'complete') {
      suggestions.push({
        tier: SUBSCRIPTION_TIERS.therapy,
        reason: 'Access AI-guided couples therapy and professional support'
      });
    }

    return suggestions;
  }
}

export const subscriptionService = new SubscriptionService();