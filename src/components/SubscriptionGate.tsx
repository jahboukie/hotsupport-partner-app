/**
 * Subscription Gate Component
 * Controls access to features based on subscription tier
 * Updated to use new feature gating system based on reference pricing
 */

import React from 'react';
import { Crown, Lock, Zap, Star } from 'lucide-react';
import { SubscriptionTier, hasFeatureAccess, getRequiredTierForFeature, getTierDisplayName, getTierPrice } from '../utils/featureGating';

interface SubscriptionGateProps {
  feature: keyof import('../utils/featureGating').FeatureAccess;
  userTier?: SubscriptionTier;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({ 
  feature, 
  userTier = SubscriptionTier.FREE,
  children, 
  fallback 
}) => {
  const hasAccess = hasFeatureAccess(userTier, feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  return fallback || <UpgradePrompt feature={feature} userTier={userTier} />;
};

interface UpgradePromptProps {
  feature: keyof import('../utils/featureGating').FeatureAccess;
  userTier: SubscriptionTier;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ feature, userTier }) => {
  const requiredTier = getRequiredTierForFeature(feature);
  const currentTierName = getTierDisplayName(userTier);
  const currentTierPrice = getTierPrice(userTier);
  const requiredTierName = getTierDisplayName(requiredTier);
  const requiredTierPrice = getTierPrice(requiredTier);

  const getFeatureDescription = (feature: keyof import('../utils/featureGating').FeatureAccess) => {
    switch (feature) {
      case 'advancedCommunicationGuides':
        return 'Access advanced communication strategies and guides';
      case 'crisisIntervention':
        return 'Get crisis intervention support and resources';
      case 'advancedAICoaching':
        return 'Unlock personalized AI coaching sessions';
      case 'relationshipAnalytics':
        return 'Track relationship progress with detailed analytics';
      case 'couplesTherapyResources':
        return 'Access AI-guided couples therapy sessions';
      case 'liveExpertConsultations':
        return 'Get live expert consultations and support';
      case 'customInterventionStrategies':
        return 'Receive custom intervention strategies';
      case 'enterpriseAnalyticsDashboard':
        return 'Access enterprise-level analytics and insights';
      default:
        return 'Access premium features for better support';
    }
  };

  const getTierIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case SubscriptionTier.BASIC:
        return <Star className="w-5 h-5 text-blue-500" />;
      case SubscriptionTier.COMPLETE:
        return <Zap className="w-5 h-5 text-purple-500" />;
      case SubscriptionTier.COUPLES_THERAPY_PLUS:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      default:
        return <Lock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <Lock className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Feature</h3>
        <p className="text-gray-600">{getFeatureDescription(feature)}</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            {getTierIcon(userTier)}
            <span className="font-medium text-gray-900">
              Current: {currentTierName} (${currentTierPrice}/month)
            </span>
          </div>
          <div className="text-sm text-gray-600">
            You need {requiredTierName} to access this feature
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {getTierIcon(requiredTier)}
              <div>
                <span className="font-bold text-lg">{requiredTierName}</span>
                <div className="text-purple-100">${requiredTierPrice}/month</div>
              </div>
            </div>
            <button
              onClick={() => handleUpgrade(requiredTier)}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
          <p className="text-purple-100 text-sm mb-3">
            Unlock {getFeatureDescription(feature)} and other premium features
          </p>
          <div className="text-sm">
            <div className="w-1.5 h-1.5 bg-white rounded-full inline-block mr-2"></div>
            Access to all features in {requiredTierName} tier
          </div>
        </div>
      </div>
    </div>
  );
};

const handleUpgrade = async (tier: SubscriptionTier) => {
  try {
    // Get the price ID for the tier
    const getPriceId = (tier: SubscriptionTier) => {
      switch (tier) {
        case SubscriptionTier.BASIC:
          return 'price_1RYnQqELGHd3NbdJ5eEbaYbw';
        case SubscriptionTier.COMPLETE:
          return 'price_1RYnRdELGHd3NbdJ8UAOxdJq';
        case SubscriptionTier.COUPLES_THERAPY_PLUS:
          return 'price_1RYnSTELGHd3NbdJQ9OyjJsZ';
        default:
          return '';
      }
    };

    const priceId = getPriceId(tier);
    
    // This would integrate with Stripe
    const response = await fetch('/api/subscriptions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    });

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error('Upgrade error:', error);
    // For demo purposes, simulate upgrade
    alert(`Redirecting to payment for ${getTierDisplayName(tier)}... (Demo mode)`);
  }
};

export default SubscriptionGate;