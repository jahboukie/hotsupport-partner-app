/**
 * Subscription Gate Component
 * Controls access to features based on subscription tier
 */

import React from 'react';
import { Crown, Lock, Zap, Star } from 'lucide-react';
import { subscriptionService, SUBSCRIPTION_TIERS } from '../services/subscription-service';

interface SubscriptionGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({ 
  feature, 
  children, 
  fallback 
}) => {
  const hasAccess = subscriptionService.hasFeatureAccess(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  return fallback || <UpgradePrompt feature={feature} />;
};

interface UpgradePromptProps {
  feature: string;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ feature }) => {
  const currentTier = subscriptionService.getCurrentTier();
  const suggestions = subscriptionService.getUpgradeSuggestions();

  const getFeatureDescription = (feature: string) => {
    switch (feature) {
      case 'community':
        return 'Join our supportive community of partners';
      case 'progress_tracking':
        return 'Track your support journey and relationship progress';
      case 'couples_therapy':
        return 'Access AI-guided couples therapy sessions';
      case 'unlimited_mama_grace':
        return 'Get unlimited access to Mama Grace conversations';
      default:
        return 'Access premium features';
    }
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'basic':
        return <Star className="w-5 h-5 text-blue-500" />;
      case 'complete':
        return <Zap className="w-5 h-5 text-purple-500" />;
      case 'therapy':
        return <Crown className="w-5 h-5 text-gold-500" />;
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
            {getTierIcon(currentTier.id)}
            <span className="font-medium text-gray-900">
              Current: {currentTier.name} (${currentTier.price}/month)
            </span>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            {currentTier.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {suggestions.map((suggestion) => (
          <div key={suggestion.tier.id} className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getTierIcon(suggestion.tier.id)}
                <div>
                  <span className="font-bold text-lg">{suggestion.tier.name}</span>
                  <div className="text-purple-100">${suggestion.tier.price}/month</div>
                </div>
              </div>
              <button
                onClick={() => handleUpgrade(suggestion.tier.priceId)}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
              >
                Upgrade Now
              </button>
            </div>
            <p className="text-purple-100 text-sm mb-3">{suggestion.reason}</p>
            <ul className="text-sm space-y-1">
              {suggestion.tier.features.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const handleUpgrade = async (priceId: string) => {
  try {
    // This would integrate with Stripe
    const response = await fetch('/api/create-checkout-session', {
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
    alert('Redirecting to payment... (Demo mode)');
  }
};

export default SubscriptionGate;